import { guard } from "@/studio/api";
import { getPost, setImages } from "@/studio/posts";

export const runtime = "nodejs";

/**
 * Setzt die Bildliste des Posts auf den vom Client gelieferten, autoritativen
 * Stand — EIN Write. Wird für Upload-Persistierung UND Löschen genutzt: der
 * Client schickt immer die vollständige gewünschte Liste (`images`), optional die
 * zu entfernenden Bilder (`remove`, key+url) fürs Blob-Aufräumen. So hängt nichts
 * mehr von einem (eventually-consistent) KV-Read ab → keine Race, bei der sich
 * Upload-/Lösch-Aktionen gegenseitig überschreiben.
 */
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

  let body: { images?: unknown; remove?: unknown };
  try {
    body = (await req.json()) as { images?: unknown; remove?: unknown };
  } catch {
    return Response.json({ error: "Ungültige Daten." }, { status: 400 });
  }
  const desired = Array.isArray(body.images) ? body.images : [];
  const remove = Array.isArray(body.remove) ? body.remove : [];

  const updated = await setImages(post, desired, remove);
  return Response.json({ images: updated.images });
}
