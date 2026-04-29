import { notFound } from "next/navigation";
import { CityHero } from "@/components/sections/CityHero";
import { CityIntent } from "@/components/sections/CityIntent";
import { CitySecretSauce } from "@/components/sections/CitySecretSauce";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { Process } from "@/components/sections/Process";
import { Materials } from "@/components/sections/Materials";
import { Reviews } from "@/components/sections/Reviews";
import { GmbGallery } from "@/components/sections/GmbGallery";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { CITIES, type City } from "@/data/cities";
import { HERO_PHOTOS } from "@/data/photos";
import { GENERAL_FAQS } from "@/data/faqs";
import { buildCityClosing } from "@/lib/cityContent";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return CITIES.map((c) => ({ citySlug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ citySlug: string }> }) {
  const { citySlug } = await params;
  const city = CITIES.find((c) => c.slug === citySlug);
  if (!city) return {};
  return buildMetadata({
    title: `Schreinerei ${city.name} – Maßmöbel, Küchen, Treppen | Alignum`,
    description: `Ihre Schreinerei in ${city.name}: Massivholzmöbel, Küchen, Treppen, Türen und Shoji nach Maß. Schreinermeister-Betrieb mit über 30 Jahren Erfahrung – Anfahrt aus ${city.name} ${city.distanceKm ?? "wenige"} km.`,
    path: `/${city.slug}/`,
  });
}

export default async function CityPage({ params }: { params: Promise<{ citySlug: string }> }) {
  const { citySlug } = await params;
  const city = CITIES.find((c) => c.slug === citySlug);
  if (!city) notFound();

  const heroPhoto = HERO_PHOTOS[Math.abs(hashString(city.slug)) % Math.max(HERO_PHOTOS.length, 1)] ?? HERO_PHOTOS[0];
  const closing = buildCityClosing(city);

  const ld = buildLocalBusinessLD(city);

  return (
    <>
      <CityHero city={city} photo={heroPhoto} />
      <CityIntent city={city} />
      <CitySecretSauce city={city} />
      <ServicesGrid heading />
      <Process />
      <Reviews />
      <GmbGallery limit={13} />
      <Materials />
      <FAQ
        items={GENERAL_FAQS.map((f) => ({
          q: f.q.replace("Mannheim", city.name),
          a: f.a.replace("Mannheim", city.name).replace("Rhein-Neckar-Raum", `${city.name} und Umgebung`),
        }))}
        title={`Häufige Fragen aus ${city.name}`}
      />

      <section className="relative py-20">
        <div className="container-tight">
          <Reveal>
            <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground italic">{closing}</p>
          </Reveal>
        </div>
      </section>

      <CTA
        heading={`Schreinerei für ${city.name} – sprechen Sie uns an`}
        body={`Wir kommen aus ${SITE.address.city} zu Ihnen nach ${city.name}, vermessen Ihren Raum und skizzieren das Möbel, das Sie bisher nirgends gefunden haben.`}
      />

      <JsonLd id={`ld-city-${city.slug}`} data={ld} />
    </>
  );
}

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

function buildLocalBusinessLD(city: City) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE.url}/${city.slug}/#business`,
    name: `Alignum Schreinerei – ${city.name}`,
    image: `${SITE.url}/images/hero/hero-01.jpg`,
    url: `${SITE.url}/${city.slug}/`,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      postalCode: SITE.address.zip,
      addressLocality: SITE.address.city,
      addressCountry: "DE",
    },
    areaServed: {
      "@type": "City",
      name: city.name,
    },
    priceRange: "€€€",
  };
}
