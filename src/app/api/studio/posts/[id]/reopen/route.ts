import { guard } from "@/studio/api";
import { getPost, reopenPost } from "@/studio/posts";

export const runtime = "nodejs";

/**
 * Setzt einen freigegebenen Beitrag zurück auf „entwurf", damit die Slide-
 * Texte (und andere Felder) nachträglich bearbeitet werden können. Danach
 * wird der Beitrag wie gewohnt neu freigegeben.
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
  await reopenPost(post);
  return Response.json({ ok: true, status: post.status });
}
