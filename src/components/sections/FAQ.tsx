"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";

export type FaqItem = { q: string; a: string };

export function FAQ({ items, title = "Häufige Fragen" }: { items: FaqItem[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <section className="relative py-24 border-t border-border">
      <div className="container-tight">
        <Reveal className="mb-10">
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">
            FAQ
          </p>
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.1] tracking-tight">
            {title}
          </h2>
        </Reveal>

        <div className="divide-y divide-border border-y border-border">
          {items.map((it, i) => {
            const expanded = open === i;
            return (
              <div key={it.q}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left hover:text-primary transition-colors"
                >
                  <span className="font-medium text-base sm:text-lg">{it.q}</span>
                  <span className="shrink-0 inline-flex size-9 items-center justify-center rounded-full border border-border">
                    {expanded ? <Minus className="size-4" /> : <Plus className="size-4" />}
                  </span>
                </button>
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-12 text-muted-foreground leading-relaxed">{it.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
      <JsonLd id={`ld-faq-${title}`} data={ld} />
    </section>
  );
}
