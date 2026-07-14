/**
 * Beiträge (Projekte) — Persistenz in KV (Metadaten/Index) + Blob (Bilder).
 * Der Index ist eine JSON-Liste von IDs; bei diesem geringen Volumen (ein
 * Handwerker, gelegentliche Projekte) ist Read-Modify-Write ausreichend.
 */
import { kvGetJSON, kvSetJSON, kvDel } from "./kv";
import { putImage, delImage } from "./blob";
import { randomTokenHex } from "./tokens";
import { UPLOAD, FIELD } from "./config";
import type { Post, PostDraft, PostImage } from "./types";

const INDEX_KEY = "studio:posts:index";
const postKey = (id: string) => `studio:post:${id}`;
const ID_RE = /^[a-z0-9]{4,32}$/;

export async function getPost(id: string): Promise<Post | null> {
  if (!ID_RE.test(id)) return null;
  return kvGetJSON<Post>(postKey(id));
}

export async function listPosts(): Promise<Post[]> {
  const ids = (await kvGetJSON<string[]>(INDEX_KEY)) ?? [];
  const posts = await Promise.all(ids.map((id) => getPost(id)));
  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => b.createdAt - a.createdAt);
}

async function addToIndex(id: string): Promise<void> {
  const ids = (await kvGetJSON<string[]>(INDEX_KEY)) ?? [];
  if (!ids.includes(id)) {
    ids.unshift(id);
    await kvSetJSON(INDEX_KEY, ids);
  }
}

async function removeFromIndex(id: string): Promise<void> {
  const ids = (await kvGetJSON<string[]>(INDEX_KEY)) ?? [];
  await kvSetJSON(
    INDEX_KEY,
    ids.filter((x) => x !== id),
  );
}

export async function createPost(email: string): Promise<Post> {
  const id = `${Date.now().toString(36)}${randomTokenHex(3)}`.toLowerCase();
  const now = Date.now();
  const post: Post = {
    id,
    createdAt: now,
    updatedAt: now,
    createdBy: email,
    status: "neu",
    ort: "",
    ortName: "",
    holzart: "",
    moebeltyp: "",
    notiz: "",
    images: [],
  };
  await kvSetJSON(postKey(id), post);
  await addToIndex(id);
  return post;
}

export async function savePost(post: Post): Promise<Post> {
  post.updatedAt = Date.now();
  await kvSetJSON(postKey(post.id), post);
  return post;
}

export async function deletePost(id: string): Promise<void> {
  const post = await getPost(id);
  if (post) {
    for (const img of post.images) await delImage(img);
  }
  await kvDel(postKey(id));
  await removeFromIndex(id);
}

function sanitizeName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "bild";
  return base.replace(/[^a-zA-Z0-9._ -]/g, "").slice(0, 120) || "bild";
}

/**
 * Verarbeitet hochgeladene Dateien (Typ/Größe validieren, HEIC→JPEG, mit sharp
 * neu kodieren + EXIF strippen = Privacy, herunterskalieren, als JPEG in den
 * Blob-Store legen) und gibt die NEUEN Bild-Descriptoren zurück. Schreibt
 * bewusst NICHT den Post-Datensatz: sonst löst jeder Einzel-Upload ein
 * Read-Modify-Write auf dem (eventually-consistent) Blob-KV aus, und schnell
 * aufeinanderfolgende Uploads überschreiben sich gegenseitig. Persistiert wird
 * gebündelt und in EINEM Write via `setImages` (autoritative Client-Liste).
 */
export interface ProcessUploadResult {
  images: PostImage[];
  added: number;
  rejected: number;
}

