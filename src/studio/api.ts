/**
 * Gemeinsame Absicherung für Studio-Route-Handler: Authentifizierung
 * (Session + Allowlist) UND CSRF für mutierende Requests. Gibt entweder den
 * User oder eine fertige Fehler-Response zurück.
 */
import { apiStudioUser } from "./dal";
import { verifyCsrf } from "./csrf";
import type { StudioUser } from "./types";

export async function guard(req: Request): Promise<StudioUser | Response> {
  const user = await apiStudioUser();
  if (!user) {
    return Response.json({ error: "Nicht angemeldet." }, { status: 401 });
  }
  if (!(await verifyCsrf(req))) {
    return Response.json({ error: "Ungültiges CSRF-Token." }, { status: 403 });
  }
  return user;
}
