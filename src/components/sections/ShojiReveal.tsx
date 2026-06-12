"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/**
 * Scroll-getriggerte Shoji-Türen-Animation.
 *
 * Komplett aus CSS-Gradients gebaut — keine Pixel-Fotos.
 * Dadurch scharf bei jeder Auflösung und brand-konsistent.
 *
 * Layer pro Tür (von hinten nach vorne):
 *  1. Dark-walnut Base (lineares vertical Gradient für Holz-Plastizität)
 *  2. Repeating-linear Wood-grain Streifen (sehr subtle)
 *  3. Radial-Light von oben (Highlight, wie Streiflicht)
 *  4. Reispapier-Panel im Zentrum (cremig, semi-transluzent)
 *  5. Innenkanten-Schatten (3D-Tiefe)
 *  6. Korn-Overlay
 */
export function ShojiReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const leftX = useTransform(
    scrollYProgress,
    [0.28, 0.66],
    reduce ? ["0%", "0%"] : ["0%", "-101%"],
  );
  const rightX = useTransform(
    scrollYProgress,
    [0.28, 0.66],
    reduce ? ["0%", "0%"] : ["0%", "101%"],
  );

  const bgScale = useTransform(
    scrollYProgress,
    [0.28, 0.7],
    reduce ? [1, 1] : [1.12, 1.0],
  );
  const bgOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0.7, 1]);

  const glowOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.72], [0, 1, 0.65]);
  const glowWidth = useTransform(scrollYProgress, [0.3, 0.6], ["0%", "55%"]);

  const captionOpacity = useTransform(scrollYProgress, [0.52, 0.75], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.52, 0.75], [50, 0]);

  return (
    <section
      ref={ref}
      className="relative w-full"
      style={{ height: "220svh" }}
      aria-label="Shoji-Türen Animation"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-surface-charcoal">
        {/* HINTERGRUND */}
        <motion.div style={{ scale: bgScale, opacity: bgOpacity }} className="absolute inset-0">
          <Image
            src="/images/hero/hero-02.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          {/* Tiefe Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.6)_100%)]" />
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
              Authentische japanische Schiebetüren aus Walnuss, Eiche oder
              Hemlock — mit echtem Washi-Reispapier aus Japan. Geräuschlos
              gleitend, jahrzehntelang haltbar.
            </p>
          </div>
        </motion.div>

        {/* GOLD-GLOW DURCH DEN SPALT */}
        <motion.div
          aria-hidden
          style={{ opacity: glowOpacity, width: glowWidth }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[110%] z-[15] pointer-events-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,132,8,0.55)_0%,rgba(232,168,71,0.2)_30%,transparent_70%)] blur-3xl" />
        </motion.div>

        {/* LINKE TÜR */}
        <motion.div
          style={{ x: leftX }}
          className="absolute top-0 left-0 h-full w-1/2 z-20 will-change-transform"
        >
          <ShojiDoor side="left" />
        </motion.div>

        {/* RECHTE TÜR */}
        <motion.div
          style={{ x: rightX }}
          className="absolute top-0 right-0 h-full w-1/2 z-20 will-change-transform"
        >
          <ShojiDoor side="right" />
        </motion.div>

        {/* Scroll-Hint */}
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

/**
 * Eine massive Shoji-Tür aus pur CSS-Layern.
 * Walnuss-Holzrahmen + Reispapier-Panel im Zentrum + 3D-Tiefenschatten.
 */
function ShojiDoor({ side }: { side: "left" | "right" }) {
  const innerEdge = side === "left" ? "right" : "left";

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Layer 1 — Dark Walnut Base + vertikale Wood-Maserung */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(255,200,140,0.10) 0%, transparent 55%),
            repeating-linear-gradient(
              90deg,
              #1a0f08 0px,
              #2a1a0e 18px,
              #1f130a 32px,
              #2d1d10 48px,
              #1a0f08 64px
            ),
            linear-gradient(180deg, #2a1a0e 0%, #1a0f08 100%)
          `,
        }}
      />

      {/* Layer 2 — Horizontale wood-knot subtile lines */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-25 mix-blend-overlay"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 120px,
              rgba(80,50,25,0.5) 121px,
              transparent 122px,
              transparent 240px,
              rgba(80,50,25,0.3) 241px,
              transparent 242px
            )
          `,
        }}
      />

      {/* Layer 3 — Diagonal Streiflicht von oben links */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,210,150,0.08) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {/* Layer 4 — REISPAPIER-PANEL im Zentrum */}
      <div className="absolute inset-[8%] rounded-[3px] overflow-hidden">
        {/* Reispapier Background mit Warm-Glow von hinten */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at center, rgba(255,235,200,0.92) 0%, rgba(245,225,185,0.78) 50%, rgba(220,195,145,0.6) 100%)
            `,
            boxShadow:
              "inset 0 0 80px rgba(212,132,8,0.18), inset 0 0 200px rgba(0,0,0,0.35)",
          }}
        />

        {/* Papier-Faser-Textur */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08] mix-blend-multiply"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 20%, #6b4f2d 0.8px, transparent 1.5px),
              radial-gradient(circle at 70% 80%, #6b4f2d 0.7px, transparent 1.5px),
              radial-gradient(circle at 50% 50%, #5a3f25 0.6px, transparent 1.2px)
            `,
            backgroundSize: "14px 14px, 19px 19px, 23px 23px",
          }}
        />

        {/* Subtile vertikale Sprossen (3 dünne Streifen) */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              repeating-linear-gradient(
                90deg,
                transparent 0%,
                transparent calc(25% - 1px),
                rgba(58,38,21,0.5) calc(25% - 0.5px),
                rgba(58,38,21,0.5) calc(25% + 0.5px),
                transparent calc(25% + 1px),
                transparent 50%
              )
            `,
          }}
        />

        {/* Innenrahmen — präzise dünne Linie */}
        <div className="absolute inset-0 border border-[#3a2615]/40 rounded-[3px]" />
      </div>

      {/* Layer 5 — INNENKANTEN-TIEFENSCHATTEN (zur Mitte hin) */}
      <div
        aria-hidden
        className={`absolute inset-y-0 ${innerEdge}-0 w-16 pointer-events-none`}
        style={{
          background:
            innerEdge === "right"
              ? "linear-gradient(to left, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)"
              : "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)",
        }}
      />

      {/* Layer 6 — Außenkanten subtle Lichtkante */}
      <div
        aria-hidden
        className={`absolute inset-y-0 ${side}-0 w-px`}
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(255,200,140,0.18) 50%, transparent 100%)",
        }}
      />

      {/* Layer 7 — GRIFF (Pull-Handle) */}
      <div
        aria-hidden
        className={`absolute top-1/2 -translate-y-1/2 ${innerEdge}-3 w-2 h-20 rounded-full`}
        style={{
          background:
            "linear-gradient(to bottom, #0a0703 0%, #1a1108 50%, #0a0703 100%)",
          boxShadow: "0 0 1px rgba(255,210,150,0.3), inset 0 0 1px rgba(0,0,0,0.9)",
        }}
      />

      {/* Layer 8 — Subtle Grain Overlay übers Ganze */}
      <div className="absolute inset-0 grain-overlay opacity-50" />

      {/* Layer 9 — Top/Bottom Schienen-Reflexion (sehr dezent) */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-1"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-1"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}
