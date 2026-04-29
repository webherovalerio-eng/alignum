import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Alignum-Logo — nur PNG-Asset, kein zusätzlicher Schriftzug.
 *
 * - `onDark` = true: Logo ist über dunklem Hintergrund (z. B. transparenter Header über Hero) → weiße Variante
 * - `onDark` = false: Logo wechselt automatisch je Theme (light → schwarz, dark → weiß)
 */
export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Alignum Möbelbau – Schreinerei Mannheim"
      className={cn(
        "group relative inline-flex items-center",
        onDark && "drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      {/* Schwarze Variante – auf hellem Hintergrund (light theme, scrolled) */}
      <Image
        src="/logo-dark.png"
        alt="Alignum Möbelbau"
        width={188}
        height={62}
        priority
        className={cn(
          "h-10 sm:h-11 w-auto object-contain transition-opacity duration-300",
          onDark ? "hidden" : "block dark:hidden",
        )}
      />
      {/* Weiße Variante – über dunklem Hero oder dark theme */}
      <Image
        src="/logo.png"
        alt="Alignum Möbelbau"
        width={188}
        height={62}
        priority
        className={cn(
          "h-10 sm:h-11 w-auto object-contain transition-opacity duration-300",
          onDark ? "block" : "hidden dark:block",
        )}
      />
    </Link>
  );
}
