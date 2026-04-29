import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function Logo({
  className,
  compact = false,
  onDark = false,
}: {
  className?: string;
  compact?: boolean;
  onDark?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Alignum Schreinerei – Startseite"
      className={cn(
        "group inline-flex items-center gap-2.5",
        onDark && "drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      <span className="relative inline-flex h-9 w-auto items-center">
        <Image
          src="/logo.png"
          alt="Alignum Logo"
          width={180}
          height={40}
          priority
          className={cn(
            "h-9 w-auto object-contain transition-[filter] duration-300",
            onDark
              ? "brightness-0 invert"
              : "dark:brightness-0 dark:invert",
          )}
        />
      </span>
      {!compact && (
        <span
          className={cn(
            "font-display text-xl tracking-tight",
            onDark ? "text-white" : "text-foreground",
          )}
        >
          alig<span className="text-primary">n</span>um
        </span>
      )}
    </Link>
  );
}
