/**
 * Social-Media-Carousel-Generator für Alignum-Projekte.
 *
 * Erzeugt aus einem Projekt-Eintrag (src/data/projects.ts) sechs
 * Instagram/LinkedIn-Carousel-Slides (1080×1350, 4:5) als PNG.
 *
 *   npx tsx scripts/generate-carousel.mts {slug}
 *   z.B. npx tsx scripts/generate-carousel.mts fernsehschrank-mannheim-ahorn
 *
 * Output: ../_extracted/social/{slug}/slide-01.png … slide-06.png
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { PROJECTS, getProject } from "../src/data/projects.ts";
import { CITIES } from "../src/data/cities.ts";
import { SERVICES } from "../src/data/services.ts";
import { MATERIALS } from "../src/data/materials.ts";
import { SITE } from "../src/data/site.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(WEB_ROOT, "..");
const OUTPUT_BASE = path.join(REPO_ROOT, "_extracted", "social");

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: npx tsx scripts/generate-carousel.mts <project-slug>");
  console.error("Available slugs:", PROJECTS.map((p) => p.slug).join(", "));
  process.exit(1);
}

const project = getProject(slug);
if (!project) {
  console.error(`Project '${slug}' not found. Available:`, PROJECTS.map((p) => p.slug).join(", "));
  process.exit(1);
}

const city = CITIES.find((c) => c.slug === project.city);
const service = SERVICES.find((s) => s.slug === project.service);
const material = MATERIALS.find((m) => m.slug === project.material);

const outDir = path.join(OUTPUT_BASE, slug);
await fs.mkdir(outDir, { recursive: true });

/**
 * Konvertiert ein Repo-Image-Path zu file:// URL für lokalen Chromium-Zugriff.
 */
