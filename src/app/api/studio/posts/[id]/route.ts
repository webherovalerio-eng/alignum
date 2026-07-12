import { guard } from "@/studio/api";
import { getPost, updatePost, deletePost } from "@/studio/posts";
import type { PostDraft } from "@/studio/types";

export const runtime = "nodejs";

/** Editierten Draft aus dem Request säubern (nur erlaubte Felder, längenbegrenzt). */
function sanitizeDraft(v: unknown, existing?: PostDraft): PostDraft | undefined {
  if (!v || typeof v !== "object") return undefined;
  const d = v as Record<string, unknown>;
  const s = (x: unknown, max: number) =>
    typeof x === "string" ? x.slice(0, max) : "";
  return {
    metaTitle: s(d.metaTitle, 120),
    metaDescription: s(d.metaDescription, 300),
    intro: s(d.intro, 2000),
    body: s(d.body, 20000),
    socialCaption: s(d.socialCaption, 4000),
    hashtags: Array.isArray(d.hashtags)
      ? d.hashtags.map((h) => String(h).replace(/^#/, "").slice(0, 60)).slice(0, 15)
      : [],
    generatedAt: existing?.generatedAt ?? Date.now(),
    model: existing?.model ?? "",
  };
}

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
    selectedKeys: Array.isArray(body.selectedKeys)
      ? body.selectedKeys.filter((x): x is string => typeof x === "string")
      : undefined,
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
