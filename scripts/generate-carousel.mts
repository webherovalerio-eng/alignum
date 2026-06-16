/**
 * Social-Media-Carousel-Generator für Alignum-Projekte.
 *
 * Erzeugt aus einem Projekt-Eintrag (src/data/projects.ts) sechs
 * Instagram/LinkedIn-Carousel-Slides (1080×1350, 4:5) als PNG.
 *
 *   npx tsx scripts/generate-carousel.mts {slug} [--classic]
 *   z.B. npx tsx scripts/generate-carousel.mts fernsehschrank-mannheim-ahorn
 *
 * --classic: Typo-Variante Cinzel (H1/H2) + Montserrat (Labels/Buttons) + Inter (Fließtext),
 *            Slide 2 bildlastig mit kurzem Statement statt langem Zitat.
 *
 * Output: ../_extracted/social/{slug}/slide-01.png … slide-06.png
 *         (--classic: ../_extracted/social/{slug}-classic/)
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
const classic = process.argv.includes("--classic");
if (!slug) {
  console.error("Usage: npx tsx scripts/generate-carousel.mts <project-slug> [--classic]");
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

// Cover-Template: Titel folgt dem Muster „{Produkt} aus {Holz} — Projekt {Ort}".
// Für die Cover-Headline nur den Produkt-Teil zeigen; den Ort separat als
// Eyebrow „Projekt · {Ort}". Der Ort im Titel ist oft präziser als die
// City-Page (z.B. Hochhausen statt der zugeordneten Stadt Haßmersheim).
const [coverTitle, titlePlace] = project.title.split(/\s*[—–-]\s*Projekt\s+/);
const projectPlace = (titlePlace ?? city?.name ?? "").trim();

// Holzart-Label: muss exakt dem entsprechen, was im Titel steht
// („… aus {Holz}"), NICHT dem Katalog-Namen (z.B. Titel „Ahorn", aber
// material.name „Berg-Ahorn"). Reihenfolge: expliziter Override > Titel > Katalog.
const woodFromTitle = (coverTitle?.trim() ?? "").match(/\baus\s+(.+?)\s*$/i)?.[1]?.trim();
const woodLabel = project.woodLabel ?? woodFromTitle ?? material?.name ?? "Massivholz";

const outDir = path.join(OUTPUT_BASE, classic ? `${slug}-classic` : slug);
await fs.mkdir(outDir, { recursive: true });

function imgUrl(relPath: string): string {
  const absPath = path.join(WEB_ROOT, "public", relPath.replace(/^\//, ""));
  return pathToFileURL(absPath).href;
}

// Logo as inline base64 — funktioniert ohne Server-Setup
const logoLight = await fs.readFile(path.join(WEB_ROOT, "public", "logo.png"));
const logoDark = await fs.readFile(path.join(WEB_ROOT, "public", "logo-dark.png"));
const logoLightUri = `data:image/png;base64,${logoLight.toString("base64")}`;
const logoDarkUri = `data:image/png;base64,${logoDark.toString("base64")}`;

// Fonts lokal als base64 einbetten — der Google-Fonts-@import lädt im
// Headless-Chromium nicht (document.fonts bleibt leer, alles fällt auf
// Georgia/Segoe zurück). Variable-Font-TTFs liegen in scripts/fonts/.
async function fontFace(file: string, family: string, weights: string): Promise<string> {
  const buf = await fs.readFile(path.join(__dirname, "fonts", file));
  return `@font-face {
    font-family: '${family}';
    src: url(data:font/ttf;base64,${buf.toString("base64")}) format('truetype');
    font-weight: ${weights};
    font-style: normal;
  }`;
}
const fontCss = (
  await Promise.all([
    fontFace("cinzel.ttf", "Cinzel", "400 900"),
    fontFace("montserrat.ttf", "Montserrat", "100 900"),
    fontFace("inter.ttf", "Inter", "100 900"),
    fontFace("fraunces.ttf", "Fraunces", "100 900"),
  ])
).join("\n");

// ─────────────── SLIDES ───────────────

const SLIDE_W = 1080;
const SLIDE_H = 1350;

const slides: string[] = [
  // 1. COVER — Hook
  `
  <div class="slide">
    <img class="bg" src="${imgUrl(project.cover)}" />
    <div class="scrim-bottom"></div>
    <div class="brand-top brand-top--light">
      <img src="${logoLightUri}" class="brand-logo" alt="Alignum" />
    </div>
    <div class="hero-bottom">
      <div class="eyebrow">Projekt · ${projectPlace}</div>
      <h1 class="hero-title">${coverTitle.trim()}</h1>
    </div>
    <div class="page-pill page-pill--light"></div>
  </div>
  `,

  // 1b. ESTABLISHING — optionales textfreies Vollbild (z.B. Gesamt-Ensemble)
  ...(project.establishingImage
    ? [
        `
  <div class="slide">
    <img class="bg" src="${imgUrl(project.establishingImage)}" />
    <div class="scrim-soft-top"></div>
    <div class="brand-top brand-top--light">
      <img src="${logoLightUri}" class="brand-logo" alt="Alignum" />
    </div>
    <div class="page-pill page-pill--light"></div>
  </div>
  `,
      ]
    : []),

  // 2. DIE IDEE (classic: reines Vollbild, kein Text — lässt das Möbel wirken).
  // Per skipIdea abschaltbar, z.B. wenn ein Establishing-Slide das Möbel bereits zeigt.
  ...(project.skipIdea
    ? []
    : [
        classic
          ? `
  <div class="slide">
    <img class="bg" src="${imgUrl(project.images[2] ?? project.cover)}" />
    <div class="scrim-soft-top"></div>
    <div class="brand-top brand-top--light">
      <img src="${logoLightUri}" class="brand-logo" alt="Alignum" />
    </div>
    <div class="page-pill page-pill--light"></div>
  </div>
  `
          : `
  <div class="slide">
    <div class="surface-deep"></div>
    <div class="watermark">${city?.name ?? "Projekt"}</div>
    <div class="brand-top brand-top--light">
      <img src="${logoLightUri}" class="brand-logo" alt="Alignum" />
    </div>
    <div class="statement-block">
      <div class="eyebrow eyebrow--gold">Die Idee</div>
      <p class="big-quote">${project.body[0]}</p>
    </div>
    <div class="page-pill page-pill--light"></div>
  </div>
  `,
      ]),

  // 3. DIE LÖSUNG — Bild + Body[1]
  `
  <div class="slide" id="slide-3">
    <img class="bg-half" src="${imgUrl(project.images[1] ?? project.cover)}" />
    <div class="brand-top">
      <img src="${logoDarkUri}" class="brand-logo" alt="Alignum" />
    </div>
    <div class="bottom-card">
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
    <div class="brand-top brand-top--light">
      <img src="${logoLightUri}" class="brand-logo" alt="Alignum" />
    </div>
    <div class="center-block">
      <div class="eyebrow eyebrow--gold">Das Holz</div>
      <h2 class="material-title">${woodLabel}</h2>
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
      <img src="${logoDarkUri}" class="brand-logo" alt="Alignum" />
    </div>
    <div class="features-block">
      <div class="eyebrow eyebrow--gold">Was wir gebaut haben</div>
      <h2 class="features-title">${project.builtLabel ?? service?.name ?? "Maßmöbel"}</h2>
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
    <div class="brand-top brand-top--light">
      <img src="${logoLightUri}" class="brand-logo" alt="Alignum" />
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

// Slide-Anzahl ist dynamisch (optionaler Establishing-Slide) — IDs und
// „n / total"-Seitenzahlen werden hier zentral vergeben, statt sie in jedem
// Template hart zu codieren.
const SLIDE_COUNT = slides.length;
const numberedSlides = slides.map((html, i) => {
  const n = i + 1;
  return html
    .replace(/ id="slide-\d+"/, "")
    .replace('<div class="slide"', `<div class="slide" id="slide-${n}"`)
    .replace(/(<div class="page-pill[^"]*">)[^<]*(<\/div>)/, `$1${n} / ${SLIDE_COUNT}$2`);
});

// ─────────────── STYLES ───────────────

const css = `
  ${fontCss}

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
  .font-brand { font-family: 'Cinzel', 'Trajan Pro', Georgia, serif; letter-spacing: 0.08em; text-transform: uppercase; }
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
    /* Links dunkel (Text lesbar), nach rechts transparent — lässt das
       Holz-Maserbild sichtbar, statt es flächig grau zu überdecken. */
    background:
      linear-gradient(
        to right,
        rgba(0,0,0,0.80) 0%,
        rgba(0,0,0,0.55) 38%,
        rgba(0,0,0,0.18) 72%,
        rgba(0,0,0,0.04) 100%
      ),
      linear-gradient(
        to bottom,
        rgba(0,0,0,0.18) 0%,
        rgba(0,0,0,0) 30%,
        rgba(0,0,0,0) 70%,
        rgba(0,0,0,0.28) 100%
      );
  }
  .scrim-soft-top {
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.45) 0%,
      rgba(0,0,0,0.12) 22%,
      rgba(0,0,0,0) 45%
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
    z-index: 3;
  }
  .brand-logo {
    height: 62px;
    width: auto;
    display: block;
  }

  .eyebrow {
    font-family: 'Cinzel', 'Trajan Pro', Georgia, serif;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.32em;
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

/*
 * Classic-Typo-Variante:
 *   H1 = Cinzel 600 (groß, edel, positives Letterspacing — Cinzel setzt alles in Kapitälchen,
 *        daher kleinere Größen als bei Fraunces)
 *   H2 = Cinzel 400
 *   H3/Labels (Eyebrows) = Montserrat 500
 *   Fließtext = Inter 400
 *   Buttons/Pills = Montserrat 500-600 mit Letterspacing
 */
const classicCss = `
  .eyebrow {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-weight: 500;
    font-size: 15px;
    letter-spacing: 0.3em;
  }
  .watermark { font-family: 'Cinzel', Georgia, serif; font-weight: 400; letter-spacing: 0; }
  .hero-title {
    font-family: 'Cinzel', Georgia, serif;
    font-weight: 600;
    font-size: 58px;
    line-height: 1.16;
    letter-spacing: 0.045em;
    max-width: none;
  }
  .hero-sub, .body-text, .material-body, .cta-body, .features-list li {
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 400;
  }
  .statement-bottom {
    position: absolute;
    left: 64px; right: 64px; bottom: 120px;
    z-index: 2;
  }
  .image-quote {
    font-family: 'Cinzel', Georgia, serif;
    font-weight: 400;
    font-size: 42px;
    line-height: 1.32;
    letter-spacing: 0.03em;
    color: #fff;
  }
  .material-title {
    font-family: 'Cinzel', Georgia, serif;
    font-weight: 600;
    font-size: 82px;
    line-height: 1.05;
    letter-spacing: 0.04em;
  }
  .features-title {
    font-family: 'Cinzel', Georgia, serif;
    font-weight: 400;
    font-size: 52px;
    line-height: 1.15;
    letter-spacing: 0.05em;
  }
  .cta-title {
    font-family: 'Cinzel', Georgia, serif;
    font-weight: 600;
    font-size: 54px;
    line-height: 1.18;
    letter-spacing: 0.035em;
  }
  .cta-title .italic { font-style: normal; } /* Cinzel hat keine Kursive — Gold trägt den Akzent */
  .cta-button {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-weight: 600;
    font-size: 22px;
    letter-spacing: 0.06em;
  }
  .page-pill {
    font-family: 'Montserrat', system-ui, sans-serif;
    letter-spacing: 0.1em;
  }
`;

const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>Carousel — ${project.title}</title>
<style>${css}${classic ? classicCss : ""}</style>
</head>
<body>
${numberedSlides.join("\n")}
</body>
</html>`;

const htmlFile = path.join(outDir, "_carousel.html");
await fs.writeFile(htmlFile, html, "utf-8");
console.log("HTML written:", htmlFile);

// ─────────────── SCREENSHOTS ───────────────

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: SLIDE_W, height: SLIDE_H },
  deviceScaleFactor: 2,
});
const page = await context.newPage();
await page.goto(pathToFileURL(htmlFile).href);
await page.evaluateHandle("document.fonts.ready");
await page.waitForTimeout(800);

for (let i = 1; i <= SLIDE_COUNT; i++) {
  const nn = String(i).padStart(2, "0");
  const slide = await page.locator(`#slide-${i}`);
  const outPath = path.join(outDir, `slide-${nn}.png`);
  await slide.screenshot({ path: outPath, omitBackground: false });
  console.log(`✓ slide-${nn}.png`);
}

await browser.close();

console.log(`\n✓ Done — Carousel für "${project.title}"`);
console.log(`  Output: ${outDir}`);
