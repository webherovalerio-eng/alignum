/**
 * Optimiert die einheitlichen Holztextur-Fotos für die Materials-Section.
 *
 * Quelle:  ../_extracted/woods/{name}.{jpg|jpeg|png}
 * Ziel:    public/images/woods/{name}.jpg  +  .webp
 *
 * Alle Texturen werden auf EXAKT gleiche Maße (5:3) gebracht (object-cover-
 * Crop), damit die Galerie absolut einheitlich wirkt. Nur vorhandene
 * Dateien werden verarbeitet — fehlende werden gemeldet, nicht erzwungen.
 *
 *   node scripts/build-wood-textures.mjs
 */
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(WEB_ROOT, "..");

const SRC_DIR = path.join(REPO_ROOT, "_extracted", "woods");
const OUT_DIR = path.join(WEB_ROOT, "public", "images", "woods");

// Einheitliche Zielmaße — 5:3 passt 1:1 zur Detail-Card (aspect-[5/3]),
// kein zusätzlicher Crop im Browser. 2000×1200 = retina-tauglich.
const OUT_W = 2000;
const OUT_H = 1200;

// Die 12 Holzarten — Dateiname muss exakt so heißen (= image-Feld in
// src/data/materials.ts). Reihenfolge wie in der Section.
const WOODS = [
  "stiel-eiche",
  "nussbaum",
  "esche",
  "kirschbaum",
  "buche",
  "laerche",
  "birnbaum",
  "ahorn",
  "birke",
  "zwetschge",
  "elsbeere",
  "platane",
];

const EXTS = [".jpg", ".jpeg", ".png", ".webp"];

async function findSource(name) {
  for (const ext of EXTS) {
    const p = path.join(SRC_DIR, name + ext);
    try {
      await fs.access(p);
      return p;
    } catch {}
  }
  return null;
}

await fs.mkdir(OUT_DIR, { recursive: true });

let done = 0;
const missing = [];

for (const name of WOODS) {
  const src = await findSource(name);
  if (!src) {
    missing.push(name);
    continue;
  }

  await sharp(src)
    .rotate()
    .resize(OUT_W, OUT_H, { fit: "cover", position: "centre" })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(OUT_DIR, name + ".jpg"));

  await sharp(path.join(OUT_DIR, name + ".jpg"))
    .webp({ quality: 84 })
    .toFile(path.join(OUT_DIR, name + ".webp"));

  console.log(`✓ ${name}`);
  done++;
}

console.log(`\n${done}/${WOODS.length} Texturen verarbeitet.`);
if (missing.length) {
  console.log(`Fehlen noch (in _extracted/woods/ ablegen): ${missing.join(", ")}`);
}