function imgUrl(relPath: string): string {
  const absPath = path.join(WEB_ROOT, "public", relPath.replace(/^\//, ""));
  return pathToFileURL(absPath).href;
}

// ─────────────── SLIDES ───────────────

const SLIDE_W = 1080;
const SLIDE_H = 1350;

const slides = [
  // 1. COVER — Hook
  `
  <div class="slide" id="slide-1">
    <img class="bg" src="${imgUrl(project.cover)}" />
    <div class="scrim-bottom"></div>
    <div class="brand-top">
      <div class="brand-letter">A</div>
      <div class="brand-name">alignum</div>
    </div>
    <div class="hero-bottom">
      <div class="eyebrow">Referenz · ${city?.name ?? ""}${project.year ? " · " + project.year : ""}</div>
      <h1 class="hero-title">${project.title}</h1>
      <div class="hero-sub">${project.summary}</div>
    </div>
    <div class="page-pill">1 / 6</div>
  </div>
  `,

  // 2. DIE IDEE — Statement
  `
  <div class="slide" id="slide-2">
    <div class="surface-deep"></div>
    <div class="watermark">${city?.name ?? "Projekt"}</div>
    <div class="brand-top">
      <div class="brand-letter brand-letter--gold">A</div>
      <div class="brand-name brand-name--light">alignum</div>
    </div>
    <div class="statement-block">
      <div class="eyebrow eyebrow--gold">Die Idee</div>
      <p class="big-quote">${project.body[0]}</p>
    </div>
    <div class="page-pill page-pill--light">2 / 6</div>
  </div>
  `,

  // 3. DIE LÖSUNG — Bild + Body[1]
  `
  <div class="slide" id="slide-3">
    <img class="bg-half" src="${imgUrl(project.images[1] ?? project.cover)}" />
    <div class="bottom-card">
      <div class="brand-mini">
        <div class="brand-letter">A</div>
        <div class="brand-name">alignum</div>
      </div>
      <div class="eyebrow eyebrow--gold">Die Lösung</div>
      <p class="body-text">${project.body[1] ?? project.summary}</p>
    </div>
    <div class="page-pill">3 / 6</div>
  </div>
  `,

  // 4. DAS HOLZ — Material-Story
  `
  <div class="slide" id="slide-4">
    <img class="bg" src="${imgUrl(`/images/woods/${material?.slug ?? "stiel-eiche"}.jpg`)}" />
    <div class="scrim-full"></div>
    <div class="brand-top">
      <div class="brand-letter brand-letter--gold">A</div>
      <div class="brand-name brand-name--light">alignum</div>
    </div>
    <div class="center-block">
      <div class="eyebrow eyebrow--gold">Das Holz</div>
      <h2 class="material-title">${material?.name ?? "Massivholz"}</h2>
      <p class="material-body">${project.body[2] ?? material?.description ?? ""}</p>
    </div>
    <div class="page-pill page-pill--light">4 / 6</div>
  </div>
  `,

  // 5. WAS WIR GEBAUT HABEN — Features
  `
  <div class="slide" id="slide-5">
    <div class="cream-surface"></div>
    <div class="watermark watermark--dark">Details</div>
    <div class="brand-top">
      <div class="brand-letter">A</div>
      <div class="brand-name">alignum</div>
    </div>
    <div class="features-block">
      <div class="eyebrow eyebrow--gold">Was wir gebaut haben</div>
      <h2 class="features-title">${service?.name ?? "Maßmöbel"}</h2>
      <ul class="features-list">
        ${project.features.slice(0, 5).map((f) => `<li><span class="check">✓</span><span>${f}</span></li>`).join("")}
      </ul>
    </div>
    <div class="page-pill">5 / 6</div>
  </div>
  `,

  // 6. CTA — Anfrage
  `
  <div class="slide" id="slide-6">
    <div class="surface-deep"></div>
    <div class="watermark">alignum</div>
    <div class="brand-top">
      <div class="brand-letter brand-letter--gold">A</div>
      <div class="brand-name brand-name--light">alignum</div>
    </div>
    <div class="cta-block">
      <div class="eyebrow eyebrow--gold">Ihr Projekt ist als nächstes dran</div>
      <h2 class="cta-title">
        Aufmaß bei Ihnen.<br/>
        <span class="italic gold">Fertigung bei uns.</span>
      </h2>
      <p class="cta-body">
        Wir kommen aus ${SITE.address.city} zu Ihnen,
        vermessen den Raum und skizzieren das Möbel,
        das Sie bisher nirgends gefunden haben.
      </p>
      <div class="cta-button">alignum.de/anfrage →</div>
    </div>
    <div class="page-pill page-pill--light">6 / 6</div>
  </div>
  `,
];

// ─────────────── STYLES ───────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap');

  :root {
    --gold: #d48408;
    --gold-soft: #e8a847;
    --bg-cream: #fbf8f3;
    --bg-deep: #0a0a0a;
    --fg-dark: #141414;
    --fg-light: #f5f1e8;
    --border: #d4c6b1;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', system-ui, sans-serif;
    background: #000;
    -webkit-font-smoothing: antialiased;
  }
  .font-display { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; letter-spacing: -0.02em; }
  .italic { font-style: italic; }
  .gold { color: var(--gold); }

  .slide {
    position: relative;
    width: ${SLIDE_W}px;
    height: ${SLIDE_H}px;
    overflow: hidden;
    margin: 0;
    background: var(--bg-deep);
  }
  .slide img.bg {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
  }
  .slide img.bg-half {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 55%;
    object-fit: cover;
  }
  .scrim-bottom {
    position: absolute; inset: 0;
    background: linear-gradient(
      to top,
      rgba(0,0,0,0.92) 0%,
      rgba(0,0,0,0.55) 40%,
      rgba(0,0,0,0.05) 100%
    );
  }
  .scrim-full {
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.55) 0%,
      rgba(0,0,0,0.65) 50%,
      rgba(0,0,0,0.85) 100%
    );
  }
  .surface-deep {
    position: absolute; inset: 0;
    background: #0a0a0a;
    background-image:
      radial-gradient(ellipse at top right, rgba(212,132,8,0.12), transparent 60%),
      radial-gradient(ellipse at bottom left, rgba(212,132,8,0.05), transparent 50%);
  }
  .cream-surface {
    position: absolute; inset: 0;
    background: var(--bg-cream);
  }

  .watermark {
    position: absolute;
    bottom: -120px;
    right: -40px;
    font-family: 'Fraunces', Georgia, serif;
    font-size: 480px;
    font-weight: 600;
    color: rgba(255,255,255,0.04);
    letter-spacing: -0.05em;
    line-height: 0.85;
    user-select: none;
    pointer-events: none;
  }
  .watermark--dark {
    color: rgba(20,20,20,0.045);
  }

  .brand-top {
    position: absolute;
    top: 56px;
    left: 64px;
    display: flex;
    align-items: center;
    gap: 14px;
    z-index: 2;
  }
  .brand-mini {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
  }
  .brand-letter {
    width: 44px; height: 44px;
    display: flex; align-items: center; justify-content: center;
    background: var(--bg-deep);
    color: var(--gold);
    font-family: 'Fraunces', serif;
    font-weight: 700;
    font-size: 30px;
    border-radius: 8px;
  }
  .brand-letter--gold {
    background: var(--gold);
    color: var(--bg-deep);
  }
  .brand-mini .brand-letter {
    width: 36px; height: 36px; font-size: 24px;
  }
  .brand-name {
    font-family: 'Fraunces', serif;
    font-size: 28px;
    font-weight: 500;
    color: var(--fg-dark);
    letter-spacing: -0.01em;
  }
  .brand-mini .brand-name { font-size: 22px; }
  .brand-name--light { color: var(--fg-light); }

  .eyebrow {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.28em;
    font-weight: 500;
    color: rgba(255,255,255,0.7);
    margin-bottom: 18px;
  }
  .eyebrow--gold {
    color: var(--gold);
  }

  /* SLIDE 1 — Cover */
  .hero-bottom {
    position: absolute;
    left: 64px;
    right: 64px;
    bottom: 130px;
    color: var(--fg-light);
    z-index: 2;
  }
  .hero-title {
    font-family: 'Fraunces', Georgia, serif;
    font-weight: 600;
    font-size: 84px;
    line-height: 1.0;
    letter-spacing: -0.025em;
    color: #fff;
    margin-bottom: 22px;
    max-width: 16ch;
  }
  .hero-sub {
    font-size: 22px;
    line-height: 1.5;
    color: rgba(255,255,255,0.85);
    max-width: 24ch;
  }

  /* SLIDE 2 — Statement */
  .statement-block {
    position: absolute;
    left: 64px; right: 64px; top: 50%;
    transform: translateY(-50%);
    z-index: 2;
  }
  .big-quote {
    font-family: 'Fraunces', serif;
    font-weight: 500;
    font-size: 48px;
    line-height: 1.2;
    color: var(--fg-light);
    letter-spacing: -0.02em;
  }
  .big-quote::before {
    content: '"';
    display: block;
    color: var(--gold);
    font-size: 96px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 12px;
  }

  /* SLIDE 3 — Lösung mit Bild oben */
  .bottom-card {
    position: absolute;
    left: 64px; right: 64px; bottom: 64px;
    background: var(--bg-cream);
    border-radius: 28px;
    padding: 56px 56px 80px 56px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.4);
  }
  .body-text {
    font-size: 26px;
    line-height: 1.45;
    color: var(--fg-dark);
    font-weight: 400;
  }

  /* SLIDE 4 — Material */
  .center-block {
    position: absolute;
    left: 64px; right: 64px; top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    color: var(--fg-light);
  }
  .material-title {
    font-family: 'Fraunces', serif;
    font-weight: 600;
    font-size: 112px;
    line-height: 0.95;
    letter-spacing: -0.03em;
    color: #fff;
    margin-bottom: 28px;
  }
  .material-body {
    font-size: 26px;
    line-height: 1.5;
    color: rgba(255,255,255,0.88);
    max-width: 30ch;
  }

  /* SLIDE 5 — Features */
  .features-block {
    position: absolute;
    left: 64px; right: 64px; top: 50%;
    transform: translateY(-50%);
    z-index: 2;
  }
  .features-title {
    font-family: 'Fraunces', serif;
    font-weight: 600;
    font-size: 60px;
    line-height: 1.05;
    letter-spacing: -0.025em;
    color: var(--fg-dark);
    margin-bottom: 40px;
  }
  .features-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }
  .features-list li {
    display: flex;
    gap: 18px;
    align-items: flex-start;
    font-size: 26px;
    line-height: 1.4;
    color: var(--fg-dark);
  }
  .check {
    display: inline-flex;
    width: 36px; height: 36px;
    align-items: center; justify-content: center;
    background: var(--gold);
    color: #fff;
    border-radius: 50%;
    font-size: 18px;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 2px;
  }

  /* SLIDE 6 — CTA */
  .cta-block {
    position: absolute;
    left: 64px; right: 64px; top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    color: var(--fg-light);
  }
  .cta-title {
    font-family: 'Fraunces', serif;
    font-weight: 600;
    font-size: 84px;
    line-height: 1.0;
    letter-spacing: -0.025em;
    color: #fff;
    margin-bottom: 32px;
  }
  .cta-body {
    font-size: 24px;
    line-height: 1.5;
    color: rgba(255,255,255,0.78);
    max-width: 30ch;
    margin-bottom: 44px;
  }
  .cta-button {
    display: inline-block;
    background: var(--gold);
    color: var(--bg-deep);
    font-weight: 600;
    font-size: 24px;
    padding: 22px 36px;
    border-radius: 999px;
    letter-spacing: -0.01em;
  }

  /* PAGE PILL */
  .page-pill {
    position: absolute;
    bottom: 56px;
    right: 64px;
    background: rgba(20,20,20,0.85);
    color: rgba(255,255,255,0.85);
    backdrop-filter: blur(8px);
    padding: 10px 18px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.08em;
    z-index: 3;
  }
  .page-pill--light {
    background: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.95);
  }
`;

const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>Carousel — ${project.title}</title>
<style>${css}</style>
</head>
<body>
${slides.join("\n")}
</body>
</html>`;

const htmlFile = path.join(outDir, "_carousel.html");
await fs.writeFile(htmlFile, html, "utf-8");
console.log("HTML written:", htmlFile);

// ─────────────── SCREENSHOTS ───────────────

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: SLIDE_W, height: SLIDE_H },
  deviceScaleFactor: 2, // Retina/2x für scharfe PNGs
});
const page = await context.newPage();
await page.goto(pathToFileURL(htmlFile).href);
// Wait for fonts to load
await page.evaluateHandle("document.fonts.ready");
await page.waitForTimeout(500);

for (let i = 1; i <= 6; i++) {
  const slide = await page.locator(`#slide-${i}`);
  const outPath = path.join(outDir, `slide-0${i}.png`);
  await slide.screenshot({ path: outPath, omitBackground: false });
  console.log(`✓ slide-0${i}.png`);
}

await browser.close();

console.log(`\n✓ Done — Carousel für "${project.title}"`);
console.log(`  Output: ${outDir}`);
