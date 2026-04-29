import { Reveal, MaskWords } from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/data/site";

export const metadata = buildMetadata({
  title: "Datenschutzerklärung",
  description: "Informationen zum Schutz Ihrer personenbezogenen Daten gemäß DSGVO.",
  path: "/datenschutzerklaerung/",
});

export default function DatenschutzPage() {
  return (
    <section className="relative pt-40 pb-24">
      <div className="container-tight">
        <Reveal>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-tight mb-12">
            <MaskWords text="Datenschutz" />
          </h1>
          <div className="space-y-6 text-foreground/85 leading-relaxed">
            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">1. Verantwortlicher</h2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br />
              {SITE.name} Schreinerei, Inhaber Wolf Preussner<br />
              {SITE.address.street}, {SITE.address.zip} {SITE.address.city}<br />
              E-Mail: {SITE.email}
            </p>

            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">2. Erhebung allgemeiner Daten</h2>
            <p>
              Beim Aufrufen unserer Website werden durch den auf Ihrem Endgerät zum Einsatz
              kommenden Browser automatisch Informationen an den Server unserer Website gesendet.
              Diese Informationen werden temporär in einem sog. Logfile gespeichert: IP-Adresse,
              Datum/Uhrzeit, Inhalt der Anforderung, HTTP-Statuscode, jeweils übertragene
              Datenmenge, Browser, Betriebssystem.
            </p>

            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">3. Kontaktformular</h2>
            <p>
              Bei Nutzung des Kontakt- oder Multistep-Formulars werden Ihre Angaben zwecks
              Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
              Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>

            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">4. Cookies</h2>
            <p>
              Diese Website setzt nur technisch notwendige Cookies ein. Externe Tracker oder
              Werbedienste werden nicht eingebunden.
            </p>

            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">5. Rechte der betroffenen Personen</h2>
            <p>
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der
              Verarbeitung, Datenübertragbarkeit, Widerruf erteilter Einwilligungen und Beschwerde
              bei einer Aufsichtsbehörde. Die zuständige Behörde finden Sie unter{" "}
              <a className="text-primary underline-grain" href="https://www.bfdi.bund.de">
                bfdi.bund.de
              </a>
              .
            </p>

            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">6. Hosting</h2>
            <p>
              Diese Website wird auf Servern von Vercel Inc. gehostet. Vercel verarbeitet als
              Auftrags­verarbeiter Logdaten zur Bereitstellung der Website.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
