import Link from "next/link";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { PROJECTS, type Project } from "@/data/projects";
import { type City } from "@/data/cities";
import { cityOffset } from "@/lib/cityRotation";

/**
 * Ersetzt die frühere `ReferenceProjects`-Sektion auf den City-Pages.
 *
 * Warum: `ReferenceProjects` zeigte auf allen 89 City-Pages dieselben sechs
 * generischen Kategoriefotos — ohne einen einzigen Link. Gemessen lagen die
 * City-Pages dadurch bei 63–76 % Textgleichheit (Stadtname neutralisiert),
 * und die 29 Projekt-Detailseiten bekamen aus der City-Ebene null interne
 * Links (Stand GSC 2026-07-29: keine davon indexiert).
 *
 * Diese Sektion zeigt stattdessen ECHTE Projekte, verlinkt auf ihre Detail-
 * seite. Die Auswahl ist pro Stadt deterministisch verschoben: jede Stadt
 * zeigt einen anderen Ausschnitt, aber immer denselben — die Links bleiben
 * über Deploys hinweg stabil (kein Link-Rotieren), und die 29 Projektseiten
 * bekommen ihre eingehenden Links gleichmäßig über die City-Ebene verteilt.
 *
 * Projekte AUS der Stadt selbst werden ausgelassen — die stehen bereits in
 * `ProjectsByCity` weiter oben auf derselben Seite.
 */

const COUNT = 6;

export function RegionProjects({ city }: { city: City }) {
  const pool: Project[] = PROJECTS.filter((p) => p.city !== city.slug);
  if (pool.length === 0) return null;

  const start = cityOffset(city.slug, pool.length);
  const picked = Array.from(
    { length: Math.min(COUNT, pool.length) },
    (_, i) => pool[(start + i) % pool.length],
  );

  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-prose">
        <Reveal className="max-w-3xl mb-12">
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">
            Aus unserer Werkstatt
          </p>
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.1] tracking-tight">
            Gebaut für Kunden{" "}
            <span className="italic text-muted-foreground">in der Region.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Echte Aufträge aus dem Rhein-Neckar-Raum – fotografiert nach der
            Montage. Wenn Sie etwas Ähnliches für Ihr Zuhause in {city.name}{" "}
            suchen, zeigt Ihnen jedes Projekt, wie wir arbeiten.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {picked.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>

        <div className="mt-10">
          <Link href="/projekte/" className="text-sm text-primary underline-grain">
            Alle Referenzprojekte ansehen →
          </Link>
        </div>
      </div>
    </section>
  );
}
