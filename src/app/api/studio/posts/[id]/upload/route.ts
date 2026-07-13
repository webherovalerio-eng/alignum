import { guard } from "@/studio/api";
import { getPost, processUpload } from "@/studio/posts";

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

  // Blob-Ablage nur — der Post-Datensatz wird NICHT hier geschrieben, sondern
  // gebündelt über die images-Route (verhindert Read-Modify-Write-Races).
  const base = {
    count: post.images.length,
    bytes: post.images.reduce((s, i) => s + i.bytes, 0),
  };
  const { images, added, rejected } = await processUpload(post.id, base, files);
  return Response.json({ images, added, rejected });
}
