import { Reveal } from "@/components/ui/Reveal";
import { Hammer, Compass, Trees, Heart } from "lucide-react";
import { type City } from "@/data/cities";
import { buildCityIntro, buildCityWhyUs, buildCityArea } from "@/lib/cityContent";

const PILLARS = [
  { Icon: Hammer, t: "Echtes Handwerk", b: "Tischlermeister-Betrieb mit eigener Werkstatt." },
  { Icon: Trees, t: "Heimisches Holz", b: "Eiche, Nuss, Esche, Kirsche – aus regionalen Wäldern." },
  { Icon: Compass, t: "Maß­anfertigung", b: "Jedes Stück passt millimetergenau in Ihren Raum." },
  { Icon: Heart, t: "Persönlich", b: "Wolf Preussner berät Sie persönlich vor Ort." },
];

/**
 * Search-Intent Sektion: erfüllt die Suchintention "Schreinerei in [Stadt]"
 * direkt in den ersten 30% der Seite. Erklärt sofort: WAS, WO, WARUM.
 */
export function CityIntent({ city }: { city: City }) {
  const intro = buildCityIntro(city);
  const whyUs = buildCityWhyUs(city);
  const area = buildCityArea(city);

  return (
    <section className="relative py-16 sm:py-24">
      <div className="container-prose grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <Reveal className="lg:col-span-7 space-y-6">
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.1] tracking-tight">
            Ihre Schreinerei in {city.name}
          </h2>
          <p className="text-lg text-foreground/85 leading-relaxed">{intro}</p>
          <p className="text-lg text-muted-foreground leading-relaxed">{whyUs}</p>
          <p className="text-lg text-muted-foreground leading-relaxed">{area}</p>
        </Reveal>

        <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <p className="text-xs uppercase tracking-widest text-primary font-medium mb-4">
              Was Sie in {city.name} bekommen
            </p>
            <ul className="space-y-4">
              {PILLARS.map((p) => (
                <li key={p.t} className="flex items-start gap-4">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <p.Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-medium">{p.t}</p>
                    <p className="text-sm text-muted-foreground">{p.b}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
