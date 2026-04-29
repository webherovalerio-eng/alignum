import { Reveal, MaskWords } from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/data/site";

export const metadata = buildMetadata({
  title: "Impressum",
  description: "Anbieterkennzeichnung gemäß § 5 TMG der Schreinerei Alignum.",
  path: "/impressum/",
  noindex: false,
});

export default function ImpressumPage() {
  return (
    <section className="relative pt-40 pb-24">
      <div className="container-tight">
        <Reveal>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-tight mb-12">
            <MaskWords text="Impressum" />
          </h1>
          <div className="prose-invert space-y-6 text-foreground/85 leading-relaxed">
            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">Angaben gemäß § 5 TMG</h2>
            <p>
              {SITE.name} Schreinerei<br />
              Inhaber: Wolf Preussner<br />
              {SITE.address.street}<br />
              {SITE.address.zip} {SITE.address.city}<br />
              Deutschland
            </p>

            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">Kontakt</h2>
            <p>
              Telefon: {SITE.phoneDisplay}<br />
              E-Mail: {SITE.email}
            </p>

            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">Berufsbezeichnung</h2>
            <p>
              Tischlermeister · Verliehen durch die Handwerkskammer Mannheim Rhein-Neckar-Odenwald<br />
              Tätig in Deutschland
            </p>

            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>Wolf Preussner, Anschrift wie oben.</p>

            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a className="text-primary underline-grain" href="https://ec.europa.eu/consumers/odr">
                https://ec.europa.eu/consumers/odr
              </a>
              .
            </p>

            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">Verbraucherstreitbeilegung</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungs­verfahren vor einer
              Verbraucher­schlichtungsstelle teilzunehmen.
            </p>

            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
