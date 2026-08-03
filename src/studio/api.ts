/**
 * Gemeinsame Absicherung für Studio-Route-Handler: Authentifizierung
 * (Session + Allowlist) UND CSRF für mutierende Requests. Gibt entweder den
 * User oder eine fertige Fehler-Response zurück.
 */
import { apiStudioUser } from "./dal";
import { verifyCsrf } from "./csrf";
import type { StudioUser } from "./types";

// Safe HTTP-Methoden ändern keinen Zustand → kein CSRF nötig (Standard-Praxis).
// Wichtig für <img src>/Downloads: die können keinen x-studio-csrf-Header
// setzen und würden sonst mit 403 scheitern (Carousel-Slide-Endpoint).
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export async function guard(req: Request): Promise<StudioUser | Response> {
  const user = await apiStudioUser();
  if (!user) {
    return Response.json({ error: "Nicht angemeldet." }, { status: 401 });
  }
  if (!SAFE_METHODS.has(req.method.toUpperCase()) && !(await verifyCsrf(req))) {
    return Response.json({ error: "Ungültiges CSRF-Token." }, { status: 403 });
  }
  return user;
}
