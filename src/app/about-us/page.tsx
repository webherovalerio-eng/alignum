import Image from "next/image";
import { Reveal, MaskWords } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { CTA } from "@/components/sections/CTA";
import { Philosophy } from "@/components/sections/Philosophy";
import { Reviews } from "@/components/sections/Reviews";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/data/site";

export const metadata = buildMetadata({
  title: "Über uns – Schreinerei Alignum aus Mannheim",
  description:
    "Wir sind Alignum: eine Schreinerei aus dem Rhein-Neckar-Raum mit über 30 Jahren Handwerk, einer eigenen Werkstatt und einer Leidenschaft für Massivholz. Lernen Sie Jan kennen.",
  path: "/about-us/",
});

export default function AboutPage() {
  return (
    <>
      <section className="relative pt-40 pb-20 grain-overlay">
        {/* Headline volle Breite, Intro DARUNTER (rechtsbündig auf Desktop) —
            verhindert die Überlappung der breiten „Leidenschaft."-Zeile mit
            dem Intro-Absatz. */}
        <div className="container-prose">
          <Reveal>
            <Badge variant="outline" className="mb-6">
              <span className="size-1.5 rounded-full bg-primary" />
              Über Alignum
            </Badge>
            <h1 className="font-display text-[clamp(2.75rem,7vw,7rem)] leading-[0.95] tracking-tight">
              <MaskWords text="Wir sind Schreiner" />
              <br />
              <span className="italic text-primary inline-block">aus Leidenschaft.</span>
            </h1>
          </Reveal>
          <Reveal className="mt-10 lg:ml-auto lg:max-w-md">
            <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground">
              Seit {new Date().getFullYear() - SITE.founded}+ Jahren bauen wir
              Möbel, die Generationen halten sollen. Tradition trifft moderne
              Technik – immer mit der Hand am Holz.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Jan — Der Schreiner hinter Alignum */}
      <section className="relative py-20 sm:py-28">
        <div className="container-prose grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <Reveal className="lg:col-span-6">
            <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-elev)]">
              <Image
                src={SITE.owner.image}
                alt={`${SITE.owner.name} – ${SITE.owner.role} bei Alignum`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent">
                <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">
                  Der Schreiner hinter Alignum
                </p>
                <p className="font-display text-3xl sm:text-4xl text-background">
                  {SITE.owner.name}
                </p>
                <p className="text-sm text-background/80 mt-1">{SITE.owner.role}</p>
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-6 space-y-6">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
              Wer wir sind
            </p>
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.1] tracking-tight">
              Eine Werkstatt am Rhein.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Alignum entstand aus dem Wunsch, etwas zu bauen, das nicht
              weggeworfen wird. Heute ist Alignum ein Meisterbetrieb mit eigener
              Werkstatt im Rhein-Neckar-Raum – ausgestattet mit traditionellen
              Werkzeugen und gewachsenem Handwerk.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Wir bauen, was Sie nicht im Möbelhaus finden. Tische, die zu
              groß sind. Treppen, die schweben. Türen, die nichts verraten und
              alles versprechen. Schränke, die in Nischen verschwinden. Und
              gelegentlich auch Möbelobjekte, die wir signieren wie Bilder.
            </p>

            <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 grain-overlay">
              <p className="text-lg sm:text-xl font-display leading-snug text-foreground">
                „{SITE.brandStatement}"
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                – {SITE.owner.name}, {SITE.owner.role}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { label: "Jahre Erfahrung", value: `${new Date().getFullYear() - SITE.founded}+` },
                { label: "Gefertigte Möbel", value: "1.500+" },
                { label: "Hölzer im Lager", value: "12" },
                { label: "Werkstatt", value: "Eigene" },
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
      </section>

      <Philosophy />

      <Reviews />
      <CTA
        heading="Werkstatt­besuch?"
        body="Kommen Sie vorbei. Riechen Sie das Holz, hören Sie die Hobel, fühlen Sie die Maserung. Termine nach Vereinbarung."
      />
    </>
  );
}
