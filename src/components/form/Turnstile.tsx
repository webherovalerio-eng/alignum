"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

/**
 * Cloudflare-Turnstile-Widget (Bot-Schutz fürs Anfrageformular) — OPTIONAL.
 * Ohne `NEXT_PUBLIC_TURNSTILE_SITE_KEY` rendert die Komponente nichts und lädt
 * kein Fremd-Skript; das Formular verhält sich dann exakt wie bisher.
 * Serverseitig wird nur geprüft, wenn `TURNSTILE_SECRET_KEY` gesetzt ist.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

export function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ts = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
    if (!SITE_KEY || !ready || !ref.current || !ts) return;
    const id = ts.render(ref.current, {
      sitekey: SITE_KEY,
      callback: onToken,
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
    });
    return () => ts.remove(id);
  }, [ready, onToken]);

  if (!SITE_KEY) return null;
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div ref={ref} className="mt-6" />
    </>
  );
}
