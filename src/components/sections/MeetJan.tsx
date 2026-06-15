"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Hand } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/data/site";
import { type City } from "@/data/cities";

/**
 * „Hi, ich bin Jan." — persönliche Vorstellung des Inhabers auf der City-Page.
 * Macht das „eine Werkstatt, ein Schreinermeister"-Modell sofort menschlich.
 */
export function MeetJan({ city }: { city?: City }) {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="container-prose grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Portrait left */}
        <Reveal className="lg:col-span-5">
          <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-elev)]">
            <Image
              src={SITE.owner.image}
              alt={`${SITE.owner.fullName} – ${SITE.owner.role} bei Alignum`}
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover"
            />
            {/* Signature sticker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
              className="absolute top-5 right-5 inline-flex items-center gap-2 rounded-full bg-background/95 backdrop-blur px-4 py-2 shadow-[var(--shadow-soft)] border border-border"
            >
              <Hand className="size-4 text-primary" />
              <span className="text-xs font-medium tracking-wider uppercase">
                Schreiner­meister
              </span>
            </motion.div>
          </div>
        </Reveal>

        {/* Text right */}
        <Reveal className="lg:col-span-7 space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
            Der Schreiner hinter Alignum
          </p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.05] tracking-tight">
            Hi, ich bin <span className="text-primary italic">{SITE.owner.name}.</span>
          </h2>
          <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed max-w-2xl">
            Tischlermeister, Inhaber von Alignum
            {city ? (
              <>
                {" "}– und derjenige, der für Ihr Projekt nach{" "}
                <strong className="text-foreground">{city.name}</strong> kommt.
              </>
            ) : (
              " – und derjenige, der bei Ihnen am Esstisch sitzt."
            )}
          </p>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Ich bringe das Aufmaß mit, eine Skizze auf Papier und Jahrzehnte
            Werkstatt-Erfahrung im Kopf. Kein Verkäufer, kein
            Zwischenhändler – Sie sprechen direkt mit dem Menschen, der Ihr
            Möbel später baut.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <LinkButton
              href={city ? `/anfrage/?city=${city.slug}` : "/anfrage/"}
              size="lg"
              variant="primary"
            >
              {city ? `Termin in ${city.name} vereinbaren` : "Termin vereinbaren"}
              <ArrowRight className="size-4" />
            </LinkButton>
            <a
              href={`mailto:${SITE.email}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-grain"
            >
              Oder direkt schreiben: {SITE.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
