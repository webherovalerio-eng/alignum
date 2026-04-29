"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Helles Design" : "Dunkles Design"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-9 w-16 items-center rounded-full border border-border bg-card transition-colors",
        "hover:border-primary/60",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-1 left-1 inline-flex h-7 w-7 items-center justify-center rounded-full",
          "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]",
          "transition-transform duration-500",
          isDark ? "translate-x-7" : "translate-x-0",
        )}
      >
        {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
      </span>
    </button>
  );
}
