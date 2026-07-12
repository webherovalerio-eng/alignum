import { cn } from "@/lib/cn";
import type { PostStatus } from "@/studio/types";

const LABELS: Record<PostStatus, string> = {
  neu: "Entwurf",
  eingereicht: "Eingereicht",
  in_generierung: "In Generierung",
  entwurf: "Zur Prüfung",
  freigegeben: "Freigegeben",
  veroeffentlicht: "Veröffentlicht",
};

export function StatusBadge({ status }: { status: PostStatus }) {
  const active = status !== "neu";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
      )}
    >
      {LABELS[status]}
    </span>
  );
}
