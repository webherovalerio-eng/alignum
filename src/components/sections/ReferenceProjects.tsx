"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { PHOTOS } from "@/data/photos";

const CATEGORIES = ["kuechen", "treppen", "schraenke", "tische", "betten", "tueren"] as const;

/**
 * Referenzprojekte aus der Region.
 *
 * Wichtig: KEINE Stadt-Zuordnung. Bilder werden generisch beschriftet
 * („Maßküche", „Treppe in Eiche", etc.) — wir suggerieren NICHT, dass
 * Alignum konkret in der Stadt X ein Projekt gebaut hat.
 */
const LABELS: Record<string, string> = {
  kuechen: "Maßküche in Eiche",
  treppen: "Freitragende Holztreppe",
  schraenke: "Einbauschrank nach Maß",
  tische: "Massivholz-Esstisch",
  betten: "Massivholzbett mit Kopfteil",
  tueren: "Pivot-Haustür",
};

export function ReferenceProjects() {
  const photos = CATEGORIES.flatMap((cat) => {
    const list = PHOTOS[cat] ?? [];
    return list.slice(0, 1).map((src) => ({ src, cat }));
  });

  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-prose">
        <Reveal className="max-w-3xl mb-12">
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">
            Aus unserer Werkstatt
          </p>
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.1] tracking-tight">
            Realisierte Projekte aus{" "}
            <span className="italic text-muted-foreground">der Region.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Ein Querschnitt aus Schreiner­arbeiten, die wir für Kunden im
            Rhein-Neckar-Raum gefertigt haben. Jedes Stück ist ein Unikat – auf
            Ihre Räume und Ihren Alltag zugeschnitten.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {photos.map((p, i) => (
            <motion.figure
              key={`${p.cat}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.19, 1, 0.22, 1] }}
              className="group relative overflow-hidden rounded-xl border border-border bg-card aspect-[4/5]"
            >
              <Image
                src={p.src}
                alt={`${LABELS[p.cat]} – gefertigt in unserer Werkstatt`}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/15 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-background">
                <p className="text-xs uppercase tracking-widest text-primary mb-1">
                  Referenz
                </p>
                <p className="font-display text-lg sm:text-xl">{LABELS[p.cat]}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
