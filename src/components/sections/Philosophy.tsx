"use client";

import { motion } from "framer-motion";
import { Heart, Compass, Award } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const PILLARS = [
  {
    Icon: Heart,
    eyebrow: "Säule eins",
    title: "Kundenorientiert",
    body:
      "Bedürfnisse nicht nur zu verstehen, sondern auch zu antizipieren. Individuelle Beratung, maßgeschneiderte Lösungen und ein offenes Ohr für Kundenwünsche sind die Eckpfeiler unserer Ausrichtung.",
    detail:
      "Wir streben danach, in jedem Projekt die Erwartungen unserer Kunden zu übertreffen und langfristige Beziehungen aufzubauen, die auf Vertrauen und gegenseitigem Respekt basieren.",
  },
  {
    Icon: Compass,
    eyebrow: "Säule zwei",
    title: "Gute Gestaltung",
    body:
      "Das beste Möbelstück hat kein langes Leben, wenn es seinen Besitzer:innen nicht mehr gefällt. Daher ist gute Gestaltung elementar – damit Freude an einem Objekt über Jahrzehnte trägt.",
    detail:
      "Es gibt objektive Kriterien, nach denen sich ein guter Entwurf richten muss. Mit unserer langjährigen Erfahrung und den ungezählten Möbeln, die hier geplant und gebaut wurden, kommen wir selten in Verlegenheit, wenn es um perfekte Lösungen geht.",
  },
  {
    Icon: Award,
    eyebrow: "Säule drei",
    title: "Qualität",
    body:
      "Qualität ist der Maßstab, an dem wir unseren Erfolg messen. Sie ist für uns eine Selbstverständlichkeit und zeigt sich in jedem Detail unserer Produkte – von der Materialauswahl bis zur handwerklich präzisen Verarbeitung.",
    detail:
      "Unser Engagement für Qualität ist unermüdlich. Wir streben stets danach, nicht nur die Erwartungen unserer Kunden zu erfüllen, sondern sie zu übertreffen.",
  },
];

export function Philosophy() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden border-y border-border bg-card/40 grain-overlay">
      {/* Decorative giant headline behind */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-12 select-none text-center font-display leading-[0.85] tracking-tighter text-foreground/[0.04] text-[clamp(8rem,18vw,18rem)]"
      >
        Philosophie
      </div>

      <div className="relative container-prose">
        <Reveal className="max-w-3xl mx-auto text-center mb-16 sm:mb-24">
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">
            Was uns trägt
          </p>
          <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-tight">
            Unternehmens­philosophie
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Bei Alignum gründet sich unsere Philosophie auf drei wesentliche
            Säulen: <span className="text-foreground">Kundenorientierung</span>,{" "}
            <span className="text-foreground">gute Gestaltung</span> und{" "}
            <span className="text-foreground">Qualität</span>. Diese Säulen
            prägen unser Ethos und leiten uns dabei, handwerkliche Objekte zu
            schaffen, die Generationen überdauern.
          </p>
        </Reveal>

        {/* Pillars */}
        <div className="relative grid lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Connector line through the icons */}
          <div
            aria-hidden
            className="hidden lg:block absolute left-[12%] right-[12%] top-[120px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          />

          {PILLARS.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.19, 1, 0.22, 1] }}
              className="group relative rounded-2xl border border-border bg-background overflow-hidden hover:border-primary/40 transition-colors duration-500"
            >
              {/* Number watermark */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-2 -right-2 select-none font-display text-[8rem] leading-none text-foreground/[0.04] tracking-tighter"
              >
                0{i + 1}
              </span>

              <div className="relative p-8 sm:p-10">
                {/* Icon */}
                <div className="relative mb-6">
                  <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/30 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                    <p.Icon className="size-7" strokeWidth={1.5} />
                  </span>
                  {/* gold glow on hover */}
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-2xl bg-primary opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-25"
                  />
                </div>

                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                  {p.eyebrow}
                </p>
                <h3 className="font-display text-3xl sm:text-4xl tracking-tight mb-5">
                  {p.title}
                </h3>

                <p className="text-base leading-relaxed text-foreground/85 mb-4">
                  {p.body}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground border-t border-border pt-4 mt-4">
                  {p.detail}
                </p>
              </div>

              {/* Bottom gold underline on hover */}
              <span
                aria-hidden
                className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"
              />
            </motion.article>
          ))}
        </div>

        {/* Closing statement */}
        <Reveal className="mt-20 max-w-3xl mx-auto text-center">
          <p className="font-display text-2xl sm:text-3xl leading-snug italic text-foreground/90">
            „Wir bauen Möbel, die nicht weggeworfen werden."
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            – Wolf Preussner, Tischlermeister & Inhaber
          </p>
        </Reveal>
      </div>
    </section>
  );
}
