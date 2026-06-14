"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { type Project, projectPath } from "@/data/projects";
import { CITIES } from "@/data/cities";
import { SERVICES } from "@/data/services";

/**
 * Wiederverwendbare Karte für Referenz-Projekte.
 * Wird verwendet auf: Projekt-Index, City-Page, Service-Detail-Page, Home.
 */
export function ProjectCard({
  project,
  index = 0,
  showCity = true,
}: {
  project: Project;
  index?: number;
  showCity?: boolean;
}) {
  const cityName = CITIES.find((c) => c.slug === project.city)?.name;
  const serviceName = SERVICES.find((s) => s.slug === project.service)?.name;
  const eyebrow =
    showCity && cityName
      ? `Projekt in ${cityName}`
      : serviceName ?? "Referenz";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay: (index % 6) * 0.05, ease: [0.19, 1, 0.22, 1] }}
    >
      <Link
        href={projectPath(project)}
        className="group block overflow-hidden rounded-xl border border-border bg-card hover:shadow-[var(--shadow-elev)] transition-shadow duration-500"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
        </div>

        <div className="p-6 sm:p-7">
          <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium mb-2">
            {eyebrow}
          </p>
          <h3 className="font-display text-xl sm:text-2xl tracking-tight leading-snug mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {project.summary}
          </p>
          <div className="mt-5 inline-flex items-center gap-1.5 text-sm text-primary font-medium">
            Projekt ansehen
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
