"use client";

import { motion } from "framer-motion";
import { ClipboardList, Hammer, Truck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { type City } from "@/data/cities";
import { SITE } from "@/data/site";

/**
 * „Wir kommen zu Ihnen" — die 3-Schritt-Klärung, wie das Alignum-Modell
 * funktioniert: Werkstatt in Edingen-Neckarhausen, Aufmaß + Montage vor Ort.
 *
 * Diese Section ist Pflicht auf jeder City-Page (siehe alignum-city-pages Skill).
 */
export function WerkstattZuIhnen({ city }: { city: City }) {
  const steps = [
    {
      n: "01",
      Icon: ClipboardList,
      title: `Aufmaß in ${city.name}`,
      body: `Wir kommen kostenlos zu Ihnen nach ${city.name}, vermessen den Raum, besprechen Ideen und Material. Wolf Preussner persönlich – oder ein Mitglied seines Teams.`,
      tag: "Vor Ort",
    },
    {
      n: "02",
      Icon: Hammer,
      title: "Fertigung in unserer Werkstatt",
      body: `Gebaut wird in ${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}. Massivholz, traditionelles Schreiner­handwerk + 5-Achs-CNC.`,
      tag: SITE.address.city,
    },
    {
      n: "03",
      Icon: Truck,
      title: `Lieferung & Montage in ${city.name}`,
      body: `Eigenes Montage-Team, ca. ${city.distanceKm ?? "—"} km Anfahrt. Wir liefern, montieren, justieren – und nehmen den Schutt wieder mit.`,
      tag: `${city.distanceKm ?? "—"} km`,
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-card/40 border-y border-border grain-overlay">
      <div className="container-prose">
        <Reveal className="max-w-3xl mb-14">
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">
            Wie wir für {city.name} arbeiten
          </p>
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.1] tracking-tight">
            Eine Werkstatt.{" "}
            <span className="text-muted-foreground italic">Ihr Zuhause als Bühne.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Alignum sitzt in {SITE.address.city} und arbeitet für Kunden in
            {" "}{city.name} und der ganzen Rhein-Neckar-Region. So sieht der Weg
            vom ersten Anruf bis zum fertigen Möbel bei Ihnen aus:
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-5 relative">
          {/* Connector line */}
          <div
            aria-hidden
            className="hidden lg:block absolute left-[16%] right-[16%] top-[88px] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />

          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="relative rounded-2xl border border-border bg-background p-7 hover:border-primary/40 transition-colors duration-500 group"
            >
              <div className="flex items-start justify-between mb-5">
                <span className="inline-flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/30 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <s.Icon className="size-6" strokeWidth={1.5} />
                </span>
                <span className="font-display text-4xl text-foreground/[0.08] leading-none">
                  {s.n}
                </span>
              </div>

              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                {s.tag}
              </p>
              <h3 className="font-display text-xl sm:text-2xl tracking-tight mb-3">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </motion.div>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Liefergebiet umfasst Mannheim, Heidelberg, Ludwigshafen, Darmstadt
            und alle Städte der Rhein-Neckar-Region innerhalb ca. 60 km um{" "}
            {SITE.address.city}.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
