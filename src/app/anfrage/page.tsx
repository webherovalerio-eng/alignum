import { Suspense } from "react";
import { Reveal, MaskWords } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { AnfrageEntry } from "./_AnfrageEntry";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Anfrage starten – Schreinerei Alignum Mannheim",
  description:
    "Beschreiben Sie uns in vier Schritten Ihr Projekt – Küche, Treppe, Tür, Möbel oder Raumkonzept. Wir antworten innerhalb eines Werktags.",
  path: "/anfrage/",
});

export default function AnfragePage() {
  return (
    <>
      <section className="relative pt-40 pb-12 grain-overlay">
        <div className="container-tight">
          <Reveal>
            <Badge variant="outline" className="mb-6">
              <span className="size-1.5 rounded-full bg-primary" />
              Multistep-Anfrage · 4 Schritte
            </Badge>
            <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-tight">
              <MaskWords text="Lassen Sie uns" />
              <br />
              <span className="italic text-primary">
                <MaskWords text="zusammen bauen." />
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Vier kurze Schritte. Keine Werbe-E-Mails. Wir lesen jede Anfrage
              persönlich und antworten innerhalb eines Werktags.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative pb-32">
        <div className="container-tight">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-[var(--shadow-soft)]">
            <Suspense fallback={<div className="h-[480px]" />}>
              <AnfrageEntry />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
