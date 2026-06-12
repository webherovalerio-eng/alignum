"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/**
 * Scroll-getriggerte Shoji-Türen-Animation.
 *
 * Verwendet ECHTE Foto-Hälften aus dem Original-Shoji-Bild als Türen —
 * keine SVG-Pattern. Beim Scrollen gleiten die Türen zur Seite und geben
 * dahinter ein zweites Foto + Botschaft frei.
 *
 * Tiefe & Atmosphäre:
 * - Warmer Gold-Glow zwischen den Türen, wenn sie zu öffnen beginnen
 * - Tiefenschatten an den Innenkanten (3D-Effekt)
 * - Subtle Vignetten + Korn-Overlay
 * - Sticky Layout, 220 svh Scroll-Distance
 */
export function ShojiReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Animation: Türen 0.28 → 0.65
  const leftX = useTransform(
    scrollYProgress,
    [0.28, 0.65],
    reduce ? ["0%", "0%"] : ["0%", "-100%"],
  );
  const rightX = useTransform(
    scrollYProgress,
    [0.28, 0.65],
    reduce ? ["0%", "0%"] : ["0%", "100%"],
  );

  // Subtler Parallax auf dem Hintergrund — er bewegt sich langsamer beim Scrollen
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["-6%", "6%"],
  );
  const bgScale = useTransform(
    scrollYProgress,
    [0.28, 0.7],
    reduce ? [1, 1] : [1.08, 1],
  );

  // Gold-Glow durch den Türspalt — wird stärker während die Türen aufgehen
  const glowOpacity = useTransform(scrollYProgress, [0.28, 0.5, 0.7], [0, 1, 0.6]);
  const glowWidth = useTransform(scrollYProgress, [0.28, 0.6], ["0%", "60%"]);

  // Caption — fadet ein nach der Hälfte der Animation
  const captionOpacity = useTransform(scrollYProgress, [0.5, 0.72], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.5, 0.72], [50, 0]);

  return (
    <section
      ref={ref}
      className="relative w-full"
      style={{ height: "220svh" }}
      aria-label="Shoji-Türen Animation"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-surface-charcoal">
        {/* HINTERGRUND — was offenbart wird wenn die Türen aufgehen */}
        <motion.div
          style={{ y: bgY, scale: bgScale }}
          className="absolute inset-0"
        >
          <Image
            src="/images/hero/hero-02.jpg"
            alt="Shoji-Showroom"
            fill
            priority={false}
            sizes="100vw"
            className="object-cover"
          />
          {/* Soft vignette für Tiefe */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
        </motion.div>

        {/* CAPTION — schwebt mittig, fadet ein wenn Türen offen sind */}
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

        {/* GOLDENER GLOW DURCH DEN SPALT — Atmosphäre, scheint von hinten durch */}
        <motion.div
          aria-hidden
          style={{ opacity: glowOpacity, width: glowWidth }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[110%] z-[15] pointer-events-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,132,8,0.55)_0%,rgba(212,132,8,0.2)_30%,transparent_70%)] blur-2xl" />
        </motion.div>

        {/* LINKE TÜR */}
        <motion.div
          style={{ x: leftX }}
          className="absolute top-0 left-0 h-full w-1/2 z-20 will-change-transform"
        >
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src="/images/shoji-reveal/door-left.jpg"
              alt=""
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />
            {/* Subtle warm overlay für Material-Feeling */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25 mix-blend-multiply" />
            {/* Innenkanten-Schatten (rechts = zur Mitte) */}
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/60 via-black/25 to-transparent" />
            {/* Subtile Korn-Textur über das ganze Panel */}
            <div className="absolute inset-0 grain-overlay" />
            {/* Edge-Highlight links (außenkante) */}
            <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/40 to-transparent" />
          </div>
        </motion.div>

        {/* RECHTE TÜR */}
        <motion.div
          style={{ x: rightX }}
          className="absolute top-0 right-0 h-full w-1/2 z-20 will-change-transform"
        >
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src="/images/shoji-reveal/door-right.jpg"
              alt=""
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25 mix-blend-multiply" />
            {/* Innenkanten-Schatten (links = zur Mitte) */}
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
            <div className="absolute inset-0 grain-overlay" />
            <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-l from-black/40 to-transparent" />
          </div>
        </motion.div>

        {/* Subtile Scroll-Hint am unteren Rand */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/55 text-shadow-lg">
            Scroll, um zu öffnen
          </p>
        </motion.div>
      </div>
    </section>
  );
}
