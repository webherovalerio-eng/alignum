"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Star } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MaskWords } from "@/components/ui/Reveal";
import { REVIEW_SUMMARY } from "@/data/reviews";
import { HERO_PHOTOS } from "@/data/photos";

export function Hero() {
  const heroSrc = HERO_PHOTOS[0] ?? "/images/hero/hero-01.jpg";
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 200]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  return (
    <section ref={ref} className="relative min-h-[100svh] w-full overflow-hidden grain-overlay">
      {/* Background photo */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src={heroSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/20 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </motion.div>

      {/* Decorative giant brand letter */}
      <div aria-hidden className="pointer-events-none absolute -bottom-[8vw] -right-[2vw] z-10 select-none">
        <span className="font-display text-[clamp(12rem,28vw,40rem)] leading-[0.85] text-foreground/[0.05] tracking-tighter">
          A
        </span>
      </div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-20 container-prose pt-40 pb-20 min-h-[100svh] flex flex-col justify-center">
        <Badge variant="outline" className="self-start mb-6">
          <span className="size-1.5 rounded-full bg-primary" />
          Schreinerei seit 1992 · Mannheim
        </Badge>

        <h1 className="font-display text-[clamp(2.75rem,8.5vw,8.5rem)] leading-[0.92] tracking-tight max-w-[16ch]">
          <MaskWords text="Schreiner aus" />
          <br />
          <span className="text-gradient-gold">
            <MaskWords text="Leidenschaft." />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: [0.19, 1, 0.22, 1] }}
          className="mt-8 max-w-[58ch] text-lg sm:text-xl text-muted-foreground leading-relaxed"
        >
          Maßgefertigte Möbel aus Massivholz – Küchen, Treppen, Türen, Shoji
          und mehr. Eine Schreinerei in Mannheim, die noch zeichnet, bevor sie sägt.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <LinkButton href="/anfrage/" size="lg" variant="primary">
            Anfrage starten <ArrowRight className="size-4" />
          </LinkButton>
          <LinkButton href="/schreinerei-in-meiner-naehe/" size="lg" variant="outline">
            Leistungen entdecken
          </LinkButton>
        </motion.div>

        {/* Social proof — angedeutet, above the fold */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-14 flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <span className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 text-primary fill-current" />
              ))}
            </span>
            <span className="font-medium text-foreground">{REVIEW_SUMMARY.averageRating.toFixed(1)}</span>
            <span>·</span>
            <Link href="#bewertungen" className="underline-grain">
              {REVIEW_SUMMARY.count}+ Google-Bewertungen
            </Link>
          </div>
          <span className="hidden sm:inline">·</span>
          <span>30+ Jahre Handwerk</span>
          <span className="hidden sm:inline">·</span>
          <span>Eigene Werkstatt im Rhein-Neckar-Raum</span>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 1.5, delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs text-muted-foreground tracking-wider uppercase"
        >
          <span>Scroll</span>
          <div className="h-12 w-px bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
