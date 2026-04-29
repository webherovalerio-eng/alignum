import { ArrowRight } from "lucide-react";
import { Reveal, MaskWords } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Unser Versprechen – Schreinerei Alignum",
  description:
    "Qualität macht uns Spaß und unsere Kunden glücklich. Wir garantieren unsere Arbeit über die Gewährleistungszeit hinaus. Wir bauen Möbel für Generationen.",
  path: "/garantie/",
});

export default function GarantiePage() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center pt-32 pb-24 overflow-hidden grain-overlay">
      {/* Decorative giant headline behind */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[28%] select-none text-center font-display leading-[0.85] tracking-tighter text-foreground/[0.04] text-[clamp(8rem,22vw,22rem)]"
      >
        Versprechen
      </div>

      {/* Subtle gold accent line top-center */}
      <div
        aria-hidden
        className="absolute top-32 left-1/2 -translate-x-1/2 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent"
      />

      <div className="relative container-tight">
        <Reveal className="text-center max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-8 mx-auto">
            <span className="size-1.5 rounded-full bg-primary" />
            Unsere Garantie
          </Badge>

          <h1 className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.92] tracking-tight">
            <MaskWords text="Unser" />{" "}
            <span className="italic text-primary inline-block">Versprechen.</span>
          </h1>

          <p className="mt-10 font-display text-2xl sm:text-3xl leading-snug text-foreground/95 italic">
            Qualität macht uns Spaß und unsere Kunden glücklich.
          </p>
        </Reveal>

        <div className="mt-16 max-w-2xl mx-auto space-y-8 text-lg sm:text-xl leading-relaxed text-foreground/85">
          <Reveal>
            <p>
              Bei der Herstellung von Einzelstücken achten wir viel auf{" "}
              <span className="text-foreground">Details</span> und die{" "}
              <span className="text-foreground">Hochwertigkeit der Materialien</span>,
              wodurch wir eine sehr große Langlebigkeit unserer Arbeiten erreichen.
            </p>
          </Reveal>

          <Reveal>
            <p>
              Daher garantieren wir Ihnen dies auch, und beschränken uns{" "}
              <strong className="text-primary not-italic font-medium">nicht</strong>{" "}
              auf die Gewährleistungszeit. Wenn etwas nicht so sein sollte, wie
              man es zu erwarten hat, kümmern wir uns auch nach Jahren der
              Benutzung gerne darum. Im besten Fall können auch wir daraus
              lernen.
            </p>
          </Reveal>
        </div>

        {/* Pull-quote — "Wir bauen Möbel für Generationen" */}
        <Reveal className="mt-20 sm:mt-24">
          <div className="relative max-w-2xl mx-auto text-center">
            {/* Top + bottom thin gold lines */}
            <span
              aria-hidden
              className="block h-px w-16 bg-primary mx-auto mb-8"
            />
            <p className="font-display text-3xl sm:text-5xl leading-[1.05] tracking-tight">
              Wir bauen Möbel für{" "}
              <span className="italic text-primary">Generationen.</span>
            </p>
            <span
              aria-hidden
              className="block h-px w-16 bg-primary mx-auto mt-8"
            />
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal className="mt-16 flex justify-center">
          <LinkButton href="/anfrage/" size="xl" variant="primary">
            Termin vereinbaren <ArrowRight className="size-5" />
          </LinkButton>
        </Reveal>
      </div>
    </section>
  );
}
