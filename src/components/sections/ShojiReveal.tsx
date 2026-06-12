"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/**
 * Scroll-getriggerte Shoji-Türen-Animation.
 *
 * Konzept: nur die ZWEI MITTLEREN Türen (mit Ornament) bewegen sich.
 * Außenwand und die zwei Außen-Türen bleiben statisch. Beim Öffnen
 * gleiten die Mittel-Türen seitlich weg und ein ruhiger Raum dahinter
 * wird sichtbar — entschleunigte japanische Wohnatmosphäre.
 *
 * Technik:
 * - Dasselbe shoji-wall.jpg wird in drei Layern gerendert:
 *   1. Statisch: clip-path zeigt nur Außenwand + 2 Außen-Türen
 *   2. Animiert links: clip-path zeigt nur die mittel-linke Tür
 *   3. Animiert rechts: clip-path zeigt nur die mittel-rechte Tür
 * - Da alle 3 Layer object-contain mit gleicher Geometrie haben, sind sie
 *   pixelgenau übereinander positioniert
 *
 * Tür-Positionen im Bild (geschätzt aus shoji-wall.jpg):
 * - Außenwand links:     0% – 13%
 * - Tür 1 (außen):      13% – 32%
 * - Tür 2 (mitte links): 32% – 50%
 * - Tür 3 (mitte rechts):50% – 68%
 * - Tür 4 (außen):      68% – 87%
 * - Außenwand rechts:   87% – 100%
 */
export function ShojiReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Mittel-Türen gleiten 0.32 → 0.68: linke um -19%, rechte um +19%
  // (das bringt sie genau hinter die Außen-Türen)
  const leftX = useTransform(
    scrollYProgress,
    [0.32, 0.68],
    reduce ? ["0%", "0%"] : ["0%", "-19%"],
  );
  const rightX = useTransform(
    scrollYProgress,
    [0.32, 0.68],
    reduce ? ["0%", "0%"] : ["0%", "19%"],
  );

  // Hintergrund-Atmosphäre
  const bgScale = useTransform(
    scrollYProgress,
    [0.3, 0.75],
    reduce ? [1, 1] : [1.08, 1.0],
  );
  const bgOpacity = useTransform(scrollYProgress, [0.28, 0.55], [0.4, 1]);

  // Warmes Licht durch den Spalt
  const glowOpacity = useTransform(scrollYProgress, [0.34, 0.55, 0.78], [0, 1, 0.6]);

  // Caption fadet ein nach 55 % Animation
  const captionOpacity = useTransform(scrollYProgress, [0.55, 0.78], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.55, 0.78], [40, 0]);

  // Clip-paths
  const FRAME_CLIP =
    // Außen-Bereiche: 0-32% (Wand+Tür1) und 68-100% (Tür4+Wand)
    "polygon(0% 0%, 32% 0%, 32% 100%, 0% 100%)";
  const FRAME_CLIP_RIGHT =
    "polygon(68% 0%, 100% 0%, 100% 100%, 68% 100%)";
  const DOOR_LEFT_CLIP =
    // Mittel-links: 32% bis 50%
    "polygon(32% 0%, 50% 0%, 50% 100%, 32% 100%)";
  const DOOR_RIGHT_CLIP =
    // Mittel-rechts: 50% bis 68%
    "polygon(50% 0%, 68% 0%, 68% 100%, 50% 100%)";

  return (
    <section
      ref={ref}
      className="relative w-full"
      style={{ height: "240svh" }}
      aria-label="Shoji-Türen Animation"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-surface-charcoal">
        {/* HINTERGRUND — der Raum hinter den Türen (japanischer Showroom) */}
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
          {/* Atmosphärische Vignette für Tiefe */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.65)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/40" />
        </motion.div>

        {/* CAPTION — fadet ein wenn Türen aufgegangen sind */}
        <motion.div
          style={{ opacity: captionOpacity, y: captionY }}
          className="absolute inset-0 flex items-center justify-center px-6 z-10 pointer-events-none"
        >
          <div className="text-center max-w-2xl">
            <p className="font-brand text-xs sm:text-sm text-primary mb-5 tracking-[0.3em]">
              Shoji
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] tracking-tight text-white text-shadow-hero">
              Holen Sie sich{" "}
              <span className="italic text-primary inline-block">
                die Ruhe nach Hause.
              </span>
            </h2>
            <p className="mt-6 text-base sm:text-lg text-white/85 leading-relaxed text-shadow-lg max-w-md mx-auto">
              Eine Schiebewand aus Massivholz und Washi-Reispapier. Minimalistisch.
              Geräuschlos. Entschleunigend.
            </p>
          </div>
        </motion.div>

        {/* WARMES LICHT zwischen den geöffneten Türen */}
        <motion.div
          aria-hidden
          style={{ opacity: glowOpacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[110%] z-[15] pointer-events-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,210,150,0.45)_0%,rgba(212,132,8,0.18)_40%,transparent_75%)] blur-3xl" />
        </motion.div>

        {/* STATISCHER FRAME — linker Außen-Bereich (Wand + Tür 1) */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ clipPath: FRAME_CLIP }}
        >
          <Image
            src="/images/shoji-reveal/shoji-wall.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-contain object-center"
          />
        </div>

        {/* STATISCHER FRAME — rechter Außen-Bereich (Tür 4 + Wand) */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ clipPath: FRAME_CLIP_RIGHT }}
        >
          <Image
            src="/images/shoji-reveal/shoji-wall.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-contain object-center"
          />
        </div>

        {/* ANIMIERT — linke Mittel-Tür (Tür 2 mit Ornament-Hälfte) */}
        <motion.div
          style={{ x: leftX, clipPath: DOOR_LEFT_CLIP }}
          className="absolute inset-0 z-25 will-change-transform pointer-events-none"
        >
          <Image
            src="/images/shoji-reveal/shoji-wall.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-contain object-center"
          />
        </motion.div>

        {/* ANIMIERT — rechte Mittel-Tür (Tür 3 mit Ornament-Hälfte) */}
        <motion.div
          style={{ x: rightX, clipPath: DOOR_RIGHT_CLIP }}
          className="absolute inset-0 z-25 will-change-transform pointer-events-none"
        >
          <Image
            src="/images/shoji-reveal/shoji-wall.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-contain object-center"
          />
        </motion.div>

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
