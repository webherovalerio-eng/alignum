import { guard } from "@/studio/api";
import { getPost, appendImages, removeImage } from "@/studio/posts";

export const runtime = "nodejs";

/**
 * Persistiert die bereits im Blob abgelegten Bilder gebündelt am Post — EIN
 * Write für den ganzen Upload-Vorgang. Bewusst getrennt vom stückweisen
 * `/upload` (das nur in den Blob schreibt), damit kein Read-Modify-Write pro
 * Bild auf dem eventually-consistent Blob-KV passiert.
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

  let body: { images?: unknown };
  try {
    body = (await req.json()) as { images?: unknown };
  } catch {
    return Response.json({ error: "Ungültige Daten." }, { status: 400 });
  }
  const incoming = Array.isArray(body.images) ? body.images : [];

  const updated = await appendImages(post, incoming);
  return Response.json({ images: updated.images });
}

/** Einzelnes Bild löschen (Blob + Post-Datensatz). Key als Query-Param `?key=`. */
export async function DELETE(
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

  const key = new URL(req.url).searchParams.get("key") ?? "";
  if (!key || !key.startsWith(`${post.id}/`)) {
    return Response.json({ error: "Kein gültiges Bild." }, { status: 400 });
  }

  const updated = await removeImage(post, key);
  return Response.json({ images: updated.images });
}
