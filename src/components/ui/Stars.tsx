import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export function Stars({ rating = 5, className }: { rating?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} von 5 Sternen`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < Math.round(rating) ? "text-primary fill-current" : "text-muted-foreground/40",
          )}
        />
      ))}
    </span>
  );
}
