"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/**
 * Scroll-getriggerte Shoji-Türen-Animation.
 *
 * Verwendet echte hochauflösende Foto-Hälften aus SH1-0 (1698×2453)
 * als Türen. Walnuss-Rahmen + cremiges Reispapier — fotorealistisch.
 *
 * Hintergrund: hero-02.jpg (Showroom mit Buddha) wird beim Öffnen
 * der Türen sichtbar.
 */
export function ShojiReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Türen-Slide: 0.32 → 0.68 (länger, langsamer = edler)
  const leftX = useTransform(
    scrollYProgress,
    [0.32, 0.68],
    reduce ? ["0%", "0%"] : ["0%", "-101%"],
  );
  const rightX = useTransform(
    scrollYProgress,
    [0.32, 0.68],
    reduce ? ["0%", "0%"] : ["0%", "101%"],
  );

  // Hintergrund-Parallax (langsamere Bewegung als Türen)
  const bgScale = useTransform(
    scrollYProgress,
    [0.3, 0.75],
    reduce ? [1, 1] : [1.15, 1.0],
  );
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["-4%", "4%"],
  );

  // Gold-Licht durch den Spalt — kommt erst wenn Türen aufgehen
  const lightOpacity = useTransform(scrollYProgress, [0.32, 0.5, 0.78], [0, 1, 0.7]);
  const lightWidth = useTransform(scrollYProgress, [0.32, 0.7], ["0%", "70%"]);

  // Caption — fadet ein nach 60% Animation
  const captionOpacity = useTransform(scrollYProgress, [0.58, 0.8], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.58, 0.8], [40, 0]);

  // Subtle Bewegungsschatten auf den Türen (Drop-Shadow stärker während Bewegung)
  const doorShadow = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.7],
    ["0px 0px 0px rgba(0,0,0,0)", "30px 0px 60px rgba(0,0,0,0.6)", "0px 0px 0px rgba(0,0,0,0)"],
  );

  return (
    <section
      ref={ref}
      className="relative w-full"
      style={{ height: "240svh" }}
      aria-label="Shoji-Türen Animation"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-surface-charcoal">
        {/* HINTERGRUND — Showroom hinter den Türen */}
        <motion.div
          style={{ scale: bgScale, y: bgY }}
          className="absolute inset-0"
        >
          <Image
            src="/images/hero/hero-02.jpg"
            alt=""
            fill
            priority={false}
            sizes="100vw"
            className="object-cover"
          />
          {/* Atmosphärische Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.7)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
        </motion.div>

        {/* CAPTION — schwebt mittig nach Öffnung */}
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

        {/* GOLD-LICHT DURCH DEN SPALT */}
        <motion.div
          aria-hidden
          style={{ opacity: lightOpacity, width: lightWidth }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[120%] z-[15] pointer-events-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,210,150,0.55)_0%,rgba(212,132,8,0.25)_35%,transparent_75%)] blur-3xl" />
        </motion.div>

        {/* LINKE TÜR — echtes Foto */}
        <motion.div
          style={{ x: leftX, filter: doorShadow.get() ? undefined : undefined }}
          className="absolute top-0 left-0 h-full w-1/2 z-20 will-change-transform"
        >
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src="/images/shoji-reveal/door-left.jpg"
              alt=""
              fill
              priority
              sizes="50vw"
              className="object-cover object-right"
            />
            {/* Warm-multiply Overlay für Stimmung */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35 mix-blend-multiply" />
            {/* Innenkante (zur Mitte) — sehr weicher Schatten für Tiefe */}
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/75 via-black/30 to-transparent pointer-events-none" />
            {/* Goldene Light-Edge an der Innenkante */}
            <motion.div
              aria-hidden
              style={{ opacity: lightOpacity }}
              className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/60 to-transparent pointer-events-none"
            />
            {/* Subtle Grain */}
            <div className="absolute inset-0 grain-overlay opacity-40" />
          </div>
        </motion.div>

        {/* RECHTE TÜR — echtes Foto */}
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
              className="object-cover object-left"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35 mix-blend-multiply" />
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/75 via-black/30 to-transparent pointer-events-none" />
            <motion.div
              aria-hidden
              style={{ opacity: lightOpacity }}
              className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/60 to-transparent pointer-events-none"
            />
            <div className="absolute inset-0 grain-overlay opacity-40" />
          </div>
        </motion.div>

        {/* Top/Bottom Schiebeschienen-Schatten — gibt der Animation Kontext */}
        <div
          aria-hidden
          className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-black/70 to-transparent z-30 pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-black/70 to-transparent z-30 pointer-events-none"
        />

        {/* Scroll-Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/55 text-shadow-lg">
            Scroll, um zu öffnen
          </p>
        </motion.div>
      </div>
    </section>
  );
}
