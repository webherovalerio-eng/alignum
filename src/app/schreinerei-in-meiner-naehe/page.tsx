import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { CTA } from "@/components/sections/CTA";
import { Reviews } from "@/components/sections/Reviews";
import { buildMetadata } from "@/lib/seo";
import { Reveal, MaskWords } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";

export const metadata = buildMetadata({
  title: "Leistungen – Schreinerei Mannheim mit zwölf Disziplinen",
  description:
    "Alle Leistungen von Alignum auf einen Blick: Küchenbau, Badmöbel, Tische, Schränke, Massivholzbetten, Treppen, Türen, Shoji, Regale, Büromöbel, Kommoden und Designermöbel. Schreinerei aus Mannheim.",
  path: "/schreinerei-in-meiner-naehe/",
});

export default function ServiceHubPage() {
  return (
    <>
      <section className="relative pt-40 pb-20 grain-overlay">
        <div className="container-prose">
          <Reveal>
            <Badge variant="outline" className="mb-6">
              <span className="size-1.5 rounded-full bg-primary" />
              Leistungen
            </Badge>
            <h1 className="font-display text-[clamp(2.75rem,7vw,7rem)] leading-[0.95] tracking-tight max-w-[14ch]">
              <MaskWords text="Schreinerei" />{" "}
              <span className="italic text-gradient-gold">
                <MaskWords text="in meiner Nähe." />
              </span>
            </h1>
            <p className="mt-8 max-w-[58ch] text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Zwölf Disziplinen – eine Werkstatt. Wir fertigen Möbel,
              Bauelemente und Raumkonzepte für Privatkunden, Architekten und
              Gewerbe rund um Mannheim. Jedes Projekt beginnt mit einem
              Gespräch, jeder Schnitt mit einem Plan.
            </p>
          </Reveal>
        </div>
      </section>

      <ServicesGrid heading={false} />
      <Reviews />
      <CTA />
    </>
  );
}
