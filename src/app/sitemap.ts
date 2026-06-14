import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";
import { SERVICES, SERVICE_HUB } from "@/data/services";
import { CITIES } from "@/data/cities";
import { PROJECTS, projectPath } from "@/data/projects";
import { cityServicePairs, cityServicePath } from "@/data/cityServices";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = [
    "/",
    "/about-us/",
    "/kontakt/",
    "/garantie/",
    "/anfrage/",
    "/standorte/",
    "/projekte/",
    `/${SERVICE_HUB}/`,
    "/impressum/",
    "/datenschutzerklaerung/",
  ].map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "/" ? 1.0 : 0.8,
  }));

  const servicePages = SERVICES.map((s) => ({
    url: `${SITE.url}/${SERVICE_HUB}/${s.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const cityPages = CITIES.map((c) => ({
    url: `${SITE.url}/${c.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const projectPages = PROJECTS.map((p) => ({
    url: `${SITE.url}${projectPath(p)}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.75,
  }));

  // Service×Stadt-Landingpages (Top-Städte × Kern-Leistungen)
  const cityServicePages = cityServicePairs().map(({ citySlug, slug }) => ({
    url: `${SITE.url}${cityServicePath(citySlug, slug)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.78,
  }));

  return [...staticPages, ...servicePages, ...cityPages, ...projectPages, ...cityServicePages];
}
