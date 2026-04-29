"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { PROCESS_STEPS } from "@/data/process";

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const fillHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <section className="relative py-24 sm:py-32 bg-card/40 grain-overlay">
      <div className="container-prose">
        <Reveal className="max-w-3xl mb-20">
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">
            Wie wir arbeiten
          </p>
          <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-tight">
            Sechs Schritte vom <br />
            <span className="italic text-muted-foreground">ersten Strich</span> zum fertigen Möbel.
          </h2>
        </Reveal>

        <div ref={ref} className="relative grid gap-12 md:grid-cols-2 lg:gap-x-20 lg:gap-y-16">
          {/* Vertical line */}
          <div
            aria-hidden
            className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-border"
          />
          <motion.div
            aria-hidden
            style={{ height: fillHeight }}
            className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 w-px bg-gradient-to-b from-primary via-primary to-primary/30"
          />

          {PROCESS_STEPS.map((step, i) => {
            const right = i % 2 === 1;
            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
                className={right ? "md:col-start-2" : "md:col-start-1"}
              >
                <div className="relative rounded-xl border border-border bg-background p-7 shadow-[var(--shadow-soft)]">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="font-display text-4xl text-primary">{step.n}</span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <h3 className="font-display text-xl mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
