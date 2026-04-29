"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { type Service } from "@/data/services";

export function ServiceContent({
  service,
  photos,
}: {
  service: Service;
  photos: string[];
}) {
  const cover = photos[0];
  const gallery = photos.slice(1, 7);

  return (
    <>
      {/* Suchintention sofort befriedigen — innerhalb der ersten 30% */}
      <section className="relative py-16 sm:py-24">
        <div className="container-prose grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <Reveal className="lg:col-span-7 space-y-6">
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.1] tracking-tight">
              Was Sie von unserem {service.name}-Handwerk erwarten können
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {service.description}
            </p>
            <ul className="space-y-3 mt-2">
              {service.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                    <Check className="size-3" />
                  </span>
                  <span className="text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {cover && (
            <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-elev)]">
                <Image
                  src={cover}
                  alt={`${service.name} – Beispielprojekt aus der Werkstatt Alignum`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Bento gallery */}
      {gallery.length > 0 && (
        <section className="relative py-16 sm:py-24">
          <div className="container-prose">
            <Reveal className="mb-10 max-w-2xl">
              <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">
                Werkstatt-Auswahl
              </p>
              <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.1] tracking-tight">
                Ein Blick in unsere {service.name}-Projekte
              </h2>
            </Reveal>

            <div className="grid grid-cols-12 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[240px]">
              {gallery.map((src, i) => {
                const span = pickSpan(i);
                return (
                  <motion.div
                    key={src}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.9, delay: i * 0.06, ease: [0.19, 1, 0.22, 1] }}
                    className={`relative overflow-hidden rounded-xl border border-border bg-card group ${span}`}
                  >
                    <Image
                      src={src}
                      alt={`${service.name} Projekt ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function pickSpan(i: number) {
  // Asymmetric bento: 6/3/3, 4/4/4, etc.
  const patterns = [
    "col-span-12 sm:col-span-6 row-span-2",
    "col-span-6 sm:col-span-3",
    "col-span-6 sm:col-span-3",
    "col-span-6 sm:col-span-4",
    "col-span-6 sm:col-span-4",
    "col-span-12 sm:col-span-4",
  ];
  return patterns[i % patterns.length];
}
