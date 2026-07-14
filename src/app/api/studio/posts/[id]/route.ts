import { guard } from "@/studio/api";
import { getPost, updatePost, deletePost, sanitizeDraft } from "@/studio/posts";

export const runtime = "nodejs";

export async function PATCH(
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
      { error: "Beitrag ist bereits eingereicht und nicht mehr editierbar." },
      { status: 409 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Ungültige Daten." }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v : undefined);
  await updatePost(post, {
    ort: str(body.ort),
    ortName: str(body.ortName),
    holzart: str(body.holzart),
    moebeltyp: str(body.moebeltyp),
    notiz: str(body.notiz),
    images: Array.isArray(body.images) ? body.images : undefined,
    draft:
      body.draft !== undefined
        ? sanitizeDraft(body.draft, post.draft)
        : undefined,
  });

  return Response.json({ ok: true, post });
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const g = await guard(req);
  if (g instanceof Response) return g;
  const { id } = await ctx.params;
  await deletePost(id);
  return Response.json({ ok: true });
}
