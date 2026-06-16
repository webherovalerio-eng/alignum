"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * „Unsere Haltung" — links Text, rechts eine handgezeichnete Treppen-Skizze,
 * die sich Strich für Strich selbst zeichnet und am Ende ins echte Foto
 * übergeht (selbst-animierende SVG mit CSS-@keyframes, läuft auch über <img>).
 *
 * Die Skizzen-Striche sind dunkel (getracte Farben) → auf hellem „Papier"-
 * Card eingebettet, damit sie in beiden Themes lesbar bleiben (Skizze-auf-
 * Papier-Look). Die eingebettete Foto-Quelle wurde von 688 KB auf ~65 KB
 * herunterkomprimiert (siehe scripts: base64-JPEG rekomprimiert).
 */
export function PhilosophySplit() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yFloat = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [28, -28]);

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

        {/* Selbst-zeichnende Treppen-Skizze auf heller „Papier"-Karte */}
        <div className="lg:col-span-6 relative flex justify-center">
          <motion.div style={{ y: yFloat }} className="relative w-full max-w-[420px]">
            <div
              className="relative overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-elev)]"
              /* warmes Papier — bewusst in beiden Themes hell, damit die dunkle
                 Skizze und das Foto lesbar bleiben (Skizze-auf-Papier). */
              style={{ backgroundColor: "hsl(36 33% 97%)" }}
            >
              <img
                src="/images/sketches/treppe-skizze.svg"
                alt="Handgezeichnete Skizze einer Treppe nach Maß, die sich Strich für Strich zeichnet"
                loading="lazy"
                className="w-full h-auto"
              />
            </div>
            <p className="mt-4 text-center font-brand text-[10px] sm:text-xs tracking-[0.3em] text-muted-foreground">
              Skizze · Treppe nach Maß
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
