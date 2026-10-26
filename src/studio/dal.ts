/**
 * Data Access Layer — zentrale Autorisierung (Next.js-Empfehlung).
 * `getStudioUser()` liest die Session UND prüft bei jedem Request erneut die
 * Allowlist. So verliert eine entfernte Adresse SOFORT den Zugriff, auch wenn
 * ihr JWT noch gültig wäre (Widerruf ohne Session-Store).
 */
import { cache } from "react";
import { redirect } from "next/navigation";
import { readCookieSession, currentSessionVersion } from "./session";
import { roleFor } from "./config";
import type { StudioUser } from "./types";

export const getStudioUser = cache(async (): Promise<StudioUser | null> => {
  const session = await readCookieSession();
  if (!session?.sub) return null;
  const role = roleFor(session.sub);
  if (!role) return null; // aus Allowlist entfernt → kein Zugriff
  // Per Logout widerrufene Session (ältere Token-Version) → kein Zugriff.
  const ver = typeof session.ver === "number" ? session.ver : 0;
  if (ver !== (await currentSessionVersion(session.sub))) return null;
  return { email: session.sub, role };
});

/** Für Server Components / Server Actions: erzwingt Login. */
export async function requireStudioUser(): Promise<StudioUser> {
  const user = await getStudioUser();
  if (!user) redirect("/login");
  return user;
}

/** Für Route Handler: gibt User zurück oder null (Aufrufer antwortet 401). */
export async function apiStudioUser(): Promise<StudioUser | null> {
  return getStudioUser();
}
