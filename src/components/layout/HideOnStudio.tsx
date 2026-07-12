"use client";

import { usePathname } from "next/navigation";

/**
 * Blendet Marketing-Chrome (Header/Footer/Consent) auf den internen Flächen
 * /login und /studio aus. Auf allen öffentlichen Routen unverändert
 * durchgereicht — keine Verhaltensänderung fürs SEO-relevante Frontend.
 */
export function HideOnStudio({ children }: { children: React.ReactNode }) {
  const p = usePathname();
  const hidden =
    p === "/login" ||
    p.startsWith("/login/") ||
    p === "/studio" ||
    p.startsWith("/studio/");
  if (hidden) return null;
  return <>{children}</>;
}
