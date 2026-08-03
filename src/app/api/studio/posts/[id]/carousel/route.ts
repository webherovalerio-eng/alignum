import { ImageResponse } from "next/og";
import { guard } from "@/studio/api";
import { getPost } from "@/studio/posts";
import {
  postToSlideData,
  renderSlide,
  SLIDE_W,
  SLIDE_H,
  SLIDE_COUNT,
} from "@/studio/carousel/slides";

export const runtime = "nodejs";

/**
 * Rendert eine einzelne Social-Slide (1080×1350 PNG) on-demand aus den
 * Studio-Daten des Beitrags — Satori/next/og, kein Chromium, läuft auf Vercel.
 * Self-Service: Jan lädt die 6 Slides direkt aus der freigegebenen Ansicht.
 *
 *   GET .../carousel/?n=1        → Slide 1 inline (Vorschau)
 *   GET .../carousel/?n=1&dl=1   → Slide 1 als Download (Content-Disposition)
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await guard(req);
  if (g instanceof Response) return g;

  const { id } = await ctx.params;
  const post = await getPost(id);
  if (!post) return Response.json({ error: "Nicht gefunden." }, { status: 404 });

  const url = new URL(req.url);
  const n = Math.min(Math.max(parseInt(url.searchParams.get("n") || "1", 10) || 1, 1), SLIDE_COUNT);
  const download = url.searchParams.get("dl") === "1";
  // Auf Vercel ist url.origin oft die interne Function-URL — die same-origin
  // Asset/Font-Fetches müssen aber die öffentliche Domain treffen.
  const fwdHost = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const fwdProto = req.headers.get("x-forwarded-proto") ?? "https";
  const origin = fwdHost ? `${fwdProto}://${fwdHost}` : url.origin;

  const data = postToSlideData(post);
  const assets = {
    logoLight: `${origin}/logo.png`,
    logoDark: `${origin}/logo-dark.png`,
    woodImg: `${origin}/images/woods/${data.materialSlug}.jpg`,
  };

  const fileBase = (post.moebeltyp || "slide")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  try {
    // Fonts same-origin laden (public/fonts/). Statische Instanzen; ein Eintrag
    // pro Familie (Satori matcht die Gewichte).
    const [cinzel, mont, inter] = await Promise.all([
      fetch(`${origin}/fonts/cinzel.ttf`).then((r) => r.arrayBuffer()),
      fetch(`${origin}/fonts/montserrat.ttf`).then((r) => r.arrayBuffer()),
      fetch(`${origin}/fonts/inter.ttf`).then((r) => r.arrayBuffer()),
    ]);

    return new ImageResponse(renderSlide(data, n, assets), {
      width: SLIDE_W,
      height: SLIDE_H,
      fonts: [
        { name: "Cinzel", data: cinzel, weight: 600, style: "normal" },
        { name: "Montserrat", data: mont, weight: 500, style: "normal" },
        { name: "Inter", data: inter, weight: 400, style: "normal" },
      ],
      headers: {
        // Nicht cachen: die Slides werden aus dem Post-Draft gerendert und
        // ändern sich, sobald Texte bearbeitet + neu freigegeben werden.
        // ImageResponse würde sonst bis zu 1 Jahr immutable cachen → der
        // Nutzer sähe nach einer Textänderung weiter die alten Slides.
        "Cache-Control": "no-store, must-revalidate",
        ...(download
          ? {
              "Content-Disposition": `attachment; filename="${fileBase}-slide-${String(n).padStart(2, "0")}.png"`,
            }
          : {}),
      },
    });
  } catch (e) {
    console.error(`[studio] carousel slide ${n} für ${id} fehlgeschlagen:`, e);
    return Response.json(
      { error: "Slide-Rendering fehlgeschlagen.", detail: String(e) },
      { status: 500 },
    );
  }
}
