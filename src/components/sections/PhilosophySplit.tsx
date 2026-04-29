"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { ABOUT_PHOTOS } from "@/data/photos";

export function PhilosophySplit() {
  const aboutA = ABOUT_PHOTOS.find((p) => /innen/i.test(p)) ?? ABOUT_PHOTOS[0];
  const aboutB = ABOUT_PHOTOS.find((p) => /au-en|außen/i.test(p)) ?? ABOUT_PHOTOS[1];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, 60]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);

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
              <span className="italic text-gradient-gold">erinnern.</span>
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

        <div className="lg:col-span-6 relative h-[440px] sm:h-[600px]">
          <motion.div
            style={{ y: y1 }}
            className="absolute top-0 left-[15%] w-[55%] aspect-[3/4] rounded-2xl overflow-hidden shadow-[var(--shadow-elev)]"
          >
            <Image
              src={aboutA}
              alt="Schreinerei Werkstatt"
              fill
              sizes="(max-width: 1024px) 60vw, 30vw"
              className="object-cover"
            />
          </motion.div>
          <motion.div
            style={{ y: y2, rotate }}
            className="absolute bottom-0 right-0 w-[60%] aspect-[4/3] rounded-2xl overflow-hidden shadow-[var(--shadow-elev)] border-4 border-background"
          >
            <Image
              src={aboutB}
              alt="Detailaufnahme Holz"
              fill
              sizes="(max-width: 1024px) 60vw, 30vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
