import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { PhilosophySplit } from "@/components/sections/PhilosophySplit";
import { Process } from "@/components/sections/Process";
import { Materials } from "@/components/sections/Materials";
import { Reviews } from "@/components/sections/Reviews";
import { GmbGallery } from "@/components/sections/GmbGallery";
import { CityMosaic } from "@/components/sections/CityMosaic";
import { CTA } from "@/components/sections/CTA";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Alignum – Schreinerei in Mannheim",
  description:
    "Maßgefertigte Möbel, Küchen, Treppen, Türen und Shoji aus Mannheim. Schreinerei mit über 30 Jahren Erfahrung – Massivholz aus heimischen Wäldern, Handwerk auf Meisterniveau.",
  path: "/",
  image: "/images/hero/hero-01.jpg",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesGrid />
      <PhilosophySplit />
      <Process />
      <Materials />
      <Reviews />
      <GmbGallery />
      <CityMosaic />
      <CTA />
    </>
  );
}
