/**
 * Galerie-Index für alle generierten Social-Carousels.
 *
 * Scannt ../_extracted/social/{ordner}/slide-*.png und schreibt
 * ../_extracted/social/index.html — eine klickbare Übersicht im
 * Alignum-Branding (schwarz/weiß/gold).
 *
 *   npx tsx scripts/generate-social-index.mts
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PROJECTS } from "../src/data/projects.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOCIAL_DIR = path.resolve(__dirname, "..", "..", "_extracted", "social");

const BASE_NAMES = ["Cover", "Die Idee", "Die Lösung", "Das Holz", "Features", "CTA"];

type Section = { title: string; variant: string; dir: string; slides: string[]; names: string[] };

const sections: Section[] = [];
for (const entry of (await fs.readdir(SOCIAL_DIR, { withFileTypes: true })).sort((a, b) =>
  a.name.localeCompare(b.name)
)) {
  if (!entry.isDirectory()) continue;
  const slides = (await fs.readdir(path.join(SOCIAL_DIR, entry.name)))
    .filter((f) => /^slide-\d+\.png$/.test(f))
    .sort();
  if (!slides.length) continue;

  const baseSlug = entry.name.replace(/-classic$/, "");
  const project = PROJECTS.find((p) => p.slug === baseSlug);
  // Optionaler Establishing-Slide wird direkt nach dem Cover eingeschoben.
  const names = [...BASE_NAMES];
  if (project?.establishingImage) names.splice(1, 0, "Ensemble");
  sections.push({
    title: project?.title ?? baseSlug,
    variant: entry.name.endsWith("-classic") ? "Classic · Cinzel" : "Fraunces",
    dir: entry.name,
    slides,
    names,
  });
}

const sectionHtml = sections
  .map(
    (s) => `
  <section>
    <h2>${s.title} <span class="variant">${s.variant}</span></h2>
    <p class="folder">${s.dir}/</p>
    <div class="grid">
      ${s.slides
        .map((f, i) => {
          const href = `${s.dir}/${f}`;
          const name = s.names[i] ?? `Slide ${i + 1}`;
          return `<a class="card" href="${href}" target="_blank">
        <img src="${href}" alt="${s.title} — ${name}" loading="lazy">
        <div class="label">${i + 1} / ${s.slides.length} · ${name}<div class="meta">${f}</div></div>
      </a>`;
        })
        .join("\n      ")}
    </div>
  </section>`
  )
  .join("\n");

const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Alignum · Social-Carousel Galerie</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Inter:wght@400;500&display=swap');
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 48px;
    font-family: 'Inter', system-ui, sans-serif;
    background: #0a0a0a;
    background-image: radial-gradient(ellipse at top right, rgba(212,132,8,0.08), transparent 60%);
    color: #f5f1e8;
  }
  h1 {
    font-family: 'Cinzel', Georgia, serif;
    font-weight: 600; font-size: 34px;
    letter-spacing: 0.06em;
    margin: 0 0 6px;
  }
  h1 .gold { color: #d48408; }
  .lead { color: rgba(245,241,232,0.6); margin: 0 0 56px; font-size: 16px; }
  section { margin-bottom: 72px; }
  h2 {
    font-family: 'Cinzel', Georgia, serif;
    font-weight: 400; font-size: 24px;
    letter-spacing: 0.05em;
    margin: 0 0 4px;
    border-bottom: 1px solid rgba(212,132,8,0.35);
    padding-bottom: 12px;
  }
  .variant {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: #d48408;
    border: 1px solid rgba(212,132,8,0.5);
    border-radius: 999px;
    padding: 5px 14px;
    vertical-align: 4px;
    margin-left: 14px;
  }
  .folder { color: rgba(245,241,232,0.4); font-size: 13px; margin: 10px 0 24px; }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }
  .card {
    display: block;
    background: #141414;
    border: 1px solid rgba(245,241,232,0.08);
    border-radius: 14px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: transform 0.15s ease, border-color 0.15s ease;
  }
  .card:hover { transform: translateY(-3px); border-color: rgba(212,132,8,0.6); }
  .card img { display: block; width: 100%; height: auto; }
  .label {
    padding: 13px 16px;
    font-weight: 500; font-size: 14px;
    letter-spacing: 0.02em;
  }
  .meta { font-size: 12px; font-weight: 400; color: rgba(245,241,232,0.45); margin-top: 3px; }
</style>
</head>
<body>
  <h1>AL<span class="gold">í</span>GNUM · Social-Carousels</h1>
  <p class="lead">Instagram/LinkedIn-Slides (1080×1350) aus den Referenz-Projekten · Stand: ${new Date().toLocaleString("de-DE")}</p>
${sectionHtml}
</body>
</html>`;

const outFile = path.join(SOCIAL_DIR, "index.html");
await fs.writeFile(outFile, html, "utf-8");
console.log(`✓ ${sections.length} Carousels indiziert -> ${outFile}`);
