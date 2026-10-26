/**
 * Bild-Speicher. Produktion → Vercel Blob (öffentliche, unratbare URLs).
 * Lokal ohne `BLOB_READ_WRITE_TOKEN` → Ablage unter `.studio-dev/blob/` +
 * Auslieferung über die Dev-Route `/studio-media/[...]` (nur non-prod).
 */
import { promises as fs } from "fs";
import path from "path";

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export interface StoredBlob {
  key: string;
  url: string;
}

const DEV_DIR = path.join(process.cwd(), ".studio-dev", "blob");

export async function putImage(
  key: string,
  data: Buffer,
  contentType: string,
): Promise<StoredBlob> {
  if (isBlobConfigured()) {
    const { put } = await import("@vercel/blob");
    const res = await put(key, data, {
      access: "public",
      contentType,
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { key, url: res.url };
  }
  // Dev-Fallback
  const file = path.join(DEV_DIR, key);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, data);
  return { key, url: `/studio-media/${key}` };
}

/**
 * Bild-Keys haben IMMER die Form `{postId}/{12 hex}.jpg` (siehe processUpload).
 * Alles andere — insbesondere die KV-Einträge unter `kv/…` im selben Store —
 * ist kein Studio-Bild und darf weder referenziert noch gelöscht werden.
 */
export function isImageKeyFor(postId: string, key: unknown): key is string {
  return (
    typeof key === "string" &&
    key.startsWith(`${postId}/`) &&
    /^[a-z0-9]{4,32}\/[a-f0-9]{12}\.jpg$/.test(key)
  );
}

/** Erwarteter Host des eigenen Blob-Stores (aus dem RW-Token abgeleitet). */
function ownBlobHost(): string | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  // Format: vercel_blob_rw_<storeId>_<secret> (wie @vercel/blob selbst parst).
  const storeId = token.split("_")[3];
  return storeId ? `${storeId.toLowerCase()}.public.blob.vercel-storage.com` : null;
}

/**
 * true, wenn `url` exakt die öffentliche URL des Bildes `key` im EIGENEN Store
 * ist. Verhindert, dass der Client beliebige URLs einschleust, die serverseitig
 * (Satori-Carousel, KI-Vision) abgerufen würden (SSRF).
 */
export function isOwnImageUrl(key: string, url: unknown): url is string {
  if (typeof url !== "string") return false;
  if (!isBlobConfigured()) return url === `/studio-media/${key}`;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return false;
  }
  if (u.protocol !== "https:" || u.search || u.hash || u.username || u.port)
    return false;
  if (u.pathname !== `/${key}`) return false;
  const host = ownBlobHost();
  return host
    ? u.hostname === host
    : u.hostname.endsWith(".public.blob.vercel-storage.com");
}

/**
 * Löscht ein Bild. Ziel wird NUR aus dem (validierten) Key abgeleitet — nie aus
 * einer vom Client gelieferten URL (sonst wären beliebige Blobs inkl. KV-Daten
 * löschbar).
 */
export async function delImage(key: string): Promise<void> {
  if (!/^[a-z0-9]{4,32}\/[a-f0-9]{12}\.jpg$/.test(key)) return;
  if (isBlobConfigured()) {
    const { del } = await import("@vercel/blob");
    // del() akzeptiert auch den Pathname (vgl. kv.ts blobDelete).
    await del(key, { token: process.env.BLOB_READ_WRITE_TOKEN });
    return;
  }
  try {
    await fs.unlink(path.join(DEV_DIR, key));
  } catch {
    /* egal, falls schon weg */
  }
}

/** Nur Dev: rohe Bytes eines lokal abgelegten Bildes lesen. */
export async function readDevImage(key: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(path.join(DEV_DIR, key));
  } catch {
    return null;
  }
}
