/**
 * CSRF-Schutz per Double-Submit-Token (Defense in Depth zusätzlich zu
 * SameSite=Lax). Ein nicht-httpOnly-Cookie hält das Token; der Client spiegelt
 * es bei mutierenden Requests im Header `x-studio-csrf`. Server vergleicht beide
 * konstantzeit.
 */
import { cookies } from "next/headers";
import {
  CSRF_COOKIE,
  CSRF_HEADER,
  SESSION_TTL_S,
  csrfCookieOptions,
} from "./config";
import { randomTokenHex, timingSafeEqual } from "./tokens";

export async function issueCsrfToken(): Promise<string> {
  const token = randomTokenHex(32);
  const c = await cookies();
  c.set(CSRF_COOKIE, token, csrfCookieOptions(SESSION_TTL_S));
  return token;
}

export async function clearCsrfToken(): Promise<void> {
  const c = await cookies();
  c.delete(CSRF_COOKIE);
}

/** true, wenn Header-Token und Cookie-Token vorhanden und gleich sind. */
export async function verifyCsrf(req: Request): Promise<boolean> {
  const c = await cookies();
  const cookieToken = c.get(CSRF_COOKIE)?.value;
  const headerToken = req.headers.get(CSRF_HEADER);
  if (!cookieToken || !headerToken) return false;
  return timingSafeEqual(cookieToken, headerToken);
}
