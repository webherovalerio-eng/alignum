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

export async function delImage(blob: StoredBlob): Promise<void> {
  if (isBlobConfigured()) {
    const { del } = await import("@vercel/blob");
    await del(blob.url, { token: process.env.BLOB_READ_WRITE_TOKEN });
    return;
  }
  try {
    await fs.unlink(path.join(DEV_DIR, blob.key));
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
