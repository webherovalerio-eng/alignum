"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/**
 * Scroll-getriggerte Shoji-Türen-Animation.
 *
 * Inszenierung: man steht in einem dunklen Raum, am Ende des Raums
 * steht die beleuchtete Shoji-Schiebewand. Beim Scrollen gleiten die
 * beiden Türen auf und geben den Blick in einen ruhigen japanischen
 * Raum frei.
 *
 * Raum-Atmosphäre (statt hartem Schwarz):
 * - fast-schwarzer warmer Hintergrund mit Glow hinter der Wand
 * - Boden-Reflexion unter der Tür (gespiegelt, geblurrt, ausblendend)
 *   wie auf dunklem poliertem Parkett
 * - seitliche Wand-Vignetten
 */

const DOOR_RATIO = "2697 / 1824";
const DOORS_SRC = "/images/shoji-reveal/shoji-doors.jpg";
const ROOM_SRC = "/images/hero/hero-02.jpg";

const CLIP_LEFT = "polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)";
const CLIP_RIGHT = "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)";

export function ShojiReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Beide Türen gleiten komplett zur Seite (jeweils um die eigene Breite)
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

  // Glow hinter der Wand wird beim Öffnen wärmer
  const glowOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0.5, 1]);

  return (
    <section
      ref={ref}
      className="relative w-full"
      style={{ height: "240svh" }}
      aria-label="Shoji-Türen Animation"
    >
      {/* WICHTIG: kein grain-overlay direkt auf dem sticky-Element —
          die ungelayerte .grain-overlay-Regel setzt position:relative
          und würde position:sticky überschreiben */}
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-[hsl(30_6%_7%)] flex flex-col items-center justify-center">
        {/* Korn-Textur als eigenes Kind-Layer */}
        <div aria-hidden className="absolute inset-0 grain-overlay pointer-events-none" />

        {/* RAUM-ATMOSPHÄRE: warmer Glow hinter der Wand */}
        <motion.div
          aria-hidden
          style={{ opacity: glowOpacity }}
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_55%_45%_at_center,rgba(212,132,8,0.10)_0%,rgba(212,132,8,0.04)_40%,transparent_70%)]"
        />
        {/* Seitliche Wand-Vignetten — als stünde man im Raum */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-[18%] pointer-events-none bg-gradient-to-r from-black/80 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-[18%] pointer-events-none bg-gradient-to-l from-black/80 to-transparent"
        />
        {/* Decke */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[16%] pointer-events-none bg-gradient-to-b from-black/85 to-transparent"
        />

        {/* Eyebrow — im Flow über der Wand, kann nicht kollidieren */}
        <p className="relative z-30 mb-5 font-brand text-[10px] sm:text-xs text-primary tracking-[0.3em] whitespace-nowrap">
          Shoji · Schiebewand nach Maß
        </p>

        {/* TÜREN-WAND — mittig; Breite so begrenzt, dass die Höhe nie
            68svh überschreitet → Aspect-Ratio bleibt immer korrekt,
            keine Verzerrung */}
        <div
          className="relative overflow-hidden shadow-[0_40px_140px_rgba(0,0,0,0.7)]"
          style={{ aspectRatio: DOOR_RATIO, width: "min(88vw, 100svh)" }}
        >
          {/* DER RAUM dahinter */}
          <motion.div style={{ scale: roomScale }} className="absolute inset-0">
            <Image
              src={ROOM_SRC}
              alt="Japanisch eingerichteter Raum mit Shoji-Wänden"
              fill
              priority={false}
              sizes="88vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/35" />
          </motion.div>

          {/* KONTRAST-LAYER — dunkelt den hellen Raum hinter dem Text ab,
              blendet synchron mit der Caption ein */}
          <motion.div
            aria-hidden
            style={{ opacity: captionOpacity }}
            className="absolute inset-0 z-[9] pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_center,rgba(0,0,0,0.60)_0%,rgba(0,0,0,0.30)_55%,rgba(0,0,0,0.10)_100%)]"
          />

          {/* CAPTION — im Raum, minimalistisch, komplett weiß */}
          <motion.div
            style={{ opacity: captionOpacity, y: captionY }}
            className="absolute inset-0 flex items-center justify-center px-8 z-10 pointer-events-none"
          >
            <div className="text-center max-w-xl">
              <h2 className="font-display text-[clamp(1.5rem,3.5vw,3.25rem)] leading-[1.08] tracking-tight text-white text-shadow-hero">
                Holen Sie sich{" "}
                <span className="italic inline-block">die Ruhe nach Hause.</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-white/95 leading-relaxed text-shadow-lg max-w-sm mx-auto">
                Minimalistisch. Geräuschlos. Entschleunigend.
              </p>
            </div>
          </motion.div>

          {/* LINKE TÜR */}
          <motion.div
            style={{ x: leftX, clipPath: CLIP_LEFT }}
            className="absolute inset-0 z-20 will-change-transform pointer-events-none"
          >
            <Image src={DOORS_SRC} alt="" fill priority sizes="88vw" className="object-fill" />
          </motion.div>

          {/* RECHTE TÜR */}
          <motion.div
            style={{ x: rightX, clipPath: CLIP_RIGHT }}
            className="absolute inset-0 z-20 will-change-transform pointer-events-none"
          >
            <Image src={DOORS_SRC} alt="" fill priority sizes="88vw" className="object-fill" />
          </motion.div>
        </div>

        {/* BODEN-REFLEXION — gespiegelte Wand auf dunklem poliertem Boden */}
        <div
          aria-hidden
          className="relative h-[10svh] overflow-hidden pointer-events-none select-none"
          style={{
            width: "min(88vw, 100svh)",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.22), transparent 80%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.22), transparent 80%)",
          }}
        >
          {/* gespiegelter Stack: Raum + beide Türen, gleiche Animation */}
          <div
            className="absolute top-0 left-0 w-full -scale-y-100 blur-[3px]"
            style={{ aspectRatio: DOOR_RATIO }}
          >
            <motion.div style={{ scale: roomScale }} className="absolute inset-0">
              <Image src={ROOM_SRC} alt="" fill sizes="88vw" className="object-cover" />
              <div className="absolute inset-0 bg-black/40" />
            </motion.div>
            <motion.div
              style={{ x: leftX, clipPath: CLIP_LEFT }}
              className="absolute inset-0 will-change-transform"
            >
              <Image src={DOORS_SRC} alt="" fill sizes="88vw" className="object-fill" />
            </motion.div>
            <motion.div
              style={{ x: rightX, clipPath: CLIP_RIGHT }}
              className="absolute inset-0 will-change-transform"
            >
              <Image src={DOORS_SRC} alt="" fill sizes="88vw" className="object-fill" />
            </motion.div>
          </div>
        </div>

        {/* Scroll-Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-[4svh] left-1/2 -translate-x-1/2 z-30"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
            Scroll, um zu öffnen
          </p>
        </motion.div>
      </div>
    </section>
  );
}
