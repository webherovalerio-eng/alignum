"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { type City } from "@/data/cities";
import { SITE } from "@/data/site";

/**
 * Statement-Strip auf solidem Surface-Deep-Hintergrund — kein Backdrop-Blur,
 * kein Text-auf-Bild mehr. Der Stadt-Name läuft als dezente, nicht
 * dominierende Watermark im Hintergrund.
 */
export function CitySecretSauce({ city }: { city: City }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["8%", "-22%"]);

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden bg-surface-deep text-surface-deep-foreground grain-overlay">
      {/* Subtle rolling watermark — sitzt HINTER allem, nicht UNTER Karten */}
      <motion.div
        aria-hidden
        style={{ x }}
        className="pointer-events-none absolute inset-0 flex items-center whitespace-nowrap font-display text-[clamp(8rem,22vw,22rem)] leading-[0.85] tracking-tighter text-white/[0.04] select-none"
      >
        {city.name} · {city.name} · {city.name} · {city.name}
      </motion.div>

      <div className="container-prose relative">
        <Reveal>
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1] tracking-tight mb-5">
            Schreinerei {city.name}
          </h2>
          <p className="font-display text-[clamp(1.25rem,2.2vw,1.875rem)] leading-[1.25] tracking-tight max-w-4xl text-white/90">
            Alignum baut in{" "}
            <span className="text-primary">{SITE.address.city}</span>{" "}
            – und kommt für Aufmaß, Lieferung und Montage zu Ihnen nach{" "}
            <span className="text-primary">{city.name}</span>.
          </p>
          <p className="mt-6 text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl">
            Keine Filiale, kein Schaufenster vor Ort. Stattdessen: ein
            Tischlermeister-Betrieb mit eigener Werkstatt, der für Sie nach{" "}
            {city.name} fährt, plant, montiert.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
