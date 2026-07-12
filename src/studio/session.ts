/**
 * Session-Management: zustandslose, signierte JWT im HttpOnly-Cookie (jose,
 * HS256). Kein Session-Store nötig; Widerruf erfolgt über die Allowlist-Prüfung
 * im DAL bei jedem Request (siehe dal.ts).
 */
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_TTL_S,
  sessionCookieOptions,
  isProd,
} from "./config";
import type { SessionPayload } from "./types";

function key(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (isProd) {
      throw new Error(
        "AUTH_SECRET ist nicht gesetzt — Studio-Auth in Produktion deaktiviert.",
      );
    }
    // Nur Dev: fester unsicherer Schlüssel, damit lokal getestet werden kann.
    return new TextEncoder().encode("dev-insecure-secret-do-not-use-in-prod");
  }
  return new TextEncoder().encode(secret);
}

export async function encodeSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_S}s`)
    .sign(key());
}

export async function decodeSession(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.sub !== "string") return null;
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const c = await cookies();
  c.set(SESSION_COOKIE, token, sessionCookieOptions(SESSION_TTL_S));
}

export async function clearSessionCookie(): Promise<void> {
  const c = await cookies();
  c.delete(SESSION_COOKIE);
}

export async function readCookieSession(): Promise<SessionPayload | null> {
  const c = await cookies();
  return decodeSession(c.get(SESSION_COOKIE)?.value);
}
