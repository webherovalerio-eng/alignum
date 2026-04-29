"use client";

import { motion } from "framer-motion";
import { Quote, MessageCircleReply } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";
import { REVIEWS, REVIEW_SUMMARY } from "@/data/reviews";
import { LinkButton } from "@/components/ui/Button";

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
            <span className="text-primary">{REVIEW_SUMMARY.averageRating.toFixed(1)}</span> von 5
            <span className="block text-muted-foreground italic">auf Google.</span>
          </h2>
          <div className="mt-6 flex items-center gap-3">
            <Stars rating={5} />
            <p className="text-muted-foreground">
              <strong className="text-foreground">{REVIEW_SUMMARY.count}+ verifizierte Bewertungen</strong> aus dem
              Rhein-Neckar-Raum.
            </p>
          </div>
          <div className="mt-6">
            <LinkButton
              href={REVIEW_SUMMARY.url}
              variant="outline"
              size="sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Alle Bewertungen auf Google ansehen →
            </LinkButton>
          </div>
        </Reveal>
      </div>

      {/* Marquee row */}
      <div className="relative w-full overflow-hidden mask-fade">
        <div className="flex animate-marquee gap-5 w-max py-2">
          {marquee.map((r, i) => (
            <motion.figure
              key={`${r.author}-${i}`}
              className="w-[380px] sm:w-[440px] shrink-0 rounded-xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]"
            >
              <Quote className="size-5 text-primary mb-3" />
              <Stars rating={r.rating} className="mb-3" />
              <blockquote className="text-sm leading-relaxed text-foreground/90 mb-4 line-clamp-5">
                {r.text}
              </blockquote>

              {r.ownerReply && (
                <div className="mt-3 mb-3 pl-3 border-l-2 border-primary/40 bg-primary/5 rounded-r-md p-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-primary mb-1">
                    <MessageCircleReply className="size-3" />
                    <span className="font-medium">Antwort von Alignum</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {r.ownerReply}
                  </p>
                </div>
              )}

              <figcaption className="flex items-center justify-between text-xs">
                <div className="flex flex-col">
                  <span className="font-medium">{r.author}</span>
                  {r.authorMeta && <span className="text-muted-foreground text-[10px]">{r.authorMeta}</span>}
                </div>
                <span className="text-muted-foreground">{r.date} · Google</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
