"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Truck, Hammer, Clock } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { type City } from "@/data/cities";
import { SITE } from "@/data/site";

/**
 * „Secret Sauce" für City-Pages — pro Stadt unverwechselbar durch den
 * rollenden Stadt-Namen im Hintergrund. Aber TEXTLICH macht die Section
 * KEINE Aussage „wir sind in {Stadt}". Stattdessen: drei klare Werkstatt-Fakten.
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
          <div className="rounded-3xl border border-border bg-background/90 backdrop-blur p-8 sm:p-12 shadow-[var(--shadow-elev)] grain-overlay max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-primary font-medium mb-4">
              So arbeiten wir mit {city.name}
            </p>
            <p className="text-2xl sm:text-3xl font-display leading-tight">
              Alignum baut in <span className="text-primary">{SITE.address.city}</span>{" "}
              – und kommt für Aufmaß, Lieferung und Montage zu Ihnen nach{" "}
              <span className="text-primary">{city.name}</span>.
            </p>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              Keine Filiale, kein Schaufenster vor Ort. Stattdessen: ein
              Tischlermeister-Betrieb mit eigener Werkstatt, der für Sie nach{" "}
              {city.name} fährt, plant, montiert.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <Stat Icon={Clock} value="30+" label="Jahre" />
              <Stat Icon={Truck} value={`${city.distanceKm ?? "—"}`} label="km Anfahrt" />
              <Stat Icon={Hammer} value="1" label="Werkstatt" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stat({
  Icon,
  value,
  label,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-card border border-border p-4 flex flex-col items-center">
      <Icon className="size-4 text-primary mb-2" />
      <p className="font-display text-2xl text-foreground">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
