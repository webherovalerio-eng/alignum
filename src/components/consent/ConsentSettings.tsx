"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart3, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useConsent } from "./ConsentContext";
import { cn } from "@/lib/cn";

/**
 * Modal für granulare Cookie-/Tracking-Einstellungen.
 *
 * Wird über:
 * - Cookie-Banner-Button „Einstellungen"
 * - Footer-Link „Cookie-Einstellungen"
 * - Datenschutzerklärung „Widerruf"-Button
 * geöffnet. Erlaubt nachträgliche Änderung des Consent-Status.
 */
export function ConsentSettings() {
  const { consent, setConsent, isSettingsOpen, closeSettings } = useConsent();
  const [analytics, setAnalytics] = useState(false);

  // Beim Öffnen aktuellen Stand laden
  useEffect(() => {
    if (isSettingsOpen) {
      setAnalytics(consent?.analytics ?? false);
    }
  }, [isSettingsOpen, consent]);

  // ESC schließt Modal
  useEffect(() => {
    if (!isSettingsOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeSettings();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSettingsOpen, closeSettings]);

  // Scroll-Lock während Modal offen
  useEffect(() => {
    if (!isSettingsOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isSettingsOpen]);

  function saveSelection() {
    setConsent(analytics);
    closeSettings();
  }

  function acceptAll() {
    setConsent(true);
    closeSettings();
  }

  function rejectAll() {
    setConsent(false);
    closeSettings();
  }

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-settings-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={closeSettings}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-[var(--shadow-elev)] grain-overlay"
          >
            <button
              type="button"
              onClick={closeSettings}
              aria-label="Schließen"
              className="absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur hover:border-primary/40 transition-colors"
            >
              <X className="size-4" />
            </button>

            <div className="p-6 sm:p-8">
              <h2
                id="consent-settings-title"
                className="font-display text-2xl sm:text-3xl mb-2"
              >
                Datenschutz-Einstellungen
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md">
                Wählen Sie selbst, welche Dienste wir auf alignum.de verwenden
                dürfen. Sie können Ihre Auswahl jederzeit widerrufen oder
                ändern.
              </p>

              <div className="space-y-3">
                {/* Necessary — immer aktiv, disabled */}
                <div className="rounded-xl border border-border bg-background p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <ShieldCheck className="size-4" />
                      </span>
                      <div>
                        <p className="font-medium">Notwendig</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Für den Betrieb der Website unverzichtbar (z.B.
                          Speicherung Ihrer Cookie-Wahl). Kein Tracking, keine
                          Weitergabe.
                        </p>
                      </div>
                    </div>
                    <ToggleSwitch checked={true} disabled />
                  </div>
                </div>

                {/* Analytics — Opt-In Toggle */}
                <div className="rounded-xl border border-border bg-background p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <BarChart3 className="size-4" />
                      </span>
                      <div>
                        <p className="font-medium">Google Analytics 4</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Anonyme Messung des Besucherverhaltens zur
                          Verbesserung unserer Website. IP-Adresse wird vor
                          Verarbeitung gekürzt. Daten werden bei Google
                          Ireland Ltd. (mit Übermittlung an USA über
                          Standardvertragsklauseln) verarbeitet.
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mt-2">
                          Speicherdauer · max. 14 Monate
                        </p>
                      </div>
                    </div>
                    <ToggleSwitch
                      checked={analytics}
                      onChange={() => setAnalytics((s) => !s)}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={rejectAll}
                  className="sm:flex-1"
                >
                  Alle ablehnen
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={saveSelection}
                  className="sm:flex-1"
                >
                  Auswahl speichern
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={acceptAll}
                  className="sm:flex-1"
                >
                  Alle akzeptieren
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ToggleSwitch({
  checked,
  disabled = false,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        "shrink-0 inline-flex h-6 w-11 rounded-full transition-colors items-center px-0.5",
        checked ? "bg-primary" : "bg-muted",
        disabled && "opacity-60 cursor-not-allowed",
      )}
    >
      <span
        className={cn(
          "size-5 rounded-full bg-background shadow-sm transition-transform",
          checked ? "translate-x-[1.25rem]" : "translate-x-0",
        )}
      />
    </button>
  );
}
