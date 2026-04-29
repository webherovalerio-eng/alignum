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
    <section className="relative py-24 sm:py-32 overflow-hidden">
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
          {/* Tab list with wood swatches */}
          <div className="lg:col-span-5">
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {MATERIALS.map((mat, i) => (
                <li key={mat.slug}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className={cn(
                      "group relative w-full text-left rounded-xl overflow-hidden",
                      "transition-all border",
                      i === active
                        ? "border-primary shadow-[var(--shadow-glow)] scale-[1.02]"
                        : "border-border hover:border-primary/40",
                    )}
                    aria-pressed={i === active}
                  >
                    <div className="relative aspect-[16/10] w-full">
                      <Image
                        src={mat.image}
                        alt={`${mat.name} Holzmaserung`}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                      <div
                        className={cn(
                          "absolute inset-0 transition-opacity",
                          i === active ? "bg-foreground/10" : "bg-foreground/30 group-hover:bg-foreground/15",
                        )}
                      />
                    </div>
                    <div className="px-3 py-2.5 bg-card">
                      <p className="font-display text-sm leading-tight">{mat.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                        {mat.hardness === "hart" ? "Hartholz" : mat.hardness === "mittel" ? "Mittel" : "Weich"}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Detail */}
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
                {/* Wood macro hero */}
                <div className="relative aspect-[5/3] w-full">
                  <Image
                    src={m.image}
                    alt={`${m.name} – Holzmaserung im Detail`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                  <span className="absolute top-4 left-4 inline-block px-3 py-1 rounded-full bg-background/90 backdrop-blur text-xs uppercase tracking-wider text-foreground">
                    {m.hardness === "hart" ? "Hartholz" : m.hardness === "mittel" ? "Mittelhart" : "Weichholz"}
                  </span>
                </div>

                <div className="p-8 sm:p-10">
                  <h3 className="font-display text-4xl sm:text-5xl tracking-tight mb-4">{m.name}</h3>
                  <p className="text-lg text-foreground/85 leading-relaxed mb-8 max-w-prose">
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
