/**
 * Wandelt das Portrait-Shoji-Bild in eine doppelbreite 4-Türen-Wand
 * (Original + horizontal gespiegelte Kopie nahtlos verbunden).
 *
 * Erzeugt:
 *   public/images/shoji-reveal/shoji-wide.jpg   (Vollbild-Hintergrund)
 *   public/images/shoji-reveal/shoji-wide.webp
 *
 * Aufruf:
 *   node scripts/build-shoji-wide.mjs
 */
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(WEB_ROOT, "..");

const SRC = path.join(REPO_ROOT, "_extracted", "shoji_source.jpg");
const OUT_DIR = path.join(WEB_ROOT, "public", "images", "shoji-reveal");

await fs.mkdir(OUT_DIR, { recursive: true });

const meta = await sharp(SRC).rotate().metadata();
console.log(`source: ${meta.width}×${meta.height}`);

// Gespiegelte Kopie generieren (Buffer)
const flipped = await sharp(SRC).rotate().flop().toBuffer();

// Composite: original | flipped → doppelt so breit, gleich hoch
const wide = await sharp({
  create: {
    width: meta.width * 2,
    height: meta.height,
    channels: 3,
    background: { r: 0, g: 0, b: 0 },
  },
})
  .composite([
    { input: SRC, left: 0, top: 0 },
    { input: flipped, left: meta.width, top: 0 },
  ])
  .jpeg({ quality: 92, mozjpeg: true })
  .toBuffer();

// Auf 3200 px breit skalieren (gut für Retina-Vollbild)
await sharp(wide)
  .resize(3200, null, { fit: "inside" })
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(path.join(OUT_DIR, "shoji-wide.jpg"));

await sharp(path.join(OUT_DIR, "shoji-wide.jpg"))
  .webp({ quality: 86 })
  .toFile(path.join(OUT_DIR, "shoji-wide.webp"));

const out = await sharp(path.join(OUT_DIR, "shoji-wide.jpg")).metadata();
console.log(`output: ${out.width}×${out.height} → ${OUT_DIR}/shoji-wide.{jpg,webp}`);
