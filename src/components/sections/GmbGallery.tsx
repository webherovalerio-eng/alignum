"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { GMB_PHOTOS } from "@/data/reviews";
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

export function GmbGallery({ limit = 13 }: { limit?: number }) {
  const photos = GMB_PHOTOS.slice(0, limit);

  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-prose">
        <Reveal className="max-w-3xl mb-12">
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4 inline-flex items-center gap-2">
            <Camera className="size-3.5" />
            Echte Kundenfotos
          </p>
          <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-tight">
            Möbel im echten <span className="italic text-muted-foreground">Zuhause</span>.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Diese Bilder haben unsere Kunden selbst hochgeladen. Keine
            Studiofotos, keine Inszenierung – so sehen unsere Möbel aus, nachdem
            sie eingezogen sind.
          </p>
        </Reveal>

        <div className="grid grid-cols-12 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px]">
          {photos.map((p, i) => {
            const span = SPANS[i % SPANS.length];
            return (
              <motion.figure
                key={p.src}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.85, delay: (i % 6) * 0.05, ease: [0.19, 1, 0.22, 1] }}
                className={`relative overflow-hidden rounded-xl border border-border bg-card group ${span}`}
              >
                <Image
                  src={p.src}
                  alt={p.attribution ? `Kundenfoto von ${p.attribution}` : "Alignum Möbel beim Kunden"}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                />
                {p.attribution && (
                  <figcaption className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-foreground/80 to-transparent text-xs text-background">
                    Foto: {p.attribution}
                  </figcaption>
                )}
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
