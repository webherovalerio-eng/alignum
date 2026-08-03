/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
/**
 * Server-seitiger Nachbau des `--classic`-Carousels (scripts/generate-carousel.mts)
 * für Satori / next/og. Rendert die 6 Instagram-Slides (1080×1350) aus den
 * STUDIO-Daten eines Beitrags (draft), nicht aus projects.ts — so kann Jan die
 * Slides selbst generieren, bevor Valerio die Website-Seite baut.
 *
 * Satori-Grenzen beachtet: nur Flexbox, kein backdrop-filter, kein ::before,
 * Inline-Styles statt Klassen. Optik so nah wie möglich am Playwright-Original;
 * pixelgenaue Deckung ist nicht das Ziel (bewusst gewählte Engine).
 */
import type { Post } from "@/studio/types";
import { MATERIALS } from "@/data/materials";

const GOLD = "#d48408";
const CREAM = "#fbf8f3";
const DEEP = "#0a0a0a";
const FG_DARK = "#141414";

const CINZEL = "Cinzel";
const MONT = "Montserrat";
const INTER = "Inter";

const LIGHT_WOODS = new Set(["ahorn", "esche", "buche", "kiefer", "pappel"]);

export const SLIDE_W = 1080;
export const SLIDE_H = 1350;
export const SLIDE_COUNT = 6;

export interface SlideAssets {
  logoLight: string; // URL (helles Logo für dunklen Grund)
  logoDark: string; // URL (dunkles Logo für hellen Grund)
  woodImg: string; // URL der Maserung
}

export interface SlideData {
  coverTitle: string;
  place: string;
  body: string[];
  features: string[];
  builtLabel: string;
  woodLabel: string;
  woodIsLight: boolean;
  coverImg?: string;
  ideaImg?: string;
  solutionImg?: string;
  materialSlug: string;
}

/** Freitext-Holzart (z. B. "Eiche") → Material-Slug für Maserung + woodIsLight. */
export function materialSlugFor(holzart: string): string {
  const h = holzart.trim().toLowerCase();
  if (!h) return "stiel-eiche";
  const hit = MATERIALS.find(
    (m) =>
      m.name.toLowerCase().includes(h) ||
      h.includes(m.slug.replace(/-/g, " ")) ||
      m.name.toLowerCase().split(/[\s&/]+/).some((w) => w && h.includes(w)),
  );
  return hit?.slug ?? "stiel-eiche";
}

/** Studio-Post → SlideData. Fällt defensiv auf Post-Felder zurück, wenn kein Draft. */
export function postToSlideData(post: Post): SlideData {
  const d = post.draft;
  const selected = post.images.filter((i) => i.selected);
  const materialSlug = materialSlugFor(post.holzart);
  return {
    coverTitle: (d?.title || post.moebeltyp || "Projekt").trim(),
    place: post.ortName || "",
    body: d?.body ? d.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean) : [],
    features: d?.features ?? [],
    builtLabel: post.moebeltyp || "Maßmöbel",
    woodLabel: post.holzart || "Massivholz",
    woodIsLight: LIGHT_WOODS.has(materialSlug),
    coverImg: selected[0]?.url,
    solutionImg: selected[1]?.url ?? selected[0]?.url,
    ideaImg: selected[2]?.url ?? selected[0]?.url,
    materialSlug,
  };
}

// ─────────────── Bausteine ───────────────

function BrandTop({ src }: { src: string }) {
  return (
    <div style={{ position: "absolute", top: 56, left: 64, display: "flex" }}>
      <img src={src} height={56} />
    </div>
  );
}

function PagePill({ n, light }: { n: number; light?: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 56,
        right: 64,
        display: "flex",
        background: light ? "rgba(255,255,255,0.14)" : "rgba(20,20,20,0.85)",
        color: light ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.85)",
        padding: "10px 18px",
        borderRadius: 999,
        fontFamily: MONT,
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "0.1em",
      }}
    >
      {n} / {SLIDE_COUNT}
    </div>
  );
}

