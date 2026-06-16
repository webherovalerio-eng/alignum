"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * „Unsere Haltung" — links Text, rechts eine handgezeichnete Möbel-Skizze
 * (Einbauschrank), die sich beim Reinscrollen Strich für Strich selbst
 * zeichnet. Ersetzt die früheren zwei Parallax-Fotos.
 *
 * Technik: SVG-Pfade mit framer-motion pathLength 0→1, gestaffelte Delays
 * → sequenzielles „Zeichnen". Farben über CSS-Tokens (currentColor +
 * text-foreground / text-primary), kein Hardcoding.
 */

// Reihenfolge = Zeichen-Reihenfolge. accent=true → Gold (Kleidung/Griffe).
const STROKES: { d: string; accent?: boolean }[] = [
  // Korpus-Rahmen
  { d: "M58 44 H382 a8 8 0 0 1 8 8 V470 a8 8 0 0 1 -8 8 H58 a8 8 0 0 1 -8 -8 V52 a8 8 0 0 1 8 -8 Z" },
  // Kranz / oberer Abschluss
  { d: "M44 44 H396" },
  { d: "M58 74 H382" },
  // Mittelteiler
  { d: "M220 74 V478" },
  // Füße
  { d: "M84 478 V494" },
  { d: "M356 478 V494" },

  // ── Linke Seite: Kleiderstange + Kleidung ──
  { d: "M74 104 H206" },
  // Kleidungsstück 1
  { d: "M96 104 q-5 -10 4 -12" },
  { d: "M96 110 l-15 11 l-6 56 q21 9 42 0 l-6 -56 z", accent: true },
  // Kleidungsstück 2
  { d: "M140 104 q-5 -10 4 -12" },
  { d: "M140 110 l-15 11 l-6 56 q21 9 42 0 l-6 -56 z", accent: true },
  // Kleidungsstück 3
  { d: "M184 104 q-5 -10 4 -12" },
  { d: "M184 110 l-15 11 l-6 56 q21 9 42 0 l-6 -56 z", accent: true },

  // ── Rechte Seite: Regalböden + gefaltete Stapel ──
  { d: "M232 116 H378" },
  { d: "M232 182 H378" },
  // gefalteter Stapel auf Boden 1
  { d: "M252 116 v-26 h46 v26" },
  { d: "M252 103 H298", accent: true },
  // gefalteter Stapel auf Boden 2
  { d: "M258 182 v-22 h40 v22" },
  { d: "M258 170 H298", accent: true },

  // ── Schubladen unten rechts ──
  { d: "M232 300 H378" },
  { d: "M232 390 H378" },
  // Griffe
  { d: "M296 345 h20", accent: true },
  { d: "M296 435 h20", accent: true },

  // ── Paar Schuhe auf dem Boden links ──
  { d: "M78 466 q4 -13 26 -10 q16 2 12 10 z" },
  { d: "M126 466 q4 -13 26 -10 q16 2 12 10 z" },
];

const STAGGER = 0.13;

export function PhilosophySplit() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yFloat = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [30, -30]);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="container-prose grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 lg:pr-8">
          <Reveal>
            <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">
              Unsere Haltung
            </p>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.05] tracking-tight">
              Möbel, die nicht nur funktionieren, sondern{" "}
              <span className="italic text-primary inline-block">erinnern.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Ein Tisch ist mehr als eine Platte auf vier Beinen. Er trägt
              Gespräche, Geburtstage, Konflikte und Versöhnungen. Wir bauen
              Möbel, die das aushalten – und mit Ihrer Familie wachsen.
            </p>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Bei der Auswahl unserer Materialien liegen die Kriterien neben
              der Gestaltungsfrage immer in der Berücksichtigung der
              ökologischen und gesundheitlichen Auswirkungen. Wir leimen
              schadstoffarm, schleifen ohne Polier­wachse, ölen mit reinen
              Naturprodukten.
            </p>
          </Reveal>
        </div>

        {/* Skizze, die sich Strich für Strich zeichnet */}
        <div className="lg:col-span-6 relative flex justify-center">
          <motion.div style={{ y: yFloat }} className="relative w-full max-w-[440px]">
            {/* dezenter warmer Schein hinter der Skizze */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.06),transparent_70%)]"
            />
            <svg
              viewBox="0 0 440 520"
              fill="none"
              className="w-full h-auto"
              role="img"
              aria-label="Handgezeichnete Skizze eines Einbauschranks nach Maß"
            >
              {STROKES.map((s, i) => (
                <motion.path
                  key={i}
                  d={s.d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={s.accent ? "text-primary" : "text-foreground/75"}
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-12%" }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : {
                          pathLength: { duration: 0.7, delay: i * STAGGER, ease: "easeInOut" },
                          opacity: { duration: 0.2, delay: i * STAGGER },
                        }
                  }
                />
              ))}
            </svg>
            <p className="mt-4 text-center font-brand text-[10px] sm:text-xs tracking-[0.3em] text-muted-foreground">
              Skizze · Einbauschrank nach Maß
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
