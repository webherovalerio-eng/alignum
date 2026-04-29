"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { type City } from "@/data/cities";

/**
 * "Secret Sauce": ein einzigartiges visuelles Element, das pro City-Page
 * andere Akzente setzt – mit Stadtname als Riesen-Schrift im Parallax.
 * Das ist der Trust-Verstärker, der jede City-Page unverwechselbar macht.
 */
export function CitySecretSauce({ city }: { city: City }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-25%"]);

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden border-y border-border bg-card/30">
      {/* Giant rolling city name */}
      <motion.div
        aria-hidden
        style={{ x }}
        className="pointer-events-none whitespace-nowrap font-display text-[clamp(8rem,22vw,22rem)] leading-[0.85] tracking-tighter text-foreground/[0.05] select-none"
      >
        {city.name} · {city.name} · {city.name} · {city.name}
      </motion.div>

      <div className="container-prose -mt-[clamp(7rem,20vw,20rem)] relative">
        <Reveal>
          <div className="rounded-3xl border border-border bg-background/85 backdrop-blur p-8 sm:p-12 shadow-[var(--shadow-elev)] grain-overlay max-w-3xl">
            <Sparkles className="size-6 text-primary mb-4" />
            <p className="text-2xl sm:text-3xl font-display leading-tight">
              Wir sind Ihre Schreinerei in <span className="text-primary">{city.name}</span> – nicht
              eines von hundert Möbelhäusern, sondern eine echte Werkstatt mit Werkzeug,
              Holz und Menschen, die ihr Handwerk lieben.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <Stat value="30+" label="Jahre" />
              <Stat value={`${city.distanceKm ?? "—"}`} label="km Anfahrt" />
              <Stat value="5⭐" label="Bewertungen" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-card border border-border p-4">
      <p className="font-display text-3xl text-primary">{value}</p>
      <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
