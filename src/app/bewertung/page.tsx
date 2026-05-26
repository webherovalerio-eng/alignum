import { BewertungFlow } from "@/components/bewertung/BewertungFlow";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Bewertung abgeben – Alignum",
  description:
    "Teilen Sie Ihre Erfahrung mit Alignum. Ihre Meinung hilft uns, besser zu werden – und anderen, uns zu finden.",
  path: "/bewertung/",
  noindex: true, // private flow, kein Indexing nötig
});

export default function BewertungPage() {
  return (
    <>
      <section className="relative pt-32 sm:pt-40 pb-12 grain-overlay">
        <div className="container-tight text-center">
          <Reveal>
            <Badge variant="outline" className="mb-6 mx-auto">
              <span className="size-1.5 rounded-full bg-primary" />
              Bewertung abgeben
            </Badge>
            <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-tight">
              Wie war Ihre <span className="italic text-primary">Erfahrung</span> mit uns?
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
              Ein kurzer, anonymer Flow in vier Schritten. Bei 5 ⭐ helfen wir
              Ihnen mit einem Vorschlag fürs Posten bei Google – bei
              weniger Sternen bekommen wir Ihr Feedback intern, nicht
              öffentlich.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative pb-32">
        <div className="container-tight">
          <BewertungFlow />
        </div>
      </section>
    </>
  );
}
