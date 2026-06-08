"use client";

import Script from "next/script";
import { useConsent } from "./ConsentContext";

/**
 * Google Analytics 4 — wird NUR geladen wenn der Nutzer
 * `consent.analytics === true` gesetzt hat (Opt-In).
 *
 * Mess-ID: G-K7T15QH6EP (Alignum)
 *
 * Konfiguration:
 * - anonymize_ip: true       → IP wird gekürzt vor Verarbeitung
 * - cookie_flags: SameSite   → Cookie-Sicherheit
 */

const GA_ID = "G-K7T15QH6EP";

export function GoogleAnalytics() {
  const { consent, hydrated } = useConsent();

  // SSR-safe: erst nach Hydration entscheiden
  if (!hydrated) return null;
  if (!consent?.analytics) return null;

  const initScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}', {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure'
    });
  `;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {initScript}
      </Script>
    </>
  );
}
