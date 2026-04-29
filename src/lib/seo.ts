import type { Metadata } from "next";
import { SITE } from "@/data/site";

type SEOInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
};

export function buildMetadata({ title, description, path = "/", image, noindex }: SEOInput): Metadata {
  const url = `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
  const fullTitle = title.includes("Alignum") ? title : `${title} | Alignum Schreinerei Mannheim`;
  const ogImage = image ?? "/images/hero/og-default.jpg";
  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      type: "website",
      locale: "de_DE",
      images: [{ url: ogImage, width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "FurnitureStore"],
    "@id": `${SITE.url}#business`,
    name: `Alignum Möbelbau – Schreinerei Mannheim`,
    image: `${SITE.url}/images/hero/hero-01.jpg`,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: "€€€",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 5.0,
      reviewCount: 26,
      bestRating: 5,
      worstRating: 1,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      postalCode: SITE.address.zip,
      addressLocality: SITE.address.city,
      addressCountry: "DE",
    },
    geo: { "@type": "GeoCoordinates", latitude: 49.4542161, longitude: 8.5940851 },
    openingHoursSpecification: SITE.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.day,
      description: h.time,
    })),
    sameAs: [SITE.social.google].filter(Boolean),
  };
}
