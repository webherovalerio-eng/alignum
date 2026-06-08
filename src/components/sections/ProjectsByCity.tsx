import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "./ProjectCard";
import { getProjectsByCity } from "@/data/projects";
import { type City } from "@/data/cities";

/**
 * „Realisierte Projekte in {Stadt}" — wird auf jeder City-Page gerendert,
 * für die echte Projekt-Einträge in src/data/projects.ts existieren.
 *
 * Wenn keine Projekte vorhanden sind → die Section rendert nichts (null),
 * damit Stadt-Pages ohne Referenz keine leere Sektion bekommen.
 */
export function ProjectsByCity({ city }: { city: City }) {
  const projects = getProjectsByCity(city.slug);
  if (projects.length === 0) return null;

  return (
    <section className="relative py-24 sm:py-32 border-t border-border">
      <div className="container-prose">
        <Reveal className="max-w-3xl mb-12">
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">
            Echte Projekte in {city.name}
          </p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] tracking-tight">
            Was wir für{" "}
            <span className="italic text-primary">{city.name}</span> gebaut haben.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Konkrete Möbel, konkrete Kunden, konkrete Räume — fotografiert nach
            der Montage in {city.name}. So sieht das aus, wenn aus Skizze und
            Holz ein echtes Möbel wird.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} showCity={false} />
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/projekte/"
            className="text-sm text-primary underline-grain"
          >
            Alle Referenzprojekte ansehen →
          </Link>
        </div>
      </div>
    </section>
  );
}
