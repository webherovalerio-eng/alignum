"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MATERIALS } from "@/data/materials";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

export function Materials() {
  const [active, setActive] = useState(0);
  const m = MATERIALS[active];

  return (
    <section id="hoelzer" className="relative py-24 sm:py-32 overflow-hidden scroll-mt-28">
      <div className="container-prose">
        <Reveal className="max-w-3xl mb-16">
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">
            Holz, das wir lieben
          </p>
          <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-tight">
            Zwölf Hölzer.
            <br />
            <span className="italic text-muted-foreground">Zwölf Charaktere.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Wir kennen jeden Baum, aus dem wir arbeiten. Maserung, Härte,
            Geruch, Verhalten beim Trocknen. Wählen Sie ein Holz – und sehen
            Sie, was es kann.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Tab list (links) — Mobile: umbrechende Pills, Desktop: Liste */}
          <div className="lg:col-span-5">
            <ul className="flex flex-wrap lg:flex-col gap-2 lg:gap-1">
              {MATERIALS.map((mat, i) => (
                <li key={mat.slug}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className={cn(
                      "group relative text-left transition-all border",
                      "rounded-full px-4 py-2 lg:rounded-xl lg:w-full lg:px-5 lg:py-4",
                      i === active
                        ? "border-primary/60 bg-card shadow-[var(--shadow-soft)]"
                        : "border-border bg-card/40 hover:bg-muted/60 lg:border-transparent lg:bg-transparent",
                    )}
                    aria-pressed={i === active}
                  >
                    <div className="flex items-center gap-2.5 lg:gap-3">
                      <span
                        aria-hidden
                        className="size-2.5 lg:size-3 shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-background transition-all"
                        style={{
                          background: `hsl(${mat.color})`,
                          boxShadow: i === active ? `0 0 0 2px hsl(var(--primary))` : "none",
                        }}
                      />
                      <span className="font-display text-base lg:text-lg whitespace-nowrap">{mat.name}</span>
                      <span className="ml-auto hidden lg:inline text-[10px] uppercase tracking-wider text-muted-foreground">
                        {mat.hardness === "hart" ? "Hart" : mat.hardness === "mittel" ? "Mittel" : "Weich"}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "hidden lg:block text-xs mt-1 transition-colors",
                        i === active ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {mat.short}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Detail (rechts) – mit großem Holzbild */}
          <div className="lg:col-span-7 lg:sticky lg:top-28">
            <AnimatePresence mode="wait">
              <motion.article
                key={m.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-[var(--shadow-elev)]"
              >
                {/* Holz-Macro-Bild */}
                <div className="relative aspect-[5/3] w-full">
                  <Image
                    src={m.image}
                    alt={`${m.name} – Holzmaserung im Detail`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute top-4 left-4 inline-block px-3 py-1 rounded-full bg-background/90 backdrop-blur text-xs uppercase tracking-wider text-foreground">
                    {m.hardness === "hart" ? "Hartholz" : m.hardness === "mittel" ? "Mittelhart" : "Weichholz"}
                  </span>
                </div>

                <div className="p-6 sm:p-10">
                  <h3 className="font-display text-3xl sm:text-5xl tracking-tight mb-4">{m.name}</h3>
                  <p className="text-base sm:text-lg text-foreground/85 leading-relaxed mb-8 max-w-prose">
                    {m.description}
                  </p>
                  <div className="border-t border-border pt-6">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                      Typische Einsatzgebiete
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {m.uses.map((u) => (
                        <span
                          key={u}
                          className="px-3 py-1.5 rounded-full bg-muted text-sm"
                        >
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
