"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, MapPin, Hammer } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { type City } from "@/data/cities";
import { REVIEW_SUMMARY } from "@/data/reviews";
import { SITE } from "@/data/site";
import { buildCityDisplayTitle } from "@/lib/cityContent";

/**
 * CityHero — Heading-Hierarchie nach Valerio-Spec:
 * - <h1> klein als Badge oben: „Schreinerei {Stadt}" — das Haupt-Keyword
 * - <p> groß als Display-Titel: Spintax-Variation („Unsere Projekte in {Stadt}",
 *   „Referenzen in {Stadt}", „Wir für {Stadt}", …)
 * - <p> kleiner: Klarstellung Werkstatt-Standort
 */
export function CityHero({ city, photo }: { city: City; photo?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 100]);

  const { prefix, suffix } = buildCityDisplayTitle(city);

  return (
    <section ref={ref} className="relative min-h-[80svh] w-full overflow-hidden grain-overlay">
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        {photo && (
          <Image src={photo} alt="" fill priority sizes="100vw" className="object-cover" />
        )}
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 scrim-readable" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 scrim-bottom" />

      <div className="relative z-10 container-prose pt-36 pb-16 min-h-[80svh] flex flex-col justify-end text-white">
        {/* H1 — Haupt-Keyword, klein als Badge */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
          className="inline-flex self-start items-center gap-2 rounded-full border border-white/25 bg-black/40 backdrop-blur-md px-4 py-1.5 text-[11px] sm:text-xs font-medium tracking-wider uppercase text-white/90 mb-5"
        >
          <MapPin className="size-3 text-primary" />
          Schreinerei {city.name}
        </motion.h1>

        {/* Werkstatt-Klarheit */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 self-start mb-7 text-xs sm:text-sm text-white/70"
        >
          <span className="inline-flex items-center gap-1.5">
            <Hammer className="size-3.5 text-primary" />
            Werkstatt in {SITE.address.city}
          </span>
          <span className="text-white/30">·</span>
          <span>Liefergebiet {city.name}</span>
        </motion.div>

        {/* Display-Headline als <p> mit Spintax */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.95] tracking-tight text-shadow-hero"
        >
          {prefix}{" "}
          <span className="text-primary italic">{city.name}</span>
          {suffix}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.75, ease: [0.19, 1, 0.22, 1] }}
          className="mt-6 max-w-[58ch] text-base sm:text-lg text-white/85 leading-relaxed text-shadow-lg"
        >
          Maßgefertigte Möbel, Küchen, Treppen und Türen – gefertigt in unserer
          Werkstatt in {SITE.address.city}, montiert bei Ihnen in {city.name}.
          Eine Schreinerei mit über 30 Jahren Handwerk, persönlich und geplant.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.95, ease: [0.19, 1, 0.22, 1] }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <LinkButton href={`/anfrage/?city=${city.slug}`} size="lg" variant="primary">
            Aufmaß in {city.name} anfragen <ArrowRight className="size-4" />
          </LinkButton>
          <div className="flex items-center gap-2 text-sm text-white/85 text-shadow-lg">
            <Stars rating={5} />
            <span>
              <strong className="font-medium text-white">{REVIEW_SUMMARY.averageRating.toFixed(1)}</strong> /{" "}
              {REVIEW_SUMMARY.count}+ Google-Bewertungen
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
