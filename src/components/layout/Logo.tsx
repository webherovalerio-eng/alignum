import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Alignum Schreinerei – Startseite"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span
        className="relative inline-flex size-9 items-center justify-center rounded-md bg-foreground text-background overflow-hidden"
      >
        <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
          <defs>
            <linearGradient id="lg-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--brand-gold-soft))" />
              <stop offset="100%" stopColor="hsl(var(--brand-gold))" />
            </linearGradient>
          </defs>
          {/* A — like a roof / wood beam */}
          <path
            d="M6 26 L16 6 L26 26 M10 19 L22 19"
            stroke="url(#lg-gold)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700"
        />
      </span>
      {!compact && (
        <span className="font-display text-xl tracking-tight">
          alig<span className="text-primary">n</span>um
        </span>
      )}
    </Link>
  );
}
