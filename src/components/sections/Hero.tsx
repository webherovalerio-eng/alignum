"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Star, Hammer, ShieldCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MaskWords } from "@/components/ui/Reveal";
import { REVIEW_SUMMARY } from "@/data/reviews";
import { HERO_PHOTOS } from "@/data/photos";

export function Hero() {
  const heroSrc = HERO_PHOTOS[1] ?? HERO_PHOTOS[0] ?? "/images/hero/hero-02.jpg";
  const accentSrc = HERO_PHOTOS[3] ?? HERO_PHOTOS[2] ?? "/images/hero/hero-04.jpg";
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 100]);
  const yAccent = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.4]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] w-full overflow-hidden grid lg:grid-cols-12"
    >
      {/* ──────────── LEFT: Statement panel ──────────── */}
      <motion.div
        style={{ opacity }}
        className="relative lg:col-span-7 bg-surface-deep text-surface-deep-foreground flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24 pt-32 pb-20 lg:pt-28 lg:pb-32 min-h-[70svh] lg:min-h-[100svh] grain-overlay"
      >
        {/* Giant decorative letter */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-[10vw] -left-[2vw] select-none font-display text-[clamp(20rem,40vw,52rem)] leading-[0.85] text-white/[0.04] tracking-tighter"
        >
          A
        </div>

        {/* Subtle gold accent line */}
        <motion.div
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="absolute top-32 left-6 sm:left-10 lg:left-16 xl:left-24 h-px w-24 bg-gradient-to-r from-primary to-primary/0 origin-left"
        />

        <div className="relative z-10 max-w-2xl">
          <Badge
            variant="outline"
            className="self-start mb-7 border-white/20 bg-white/5 text-white/85 backdrop-blur-sm"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            Schreinerei seit 1992 · Edingen-Neckarhausen
          </Badge>

          <h1 className="font-display text-[clamp(3rem,7vw,7.5rem)] leading-[0.92] tracking-tight">
            <MaskWords text="Schreiner aus" />
            <br />
            <span className="text-gradient-gold inline-block italic">
              <MaskWords text="Leidenschaft." />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: [0.19, 1, 0.22, 1] }}
            className="mt-8 max-w-[52ch] text-lg sm:text-xl text-white/75 leading-relaxed"
          >
            Maßgefertigte Möbel aus Massivholz – Küchen, Treppen, Türen, Shoji
            und mehr. Eine Schreinerei, die noch zeichnet, bevor sie sägt.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <LinkButton href="/anfrage/" size="lg" variant="primary">
              Anfrage starten <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton
              href="/schreinerei-in-meiner-naehe/"
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:border-white hover:bg-white/10"
            >
              Leistungen entdecken
            </LinkButton>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-14 grid grid-cols-3 gap-4 sm:gap-6 max-w-xl border-t border-white/10 pt-7"
          >
            <TrustItem
              icon={
                <span className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 text-primary fill-current" />
                  ))}
                </span>
              }
              value={REVIEW_SUMMARY.averageRating.toFixed(1)}
              label={`${REVIEW_SUMMARY.count}+ Google Reviews`}
            />
            <TrustItem
              icon={<Hammer className="size-4 text-primary" />}
              value="30+"
              label="Jahre Handwerk"
            />
            <TrustItem
              icon={<ShieldCheck className="size-4 text-primary" />}
              value="5"
              label="Jahre Garantie"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* ──────────── RIGHT: Hero photo column ──────────── */}
      <div className="relative lg:col-span-5 min-h-[60svh] lg:min-h-[100svh] overflow-hidden bg-card">
        <motion.div style={{ y: yImg }} className="absolute inset-0">
          <Image
            src={heroSrc}
            alt="Alignum Schreinerei – Werkstatt"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover"
          />
        </motion.div>

        {/* Vertical gold edge */}
        <div
          aria-hidden
          className="absolute left-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent"
        />

        {/* Floating accent card */}
        <motion.div
          style={{ y: yAccent }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1, ease: [0.19, 1, 0.22, 1] }}
          className="absolute bottom-8 left-8 right-8 lg:bottom-12 lg:left-auto lg:right-12 lg:w-72"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-[var(--shadow-elev)]">
            <div className="relative aspect-[4/3]">
              <Image
                src={accentSrc}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 280px"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <p className="text-xs uppercase tracking-widest text-primary mb-1">
                Aus der Werkstatt
              </p>
              <p className="text-sm font-medium">Mannheimer Str. 80</p>
              <p className="text-xs text-white/70">68535 Edingen-Neckarhausen</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile-only scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.5, delay: 2 }}
        className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-[140%] flex-col items-center gap-2 text-[10px] text-white/60 tracking-[0.3em] uppercase z-10"
      >
        <span>Scroll</span>
        <div className="h-10 w-px bg-gradient-to-b from-primary to-transparent" />
      </motion.div>

      <Link
        href="#bewertungen"
        aria-hidden
        tabIndex={-1}
        className="sr-only"
      >
        Bewertungen
      </Link>
    </section>
  );
}

function TrustItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-4 flex items-center">{icon}</div>
      <p className="font-display text-2xl text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-white/55 leading-tight">
        {label}
      </p>
    </div>
  );
}
