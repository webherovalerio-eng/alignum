/**
 * Beiträge (Projekte) — Persistenz in KV (Metadaten/Index) + Blob (Bilder).
 * Der Index ist eine JSON-Liste von IDs; bei diesem geringen Volumen (ein
 * Handwerker, gelegentliche Projekte) ist Read-Modify-Write ausreichend.
 */
import { kvGetJSON, kvSetJSON, kvDel } from "./kv";
import { putImage, delImage, isImageKeyFor, isOwnImageUrl } from "./blob";
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
    regie: "",
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
    for (const img of post.images) {
      if (isImageKeyFor(post.id, img.key)) await delImage(img.key);
    }
  }
  await kvDel(postKey(id));
  await removeFromIndex(id);
}

type ImageKind = "jpeg" | "png" | "webp" | "heic" | "avif";

const HEIC_BRANDS = new Set(["heic", "heix", "hevc", "hevx", "heim", "heis", "hevm", "hevs"]);
const AVIF_BRANDS = new Set(["avif", "avis"]);

/** Erkennt das Bildformat an den Magic Bytes; null = nicht erlaubt. */
function sniffImage(b: Buffer): ImageKind | null {
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpeg";
  if (
    b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  )
    return "png";
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP")
    return "webp";
  // ISO-BMFF (HEIF/AVIF): [size]["ftyp"][major brand][minor][compatible brands…]
  if (b.toString("ascii", 4, 8) === "ftyp") {
    const boxSize = Math.min(b.readUInt32BE(0), b.length, 256);
    const brands = [b.toString("ascii", 8, 12)];
    for (let i = 16; i + 4 <= boxSize; i += 4) brands.push(b.toString("ascii", i, i + 4));
    if (brands.some((x) => AVIF_BRANDS.has(x))) return "avif";
    if (brands.some((x) => HEIC_BRANDS.has(x) || x === "mif1" || x === "msf1"))
      return "heic";
  }
  return null;
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
    // Deklarierter Typ muss in der Allowlist sein. Leerer/generischer MIME-Typ
    // (HEIC vom iPhone liefert oft "") nur mit passender Bild-Endung.
    const nameOk = /\.(jpe?g|png|webp|heic|heif|avif)$/i.test(file.name);
    const typeOk =
      UPLOAD.allowedTypes.has(file.type.toLowerCase()) ||
      ((file.type === "" || file.type === "application/octet-stream") && nameOk);
    if (!typeOk || file.size > UPLOAD.maxImageBytes) {
      rejected++;
      continue;
    }

    let input = Buffer.from(await file.arrayBuffer());

    // Der tatsächliche Typ zählt (Magic Bytes), nicht Name/MIME des Clients.
    // SVG, GIF, TIFF, PDF … erreichen die Decoder damit gar nicht erst.
    const kind = sniffImage(input);
    if (!kind) {
      rejected++;
      continue;
    }

    // sharp kann HEIC/HEIF nicht dekodieren (Patent-Lizenz) → vorher nach JPEG.
    if (kind === "heic") {
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
export function validateImages(
  postId: string,
  desired: unknown[],
  known: PostImage[] = [],
): PostImage[] {
  // Bereits gespeicherte Bilder behalten ihre (serverseitig bekannte) URL.
  const knownUrl = new Map(known.map((i) => [i.key, i.url]));
  const seen = new Set<string>();
  const out: PostImage[] = [];
  for (const raw of desired) {
    if (out.length >= UPLOAD.maxImagesPerPost) break;
    const img = raw as Partial<PostImage>;
    if (!isImageKeyFor(postId, img?.key) || seen.has(img.key)) continue;
    // URL muss exakt zum Key im eigenen Blob-Store passen (kein SSRF über
    // Satori/KI-Vision mit fremden URLs).
    const url =
      knownUrl.get(img.key) === img.url
        ? img.url
        : isOwnImageUrl(img.key, img.url)
          ? img.url
          : undefined;
    if (!url) continue;
    out.push({
      key: img.key,
      url,
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
  post.images = validateImages(post.id, desired, post.images);
  await savePost(post);

  const keep = new Set(post.images.map((i) => i.key));
  for (const raw of remove) {
    const r = raw as Partial<PostImage>;
    // Löschziel NUR aus dem validierten Key ableiten — die Client-URL wird
    // ignoriert (sonst wäre jeder Blob im Store löschbar, inkl. KV-Daten).
    if (isImageKeyFor(post.id, r?.key) && !keep.has(r.key)) {
      try {
        await delImage(r.key);
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
  regie?: string;
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
  if (patch.regie !== undefined) post.regie = patch.regie.slice(0, FIELD.regie);
  // Bildliste ist client-autoritativ → 1:1 übernehmen (kein Read-Modify-Write).
  if (patch.images !== undefined)
    post.images = validateImages(post.id, patch.images, post.images);
  if (patch.draft !== undefined) post.draft = patch.draft;
  return savePost(post);
}

/**
 * Übernimmt den vom Client gelieferten Brief (Ort/Holzart/Möbeltyp/Notiz +
 * autoritative Bildliste) in das Post-Objekt — OHNE zu speichern. So hängen
 * Generierung/Freigabe NICHT von einem stale KV-Re-Read ab: die Validierung und
 * die spätere Speicherung laufen auf dem aktuellen Client-Stand.
 */
export function applyBrief(post: Post, body: Record<string, unknown>): void {
  const s = (v: unknown) => (typeof v === "string" ? v : undefined);
  if (s(body.ort) !== undefined) post.ort = (body.ort as string).slice(0, FIELD.ort);
  if (s(body.ortName) !== undefined)
    post.ortName = (body.ortName as string).slice(0, FIELD.ort);
  if (s(body.holzart) !== undefined)
    post.holzart = (body.holzart as string).slice(0, FIELD.holzart);
  if (s(body.moebeltyp) !== undefined)
    post.moebeltyp = (body.moebeltyp as string).slice(0, FIELD.moebeltyp);
  if (s(body.notiz) !== undefined)
    post.notiz = (body.notiz as string).slice(0, FIELD.notiz);
  if (s(body.regie) !== undefined)
    post.regie = (body.regie as string).slice(0, FIELD.regie);
  if (Array.isArray(body.images))
    post.images = validateImages(post.id, body.images, post.images);
}

/** Editierten Draft aus dem Request säubern (nur erlaubte Felder, längenbegrenzt). */
export function sanitizeDraft(
  v: unknown,
  existing?: PostDraft,
): PostDraft | undefined {
  if (!v || typeof v !== "object") return undefined;
  const d = v as Record<string, unknown>;
  const s = (x: unknown, max: number) =>
    typeof x === "string" ? x.slice(0, max) : "";
  return {
    title: s(d.title, 120),
    metaTitle: s(d.metaTitle, 120),
    metaDescription: s(d.metaDescription, 300),
    // Fallback auf altes `intro`-Feld, damit Alt-Entwürfe beim Speichern nicht ihren Lead verlieren.
    summary: s(d.summary, 2000) || s(d.intro, 2000),
    body: s(d.body, 20000),
    features: Array.isArray(d.features)
      ? d.features.map((x) => String(x).slice(0, 120)).slice(0, 8)
      : (existing?.features ?? []),
    socialCaption: s(d.socialCaption, 4000),
    hashtags: Array.isArray(d.hashtags)
      ? d.hashtags.map((h) => String(h).replace(/^#/, "").slice(0, 60)).slice(0, 15)
      : [],
    generatedAt: existing?.generatedAt ?? Date.now(),
    model: existing?.model ?? "",
  };
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

/**
 * Holt einen freigegebenen Beitrag zurück in den Bearbeiten-Modus („entwurf"),
 * damit Slide-Texte, Bilder o. Ä. nachträglich angepasst werden können. Der
 * Draft bleibt erhalten; nach erneutem Freigeben regenerieren sich die Slides.
 */
export async function reopenPost(post: Post): Promise<Post> {
  post.status = "entwurf";
  return savePost(post);
}
