import { ShieldCheck, Hammer, Leaf, RefreshCw, ScrollText } from "lucide-react";
import { Reveal, MaskWords } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { CTA } from "@/components/sections/CTA";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "5 Jahre Garantie – Schreinerei Alignum Mannheim",
  description:
    "Alignum gibt Ihnen 5 Jahre volle Garantie auf alle Schreinerarbeiten – deutlich über der gesetzlichen Gewährleistung. Was wir versprechen, halten wir.",
  path: "/garantie/",
});

const PROMISES = [
  {
    Icon: ShieldCheck,
    title: "5 Jahre volle Garantie",
    body: "Auf alle handwerklichen Schreinerarbeiten – Material und Verarbeitung. Tritt ein Mangel auf, beseitigen wir ihn ohne Diskussion.",
  },
  {
    Icon: Hammer,
    title: "Kostenlose Nachjustage",
    body: "In den ersten 12 Monaten kommen wir bei Bedarf einmalig kostenlos zur Nachjustage von Türen, Schubladen und Beschlägen.",
  },
  {
    Icon: Leaf,
    title: "Holz wird begleitet",
    body: "Wir beraten Sie ein Möbelleben lang zur Pflege Ihres Holzes – Öle, Wachse, kleinere Schäden, Auffrischung.",
  },
  {
    Icon: RefreshCw,
    title: "Reparatur statt Neukauf",
    body: "Wir reparieren, was wir gebaut haben. Auch nach 20 Jahren. Ein Tisch von Alignum bekommt eine neue Platte – nicht eine neue Existenz.",
  },
];

export default function GarantiePage() {
  return (
    <>
      <section className="relative pt-40 pb-16 grain-overlay">
        <div className="container-prose">
          <Reveal>
            <Badge variant="outline" className="mb-6">
              <span className="size-1.5 rounded-full bg-primary" />
              Garantie & Service
            </Badge>
            <h1 className="font-display text-[clamp(2.75rem,7vw,7rem)] leading-[0.95] tracking-tight max-w-[14ch]">
              <MaskWords text="Fünf Jahre." />{" "}
              <span className="italic text-primary inline-block">Wort gehalten.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Wir geben Ihnen 5 Jahre Garantie auf jede Arbeit, die unsere
              Werkstatt verlässt – das ist deutlich mehr als die gesetzliche
              Gewährleistung von 2 Jahren. Warum? Weil wir wissen, was wir
              bauen.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative py-16">
        <div className="container-prose grid sm:grid-cols-2 gap-4">
          {PROMISES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="rounded-2xl border border-border bg-card p-8 h-full">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-5">
                  <p.Icon className="size-5" />
                </span>
                <h3 className="font-display text-2xl mb-3">{p.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative py-16">
        <div className="container-tight">
          <Reveal>
            <div className="rounded-3xl border border-border bg-card/40 p-8 sm:p-12 grain-overlay">
              <ScrollText className="size-6 text-primary mb-4" />
              <h2 className="font-display text-2xl sm:text-3xl mb-6">Garantiebedingungen im Klartext</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Was abgedeckt ist:</strong>{" "}
                  Material- und Verarbeitungsfehler, gebrochene Verbindungen,
                  fehlerhafte Beschläge, sich verziehende Massivholzplatten,
                  defekte Soft-Close-Mechaniken.
                </li>
                <li>
                  <strong className="text-foreground">Was nicht abgedeckt ist:</strong>{" "}
                  Schäden durch Umzug, Wasserschäden, mutwillige Beschädigung,
                  Veränderungen am Möbel durch Dritte.
                </li>
                <li>
                  <strong className="text-foreground">So geht's:</strong>{" "}
                  Schicken Sie uns ein Foto und eine kurze Beschreibung an{" "}
                  <span className="text-primary">info@alignum.de</span>. Wir
                  melden uns binnen 24 Stunden mit einem Termin.
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <CTA />
    </>
  );
}
