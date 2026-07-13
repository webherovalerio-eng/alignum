/**
 * Geteilter Key-Value-Speicher mit drei Backends (in dieser Priorität):
 *   1. Upstash Redis (falls UPSTASH/KV-Env gesetzt) — echter Redis, atomar.
 *   2. Vercel Blob (falls BLOB_READ_WRITE_TOKEN gesetzt) — KV auf Objekt-Storage.
 *   3. In-Memory (Dev-Fallback, an globalThis gehängt).
 *
 * WARUM Blob als KV: Upstash braucht eine Browser-Freigabe (nicht headless
 * provisionierbar). Der Blob-Store ist per CLI angelegt → wir betreiben KV
 * darauf. Keys werden mit AUTH_SECRET gesalzen und SHA-256-gehasht → die
 * Blob-Pfade sind unratbar (Store ist zwar public, aber ohne List-Zugriff und
 * ohne verlinkte URLs). Reads werden per Query-String cache-gebustet, weil
 * Blob-URLs CDN-gecacht sind (min. 60s) — sonst gäbe es stale Read-after-Write.
 */
import { Redis } from "@upstash/redis";
import { sha256Hex } from "./tokens";

// --- Backend-Detection -----------------------------------------------------
let cachedRedis: Redis | null | undefined;

function getRedis(): Redis | null {
  if (cachedRedis !== undefined) return cachedRedis;
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  cachedRedis =
    url && token ? new Redis({ url, token, automaticDeserialization: false }) : null;
  return cachedRedis;
}

function blobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

export function isKvConfigured(): boolean {
  return getRedis() !== null || Boolean(blobToken());
}

// --- Blob-Backend ----------------------------------------------------------
interface Entry {
  v: string;
  exp: number | null;
}

function kvSalt(): string {
  return process.env.AUTH_SECRET || "dev-insecure-secret-do-not-use-in-prod";
}

async function blobPath(key: string): Promise<string> {
  return `kv/${await sha256Hex(`${kvSalt()}::${key}`)}.json`;
}

/** Rohes Entry lesen (ohne Expiry-Nebenwirkung). null wenn nicht vorhanden. */
async function blobReadEntry(key: string): Promise<Entry | null> {
  const { head } = await import("@vercel/blob");
  const path = await blobPath(key);
  let url: string;
  try {
    const meta = await head(path, { token: blobToken() });
    url = meta.url;
  } catch {
    return null; // BlobNotFoundError
  }
  // Cache-Bust: eindeutiger Query-String → CDN-Miss → frischer Origin-Read.
  const res = await fetch(`${url}?_=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) return null;
  try {
    return (await res.json()) as Entry;
  } catch {
    return null;
  }
}

async function blobWriteEntry(key: string, entry: Entry): Promise<void> {
  const { put } = await import("@vercel/blob");
  const path = await blobPath(key);
  await put(path, JSON.stringify(entry), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60, // Minimum; Reads busten den Cache ohnehin
    token: blobToken(),
  });
}

async function blobDelete(key: string): Promise<void> {
  const { del } = await import("@vercel/blob");
  try {
    await del(await blobPath(key), { token: blobToken() });
  } catch {
    /* nicht vorhanden → egal */
  }
}

// --- In-Memory-Backend (Dev) ----------------------------------------------
const g = globalThis as unknown as { __studioKvMem?: Map<string, Entry> };
const mem: Map<string, Entry> = (g.__studioKvMem ??= new Map());

function memValid(key: string): Entry | null {
  const e = mem.get(key);
  if (!e) return null;
  if (e.exp !== null && e.exp < Date.now()) {
    mem.delete(key);
    return null;
  }
  return e;
}

// --- Öffentliche API -------------------------------------------------------
export async function kvGet(key: string): Promise<string | null> {
  const r = getRedis();
  if (r) return ((await r.get(key)) as string | null) ?? null;
  if (blobToken()) {
    const e = await blobReadEntry(key);
    if (!e) return null;
    if (e.exp !== null && e.exp < Date.now()) {
      await blobDelete(key);
      return null;
    }
    return e.v;
  }
  return memValid(key)?.v ?? null;
}

export async function kvSet(
  key: string,
  value: string,
  ttlS?: number,
): Promise<void> {
  const r = getRedis();
  if (r) {
    await r.set(key, value, ttlS ? { ex: ttlS } : undefined);
    return;
  }
  const entry: Entry = { v: value, exp: ttlS ? Date.now() + ttlS * 1000 : null };
  if (blobToken()) {
    await blobWriteEntry(key, entry);
    return;
  }
  mem.set(key, entry);
}

export async function kvDel(key: string): Promise<void> {
  const r = getRedis();
  if (r) {
    await r.del(key);
    return;
  }
  if (blobToken()) {
    await blobDelete(key);
    return;
  }
  mem.delete(key);
}

/** Increment mit TTL beim ersten Treffer; erhält vorhandene Expiry. */
export async function kvIncr(key: string, ttlS: number): Promise<number> {
  const r = getRedis();
  if (r) {
    const n = await r.incr(key);
    if (n === 1) await r.expire(key, ttlS);
    return n;
  }
  if (blobToken()) {
    const cur = await blobReadEntry(key);
    const fresh = !cur || (cur.exp !== null && cur.exp < Date.now());
    const n = (fresh ? 0 : parseInt(cur!.v, 10) || 0) + 1;
    const exp = fresh ? Date.now() + ttlS * 1000 : cur!.exp;
    await blobWriteEntry(key, { v: String(n), exp });
    return n;
  }
  const e = memValid(key);
  const n = (e ? parseInt(e.v, 10) : 0) + 1;
  mem.set(key, { v: String(n), exp: e?.exp ?? Date.now() + ttlS * 1000 });
  return n;
}

/** Decrement (Rollback), erhält Expiry. */
export async function kvDecr(key: string): Promise<number> {
  const r = getRedis();
  if (r) return await r.decr(key);
  if (blobToken()) {
    const cur = await blobReadEntry(key);
    const n = (cur ? parseInt(cur.v, 10) || 0 : 0) - 1;
    await blobWriteEntry(key, { v: String(n), exp: cur?.exp ?? null });
    return n;
  }
  const e = memValid(key);
  const n = (e ? parseInt(e.v, 10) : 0) - 1;
  mem.set(key, { v: String(n), exp: e?.exp ?? null });
  return n;
}

// --- JSON-Helfer -----------------------------------------------------------
export async function kvGetJSON<T>(key: string): Promise<T | null> {
  const raw = await kvGet(key);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function kvSetJSON<T>(
  key: string,
  value: T,
  ttlS?: number,
): Promise<void> {
  await kvSet(key, JSON.stringify(value), ttlS);
}
