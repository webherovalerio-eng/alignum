import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost } from "@/studio/posts";
import { getMonthlyUsage } from "@/studio/usage";
import { CITIES } from "@/data/cities";
import { PostEditor } from "./PostEditor";

export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const cities = CITIES.map((c) => ({ slug: c.slug, name: c.name }));
  const usage = await getMonthlyUsage();

  return (
    <div>
      <Link
        href="/studio"
        className="text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        ← Zurück zur Übersicht
      </Link>
      <div className="mt-4">
        <PostEditor initialPost={post} cities={cities} initialUsage={usage} />
      </div>
    </div>
  );
}
