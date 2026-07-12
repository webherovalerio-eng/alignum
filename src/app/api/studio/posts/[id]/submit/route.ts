import { guard } from "@/studio/api";
import { getPost, submissionError, submitPost } from "@/studio/posts";
import { sendMail, submissionNotifyEmail } from "@/studio/mail";

export const runtime = "nodejs";

const NOTIFY_TO = process.env.STUDIO_NOTIFY_TO || "vale.dc@hotmail.de";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const g = await guard(req);
  if (g instanceof Response) return g;
  const { id } = await ctx.params;
  const post = await getPost(id);
  if (!post) return Response.json({ error: "Nicht gefunden." }, { status: 404 });

  const err = submissionError(post);
  if (err) return Response.json({ error: err }, { status: 400 });

  await submitPost(post);

  // Valerio benachrichtigen, damit er die Generierung anstößt.
  try {
    const tpl = submissionNotifyEmail({
      postId: post.id,
      ortName: post.ortName,
      holzart: post.holzart,
      moebeltyp: post.moebeltyp,
      imageCount: post.images.filter((i) => i.selected).length,
    });
    await sendMail({ to: NOTIFY_TO, ...tpl });
  } catch (e) {
    console.error("[studio] Benachrichtigung fehlgeschlagen:", e);
    // Einreichung bleibt gültig, auch wenn die Mail scheitert.
  }

  return Response.json({ ok: true, status: post.status });
}
