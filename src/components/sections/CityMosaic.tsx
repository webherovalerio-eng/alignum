import Link from "next/link";
import { CITIES } from "@/data/cities";
import { Reveal } from "@/components/ui/Reveal";
import { MapPin } from "lucide-react";

export function CityMosaic({ exclude }: { exclude?: string }) {
  const cities = CITIES.filter((c) => c.slug !== exclude).slice(0, 36);
  return (
    <section className="relative py-24 sm:py-32 border-t border-border">
      <div className="container-prose">
        <Reveal className="max-w-3xl mb-12">
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">
            Standorte
          </p>
          <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-tight">
            Vor Ort, wo Sie wohnen.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Wir kommen zu Ihnen – ob Mannheim, Heidelberg, Ludwigshafen,
            Darmstadt oder weiter im Rhein-Neckar-Kreis.
          </p>
        </Reveal>

        <ul className="flex flex-wrap gap-2">
          {cities.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/${c.slug}/`}
                className="group inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-border bg-card hover:border-primary hover:text-primary transition-colors text-sm"
              >
                <MapPin className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Link href="/standorte/" className="text-sm text-primary underline-grain">
            Alle {CITIES.length} Standorte ansehen →
          </Link>
        </div>
      </div>
    </section>
  );
}
