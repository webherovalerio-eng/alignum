"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

/**
 * DSGVO-konformer Consent-Context für Alignum.
 *
 * Speichert Nutzerentscheidung in LocalStorage (kein Cookie, damit nicht
 * ein „Consent-Cookie braucht Consent"-Paradox entsteht).
 *
 * State:
 * - null  → noch keine Entscheidung getroffen → Banner zeigen
 * - { analytics: bool, timestamp } → Entscheidung gespeichert
 */

export type ConsentState = {
  analytics: boolean;
  timestamp: number;
} | null;

type ConsentContextValue = {
  consent: ConsentState;
  hydrated: boolean;
  setConsent: (analytics: boolean) => void;
  revoke: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  isSettingsOpen: boolean;
};

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

const STORAGE_KEY = "alignum-consent";

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<ConsentState>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initial-Laden aus LocalStorage NACH Hydration (SSR-safe)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ConsentState;
        if (parsed && typeof parsed.analytics === "boolean") {
          setConsentState(parsed);
        }
      }
    } catch {
      // ignore — LocalStorage nicht verfügbar oder corrupt
    }
    setHydrated(true);
  }, []);

  const setConsent = useCallback((analytics: boolean) => {
    const next: ConsentState = { analytics, timestamp: Date.now() };
    setConsentState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const revoke = useCallback(() => {
    setConsentState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <ConsentContext.Provider
      value={{
        consent,
        hydrated,
        setConsent,
        revoke,
        openSettings: () => setIsSettingsOpen(true),
        closeSettings: () => setIsSettingsOpen(false),
        isSettingsOpen,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return ctx;
}
