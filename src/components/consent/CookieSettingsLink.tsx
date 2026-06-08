"use client";

import { useConsent } from "./ConsentContext";

/**
 * Footer-Link, der das Consent-Settings-Modal öffnet.
 * Erlaubt jederzeitigen Widerruf/Änderung der Einwilligung.
 */
export function CookieSettingsLink({
  className = "",
  label = "Cookie-Einstellungen",
}: {
  className?: string;
  label?: string;
}) {
  const { openSettings } = useConsent();
  return (
    <button
      type="button"
      onClick={openSettings}
      className={className}
    >
      {label}
    </button>
  );
}
