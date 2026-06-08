import Link from "next/link";
import { Reveal, MaskWords } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { CTA } from "@/components/sections/CTA";
import { PROJECTS } from "@/data/projects";
import { CITIES } from "@/data/cities";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Projekte & Referenzen – Alignum Möbelbau",
  description:
    "Echte Schreiner-Projekte aus dem Rhein-Neckar-Raum. Massivholzmöbel, Küchen, Schränke und Treppen — fotografiert nach der Montage beim Kunden.",
  path: "/projekte/",
});

export default function ProjektIndexPage() {
  // group by city for skim-scanning
  const projectsByCity = PROJECTS.reduce<Record<string, typeof PROJECTS>>(
    (acc, p) => {
      (acc[p.city] ||= []).push(p);
      return acc;
    },
    {},
  );

  return (
    <>
      <section className="relative pt-40 pb-12 grain-overlay">
        <div className="container-prose">
          <Reveal>
            <Badge variant="outline" className="mb-6">
              <span className="size-1.5 rounded-full bg-primary" />
              {PROJECTS.length} {PROJECTS.length === 1 ? "Projekt" : "Projekte"}
            </Badge>
            <h1 className="font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] tracking-tight max-w-[18ch]">
              <MaskWords text="Echte Projekte." />{" "}
              <span className="italic text-primary inline-block">Echte Räume.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Jedes Möbel, das unsere Werkstatt verlässt, ist ein Unikat. Hier
              eine Auswahl der Projekte, die wir für Kunden im Rhein-Neckar-Raum
              realisiert haben — fotografiert nach der Montage, wie sie heute
              im Alltag stehen.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative py-20 sm:py-28">
        <div className="container-prose space-y-20">
          {Object.entries(projectsByCity).map(([citySlug, list]) => {
            const cityName = CITIES.find((c) => c.slug === citySlug)?.name ?? citySlug;
            return (
              <div key={citySlug}>
                <Reveal>
                  <div className="flex items-baseline justify-between gap-4 mb-8 pb-4 border-b border-border">
                    <h2 className="font-display text-2xl sm:text-3xl tracking-tight">
                      {cityName}
                    </h2>
                    <Link
                      href={`/${citySlug}/`}
                      className="text-sm text-primary underline-grain whitespace-nowrap"
                    >
                      Schreinerei {cityName} →
                    </Link>
                  </div>
                </Reveal>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {list.map((p, i) => (
                    <ProjectCard key={p.slug} project={p} index={i} showCity={false} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CTA
        heading="Ihr Projekt ist als nächstes dran"
        body="Aufmaß, Beratung und Montage übernehmen wir persönlich — egal ob ein einzelnes Möbel oder ein komplettes Raumkonzept."
      />
    </>
  );
}