function Eyebrow({ text, gold }: { text: string; gold?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: MONT,
        fontSize: 15,
        fontWeight: 500,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: gold ? GOLD : "rgba(255,255,255,0.7)",
        marginBottom: 18,
      }}
    >
      {text}
    </div>
  );
}

/** Vertikal zentrierter Content-Block (ersetzt top:50% + translateY). */
function CenterWrap({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
    left: 0,
    right: 0,
    bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 64px",
        color,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────── Slides ───────────────

export function renderSlide(
  data: SlideData,
  n: number,
  a: SlideAssets,
): React.ReactElement {
  const base: React.CSSProperties = {
    position: "relative",
    width: SLIDE_W,
    height: SLIDE_H,
    display: "flex",
    overflow: "hidden",
    background: DEEP,
  };
  const fill: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SLIDE_W,
    height: SLIDE_H,
    objectFit: "cover",
  };

  switch (n) {
    case 1:
      return (
        <div style={base}>
          {data.coverImg && <img src={data.coverImg} style={fill} />}
          <div
            style={{
              position: "absolute",
              top: 0,
    left: 0,
    right: 0,
    bottom: 0,
              backgroundImage:
                "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.05) 100%)",
            }}
          />
          <BrandTop src={a.logoLight} />
          <div
            style={{
              position: "absolute",
              left: 64,
              right: 64,
              bottom: 130,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Eyebrow text={`Projekt · ${data.place}`} />
            <div
              style={{
                display: "flex",
                fontFamily: CINZEL,
                fontWeight: 600,
                fontSize: 58,
                lineHeight: 1.16,
                letterSpacing: "0.045em",
                color: "#fff",
              }}
            >
              {data.coverTitle}
            </div>
          </div>
          <PagePill n={n} light />
        </div>
      );

    case 2:
      return (
        <div style={base}>
          {data.ideaImg && <img src={data.ideaImg} style={fill} />}
          <div
            style={{
              position: "absolute",
              top: 0,
    left: 0,
    right: 0,
    bottom: 0,
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.12) 22%, rgba(0,0,0,0) 45%)",
            }}
          />
          <BrandTop src={a.logoLight} />
          <PagePill n={n} light />
        </div>
      );

    case 3:
      return (
        <div style={base}>
          {data.solutionImg && (
            <img
              src={data.solutionImg}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: SLIDE_W,
                height: Math.round(SLIDE_H * 0.55),
                objectFit: "cover",
              }}
            />
          )}
          <BrandTop src={a.logoLight} />
          <div
            style={{
              position: "absolute",
              left: 64,
              right: 64,
              bottom: 64,
              display: "flex",
              flexDirection: "column",
              background: CREAM,
              borderRadius: 28,
              padding: "56px 56px 80px 56px",
            }}
          >
            <Eyebrow text="Die Lösung" gold />
            <div
              style={{
                display: "flex",
                fontFamily: INTER,
                fontSize: 26,
                lineHeight: 1.45,
                color: FG_DARK,
              }}
            >
              {data.body[1] ?? data.body[0] ?? ""}
            </div>
          </div>
          <PagePill n={n} />
        </div>
      );

    case 4: {
      const light = data.woodIsLight;
      const scrim = light
        ? "linear-gradient(to right, rgba(251,248,243,0.86) 0%, rgba(251,248,243,0.55) 40%, rgba(251,248,243,0.12) 72%, rgba(251,248,243,0) 100%)"
        : "linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.18) 72%, rgba(0,0,0,0.04) 100%)";
      const titleColor = light ? FG_DARK : "#fff";
      const bodyColor = light ? "rgba(20,20,20,0.82)" : "rgba(255,255,255,0.88)";
      return (
        <div style={base}>
          <img src={a.woodImg} style={fill} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: scrim }} />
          <BrandTop src={light ? a.logoDark : a.logoLight} />
          <CenterWrap color={titleColor}>
            <Eyebrow text="Das Holz" gold />
            <div
              style={{
                display: "flex",
                fontFamily: CINZEL,
                fontWeight: 600,
                fontSize: 82,
                lineHeight: 1.05,
                letterSpacing: "0.04em",
                color: titleColor,
                marginBottom: 24,
              }}
            >
              {data.woodLabel}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: INTER,
                fontSize: 26,
                lineHeight: 1.5,
                color: bodyColor,
                maxWidth: 620,
              }}
            >
              {data.body[2] ?? data.body[0] ?? ""}
            </div>
          </CenterWrap>
          <PagePill n={n} light={!light} />
        </div>
      );
    }

    case 5:
      return (
        <div style={{ ...base, background: CREAM }}>
          <div
            style={{
              position: "absolute",
              bottom: -110,
              right: -30,
              display: "flex",
              fontFamily: CINZEL,
              fontSize: 460,
              fontWeight: 400,
              color: "rgba(20,20,20,0.045)",
              lineHeight: 0.85,
            }}
          >
            Details
          </div>
          <BrandTop src={a.logoDark} />
          <CenterWrap color={FG_DARK}>
            <Eyebrow text="Was wir gebaut haben" gold />
            <div
              style={{
                display: "flex",
                fontFamily: CINZEL,
                fontWeight: 400,
                fontSize: 52,
                lineHeight: 1.15,
                letterSpacing: "0.05em",
                color: FG_DARK,
                marginBottom: 40,
              }}
            >
              {data.builtLabel}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {data.features.slice(0, 5).map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                  <div
                    style={{
                      display: "flex",
                      width: 36,
                      height: 36,
                      alignItems: "center",
                      justifyContent: "center",
                      background: GOLD,
                      color: "#fff",
                      borderRadius: 999,
                      fontSize: 18,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      fontFamily: INTER,
                      fontSize: 26,
                      lineHeight: 1.4,
                      color: FG_DARK,
                    }}
                  >
                    {f}
                  </div>
                </div>
              ))}
            </div>
          </CenterWrap>
          <PagePill n={n} />
        </div>
      );

    case 6:
    default:
      return (
        <div
          style={{
            ...base,
            backgroundImage:
              "radial-gradient(ellipse at top right, rgba(212,132,8,0.12), transparent 60%), radial-gradient(ellipse at bottom left, rgba(212,132,8,0.05), transparent 50%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: -110,
              right: -30,
              display: "flex",
              fontFamily: CINZEL,
              fontSize: 380,
              fontWeight: 400,
              color: "rgba(255,255,255,0.04)",
              lineHeight: 0.85,
            }}
          >
            alignum
          </div>
          <BrandTop src={a.logoLight} />
          <CenterWrap color="#fff">
            <Eyebrow text="Ihr Projekt ist als nächstes dran" gold />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontFamily: CINZEL,
                fontWeight: 600,
                fontSize: 54,
                lineHeight: 1.18,
                letterSpacing: "0.035em",
                marginBottom: 32,
              }}
            >
              <div style={{ display: "flex", color: "#fff" }}>Aufmaß bei Ihnen.</div>
              <div style={{ display: "flex", color: GOLD }}>Fertigung bei uns.</div>
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: INTER,
                fontSize: 24,
                lineHeight: 1.5,
                color: "rgba(255,255,255,0.78)",
                maxWidth: 620,
                marginBottom: 44,
              }}
            >
              Wir kommen zu Ihnen, vermessen den Raum und skizzieren das Möbel, das
              Sie bisher nirgends gefunden haben.
            </div>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  background: GOLD,
                  color: DEEP,
                  fontFamily: MONT,
                  fontWeight: 600,
                  fontSize: 22,
                  letterSpacing: "0.06em",
                  padding: "22px 36px",
                  borderRadius: 999,
                }}
              >
                alignum.de/anfrage →
              </div>
            </div>
          </CenterWrap>
          <PagePill n={n} light />
        </div>
      );
  }
}
