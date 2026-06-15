import { permanentRedirect } from "next/navigation";
import { PROJECTS, getProject, projectPath } from "@/data/projects";

/**
 * Legacy-Route: Projekte liegen jetzt unter /{citySlug}/{slug}/.
 * Diese alte URL leitet per 308 (permanent) auf die neue kanonische URL um,
 * damit Bestandslinks und Suchmaschinen-Index sauber übergehen.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function LegacyProjectRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) permanentRedirect("/projekte/");
  permanentRedirect(projectPath(project));
}
