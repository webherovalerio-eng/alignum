import { guard } from "@/studio/api";
import { getPost, savePost } from "@/studio/posts";
import { generateDraft } from "@/studio/generate";
import { reserveGeneration, releaseGeneration } from "@/studio/usage";

export const runtime = "nodejs";
export const maxDuration = 60; // KI-Generierung kann 20–40s dauern

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const g = await guard(req);
  if (g instanceof Response) return g;
  const { id } = await ctx.params;
  const post = await getPost(id);
  if (!post) return Response.json({ error: "Nicht gefunden." }, { status: 404 });
  if (post.status !== "neu" && post.status !== "entwurf") {
    return Response.json(
      { error: "Beitrag ist nicht mehr editierbar." },
      { status: 409 },
    );
  }

  // Voraussetzungen (ohne Draft — der entsteht ja gerade).
  if (!post.images.some((i) => i.selected)) {
    return Response.json(
      { error: "Bitte zuerst mindestens ein Bild auswählen." },
      { status: 400 },
    );
  }
  if (!post.ort || !post.holzart.trim() || !post.moebeltyp.trim()) {
    return Response.json(
      { error: "Bitte Ort, Möbeltyp und Holzart ausfüllen." },
      { status: 400 },
    );
  }

  // Hartes Monatslimit — Reservierung ZUERST (nicht umgehbar).
  const { ok, usage } = await reserveGeneration();
  if (!ok) {
    return Response.json(
      {
        error: `Monatslimit erreicht (${usage.limit} Generierungen pro Monat). Nächsten Monat wieder verfügbar.`,
        usage,
      },
      { status: 429 },
    );
  }

  try {
    const draft = await generateDraft({
      ortName: post.ortName,
      holzart: post.holzart,
      moebeltyp: post.moebeltyp,
      notiz: post.notiz,
    });
    post.draft = draft;
    await savePost(post);
    return Response.json({ draft, usage });
  } catch (e) {
    // Fehlgeschlagen → Reservierung zurückgeben (verbraucht kein Kontingent).
    await releaseGeneration();
    console.error("[studio] Generierung fehlgeschlagen:", e);
    const msg =
      e instanceof Error && e.message.includes("ANTHROPIC_API_KEY")
        ? "KI-Generierung ist noch nicht konfiguriert (ANTHROPIC_API_KEY fehlt)."
        : "Generierung fehlgeschlagen. Bitte erneut versuchen.";
    return Response.json({ error: msg }, { status: 502 });
  }
}
