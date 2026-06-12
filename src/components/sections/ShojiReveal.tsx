"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/**
 * Scroll-getriggerte Shoji-Türen-Animation — finale Version.
 *
 * Technik:
 * - Hintergrund: Showroom-Foto (was sichtbar wird wenn Türen aufgehen)
 * - Zwei vollformatige Layer mit demselben shoji-wide.jpg, jeweils
 *   per clip-path auf eine Bildhälfte beschränkt
 * - Beim Scrollen gleiten beide Layer komplett zur Seite (x: 0 → ±100 %)
 * - Dadurch bleibt das Bild bildscharf — keine Crops/Upscales pro Tür
 *
 * shoji-wide.jpg (3200×1593) ist die original-Aufnahme + horizontal
 * gespiegelte Kopie → vier symmetrische Türen, Mitte = Wand.
 */
export function ShojiReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Türen-Slide: 0.32 → 0.7 (langsamer, edler)
  const leftX = useTransform(
    scrollYProgress,
    [0.32, 0.7],
    reduce ? ["0%", "0%"] : ["0%", "-100%"],
  );
  const rightX = useTransform(
    scrollYProgress,
    [0.32, 0.7],
    reduce ? ["0%", "0%"] : ["0%", "100%"],
  );

  // Hintergrund-Atmosphäre — leichter Parallax und Scale
  const bgScale = useTransform(
    scrollYProgress,
    [0.3, 0.75],
    reduce ? [1, 1] : [1.1, 1.0],
  );
  const bgOpacity = useTransform(scrollYProgress, [0.25, 0.5], [0.5, 1]);

  // Gold-Glow durch den Spalt
  const glowOpacity = useTransform(scrollYProgress, [0.32, 0.5, 0.78], [0, 1, 0.7]);
  const glowWidth = useTransform(scrollYProgress, [0.32, 0.7], ["0%", "70%"]);

  // Caption fadet ein nach 55% Animation
  const captionOpacity = useTransform(scrollYProgress, [0.55, 0.8], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.55, 0.8], [40, 0]);

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
          style={{ scale: bgScale, opacity: bgOpacity }}
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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.65)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/45" />
        </motion.div>

        {/* CAPTION */}
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
              Authentische japanische Schiebetüren aus heimischem Massivholz
              und echtem Washi-Reispapier — geräuschlos gleitend, jahrzehnte­lang
              haltbar.
            </p>
          </div>
        </motion.div>

        {/* GOLD-LICHT DURCH DEN SPALT */}
        <motion.div
          aria-hidden
          style={{ opacity: glowOpacity, width: glowWidth }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[120%] z-[15] pointer-events-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,210,150,0.6)_0%,rgba(212,132,8,0.28)_35%,transparent_75%)] blur-3xl" />
        </motion.div>

        {/* LINKE TÜR — Vollbild mit clip-path auf linke Hälfte */}
        <motion.div
          style={{
            x: leftX,
            clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
          }}
          className="absolute inset-0 z-20 will-change-transform"
        >
          <div className="relative h-full w-full">
            <Image
              src="/images/shoji-reveal/shoji-wide.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            {/* Innenkanten-Tiefenschatten — vom rechten Rand des Layers
                (= Mitte der Animation) nach links auslaufend */}
            <div
              className="absolute inset-y-0 left-[calc(50%-3rem)] w-12 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to left, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
              }}
            />
            {/* Subtle warm gradient overlay für Material-Stimmung */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 mix-blend-multiply" />
            {/* Gold-Light-Edge an der Innenkante */}
            <motion.div
              aria-hidden
              style={{ opacity: glowOpacity }}
              className="absolute inset-y-0 left-[calc(50%-1px)] w-px bg-gradient-to-b from-transparent via-primary/70 to-transparent pointer-events-none"
            />
            {/* Grain für Material-Tiefe */}
            <div className="absolute inset-0 grain-overlay opacity-30" />
          </div>
        </motion.div>

        {/* RECHTE TÜR — Vollbild mit clip-path auf rechte Hälfte */}
        <motion.div
          style={{
            x: rightX,
            clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
          }}
          className="absolute inset-0 z-20 will-change-transform"
        >
          <div className="relative h-full w-full">
            <Image
              src="/images/shoji-reveal/shoji-wide.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-y-0 right-[calc(50%-3rem)] w-12 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 mix-blend-multiply" />
            <motion.div
              aria-hidden
              style={{ opacity: glowOpacity }}
              className="absolute inset-y-0 right-[calc(50%-1px)] w-px bg-gradient-to-b from-transparent via-primary/70 to-transparent pointer-events-none"
            />
            <div className="absolute inset-0 grain-overlay opacity-30" />
          </div>
        </motion.div>

        {/* Top/Bottom Schiebeschienen-Schatten */}
        <div
          aria-hidden
          className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-black/65 to-transparent z-30 pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-black/65 to-transparent z-30 pointer-events-none"
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
