import { cn } from "@/lib/cn";
import { type ReactNode } from "react";

export function Badge({
  children,
  variant = "outline",
  className,
}: {
  children: ReactNode;
  variant?: "outline" | "primary" | "subtle";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        variant === "outline" && "border border-border bg-background/60 text-muted-foreground backdrop-blur",
        variant === "primary" && "bg-primary text-primary-foreground",
        variant === "subtle" && "bg-muted text-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
