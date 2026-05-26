"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SERVICES, SERVICE_HUB } from "@/data/services";
import { PHOTOS } from "@/data/photos";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

export function ServicesGrid({ heading = true }: { heading?: boolean }) {
  return (
    <section className="relative py-24 sm:py-32 grain-overlay">
      <div className="container-prose">
        {heading && (
          <Reveal className="max-w-3xl mb-16">
            <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">
              Unser Handwerk
            </p>
            <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-tight">
              Zwölf Disziplinen.
              <br />
              <span className="italic text-muted-foreground">Eine Werkstatt.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Von der Massivholzküche bis zum Shoji-Raumteiler – jedes
              Möbelstück verlässt unsere Werkstatt nur, wenn wir es selbst
              kaufen würden.
            </p>
          </Reveal>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {SERVICES.map((s, i) => {
            const photos = PHOTOS[s.imageCategory] ?? [];
            const cover = photos[0];
            return (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: (i % 6) * 0.05 }}
              >
                <Link
                  href={`/${SERVICE_HUB}/${s.slug}/`}
                  className={cn(
                    "group relative block overflow-hidden rounded-xl border border-border bg-card",
                    "aspect-[4/5] sm:aspect-[3/4]",
                    "transition-shadow duration-500 hover:shadow-[var(--shadow-elev)]",
                  )}
                >
                  {cover ? (
                    <Image
                      src={cover}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-muted via-card to-muted" />
                  )}

                  {/* Permanenter Bottom-Scrim für Lesbarkeit der Card-Caption */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                  {/* Top-right number badge */}
                  <span className="absolute top-4 right-4 inline-flex items-center justify-center size-9 rounded-full bg-background/15 backdrop-blur-md border border-white/20 text-[10px] font-medium tracking-wider text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Caption — feste Mindesthöhe, Inhalt unten verankert */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white min-h-[150px] sm:min-h-[170px] flex flex-col justify-end">
                    <div className="flex items-end justify-between gap-3 mb-2">
                      <h3 className="font-display text-2xl sm:text-3xl tracking-tight leading-[1.1] line-clamp-2">
                        {s.name}
                      </h3>
                      <span className="shrink-0 inline-flex size-9 items-center justify-center rounded-full border border-white/40 bg-white/5 backdrop-blur-md transition-all duration-500 group-hover:bg-primary group-hover:border-primary group-hover:-translate-y-1">
                        <ArrowUpRight className="size-4 text-white transition-transform group-hover:rotate-0" />
                      </span>
                    </div>
                    <p className="text-sm text-white/80 leading-snug min-h-[2.5em] line-clamp-2">
                      {s.short}
                    </p>
                    {/* Fine gold rule above caption */}
                    <span
                      aria-hidden
                      className="absolute top-0 inset-x-5 sm:inset-x-6 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
