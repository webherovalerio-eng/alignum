import { notFound } from "next/navigation";
import { CityHero } from "@/components/sections/CityHero";
import { WerkstattZuIhnen } from "@/components/sections/WerkstattZuIhnen";
import { CityIntent } from "@/components/sections/CityIntent";
import { CitySecretSauce } from "@/components/sections/CitySecretSauce";
import { ReferenceProjects } from "@/components/sections/ReferenceProjects";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { Materials } from "@/components/sections/Materials";
import { Reviews } from "@/components/sections/Reviews";
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
    title: `Schreinerei ${city.name} – Maßmöbel aus unserer Werkstatt | Alignum`,
    description: `Schreiner für ${city.name}: Aus unserer Werkstatt in ${SITE.address.city} liefern und montieren wir Maßmöbel, Küchen, Treppen und Türen bei Ihnen vor Ort. Anfahrt inklusive.`,
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
      <WerkstattZuIhnen city={city} />
      <CityIntent city={city} />
      <ReferenceProjects />
      <CitySecretSauce city={city} />
      <ServicesGrid heading />
      <Reviews />
      <Materials />
      <FAQ
        items={GENERAL_FAQS.map((f) => ({
          q: f.q.replace("Mannheim", city.name),
          a: f.a
            .replace("Mannheim", city.name)
            .replace("Rhein-Neckar-Raum", `${city.name} und Umgebung`),
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
    name: `Alignum Möbelbau – Schreinerei für ${city.name}`,
    image: `${SITE.url}/images/hero/hero-01.jpg`,
    url: `${SITE.url}/${city.slug}/`,
    telephone: SITE.phone,
    email: SITE.email,
    // WICHTIG: Adresse bleibt IMMER Edingen-Neckarhausen — wir haben keine Filiale in der Stadt
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      postalCode: SITE.address.zip,
      addressLocality: SITE.address.city,
      addressCountry: "DE",
    },
    // city.name geht in areaServed, NICHT in address
    areaServed: {
      "@type": "City",
      name: city.name,
    },
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 49.4542161,
        longitude: 8.5940851,
      },
      geoRadius: 60000,
    },
    priceRange: "€€€",
  };
}
