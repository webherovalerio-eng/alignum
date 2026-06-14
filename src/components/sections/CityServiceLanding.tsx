import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Check, MapPin, ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal, MaskWords } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { type City } from "@/data/cities";
import { type CityService, CITY_SERVICES, cityServicePath } from "@/data/cityServices";
import { SERVICES, SERVICE_HUB } from "@/data/services";
import { SERVICE_FAQS } from "@/data/faqs";
import { PHOTOS } from "@/data/photos";
import { REVIEW_SUMMARY } from "@/data/reviews";
import { SITE } from "@/data/site";
import { buildCityServiceCopy } from "@/lib/cityServiceContent";

/**
 * Service×Stadt-Landingpage, z.B. „Schreinerküche Mannheim".
 * Gerendert unter /{citySlug}/{comboSlug}/ über die gemergte [slug]-Route.
 */
export function CityServiceLanding({ city, combo }: { city: City; combo: CityService }) {
  const service = SERVICES.find((s) => s.slug === combo.serviceSlug);
  const photos = PHOTOS[combo.imageCategory] ?? [];
  const cover = combo.imageCategory ? photos[0] : undefined;
  const gallery = photos.slice(1, 5);
  const copy = buildCityServiceCopy(city, combo);
  const lead = combo.lead.replace(/\{city\}/g, city.name);

  const serviceFaqs = (SERVICE_FAQS[combo.serviceSlug] ?? []).map((f) => ({
    q: f.q,
    a: f.a.replace(/Mannheim/g, city.name),
  }));

  // Andere Leistungen für dieselbe Stadt (Querverlinkung)
  const otherServices = CITY_SERVICES.filter((c) => c.slug !== combo.slug);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${combo.h1} ${city.name}`,
    serviceType: combo.h1,
    description: lead,
    areaServed: { "@type": "City", name: city.name },
    provider: {
      "@type": "LocalBusiness",
      name: "Alignum Möbelbau",
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.street,
        postalCode: SITE.address.zip,
        addressLocality: SITE.address.city,
        addressCountry: "DE",
      },
    },
    url: `${SITE.url}${cityServicePath(city.slug, combo.slug)}`,
  };

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[78svh] w-full overflow-hidden grain-overlay">
        <div className="absolute inset-0 -z-10">
          {cover && <Image src={cover} alt="" fill priority sizes="100vw" className="object-cover" />}
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 scrim-readable" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 scrim-bottom" />

        <div className="relative z-10 container-prose pt-36 pb-16 min-h-[78svh] flex flex-col justify-end text-white">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 text-sm text-white/80 flex flex-wrap items-center gap-1.5"
          >
            <Link href="/" className="hover:text-primary">Start</Link>
            <ChevronRight className="size-3.5" />
            <Link href={`/${city.slug}/`} className="hover:text-primary">Schreinerei {city.name}</Link>
            <ChevronRight className="size-3.5" />
            <span className="text-white">{combo.h1}</span>
          </nav>

          <Badge variant="outline" className="self-start mb-5 border-white/30 bg-black/30 text-white backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-primary" />
            Werkstatt in {SITE.address.city} · für {city.name}
          </Badge>

          <h1 className="font-display text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.95] tracking-tight max-w-[18ch] text-shadow-hero">
            <MaskWords text={`${combo.h1} ${city.name}`} />
          </h1>

          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-white/90 leading-relaxed text-shadow-lg">
            {lead}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <LinkButton href={`/anfrage/?service=${combo.serviceSlug}&city=${city.slug}`} size="lg" variant="primary">
              {combo.h1} in {city.name} anfragen <ArrowRight className="size-4" />
            </LinkButton>
            <div className="flex items-center gap-2 text-sm text-white/85 text-shadow-lg">
              <Stars rating={5} />
              <span>
                <strong className="font-medium text-white">{REVIEW_SUMMARY.averageRating.toFixed(1)}</strong> /{" "}
                {REVIEW_SUMMARY.count}+ Google-Bewertungen
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="relative py-16 sm:py-24">
        <div className="container-prose grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7 space-y-6">
            {copy.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p
                  className={
                    i === 0
                      ? "text-xl sm:text-2xl font-display leading-snug text-foreground"
                      : "text-base sm:text-lg leading-relaxed text-foreground/85"
                  }
                >
                  {p}
                </p>
              </Reveal>
            ))}
            {service && (
              <Reveal delay={0.1}>
                <p className="text-base sm:text-lg leading-relaxed text-foreground/85">
                  {service.description.replace(/in Mannheim/g, `für ${city.name}`).replace(/Mannheim/g, city.name)}
                </p>
              </Reveal>
            )}
          </div>

          {/* Features */}
          {service && service.features.length > 0 && (
            <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium mb-4">
                  {combo.h1} für {city.name} – das bauen wir
                </p>
                <ul className="space-y-3">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3" />
                      </span>
                      <span className="text-foreground/90 text-sm sm:text-base">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-5 mt-5 border-t border-border">
                  <LinkButton href={`/${SERVICE_HUB}/${combo.serviceSlug}/`} variant="outline" size="md" className="w-full">
                    Mehr zu {service.name}
                  </LinkButton>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* GALLERY */}
      {gallery.length > 0 && (
        <section className="relative pb-16">
          <div className="container-prose">
            <Reveal className="mb-8">
              <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.1] tracking-tight">
                {combo.h1} – Beispiele aus unserer Werkstatt
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {gallery.map((src, i) => (
                <Reveal key={src} delay={(i % 4) * 0.05} className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border bg-card">
                  <Image src={src} alt={`${combo.h1} ${city.name} – Beispiel ${i + 1}`} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {serviceFaqs.length > 0 && (
        <FAQ items={serviceFaqs} title={`${combo.h1} ${city.name} – häufige Fragen`} />
      )}

      {/* CROSS-LINKS: weitere Leistungen für diese Stadt + City-Page */}
      <section className="relative py-16 border-t border-border bg-muted/30 grain-overlay">
        <div className="container-prose">
          <Reveal className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium mb-4">
              Weitere Leistungen für {city.name}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {otherServices.map((s) => (
                <Link
                  key={s.slug}
                  href={cityServicePath(city.slug, s.slug)}
                  className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground/85 hover:border-primary/50 hover:text-foreground transition-colors"
                >
                  {s.h1} {city.name}
                </Link>
              ))}
              <Link
                href={`/${city.slug}/`}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-card px-4 py-2 text-sm text-foreground hover:border-primary transition-colors"
              >
                <MapPin className="size-4 text-primary" /> Schreinerei {city.name}
                <ArrowUpRight className="size-4 text-primary" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CTA
        heading={`${combo.h1} für ${city.name} – sprechen Sie uns an`}
        body={`Wir kommen aus ${SITE.address.city} zu Ihnen nach ${city.name}, vermessen Ihren Raum und machen Ihnen nach dem Aufmaß ein verbindliches Angebot.`}
      />

      <JsonLd id={`ld-cityservice-${city.slug}-${combo.slug}`} data={ld} />
    </>
  );
}
