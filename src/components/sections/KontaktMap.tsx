"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { SITE } from "@/data/site";

/**
 * Google-Maps-Einbettung auf der Kontaktseite — DSGVO-konforme
 * „Zwei-Klick-Lösung": Es wird KEIN Google-Inhalt geladen, bis die Nutzerin
 * aktiv auf „Karte laden" klickt. Erst dann wird der Embed-iframe gerendert.
 * So passt die Karte zum Opt-In-Standard von Alignum (Google erst nach
 * bewusster Einwilligung).
 */

const MAPS_QUERY = `ALIGNUM Möbelbau, ${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}`;
const EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&z=16&output=embed`;

export function KontaktMap() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-muted aspect-[16/10] sm:aspect-[21/9]">
      {loaded ? (
        <iframe
          title="Standort der Alignum Werkstatt auf Google Maps"
          src={EMBED_SRC}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center grain-overlay transition-colors hover:bg-card"
          aria-label="Google-Karte laden"
        >
          <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <MapPin className="size-6" />
          </span>
          <span>
            <span className="block font-display text-xl sm:text-2xl">
              {SITE.address.street}
            </span>
            <span className="block text-muted-foreground">
              {SITE.address.zip} {SITE.address.city}
            </span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium transition-colors group-hover:border-primary group-hover:text-primary">
            Karte laden
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="max-w-md text-xs leading-relaxed text-muted-foreground">
            Mit dem Laden der Karte akzeptieren Sie die{" "}
            <Link
              href="/datenschutzerklaerung/"
              className="underline underline-offset-2 hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              Datenschutzerklärung
            </Link>{" "}
            von Google. Es werden Daten an Google übertragen.
          </span>
        </button>
      )}
    </div>
  );
}
