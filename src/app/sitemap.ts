import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";
import { SERVICES, SERVICE_HUB } from "@/data/services";
import { CITIES } from "@/data/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = [
    "/",
    "/about-us/",
    "/kontakt/",
    "/garantie/",
    "/anfrage/",
    "/standorte/",
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

  return [...staticPages, ...servicePages, ...cityPages];
}
