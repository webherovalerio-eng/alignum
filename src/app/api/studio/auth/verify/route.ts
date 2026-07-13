import { type NextRequest, NextResponse } from "next/server";
import { consumeMagicToken } from "@/studio/magiclink";
import {
  roleFor,
  SESSION_COOKIE,
  CSRF_COOKIE,
  SESSION_TTL_S,
  sessionCookieOptions,
  csrfCookieOptions,
} from "@/studio/config";
import { encodeSession } from "@/studio/session";
import { randomTokenHex } from "@/studio/tokens";

export const runtime = "nodejs";

/**
 * Token-Einlösung per POST (aus der Bestätigungsseite /login/verify).
 * BEWUSST kein GET: E-Mail-Sicherheits-Scanner (Outlook/Hotmail „Safe Links")
 * rufen Links per HEAD/GET vorab auf — ein Einmal-GET würde dabei verbraucht.
 * Ein Formular-POST wird von Scannern nicht ausgelöst → nur der Klick des
 * Nutzers löst ein.
 */
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const raw = form?.get("token");
  const token = typeof raw === "string" ? raw : "";

  const email = await consumeMagicToken(token);
  if (!email) {
    return NextResponse.redirect(new URL("/login/?e=link", req.url), 303);
  }
  const role = roleFor(email);
  if (!role) {
    return NextResponse.redirect(new URL("/login/?e=denied", req.url), 303);
  }

  const jwt = await encodeSession({ sub: email, role });
  const csrf = randomTokenHex(32);

  // 303 → Browser folgt per GET nach /studio/ und sendet dabei die neuen Cookies.
  const res = NextResponse.redirect(new URL("/studio/", req.url), 303);
  res.cookies.set(SESSION_COOKIE, jwt, sessionCookieOptions(SESSION_TTL_S));
  res.cookies.set(CSRF_COOKIE, csrf, csrfCookieOptions(SESSION_TTL_S));
  return res;
}
