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
 * gebündelt und in EINEM Write via `appendImages`.
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
 * Hängt bereits im Blob abgelegte Bild-Descriptoren an den Post an — EIN Write,
 * daher race-frei gegenüber dem stückweisen Upload. Nimmt nur Keys an, die zu
 * diesem Post gehören, und dedupliziert (idempotent gegen Doppel-Sends).
 */
export async function appendImages(
  post: Post,
  incoming: unknown[],
): Promise<Post> {
  const prefix = `${post.id}/`;
  const have = new Set(post.images.map((i) => i.key));
  for (const raw of incoming) {
    if (post.images.length >= UPLOAD.maxImagesPerPost) break;
    const img = raw as Partial<PostImage>;
    if (typeof img?.key !== "string" || !img.key.startsWith(prefix)) continue;
    if (typeof img.url !== "string" || have.has(img.key)) continue;
    post.images.push({
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
      selected: false,
    });
    have.add(img.key);
  }
  return savePost(post);
}

export interface PostPatch {
  ort?: string;
  ortName?: string;
  holzart?: string;
  moebeltyp?: string;
  notiz?: string;
  selectedKeys?: string[];
  draft?: PostDraft;
}

export async function updatePost(post: Post, patch: PostPatch): Promise<Post> {
  if (patch.ort !== undefined) post.ort = patch.ort.slice(0, FIELD.ort);
  if (patch.ortName !== undefined) post.ortName = patch.ortName.slice(0, FIELD.ort);
  if (patch.holzart !== undefined) post.holzart = patch.holzart.slice(0, FIELD.holzart);
  if (patch.moebeltyp !== undefined)
    post.moebeltyp = patch.moebeltyp.slice(0, FIELD.moebeltyp);
  if (patch.notiz !== undefined) post.notiz = patch.notiz.slice(0, FIELD.notiz);
  if (patch.selectedKeys) {
    const set = new Set(patch.selectedKeys);
    post.images = post.images.map((i) => ({ ...i, selected: set.has(i.key) }));
  }
  if (patch.draft !== undefined) post.draft = patch.draft;
  return savePost(post);
}

export async function removeImage(post: Post, key: string): Promise<Post> {
  const img = post.images.find((i) => i.key === key);
  if (img) {
    await delImage(img);
    post.images = post.images.filter((i) => i.key !== key);
  }
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
