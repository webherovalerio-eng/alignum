import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal, MaskWords } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { CITIES } from "@/data/cities";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Projekte in der Region – Schreinerei Alignum",
  description: `Projekte in ${CITIES.length} Städten rund um Mannheim. Massivholzmöbel, Küchen, Treppen und Türen vor Ort.`,
  path: "/standorte/",
});

export default function StandortePage() {
  // Group by state
  const grouped = CITIES.reduce<Record<string, typeof CITIES>>((acc, c) => {
    (acc[c.state] ||= []).push(c);
    return acc;
  }, {});

  return (
    <>
      <section className="relative pt-40 pb-12 grain-overlay">
        <div className="container-prose">
          <Reveal>
            <Badge variant="outline" className="mb-6">
              <span className="size-1.5 rounded-full bg-primary" />
              {CITIES.length} Städte
            </Badge>
            <h1 className="font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] tracking-tight max-w-[16ch]">
              <MaskWords text="Projekte in" />{" "}
              <span className="italic text-gradient-gold">
                <MaskWords text="der Region." />
              </span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Wir liefern und montieren in der gesamten Rhein-Neckar-Region.
              Wählen Sie Ihre Stadt – jede Seite zeigt, was wir vor Ort tun.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative py-20">
        <div className="container-prose space-y-16">
          {Object.entries(grouped).map(([state, cities]) => (
            <Reveal key={state}>
              <div>
                <h2 className="font-display text-2xl sm:text-3xl mb-6 flex items-baseline gap-3">
                  {state}
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-sm text-muted-foreground">{cities.length}</span>
                </h2>
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {cities
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/${c.slug}/`}
                          className="group flex items-center justify-between gap-3 rounded-lg border border-transparent hover:border-border hover:bg-card px-4 py-3 transition-colors"
                        >
                          <span>
                            <span className="font-medium">{c.name}</span>
                            {c.distanceKm !== undefined && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                · {c.distanceKm} km
                              </span>
                            )}
                          </span>
                          <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
