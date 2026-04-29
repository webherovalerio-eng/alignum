"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Bei jedem Routenwechsel zum Top scrollen.
 * Lenis cached den Scroll-State über Routen — wir resetten ihn explizit.
 */
export function ScrollRestore() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip if there is a hash — let the browser jump to anchor
    if (window.location.hash) return;

    // First reset native scroll
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Lenis stores its own scroll position on the <html> via transform.
    // We dispatch a synthetic event so the next RAF in the SmoothScroll
    // loop re-syncs to 0.
    const html = document.documentElement;
    html.style.scrollBehavior = "auto";
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      html.style.scrollBehavior = "";
    });
  }, [pathname]);

  return null;
}
