import { notFound } from "next/navigation";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { ServiceContent } from "@/components/sections/ServiceContent";
import { Materials } from "@/components/sections/Materials";
import { Process } from "@/components/sections/Process";
import { Reviews } from "@/components/sections/Reviews";
import { RelatedServices } from "@/components/sections/RelatedServices";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { SERVICES, SERVICE_HUB } from "@/data/services";
import { PHOTOS } from "@/data/photos";
import { GENERAL_FAQS, SERVICE_FAQS } from "@/data/faqs";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const s = SERVICES.find((x) => x.slug === params.slug);
  if (!s) return {};
  const photoCat = s.imageCategory;
  const cover = PHOTOS[photoCat]?.[0];
  return buildMetadata({
    title: `${s.name} aus Mannheim – ${s.short}`,
    description: `${s.intro} Ihr ${s.name}-Spezialist von Alignum aus Mannheim – Massivholz, Maßanfertigung, 30+ Jahre Erfahrung.`,
    path: `/${SERVICE_HUB}/${s.slug}/`,
    image: cover,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const photos = PHOTOS[service.imageCategory] ?? [];
  const cover = photos[0];
  const faqs = SERVICE_FAQS[service.slug] ?? GENERAL_FAQS.slice(0, 4);

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.name,
    name: `${service.name} – ${SITE.name} Schreinerei Mannheim`,
    provider: {
      "@type": "LocalBusiness",
      name: SITE.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.street,
        postalCode: SITE.address.zip,
        addressLocality: SITE.address.city,
        addressCountry: "DE",
      },
    },
    areaServed: SITE.serviceArea,
    description: service.description,
  };

  return (
    <>
      <ServiceHero service={service} photo={cover} />
      <ServiceContent service={service} photos={photos} />
      <Process />
      <Materials />
      <Reviews />
      <FAQ items={faqs} title={`Häufige Fragen zum ${service.name}`} />
      <RelatedServices exclude={service.slug} />
      <CTA
        heading={`Bereit für Ihr ${service.name}-Projekt?`}
        body="Senden Sie uns eine Skizze, ein Foto oder eine Idee – wir antworten innerhalb eines Werktags."
      />
      <JsonLd id={`ld-service-${service.slug}`} data={serviceLd} />
    </>
  );
}
