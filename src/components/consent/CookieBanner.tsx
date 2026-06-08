"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useConsent } from "./ConsentContext";

/**
 * DSGVO-Cookie-Banner — Opt-In nach BGH/EuGH-Standard.
 * Verschwindet sobald eine Entscheidung getroffen wurde (oder über
 * den Footer wieder geöffnet wird).
 */
export function CookieBanner() {
  const { consent, hydrated, setConsent, openSettings } = useConsent();

  // Wenn noch nicht hydriert oder bereits Entscheidung getroffen → kein Banner
  if (!hydrated || consent !== null) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-desc"
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
        className="fixed bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md z-50 rounded-2xl border border-border bg-card shadow-[var(--shadow-elev)] grain-overlay overflow-hidden"
      >
        <div className="relative p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Cookie className="size-4" />
            </span>
            <h2 id="cookie-banner-title" className="font-display text-lg">
              Cookies &amp; Datenschutz
            </h2>
          </div>

          <p id="cookie-banner-desc" className="text-sm text-muted-foreground leading-relaxed mb-4">
            Wir nutzen <strong className="text-foreground">Google Analytics</strong>, um anonym
            zu messen, was funktioniert. Notwendige Cookies laufen immer.
            Analyse-Cookies entscheiden Sie selbst – und können Ihre Wahl
            jederzeit widerrufen.{" "}
            <Link
              href="/datenschutzerklaerung/"
              className="text-primary underline-grain"
            >
              Mehr in der Datenschutzerklärung
            </Link>
            .
          </p>

          <div className="space-y-2.5">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => setConsent(true)}
              className="w-full"
            >
              Alle akzeptieren
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setConsent(false)}
                className="w-full"
              >
                Ablehnen
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={openSettings}
                className="w-full"
              >
                <SettingsIcon className="size-3.5" /> Einstellungen
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
