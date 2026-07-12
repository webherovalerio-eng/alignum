"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { studioFetch } from "@/studio/client";

export function NewPostButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true);
    try {
      const res = await studioFetch("/api/studio/posts", { method: "POST" });
      const data = (await res.json()) as { id?: string };
      if (data.id) {
        router.push(`/studio/${data.id}`);
        return;
      }
    } catch {
      /* fällt unten auf busy=false zurück */
    }
    setBusy(false);
  }

  return (
    <Button onClick={create} disabled={busy}>
      {busy ? "Wird angelegt …" : "Neuer Beitrag"}
    </Button>
  );
}
