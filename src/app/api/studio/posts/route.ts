import { guard } from "@/studio/api";
import { createPost } from "@/studio/posts";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const g = await guard(req);
  if (g instanceof Response) return g;
  const post = await createPost(g.email);
  return Response.json({ id: post.id });
}
