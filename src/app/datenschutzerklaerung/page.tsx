import { Reveal, MaskWords } from "@/components/ui/Reveal";
import { CookieSettingsLink } from "@/components/consent/CookieSettingsLink";
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
              {SITE.name} Möbelbau, Inhaber {SITE.owner.fullName}<br />
              {SITE.address.street}, {SITE.address.zip} {SITE.address.city}<br />
              E-Mail: {SITE.email}
            </p>

            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">2. Erhebung allgemeiner Daten</h2>
            <p>
              Beim Aufrufen unserer Website werden durch den auf Ihrem Endgerät zum Einsatz
              kommenden Browser automatisch Informationen an den Server unserer Website gesendet.
              Diese Informationen werden temporär in einem sogenannten Logfile gespeichert:
              IP-Adresse, Datum/Uhrzeit, Inhalt der Anforderung, HTTP-Statuscode, jeweils
              übertragene Datenmenge, Browser und Betriebssystem. Rechtsgrundlage ist Art. 6
              Abs. 1 lit. f DSGVO (berechtigtes Interesse am stabilen, sicheren Betrieb der
              Website).
            </p>

            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">3. Kontaktformular &amp; Bewertungs-Flow</h2>
            <p>
              Bei Nutzung des Anfrage-Formulars unter <code>/anfrage/</code> oder des
              Bewertungs-Flows unter <code>/bewertung/</code> werden Ihre Angaben (Name,
              E-Mail, Telefon, Ort, Projekt­beschreibung) per E-Mail an uns übermittelt. Diese
              Daten geben wir nicht an Dritte weiter und nutzen sie ausschließlich zur Bearbeitung
              Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung).
            </p>

            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">4. Cookies</h2>
            <p>
              Diese Website setzt nur technisch notwendige Cookies sowie – bei aktiver
              Einwilligung – analytische Cookies (siehe Abschnitt 5) ein. Notwendige Cookies
              speichern z. B. Ihre Cookie-Banner-Entscheidung im{" "}
              <code>LocalStorage</code> Ihres Browsers. Sie können diese Daten jederzeit über
              die Browser-Einstellungen löschen.
            </p>

            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">
              5. Google Analytics 4
            </h2>
            <p>
              Diese Website nutzt – <strong className="text-foreground">nur nach Ihrer
              ausdrücklichen Einwilligung</strong> – Google Analytics 4, einen Webanalyse­dienst
              der Google Ireland Ltd. (Gordon House, Barrow Street, Dublin 4, Irland;
              „Google"). Mess-ID: <code>G-K7T15QH6EP</code>.
            </p>
            <p>
              <strong className="text-foreground">Was wird erfasst:</strong> anonymisierte
              Nutzungsdaten wie aufgerufene Seiten, Verweildauer, ungefährer Standort
              (Land/Region), Gerätetyp und Browser. Ihre IP-Adresse wird durch Aktivierung
              der „IP-Anonymisierung" (Parameter <code>anonymize_ip=true</code>) vor jeder
              Verarbeitung gekürzt — eine personenbezogene Identifikation ist damit
              ausgeschlossen.
            </p>
            <p>
              <strong className="text-foreground">Wohin werden Daten übermittelt:</strong> Server
              von Google in Irland und in den USA. Für die USA-Übermittlung greifen die
              EU-Standardvertragsklauseln (SCCs) sowie das EU-US Data Privacy Framework.
            </p>
            <p>
              <strong className="text-foreground">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a
              DSGVO (Einwilligung). Speicherdauer maximal 14 Monate.
            </p>
            <p>
              <strong className="text-foreground">Widerrufsrecht:</strong> Sie können Ihre
              Einwilligung jederzeit widerrufen — über die Schaltfläche:
            </p>
            <p>
              <CookieSettingsLink
                className="inline-flex items-center px-5 py-3 rounded-full border border-border bg-card hover:border-primary hover:text-primary transition-colors text-sm font-medium"
                label="🍪 Cookie-Einstellungen öffnen"
              />
            </p>
            <p>
              Weitere Informationen finden Sie in der{" "}
              <a
                className="text-primary underline-grain"
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Datenschutzerklärung von Google
              </a>
              .
            </p>

            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">
              6. Rechte der betroffenen Personen
            </h2>
            <p>
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der
              Verarbeitung, Datenübertragbarkeit, Widerruf erteilter Einwilligungen und
              Beschwerde bei einer Aufsichtsbehörde. Die zuständige Behörde finden Sie unter{" "}
              <a className="text-primary underline-grain" href="https://www.bfdi.bund.de">
                bfdi.bund.de
              </a>
              .
            </p>

            <h2 className="font-display text-2xl mt-8 mb-2 text-foreground">7. Hosting</h2>
            <p>
              Diese Website wird auf Servern von Vercel Inc. (Standort EU/USA, mit SCCs)
              gehostet. Vercel verarbeitet als Auftrags­verarbeiter Logdaten zur Bereitstellung
              der Website.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
