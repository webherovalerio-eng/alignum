import { Reveal, MaskWords } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Coming soon",
  description: "Hier entsteht Neues aus der Werkstatt von Alignum.",
  path: "/coming-soon/",
  noindex: true,
});

export default function ComingSoonPage() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center grain-overlay py-32">
      <div className="container-tight text-center">
        <Reveal>
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-6">
            Aus der Werkstatt
          </p>
          <h1 className="font-display text-[clamp(3rem,9vw,9rem)] leading-[0.92] tracking-tight">
            <MaskWords text="Hier entsteht" />
            <br />
            <span className="italic text-primary inline-block">etwas Schönes.</span>
          </h1>
          <p className="mt-10 text-lg text-muted-foreground max-w-md mx-auto">
            Wir schleifen, ölen, montieren. Schauen Sie bald wieder vorbei – oder
            beginnen Sie schon jetzt Ihr eigenes Projekt.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href="/" variant="outline">Zur Startseite</LinkButton>
            <LinkButton href="/anfrage/" variant="primary">Anfrage starten</LinkButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
