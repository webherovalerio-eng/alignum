/**
 * Optimiert Projekt-Fotos für /projekte/{slug}/.
 *
 * Usage:
 *   node scripts/optimize-project-images.mjs "<srcDir>" <slug> [IMG_0001.JPG IMG_0002.JPG ...]
 *
 * Ohne Dateiliste werden alle JPG/JPEG/PNG im Quellordner alphabetisch verarbeitet.
 * Mit Dateiliste bestimmt deren Reihenfolge die Nummerierung {slug}-01.jpg, -02.jpg, …
 *
 * - respektiert EXIF-Orientation (.rotate()) — Apple-Fotos kommen sonst gekippt an
 * - skaliert auf max 2400 px Längskante
 * - schreibt mozjpeg q86 + WebP q82 nach public/images/projects/{slug}/
 */
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const [srcDir, slug, ...fileArgs] = process.argv.slice(2);
if (!srcDir || !slug) {
  console.error('Usage: node scripts/optimize-project-images.mjs "<srcDir>" <slug> [files...]');
  process.exit(1);
}

const outDir = path.join(import.meta.dirname, "..", "public", "images", "projects", slug);
await mkdir(outDir, { recursive: true });

const files = fileArgs.length
  ? fileArgs
  : (await readdir(srcDir)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();

let i = 0;
for (const file of files) {
  i += 1;
  const nn = String(i).padStart(2, "0");
  const base = sharp(path.join(srcDir, file))
    .rotate()
    .resize(2400, 2400, { fit: "inside", withoutEnlargement: true });

  const jpg = await base
    .clone()
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(outDir, `${slug}-${nn}.jpg`));
  await base
    .clone()
    .webp({ quality: 82 })
    .toFile(path.join(outDir, `${slug}-${nn}.webp`));

  console.log(`${file} -> ${slug}-${nn}.jpg (${jpg.width}x${jpg.height})`);
}
console.log(`\n${i} Bilder -> ${outDir}`);
