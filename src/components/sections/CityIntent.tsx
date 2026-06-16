import { Reveal } from "@/components/ui/Reveal";
import { Quote } from "lucide-react";
import { type City } from "@/data/cities";
import {
  buildCityIntro,
  buildCityWhyUs,
  buildCityArea,
  buildCityProjectsCopy,
} from "@/lib/cityContent";

/**
 * Sucht­intention für „Schreinerei {Stadt}" sofort befriedigen — innerhalb der
 * ersten 30 % der Seite.
 *
 * Heading-Hierarchie:
 * - <h2>Schreinerei {Stadt}</h2> — Keyword nochmal in H2 (oben)
 * - Pull-Quote-Lead aus Spintax-Projekt-Copy
 * - Body in zwei Spalten (kein Wall-of-Text mehr)
 */
export function CityIntent({ city }: { city: City }) {
  const projectsCopy = buildCityProjectsCopy(city);
  const intro = buildCityIntro(city);
  const whyUs = buildCityWhyUs(city);
  const area = buildCityArea(city);

  return (
    <section className="relative py-20 sm:py-28">
      <div className="container-prose">
        {/* SEO-Keyword: kleines, unauffälliges H2 (kein Display-Font) —
            „Tischler" laut Search-Console stark nachgefragt + bisher ungenutzt. */}
        <Reveal className="max-w-3xl mb-3">
          <h2 className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
            Schreinerei &amp; Tischler {city.name}
          </h2>
        </Reveal>

        {/* Visueller Blickfang: große Display-Zeile als „fake H2" (<p>) */}
        <Reveal className="max-w-3xl mb-10">
          <p className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.05] tracking-tight">
            Für Sie in{" "}
            <span className="text-primary italic">{city.name}</span>
          </p>
        </Reveal>

        {/* Pull-Quote-Lead */}
        <Reveal className="max-w-3xl mb-16 border-l-2 border-primary pl-6 sm:pl-8">
          <Quote className="size-5 text-primary mb-3" />
          <p className="font-display text-xl sm:text-2xl leading-snug text-foreground/95">
            {projectsCopy}
          </p>
        </Reveal>

        {/* Body in zwei Spalten — bricht den Wall-of-Text auf */}
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 max-w-5xl">
          <Reveal>
            <p className="text-base sm:text-lg text-foreground/85 leading-relaxed">
              {intro}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-base sm:text-lg text-foreground/85 leading-relaxed">
              {whyUs}
            </p>
          </Reveal>
          <Reveal delay={0.15} className="md:col-span-2">
            <p className="text-base sm:text-lg text-foreground/85 leading-relaxed max-w-3xl">
              {area}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
