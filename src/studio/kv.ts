/**
 * Geteilter Key-Value-Speicher.
 *
 * WARUM zwingend geteilt: Magic-Link-Tokens werden in einer Serverless-Instanz
 * erzeugt und in einer ANDEREN verifiziert — In-Memory pro Instanz funktioniert
 * in Produktion nicht. In Produktion → Upstash Redis (Vercel KV). Lokal ohne
 * Env fällt der Code auf einen In-Memory-Store zurück (ein `next dev`-Prozess =
 * ein Speicher, für lokales Testen ausreichend).
 */
import { Redis } from "@upstash/redis";

let cached: Redis | null | undefined;

function getRedis(): Redis | null {
  if (cached !== undefined) return cached;
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  // automaticDeserialization:false → get/set arbeiten konsistent mit Strings,
  // egal ob Redis oder Dev-Fallback (verhindert Doppel-JSON-Parsing).
  cached = url && token ? new Redis({ url, token, automaticDeserialization: false }) : null;
  return cached;
}

export function isKvConfigured(): boolean {
  return getRedis() !== null;
}

// --- Dev-Fallback (In-Memory) ---------------------------------------------
// An globalThis gehängt, damit ALLE Modul-Instanzen im selben Node-Prozess
// (Next dev bündelt Route-Handler und Server-Components getrennt!) denselben
// Store teilen — und der Store HMR-Reloads übersteht. In Prod ungenutzt.
type Entry = { v: string; exp: number | null };
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

// --- API -------------------------------------------------------------------
export async function kvGet(key: string): Promise<string | null> {
  const r = getRedis();
  if (r) return ((await r.get(key)) as string | null) ?? null;
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
  mem.set(key, { v: value, exp: ttlS ? Date.now() + ttlS * 1000 : null });
}

export async function kvDel(key: string): Promise<void> {
  const r = getRedis();
  if (r) {
    await r.del(key);
    return;
  }
  mem.delete(key);
}

/** Atomarer Zähler mit TTL beim ersten Increment (für Rate-Limits). */
export async function kvIncr(key: string, ttlS: number): Promise<number> {
  const r = getRedis();
  if (r) {
    const n = await r.incr(key);
    if (n === 1) await r.expire(key, ttlS);
    return n;
  }
  const e = memValid(key);
  const n = (e ? parseInt(e.v, 10) : 0) + 1;
  mem.set(key, {
    v: String(n),
    exp: e?.exp ?? Date.now() + ttlS * 1000,
  });
  return n;
}

/** Atomares Decrement (für Rollback einer reservierten Generierung). */
export async function kvDecr(key: string): Promise<number> {
  const r = getRedis();
  if (r) return await r.decr(key);
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
