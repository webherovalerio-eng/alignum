"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/**
 * Scroll-getriggerte Shoji-Türen-Animation.
 *
 * Aufbau:
 * - Die freigestellte Schiebewand (shoji-doors.jpg, 2697×1824 — nur die
 *   Türen, kein Boden, keine Wand) sitzt als mittiger Rahmen auf dem
 *   dunklen Charcoal-Hintergrund der Website.
 * - Die Wand besteht aus ZWEI Schiebetüren: linke Hälfte und rechte Hälfte.
 * - Beim Scrollen gleiten beide Türen komplett zur Seite (overflow-hidden
 *   schneidet sie ab — als würden sie in der Wand verschwinden).
 * - Dahinter wird ein ruhiger japanischer Raum sichtbar + Botschaft:
 *   „Holen Sie sich die Ruhe nach Hause."
 */

// Aspect-Ratio des getrimmten Türen-Bildes
const DOOR_RATIO = "2697 / 1824";

export function ShojiReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Beide Türen gleiten komplett aus dem Rahmen: linke Hälfte → -50 %
  // der Container-Breite (= eigene Breite), rechte → +50 %.
  const leftX = useTransform(
    scrollYProgress,
    [0.32, 0.68],
    reduce ? ["0%", "0%"] : ["0%", "-50%"],
  );
  const rightX = useTransform(
    scrollYProgress,
    [0.32, 0.68],
    reduce ? ["0%", "0%"] : ["0%", "50%"],
  );

  // Raum dahinter: subtiler Zoom-Out beim Öffnen
  const roomScale = useTransform(
    scrollYProgress,
    [0.3, 0.75],
    reduce ? [1, 1] : [1.12, 1.0],
  );

  // Caption fadet ein, wenn die Türen weit genug offen sind
  const captionOpacity = useTransform(scrollYProgress, [0.55, 0.78], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.55, 0.78], [30, 0]);

  return (
    <section
      ref={ref}
      className="relative w-full"
      style={{ height: "240svh" }}
      aria-label="Shoji-Türen Animation"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-surface-charcoal grain-overlay flex items-center justify-center">
        {/* Dezenter warmer Schein hinter dem Türen-Rahmen */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(212,132,8,0.07)_0%,transparent_60%)]"
        />

        {/* Eyebrow über dem Rahmen */}
        <p className="absolute top-[7svh] left-1/2 -translate-x-1/2 font-brand text-[10px] sm:text-xs text-primary tracking-[0.3em] z-30 whitespace-nowrap">
          Shoji · Schiebewand nach Maß
        </p>

        {/* TÜREN-RAHMEN — mittig, feste Aspect-Ratio, überlauf versteckt */}
        <div
          className="relative w-[min(92vw,150svh)] max-h-[78svh] overflow-hidden rounded-sm shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
          style={{ aspectRatio: DOOR_RATIO }}
        >
          {/* DER RAUM dahinter — wird beim Öffnen sichtbar */}
          <motion.div style={{ scale: roomScale }} className="absolute inset-0">
            <Image
              src="/images/hero/hero-02.jpg"
              alt="Japanisch eingerichteter Raum mit Shoji-Wänden"
              fill
              priority={false}
              sizes="92vw"
              className="object-cover"
            />
            {/* Ruhige, warme Abdunklung für Text-Lesbarkeit */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/35" />
          </motion.div>

          {/* CAPTION — im Raum, minimalistisch */}
          <motion.div
            style={{ opacity: captionOpacity, y: captionY }}
            className="absolute inset-0 flex items-center justify-center px-8 z-10 pointer-events-none"
          >
            <div className="text-center max-w-xl">
              <h2 className="font-display text-[clamp(1.5rem,3.5vw,3.25rem)] leading-[1.08] tracking-tight text-white text-shadow-hero">
                Holen Sie sich{" "}
                <span className="italic text-primary inline-block">
                  die Ruhe nach Hause.
                </span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-white/85 leading-relaxed text-shadow-lg max-w-sm mx-auto">
                Minimalistisch. Geräuschlos. Entschleunigend.
              </p>
            </div>
          </motion.div>

          {/* LINKE TÜR — linke Hälfte der Schiebewand */}
          <motion.div
            style={{ x: leftX, clipPath: "polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)" }}
            className="absolute inset-0 z-20 will-change-transform pointer-events-none"
          >
            <Image
              src="/images/shoji-reveal/shoji-doors.jpg"
              alt=""
              fill
              priority
              sizes="92vw"
              className="object-fill"
            />
          </motion.div>

          {/* RECHTE TÜR — rechte Hälfte der Schiebewand */}
          <motion.div
            style={{ x: rightX, clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)" }}
            className="absolute inset-0 z-20 will-change-transform pointer-events-none"
          >
            <Image
              src="/images/shoji-reveal/shoji-doors.jpg"
              alt=""
              fill
              priority
              sizes="92vw"
              className="object-fill"
            />
          </motion.div>
        </div>

        {/* Scroll-Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-[5svh] left-1/2 -translate-x-1/2 z-30"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
            Scroll, um zu öffnen
          </p>
        </motion.div>
      </div>
    </section>
  );
}
