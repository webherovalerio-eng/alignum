"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export function StarRating({
  value,
  onChange,
  size = "lg",
}: {
  value: number;
  onChange: (v: number) => void;
  size?: "md" | "lg";
}) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  const px = size === "lg" ? "size-12 sm:size-14" : "size-8";

  return (
    <div className="inline-flex items-center gap-1.5" role="radiogroup" aria-label="Sterne-Bewertung">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= display;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} ${n === 1 ? "Stern" : "Sterne"}`}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className={cn(
              "transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full",
              active ? "text-primary" : "text-muted-foreground/30 hover:text-primary/60",
            )}
          >
            <Star className={cn(px, active && "fill-current")} strokeWidth={1.5} />
          </button>
        );
      })}
    </div>
  );
}
