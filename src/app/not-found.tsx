import Link from "next/link";
import { Reveal, MaskWords } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center grain-overlay py-32">
      <div className="container-tight text-center">
        <Reveal>
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-6">
            404 · Verschwunden im Holzlager
          </p>
          <h1 className="font-display text-[clamp(3rem,9vw,9rem)] leading-[0.92] tracking-tight">
            <MaskWords text="Diese Seite" />
            <br />
            <span className="italic text-gradient-gold">
              <MaskWords text="haben wir nicht gebaut." />
            </span>
          </h1>
          <p className="mt-10 text-lg text-muted-foreground max-w-md mx-auto">
            Vielleicht ist sie umgezogen, oder sie war nie da. Versuchen Sie
            unsere Startseite – oder beginnen Sie einfach Ihr eigenes Projekt.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href="/" variant="outline">Zur Startseite</LinkButton>
            <Link href="/anfrage/" className="text-primary underline-grain">
              Anfrage starten →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
