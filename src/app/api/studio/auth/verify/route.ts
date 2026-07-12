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

export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  const email = await consumeMagicToken(token);
  if (!email) {
    return NextResponse.redirect(new URL("/login/?e=link", req.url));
  }
  // Allowlist erneut prüfen (Adresse könnte seit Anforderung entzogen sein).
  const role = roleFor(email);
  if (!role) {
    return NextResponse.redirect(new URL("/login/?e=denied", req.url));
  }

  const jwt = await encodeSession({ sub: email, role });
  const csrf = randomTokenHex(32);

  const res = NextResponse.redirect(new URL("/studio/", req.url));
  res.cookies.set(SESSION_COOKIE, jwt, sessionCookieOptions(SESSION_TTL_S));
  res.cookies.set(CSRF_COOKIE, csrf, csrfCookieOptions(SESSION_TTL_S));
  return res;
}
