"use client";

import Link from "next/link";
import { studioFetch } from "@/studio/client";

export function StudioTopBar({ email }: { email: string }) {
  async function logout() {
    await studioFetch("/api/studio/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
      <div className="container-tight flex h-16 items-center justify-between">
        <Link href="/studio" className="font-brand text-sm tracking-widest text-primary">
          Alignum Studio
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="hidden text-muted-foreground sm:inline">{email}</span>
          <button
            onClick={logout}
            className="rounded-full px-3 py-1.5 text-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            Abmelden
          </button>
        </div>
      </div>
    </header>
  );
}
