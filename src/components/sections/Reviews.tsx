"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";
import { REVIEWS, REVIEW_SUMMARY } from "@/data/reviews";

export function Reviews() {
  // Duplicate for marquee illusion
  const marquee = [...REVIEWS, ...REVIEWS];

  return (
    <section id="bewertungen" className="relative py-24 sm:py-32 overflow-hidden bg-card/30 grain-overlay">
      <div className="container-prose">
        <Reveal className="max-w-3xl mb-16">
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">
            Was Kunden sagen
          </p>
          <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-tight">
            <span className="text-gradient-gold">{REVIEW_SUMMARY.averageRating.toFixed(1)}</span> von 5
            <span className="block text-muted-foreground italic">auf Google.</span>
          </h2>
          <div className="mt-6 flex items-center gap-3">
            <Stars rating={5} />
            <p className="text-muted-foreground">
              {REVIEW_SUMMARY.count}+ verifizierte Bewertungen aus dem Rhein-Neckar-Raum.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Marquee row 1 */}
      <div className="relative w-full overflow-hidden mask-fade">
        <div className="flex animate-marquee gap-5 w-max py-2">
          {marquee.map((r, i) => (
            <motion.figure
              key={`${r.author}-${i}`}
              className="w-[360px] sm:w-[420px] shrink-0 rounded-xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]"
            >
              <Quote className="size-5 text-primary mb-3" />
              <Stars rating={r.rating} className="mb-3" />
              <blockquote className="text-sm leading-relaxed text-foreground/90 mb-4 line-clamp-6">
                {r.text}
              </blockquote>
              <figcaption className="flex items-center justify-between text-xs">
                <span className="font-medium">{r.author}</span>
                <span className="text-muted-foreground">
                  {new Date(r.date).toLocaleDateString("de-DE", {
                    year: "numeric",
                    month: "short",
                  })}
                  {" · Google"}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
