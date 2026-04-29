"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MaskWords } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";
import { type Service } from "@/data/services";
import { REVIEW_SUMMARY } from "@/data/reviews";

export function ServiceHero({ service, photo }: { service: Service; photo?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.1]);

  return (
    <section ref={ref} className="relative min-h-[88svh] w-full overflow-hidden grain-overlay">
      <motion.div style={{ y, scale }} className="absolute inset-0 -z-10">
        {photo && (
          <Image src={photo} alt="" fill priority sizes="100vw" className="object-cover" />
        )}
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 scrim-readable" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 scrim-bottom" />

      <div className="relative z-10 container-prose pt-36 pb-16 min-h-[88svh] flex flex-col justify-end text-white">
        <Badge
          variant="outline"
          className="self-start mb-5 border-white/30 bg-black/30 text-white backdrop-blur-sm"
        >
          <span className="size-1.5 rounded-full bg-primary" />
          {service.short}
        </Badge>

        <h1 className="font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.95] tracking-tight max-w-[14ch] text-shadow-hero">
          <MaskWords text={service.name} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="mt-6 max-w-[58ch] text-lg sm:text-xl text-white/90 leading-relaxed text-shadow-lg"
        >
          {service.intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.0, ease: [0.19, 1, 0.22, 1] }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <LinkButton href={`/anfrage/?service=${service.slug}`} size="lg" variant="primary">
            {service.name} anfragen <ArrowRight className="size-4" />
          </LinkButton>
          <div className="flex items-center gap-2 text-sm text-white/85 text-shadow-lg">
            <Stars rating={5} />
            <span>
              <strong className="font-medium text-white">{REVIEW_SUMMARY.averageRating.toFixed(1)}</strong> /{" "}
              {REVIEW_SUMMARY.count}+ Google-Bewertungen
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
