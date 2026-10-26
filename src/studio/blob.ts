/**
 * Bild-Speicher des Studios — AUSSCHLIESSLICH der PRIVATE Vercel-Blob-Store
 * (`PRIVATE_READ_WRITE_TOKEN`, fra1). Private Blobs haben keine öffentlich
 * abrufbare URL; ausgeliefert wird nur über die eigene, session-geschützte Route
 * `/studio-media/{key}` (siehe src/app/studio-media/[...path]/route.ts).
 *
 * Gespeichert wird pro Bild der Pathname (`key`) + die eigene Proxy-URL
 * (`/studio-media/{key}`), NIE eine Blob-Host-URL. Serverseitige Leser
 * (Satori-Carousel, KI-Vision, studio-pull) holen die Bytes per `get()` über den
 * Key — es wird nie eine (vom Client gelieferte) URL gefetcht.
 *
 * Lokal ohne `PRIVATE_READ_WRITE_TOKEN` → Ablage unter `.studio-dev/blob/`,
 * ausgeliefert über dieselbe Route (Dev-Medienmodus).
 *
 * Das Token wird bei JEDEM Blob-Aufruf explizit übergeben — nie auf SDK-Defaults
 * (`BLOB_READ_WRITE_TOKEN` = alter öffentlicher Store, `BLOB_STORE_ID`/OIDC)
 * verlassen.
 */
import { promises as fs } from "fs";
import path from "path";
import { privateBlobToken } from "./config";

export function isBlobConfigured(): boolean {
  return Boolean(privateBlobToken());
}

export interface StoredBlob {
  key: string;
  url: string;
}

const DEV_DIR = path.join(process.cwd(), ".studio-dev", "blob");

/** Einzige erlaubte Form eines Studio-Bild-Keys: `{postId}/{12 hex}.jpg`. */
const IMAGE_KEY_RE = /^[a-z0-9]{4,32}\/[a-f0-9]{12}\.jpg$/;

/** Präfix der eigenen Auslieferungs-Route. */
export const MEDIA_ROUTE = "/studio-media/";

export function isImageKey(key: unknown): key is string {
  return typeof key === "string" && IMAGE_KEY_RE.test(key);
}

/**
 * Bild-Keys haben IMMER die Form `{postId}/{12 hex}.jpg` (siehe processUpload).
 * Alles andere — insbesondere die KV-Einträge unter `kv/…` im selben Store —
 * ist kein Studio-Bild und darf weder referenziert, ausgeliefert noch gelöscht
 * werden.
 */
export function isImageKeyFor(postId: string, key: unknown): key is string {
  return isImageKey(key) && key.startsWith(`${postId}/`);
}

/** Kanonische (gespeicherte + anzeigbare) URL eines Bildes: eigene Route. */
export function mediaUrl(key: string): string {
  return `${MEDIA_ROUTE}${key}`;
}

/**
 * Übergang: leitet aus einer ALT-Referenz (volle URL des alten öffentlichen
 * Stores, `https://<store>.public.blob.vercel-storage.com/{key}`) den Pathname
 * ab. Gibt nur gültige Bild-Keys zurück, sonst null. Die Datei wird danach aus
 * dem PRIVATEN Store gelesen (die Migration kopiert mit gleichem Pathname).
 */
