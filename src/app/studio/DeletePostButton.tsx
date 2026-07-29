"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { studioFetch } from "@/studio/client";

/**
 * Löscht einen Beitrag direkt aus der Übersicht. Bewusst als eigene
 * Client-Insel: die Übersicht ist eine Server-Component, und der Button darf
 * nicht im umschließenden <Link> liegen (kein verschachteltes <a>).
 */
export function DeletePostButton({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (busy) return;
    if (!confirm(`„${label}" wirklich löschen? Das lässt sich nicht rückgängig machen.`))
      return;
    setBusy(true);
    try {
      const res = await studioFetch(`/api/studio/posts/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        setBusy(false);
        alert("Löschen fehlgeschlagen. Bitte erneut versuchen.");
      }
    } catch {
      setBusy(false);
      alert("Löschen fehlgeschlagen. Bitte erneut versuchen.");
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={busy}
      aria-label={`${label} löschen`}
      title="Beitrag löschen"
      className="shrink-0 rounded-[var(--radius)] p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
    >
      <Trash2 className="size-4" />
    </button>
  );
}
