import { guard } from "@/studio/api";
import { getPost, addImages } from "@/studio/posts";

export const runtime = "nodejs";
export const maxDuration = 60; // sharp-Re-Encode mehrerer Bilder kann dauern

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

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Ungültiger Upload." }, { status: 400 });
  }
  const files = form
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) {
    return Response.json({ error: "Keine Dateien." }, { status: 400 });
  }

  const { post: updated, added, rejected } = await addImages(post, files);
  return Response.json({ images: updated.images, added, rejected });
}