export function keyFromLegacyUrl(url: unknown): string | null {
  if (typeof url !== "string") return null;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (
    u.protocol !== "https:" ||
    u.search ||
    u.hash ||
    u.username ||
    u.port ||
    !u.hostname.endsWith(".public.blob.vercel-storage.com")
  )
    return null;
  const key = u.pathname.replace(/^\//, "");
  return isImageKey(key) ? key : null;
}

/**
 * true, wenn `url` eine zulässige Referenz auf das Bild `key` ist: die
 * kanonische Proxy-URL oder (Übergang) die Alt-URL des öffentlichen Stores mit
 * exakt diesem Pathname. Die URL wird serverseitig NIE gefetcht — gespeichert
 * wird immer `mediaUrl(key)`.
 */
export function isOwnImageUrl(key: string, url: unknown): boolean {
  if (typeof url !== "string") return false;
  return url === mediaUrl(key) || keyFromLegacyUrl(url) === key;
}

export async function putImage(
  key: string,
  data: Buffer,
  contentType: string,
): Promise<StoredBlob> {
  if (!isImageKey(key)) throw new Error("Ungültiger Bild-Key.");
  const token = privateBlobToken();
  if (token) {
    const { put } = await import("@vercel/blob");
    await put(key, data, {
      access: "private",
      contentType,
      addRandomSuffix: false,
      token,
    });
    return { key, url: mediaUrl(key) };
  }
  // Dev-Fallback
  const file = path.join(DEV_DIR, key);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, data);
  return { key, url: mediaUrl(key) };
}

export interface ImageStream {
  stream: ReadableStream<Uint8Array>;
  size: number | null;
}

/**
 * Öffnet ein Bild als Stream (für die Auslieferungs-Route). null = nicht
 * vorhanden oder ungültiger Key. Liest ausschließlich aus dem privaten Store
 * bzw. lokal aus `.studio-dev/blob/`.
 */
export async function openImage(key: string): Promise<ImageStream | null> {
  if (!isImageKey(key)) return null;
  const token = privateBlobToken();
  if (token) {
    const { get } = await import("@vercel/blob");
    const res = await get(key, { access: "private", token });
    if (!res || res.statusCode !== 200) return null;
    return { stream: res.stream, size: res.blob.size || null };
  }
  const buf = await readDevImage(key);
  if (!buf) return null;
  return { stream: new Blob([new Uint8Array(buf)]).stream(), size: buf.length };
}

/** Rohe Bytes eines Bildes (privater Store bzw. Dev-Ordner). null = fehlt. */
export async function readImage(key: string): Promise<Buffer | null> {
  if (!isImageKey(key)) return null;
  const token = privateBlobToken();
  if (token) {
    const { get } = await import("@vercel/blob");
    const res = await get(key, { access: "private", token });
    if (!res || res.statusCode !== 200) return null;
    return Buffer.from(await new Response(res.stream).arrayBuffer());
  }
  return readDevImage(key);
}

/**
 * Bild als JPEG, auf `maxEdge` herunterskaliert (für Satori-Data-URIs und
 * KI-Vision — hält Payload und Renderzeit klein). null = fehlt/defekt.
 */
export async function readImageJpeg(
  key: string,
  maxEdge: number,
): Promise<Buffer | null> {
  const raw = await readImage(key);
  if (!raw) return null;
  try {
    const { default: sharp } = await import("sharp");
    return await sharp(raw)
      .resize(maxEdge, maxEdge, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
  } catch {
    return null;
  }
}

/**
 * Löscht ein Bild. Ziel wird NUR aus dem (validierten) Key abgeleitet — nie aus
 * einer vom Client gelieferten URL (sonst wären beliebige Blobs inkl. KV-Daten
 * löschbar).
 */
export async function delImage(key: string): Promise<void> {
  if (!isImageKey(key)) return;
  const token = privateBlobToken();
  if (token) {
    const { del } = await import("@vercel/blob");
    // del() akzeptiert auch den Pathname (vgl. kv.ts blobDelete).
    await del(key, { token });
    return;
  }
  try {
    await fs.unlink(path.join(DEV_DIR, key));
  } catch {
    /* egal, falls schon weg */
  }
}

/** Nur Dev: rohe Bytes eines lokal abgelegten Bildes lesen. */
async function readDevImage(key: string): Promise<Buffer | null> {
  if (!isImageKey(key)) return null;
  try {
    return await fs.readFile(path.join(DEV_DIR, key));
  } catch {
    return null;
  }
}