export async function processUpload(
  postId: string,
  base: { count: number; bytes: number },
  files: File[],
): Promise<ProcessUploadResult> {
  const { default: sharp } = await import("sharp");
  let total = base.bytes;
  let count = base.count;
  const images: PostImage[] = [];
  let added = 0;
  let rejected = 0;

  for (const file of files) {
    if (count >= UPLOAD.maxImagesPerPost) {
      rejected++;
      continue;
    }
    const nameHeic = /\.(heic|heif)$/i.test(file.name);
    const isHeic = nameHeic || /heic|heif/i.test(file.type);
    // Permissiv: echtes Bild (image/*), leerer MIME-Typ (HEIC von iPhone liefert
    // oft "") oder HEIC/HEIF-Endung. Alles andere wird abgelehnt.
    const typeOk = file.type.startsWith("image/") || file.type === "" || nameHeic;
    if (!typeOk || file.size > UPLOAD.maxImageBytes) {
      rejected++;
      continue;
    }

    let input = Buffer.from(await file.arrayBuffer());

    // sharp kann HEIC/HEIF nicht dekodieren (Patent-Lizenz) → vorher nach JPEG.
    if (isHeic) {
      try {
        const heicConvert = (await import("heic-convert")).default;
        const jpeg = await heicConvert({
          buffer: input,
          format: "JPEG",
          quality: 0.92,
        });
        input = Buffer.from(jpeg);
      } catch {
        rejected++;
        continue;
      }
    }

    let out: Buffer;
    let width: number | undefined;
    let height: number | undefined;
    try {
      const res = await sharp(input)
        .rotate() // EXIF-Orientierung anwenden, dann Orientierung neutralisieren
        .resize(UPLOAD.maxEdge, UPLOAD.maxEdge, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer({ resolveWithObject: true });
      out = res.data;
      width = res.info.width;
      height = res.info.height;
    } catch {
      rejected++;
      continue; // kaputtes / kein echtes Bild → überspringen
    }

    total += out.length;
    if (total > UPLOAD.maxTotalBytes) {
      rejected++;
      break;
    }

    const key = `${postId}/${randomTokenHex(6)}.jpg`;
    const stored = await putImage(key, out, "image/jpeg");
    images.push({
      key: stored.key,
      url: stored.url,
      filename: sanitizeName(file.name),
      bytes: out.length,
      width,
      height,
      selected: false,
    });
    count++;
    added++;
  }
  return { images, added, rejected };
}

/**
 * Macht eine vom Client gelieferte, AUTORITATIVE Bildliste sicher: nur Keys, die
 * zu diesem Post gehören, dedupliziert, auf das Maximum gedeckelt. Zentral für
 * alle Bild-Schreibvorgänge — der Server baut die Liste NIE selbst aus einem
 * (eventually-consistent) KV-Read zusammen, sonst überschreiben sich schnelle
 * Upload-/Lösch-Aktionen gegenseitig.
 */
export function validateImages(postId: string, desired: unknown[]): PostImage[] {
  const prefix = `${postId}/`;
  const seen = new Set<string>();
  const out: PostImage[] = [];
  for (const raw of desired) {
    if (out.length >= UPLOAD.maxImagesPerPost) break;
    const img = raw as Partial<PostImage>;
    if (typeof img?.key !== "string" || !img.key.startsWith(prefix)) continue;
    if (typeof img.url !== "string" || seen.has(img.key)) continue;
    out.push({
      key: img.key,
      url: img.url,
      filename:
        typeof img.filename === "string" ? sanitizeName(img.filename) : "bild",
      bytes:
        typeof img.bytes === "number" && Number.isFinite(img.bytes)
          ? img.bytes
          : 0,
      width: typeof img.width === "number" ? img.width : undefined,
      height: typeof img.height === "number" ? img.height : undefined,
      selected: img.selected === true,
    });
    seen.add(img.key);
  }
  return out;
}

/**
 * Setzt die Bildliste des Posts auf den autoritativen Client-Stand — EIN Write,
 * unabhängig davon, was der KV-Read gerade liefert. Dadurch können sich Upload-
 * und Lösch-Vorgänge nicht mehr gegenseitig überschreiben (kein Read-Modify-Write
 * auf der Liste). `remove` (key+url) wird zusätzlich best-effort aus dem Blob
 * gelöscht; ein liegengebliebener Orphan ist unkritisch, die Liste stimmt.
 */
export async function setImages(
  post: Post,
  desired: unknown[],
  remove: unknown[] = [],
): Promise<Post> {
  post.images = validateImages(post.id, desired);
  await savePost(post);

  const keep = new Set(post.images.map((i) => i.key));
  const prefix = `${post.id}/`;
  for (const raw of remove) {
    const r = raw as Partial<PostImage>;
    if (
      typeof r?.key === "string" &&
      r.key.startsWith(prefix) &&
      !keep.has(r.key) &&
      typeof r.url === "string"
    ) {
      try {
        await delImage({ key: r.key, url: r.url });
      } catch {
        /* Orphan bleibt liegen — Liste ist bereits korrekt gespeichert. */
      }
    }
  }
  return post;
}

export interface PostPatch {
  ort?: string;
  ortName?: string;
  holzart?: string;
  moebeltyp?: string;
  notiz?: string;
  /** Autoritative Bildliste (inkl. Auswahl-Flags) — 1:1 vom Client. */
  images?: unknown[];
  draft?: PostDraft;
}

export async function updatePost(post: Post, patch: PostPatch): Promise<Post> {
  if (patch.ort !== undefined) post.ort = patch.ort.slice(0, FIELD.ort);
  if (patch.ortName !== undefined) post.ortName = patch.ortName.slice(0, FIELD.ort);
  if (patch.holzart !== undefined) post.holzart = patch.holzart.slice(0, FIELD.holzart);
  if (patch.moebeltyp !== undefined)
    post.moebeltyp = patch.moebeltyp.slice(0, FIELD.moebeltyp);
  if (patch.notiz !== undefined) post.notiz = patch.notiz.slice(0, FIELD.notiz);
  // Bildliste ist client-autoritativ → 1:1 übernehmen (kein Read-Modify-Write).
  if (patch.images !== undefined)
    post.images = validateImages(post.id, patch.images);
  if (patch.draft !== undefined) post.draft = patch.draft;
  return savePost(post);
}

/** Prüft, ob ein Beitrag freigebbar ist. Gibt Fehlermeldung oder null zurück. */
export function submissionError(post: Post): string | null {
  if (!post.images.some((i) => i.selected))
    return "Bitte mindestens ein Bild auswählen.";
  if (!post.ort) return "Bitte einen Ort auswählen.";
  if (!post.holzart.trim()) return "Bitte die Holzart angeben.";
  if (!post.moebeltyp.trim()) return "Bitte den Möbeltyp angeben.";
  if (!post.draft) return "Bitte zuerst den Text generieren.";
  return null;
}

export async function submitPost(post: Post): Promise<Post> {
  post.status = "freigegeben";
  return savePost(post);
}
