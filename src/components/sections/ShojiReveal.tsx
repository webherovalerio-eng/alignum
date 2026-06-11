"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Scroll-getriggerte Shoji-Türen-Animation.
 *
 * Beim Scrollen durch die Section gleiten zwei Shoji-Schiebetüren zur
 * Seite (links/rechts) und geben dahinter ein Bild + Botschaft frei —
 * wie das echte Möbel beim Öffnen.
 *
 * Layout:
 * - Outer-Container 220 svh hoch → genug Scroll-Distance für saubere Animation
 * - Inner sticky-Container 100 svh → Animation passiert hier
 * - Animation: linke Tür → -100 %, rechte Tür → +100 %
 *
 * Nur auf /schreinerei-in-meiner-naehe/shoji/ einsetzen.
 */
export function ShojiReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Animation läuft von scrollYProgress 0.28 → 0.62, davor und danach static
  const leftX = useTransform(
    scrollYProgress,
    [0.28, 0.62],
    reduce ? ["0%", "0%"] : ["0%", "-102%"],
  );
  const rightX = useTransform(
    scrollYProgress,
    [0.28, 0.62],
    reduce ? ["0%", "0%"] : ["0%", "102%"],
  );

  // Caption hinter den Türen fadet ein während/nach Öffnung
  const captionOpacity = useTransform(scrollYProgress, [0.45, 0.7], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.45, 0.7], [40, 0]);

  // Subtile Schwellen-Indikatoren (Türrillen oben)
  const railOpacity = useTransform(scrollYProgress, [0.18, 0.32], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative w-full"
      style={{ height: "220svh" }}
      aria-label="Shoji-Türen Animation"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-surface-charcoal">
        {/* HINTERGRUND — was offenbart wird wenn die Türen aufgehen */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-02.jpg"
            alt="Shoji-Raumtrenner Showroom"
            fill
            priority={false}
            sizes="100vw"
            className="object-cover"
          />
          {/* Subtiles Vignette für Tiefe */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/40" />
        </div>

        {/* CAPTION — schwebt mittig hinter den Türen, fadet ein */}
        <motion.div
          style={{ opacity: captionOpacity, y: captionY }}
          className="absolute inset-0 flex items-center justify-center px-6 z-10 pointer-events-none"
        >
          <div className="text-center max-w-2xl">
            <p className="font-brand text-xs sm:text-sm text-primary mb-5 tracking-[0.3em]">
              Shoji · Schiebewand nach Maß
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] tracking-tight text-white text-shadow-hero">
              Räume teilen.{" "}
              <span className="italic text-primary inline-block">
                Ohne sie zu trennen.
              </span>
            </h2>
            <p className="mt-6 text-base sm:text-lg text-white/85 leading-relaxed text-shadow-lg max-w-lg mx-auto">
              Authentische japanische Schiebetüren aus Walnuss, Eiche oder
              Hemlock — mit echtem Washi-Reispapier aus Japan. Geräuschlos
              gleitend, jahrzehntelang haltbar.
            </p>
          </div>
        </motion.div>

        {/* RAIL — Schiebeschiene oben, klein und unaufdringlich */}
        <motion.div
          aria-hidden
          style={{ opacity: railOpacity }}
          className="absolute top-0 inset-x-0 h-3 bg-gradient-to-b from-[#3a2a1c] to-[#1a1208] shadow-[inset_0_-1px_0_rgba(0,0,0,0.6)] z-20"
        />

        {/* LINKE SHOJI-TÜR */}
        <motion.div
          style={{ x: leftX }}
          className="absolute top-0 left-0 h-full w-1/2 z-20 will-change-transform"
        >
          <ShojiPanel side="left" />
        </motion.div>

        {/* RECHTE SHOJI-TÜR */}
        <motion.div
          style={{ x: rightX }}
          className="absolute top-0 right-0 h-full w-1/2 z-20 will-change-transform"
        >
          <ShojiPanel side="right" />
        </motion.div>

        {/* Subtile Scroll-Hint am unteren Rand */}
        <Reveal className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
            Scroll, um zu öffnen
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Eine einzelne Shoji-Tür-Hälfte als SVG-Panel.
 * - Walnuss-Holzrahmen außen
 * - Reispapier-Hintergrund (cremig, leicht transluzent)
 * - Klassisches Rastermuster: vertikale + horizontale Holzleisten
 * - Ein Griff (Holzleiste) auf der Innenseite (zur Mitte hin)
 *
 * side='left' → Griff rechts (zur Mitte); side='right' → Griff links.
 */
function ShojiPanel({ side }: { side: "left" | "right" }) {
  const handleSide = side === "left" ? "right" : "left";

  return (
    <div className="relative h-full w-full">
      {/* Reispapier-Hintergrund mit subtilem Glow von hinten */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f4ecdc] via-[#ece1c8] to-[#e1d4b5]" />

      {/* Subtle paper texture noise */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, #6b4f2d 0.5px, transparent 1px), radial-gradient(circle at 70% 80%, #6b4f2d 0.5px, transparent 1px)",
          backgroundSize: "8px 8px, 11px 11px",
        }}
      />

      {/* Rastermuster — vertikale und horizontale Holzleisten */}
      <svg
        viewBox="0 0 200 540"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        {/* Außenrahmen */}
        <rect
          x="0"
          y="0"
          width="200"
          height="540"
          fill="none"
          stroke="#3a2615"
          strokeWidth="6"
        />

        {/* Inner-Rahmen (subtle inset) */}
        <rect
          x="10"
          y="10"
          width="180"
          height="520"
          fill="none"
          stroke="#4a3220"
          strokeWidth="0.6"
          opacity="0.4"
        />

        {/* Vertikale Leisten — 3 Stück, gleichmäßig verteilt */}
        {[50, 100, 150].map((x) => (
          <line
            key={`v-${x}`}
            x1={x}
            x2={x}
            y1="6"
            y2="534"
            stroke="#3a2615"
            strokeWidth="2.4"
          />
        ))}

        {/* Horizontale Leisten — 8 Stück, gleichmäßig verteilt */}
        {[60, 120, 180, 240, 300, 360, 420, 480].map((y) => (
          <line
            key={`h-${y}`}
            x1="6"
            x2="194"
            y1={y}
            y2={y}
            stroke="#3a2615"
            strokeWidth="2.4"
          />
        ))}

        {/* Subtle Schattierung an den Rahmenkanten (links/oben) */}
        <line
          x1="6"
          x2="194"
          y1="6"
          y2="6"
          stroke="#1a1208"
          strokeWidth="1.2"
          opacity="0.45"
        />
        <line
          x1="6"
          x2="6"
          y1="6"
          y2="534"
          stroke="#1a1208"
          strokeWidth="1.2"
          opacity="0.45"
        />
      </svg>

      {/* Edge-Schatten zur Mitte hin (3D-Effekt) */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 ${
          handleSide === "left" ? "left-0" : "right-0"
        } w-3 bg-gradient-to-${handleSide === "left" ? "r" : "l"} from-black/25 to-transparent`}
      />

      {/* GRIFF — kleine Holzeinkerbung in der Mitte der Innenkante */}
      <div
        aria-hidden
        className={`absolute top-1/2 -translate-y-1/2 ${
          handleSide === "right" ? "right-2" : "left-2"
        } w-3 h-16 rounded-sm bg-gradient-to-b from-[#2d1e10] to-[#1a1208] shadow-[inset_0_0_2px_rgba(0,0,0,0.8)] flex items-center justify-center`}
      >
        <div className="w-1.5 h-10 rounded-full bg-[#0f0a05]" />
      </div>
    </div>
  );
}
