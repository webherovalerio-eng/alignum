import Image from "next/image";
import { Reveal, MaskWords } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { CTA } from "@/components/sections/CTA";
import { Reviews } from "@/components/sections/Reviews";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/data/site";
import { ABOUT_PHOTOS } from "@/data/photos";

export const metadata = buildMetadata({
  title: "Über uns – Schreinerei Alignum aus Mannheim",
  description:
    "Wir sind Alignum: eine Schreinerei aus Mannheim mit über 30 Jahren Handwerk, einer eigenen Werkstatt und einer Leidenschaft für Massivholz. Lernen Sie das Team kennen.",
  path: "/about-us/",
});

export default function AboutPage() {
  const portrait = ABOUT_PHOTOS.find((p) => /wolf|werkstatt|innen/i.test(p)) ?? ABOUT_PHOTOS[0];
  const teamPics = ABOUT_PHOTOS.filter((p) =>
    /wolf|ute|christian|mathew|christoph|kathi|daniel|palanivel|ronja|uwe/i.test(p),
  ).slice(0, 8);

  return (
    <>
      <section className="relative pt-40 pb-20 grain-overlay">
        <div className="container-prose grid lg:grid-cols-12 gap-10 items-end">
          <Reveal className="lg:col-span-7">
            <Badge variant="outline" className="mb-6">
              <span className="size-1.5 rounded-full bg-primary" />
              Über Alignum
            </Badge>
            <h1 className="font-display text-[clamp(2.75rem,7vw,7rem)] leading-[0.95] tracking-tight">
              <MaskWords text="Wir sind Schreiner." />
              <br />
              <span className="italic text-primary inline-block">Aus Leidenschaft.</span>
            </h1>
          </Reveal>
          <Reveal className="lg:col-span-5">
            <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground max-w-md">
              Seit {new Date().getFullYear() - SITE.founded}+ Jahren bauen wir
              Möbel, die Generationen halten sollen. Tradition trifft moderne
              Technik – immer mit der Hand am Holz.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-prose">
        <Reveal>
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-elev)]">
            <Image
              src={portrait}
              alt="Alignum Werkstatt"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section className="relative py-24">
        <div className="container-prose grid lg:grid-cols-12 gap-10 lg:gap-20">
          <Reveal className="lg:col-span-6 space-y-6">
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.1] tracking-tight">
              Eine Werkstatt am Rhein.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Alignum entstand {SITE.founded} aus dem Wunsch, etwas zu bauen,
              das nicht weggeworfen wird. Was als Ein-Mann-Schreinerei am Neckar
              begann, ist heute ein Meisterbetrieb mit eigener Werkstatt
              zwischen Mannheim und Heidelberg, ausgestattet mit traditionellen
              Werkzeugen und einer 5-Achs-CNC-Fräse, die selbst die
              komplexesten Verbindungen perfekt schneidet.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Wir bauen, was Sie nicht im Möbelhaus finden. Tische, die zu
              groß sind. Treppen, die schweben. Türen, die nichts verraten und
              alles versprechen. Schränke, die in Nischen verschwinden. Und
              gelegentlich auch Möbelobjekte, die wir signieren wie Bilder.
            </p>
          </Reveal>

          <div className="lg:col-span-6 space-y-6">
            <Reveal>
              <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 grain-overlay">
                <p className="text-xl sm:text-2xl font-display leading-snug text-foreground">
                  „{SITE.brandStatement}"
                </p>
                <p className="mt-6 text-sm text-muted-foreground">
                  – Wolf Preussner, Tischlermeister & Inhaber
                </p>
              </div>
            </Reveal>
            <Reveal>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Jahre Erfahrung", value: `${new Date().getFullYear() - SITE.founded}+` },
                  { label: "Gefertigte Möbel", value: "1.500+" },
                  { label: "Hölzer im Lager", value: "12" },
                  { label: "Garantie", value: "5 Jahre" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-background p-5">
                    <p className="font-display text-3xl text-primary">{s.value}</p>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative py-24 border-t border-border">
        <div className="container-prose">
          <Reveal className="mb-12 max-w-2xl">
            <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">Das Team</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] tracking-tight">
              Menschen, die an jedem Möbelstück mitbauen.
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SITE.team.slice(0, 4).map((p, i) => (
              <Reveal key={p.name} delay={i * 0.05}>
                <div className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-card">
                  {teamPics[i] && (
                    <Image
                      src={teamPics[i]}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-background">
                    <p className="font-display text-xl">{p.name}</p>
                    <p className="text-sm text-background/75">{p.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Reviews />
      <CTA
        heading="Werkstatt­besuch?"
        body="Kommen Sie vorbei. Riechen Sie das Holz, hören Sie die Hobel, fühlen Sie die Maserung. Termine nach Vereinbarung."
      />
    </>
  );
}
