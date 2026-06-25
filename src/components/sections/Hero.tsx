"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Star, Hammer, Trees } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MaskWords } from "@/components/ui/Reveal";
import { REVIEW_SUMMARY } from "@/data/reviews";

export function Hero() {
  const heroSrc = "/images/hero/hero-shoji-ez12.jpg";
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.4]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] w-full overflow-hidden grid lg:grid-cols-12"
    >
      {/* ──────────── Durchgängiges Shoji-Bild als Vollflächen-Hintergrund ──────────── */}
      <motion.div aria-hidden style={{ y: yImg }} className="absolute inset-0 -z-20">
        <Image
          src={heroSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Lesbarkeits-Overlay — Mobile: voller Scrim · Desktop: solider Charcoal-Bereich
          hinter dem Text (≈5/12), der erst nach rechts ins durchlaufende Bild ausläuft.
          Inline-Gradient (statt Tailwind-Stops), damit die soliden Stopps zuverlässig greifen. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-surface-charcoal/85 lg:hidden"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden lg:block"
        style={{
          background:
            "linear-gradient(to right, hsl(var(--surface-charcoal) / 0.85) 0%, hsl(var(--surface-charcoal) / 0.85) 45%, hsl(var(--surface-charcoal) / 0.5) 60%, transparent 78%)",
        }}
      />

      {/* Giant decorative letter */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[10vw] -left-[2vw] select-none font-display text-[clamp(20rem,40vw,52rem)] leading-[0.85] text-white/[0.05] tracking-tighter"
      >
        A
      </div>

      {/* Subtle gold accent line */}
      <motion.div
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
        className="absolute top-32 left-6 sm:left-10 lg:left-12 xl:left-14 h-px w-24 bg-gradient-to-r from-primary to-primary/0 origin-left z-10"
      />

      {/* ──────────── LEFT: Statement panel (Text über dem durchlaufenden Bild) ──────────── */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 lg:col-span-5 text-surface-charcoal-foreground flex flex-col justify-center px-6 sm:px-10 lg:px-12 xl:px-14 pt-32 pb-20 lg:pt-28 lg:pb-32 min-h-[70svh] lg:min-h-[100svh]"
      >
        <div className="max-w-xl">
          <Badge
            variant="outline"
            className="self-start mb-7 border-white/20 bg-white/5 text-white/85 backdrop-blur-sm"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            Schreinerei seit 1992 · Edingen-Neckarhausen
          </Badge>

          <h1 className="font-display text-[clamp(2.25rem,3.6vw,4.25rem)] leading-[0.95] tracking-tight">
            <MaskWords text="Schreiner aus" />
            <br />
            <motion.span
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="text-primary inline-block italic"
            >
              Leidenschaft.
            </motion.span>
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
              icon={<Trees className="size-4 text-primary" />}
              value="12"
              label="Heimische Hölzer"
            />
          </motion.div>
        </div>
      </motion.div>

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
