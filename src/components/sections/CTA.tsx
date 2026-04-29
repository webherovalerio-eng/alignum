import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";

export function CTA({
  heading = "Bereit, Ihr Projekt zu beginnen?",
  body = "Skizzieren wir gemeinsam, was Ihnen vorschwebt. Erstgespräch unverbindlich – telefonisch, online oder bei einem Espresso in der Werkstatt.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-tight">
        <Reveal className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-background p-10 sm:p-16 text-center grain-overlay">
          <div
            aria-hidden
            className="absolute -top-40 -right-20 size-96 rounded-full bg-primary/30 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-40 -left-20 size-96 rounded-full bg-primary/15 blur-3xl"
          />
          <div className="relative">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] tracking-tight max-w-2xl mx-auto">
              {heading}
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
              {body}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <LinkButton href="/anfrage/" size="lg" variant="primary">
                Anfrage starten <ArrowRight className="size-4" />
              </LinkButton>
              <LinkButton href="/kontakt/" size="lg" variant="outline">
                Werkstatt besuchen
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
