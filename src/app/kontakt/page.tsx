import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import { Reveal, MaskWords } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Reviews } from "@/components/sections/Reviews";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/data/site";

export const metadata = buildMetadata({
  title: "Kontakt – Schreinerei Alignum Mannheim",
  description:
    "Telefon, E-Mail, Adresse und Öffnungszeiten der Schreinerei Alignum in Mannheim. Wir freuen uns auf Ihre Nachricht.",
  path: "/kontakt/",
});

export default function KontaktPage() {
  return (
    <>
      <section className="relative pt-40 pb-12 grain-overlay">
        <div className="container-prose">
          <Reveal>
            <Badge variant="outline" className="mb-6">
              <span className="size-1.5 rounded-full bg-primary" />
              Wir freuen uns auf Sie
            </Badge>
            <h1 className="font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] tracking-tight max-w-[16ch]">
              <MaskWords text="Sprechen wir." />
            </h1>
            <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Egal ob Sie eine konkrete Idee haben, eine Skizze auf der
              Serviette oder einfach nur einen Raum, der nicht funktioniert –
              schreiben Sie uns. Wir antworten innerhalb eines Werktags.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative py-12 sm:py-20">
        <div className="container-prose grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            {[
              {
                Icon: Phone,
                label: "Telefon",
                value: SITE.phoneDisplay,
                href: `tel:${SITE.phone.replace(/\s/g, "")}`,
              },
              {
                Icon: Mail,
                label: "E-Mail",
                value: SITE.email,
                href: `mailto:${SITE.email}`,
              },
              {
                Icon: MapPin,
                label: "Werkstatt",
                value: `${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}`,
                href: `https://maps.google.com/?q=${encodeURIComponent(`${SITE.address.street} ${SITE.address.zip} ${SITE.address.city}`)}`,
              },
            ].map(({ Icon, label, value, href }) => (
              <Reveal key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-5 rounded-2xl border border-border bg-card p-6 hover:border-primary transition-colors"
                >
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
                    <p className="text-lg font-medium">{value}</p>
                  </div>
                  <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal className="lg:col-span-5">
            <div className="sticky top-28 rounded-2xl border border-border bg-card p-8 grain-overlay">
              <Clock className="size-5 text-primary mb-4" />
              <h2 className="font-display text-2xl mb-4">Öffnungszeiten</h2>
              <ul className="space-y-2.5">
                {SITE.hours.map((h) => (
                  <li key={h.day} className="flex items-center justify-between gap-4 text-sm border-b border-border pb-2.5 last:border-none last:pb-0">
                    <span className="text-muted-foreground">{h.day}</span>
                    <span className="font-medium">{h.time}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-6">
                Werkstattbesuche bitte vorher telefonisch ankündigen.
              </p>
              <div className="mt-6">
                <LinkButton href="/anfrage/" variant="primary" className="w-full">
                  Multistep-Anfrage starten
                </LinkButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Reviews />
    </>
  );
}
