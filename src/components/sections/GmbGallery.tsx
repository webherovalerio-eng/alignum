"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { PHOTOS } from "@/data/photos";
import { Camera } from "lucide-react";

const SPANS = [
  "col-span-12 sm:col-span-6 row-span-2",
  "col-span-6 sm:col-span-3",
  "col-span-6 sm:col-span-3",
  "col-span-6 sm:col-span-3",
  "col-span-6 sm:col-span-3",
  "col-span-12 sm:col-span-4",
  "col-span-6 sm:col-span-4",
  "col-span-6 sm:col-span-4",
  "col-span-12 sm:col-span-6 row-span-2",
  "col-span-6 sm:col-span-3",
  "col-span-6 sm:col-span-3",
  "col-span-6 sm:col-span-3",
  "col-span-6 sm:col-span-3",
];

/**
 * Werkstatt-Galerie — kuratierte Möbelbilder aus allen Kategorien.
 * Diversifiziert Hero-Photos quer durch Küchen, Treppen, Türen, Schränke etc.
 */
function getCuratedPhotos(limit: number): { src: string; cat: string }[] {
  const order = ["kuechen", "treppen", "schraenke", "tische", "betten", "tueren", "shoji", "regale", "badmoebel", "bueromoebel", "kunstvolles"];
  const out: { src: string; cat: string }[] = [];
  let i = 0;
  while (out.length < limit) {
    const cat = order[i % order.length];
    const idx = Math.floor(i / order.length);
    const list = PHOTOS[cat] ?? [];
    if (list[idx]) out.push({ src: list[idx], cat });
    i++;
    if (i > limit * order.length) break;
  }
  return out;
}

export function GmbGallery({ limit = 13 }: { limit?: number }) {
  const photos = getCuratedPhotos(limit);

  const labels: Record<string, string> = {
    kuechen: "Küche",
    treppen: "Treppe",
    schraenke: "Schrank",
    tische: "Tisch",
    betten: "Bett",
    tueren: "Tür",
    shoji: "Shoji",
    regale: "Regal",
    badmoebel: "Bad",
    bueromoebel: "Büro",
    kunstvolles: "Kunst",
  };

  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-prose">
        <Reveal className="max-w-3xl mb-12">
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4 inline-flex items-center gap-2">
            <Camera className="size-3.5" />
            Aus unserer Werkstatt
          </p>
          <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-tight">
            Möbel, die unser Holz <span className="italic text-muted-foreground">verlassen.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Ein Querschnitt aus Projekten der letzten Jahre – jedes Stück ist
            individuell für seinen Auftraggeber gefertigt.
          </p>
        </Reveal>

        <div className="grid grid-cols-12 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px]">
          {photos.map((p, i) => {
            const span = SPANS[i % SPANS.length];
            return (
              <motion.figure
                key={`${p.src}-${i}`}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.85, delay: (i % 6) * 0.05, ease: [0.19, 1, 0.22, 1] }}
                className={`relative overflow-hidden rounded-xl border border-border bg-card group ${span}`}
              >
                <Image
                  src={p.src}
                  alt={`${labels[p.cat] ?? "Projekt"} aus der Werkstatt Alignum`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute top-3 left-3 inline-block px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-[10px] uppercase tracking-wider text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {labels[p.cat] ?? "Möbel"}
                </span>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
