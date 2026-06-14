import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/sections/ProjectDetail";
import { CityServiceLanding } from "@/components/sections/CityServiceLanding";
import { PROJECTS, getProject, projectPath } from "@/data/projects";
import {
  cityServicePairs,
  getCityService,
  isTopCity,
  cityServicePath,
} from "@/data/cityServices";
import { CITIES } from "@/data/cities";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/data/site";

export const dynamicParams = false;

/**
 * Gemergte Zwei-Segment-Route unter einer Stadt:
 *  - Referenz-Projekte:  /{citySlug}/{projectSlug}/   → <ProjectDetail>
 *  - Service×Stadt-Landing: /{citySlug}/{comboSlug}/  → <CityServiceLanding>
 * Projekt-Slugs und Kombi-Slugs überschneiden sich nicht, daher eindeutig.
 */
export function generateStaticParams() {
  const projectParams = PROJECTS.map((p) => ({ citySlug: p.city, slug: p.slug }));
  const comboParams = cityServicePairs();
  return [...projectParams, ...comboParams];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ citySlug: string; slug: string }>;
}) {
  const { citySlug, slug } = await params;

  // 1. Service×Stadt-Kombi?
  const combo = getCityService(slug);
  if (combo && isTopCity(citySlug)) {
    const city = CITIES.find((c) => c.slug === citySlug);
    if (city) {
      return buildMetadata({
        title: `${combo.h1} ${city.name} – ${combo.metaTagline} | Alignum`,
        description: `${combo.h1} für ${city.name}: ${combo.lead.replace(/\{city\}/g, city.name)} Aus unserer Werkstatt in ${SITE.address.city} – Aufmaß, Lieferung und Montage in ${city.name} inklusive.`,
        path: cityServicePath(city.slug, combo.slug),
      });
    }
  }

  // 2. Referenz-Projekt?
  const p = getProject(slug);
  if (p && p.city === citySlug) {
    return buildMetadata({
      title: p.metaTitle,
      description: p.metaDescription,
      path: projectPath(p),
      image: p.cover,
    });
  }

  return {};
}

export default async function CitySlugPage({
  params,
}: {
  params: Promise<{ citySlug: string; slug: string }>;
}) {
  const { citySlug, slug } = await params;
  const city = CITIES.find((c) => c.slug === citySlug);
  if (!city) notFound();

  // Service×Stadt-Landing
  const combo = getCityService(slug);
  if (combo && isTopCity(citySlug)) {
    return <CityServiceLanding city={city} combo={combo} />;
  }

  // Referenz-Projekt
  const project = getProject(slug);
  if (project && project.city === citySlug) {
    return <ProjectDetail project={project} />;
  }

  notFound();
}
