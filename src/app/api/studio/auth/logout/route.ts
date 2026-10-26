import { NextResponse } from "next/server";
import { SESSION_COOKIE, CSRF_COOKIE, isProd } from "@/studio/config";
import { verifyCsrf } from "@/studio/csrf";
import { readCookieSession, revokeSessions } from "@/studio/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // Auch Logout gegen CSRF absichern (sonst könnte man Nutzer ausloggen).
  if (!(await verifyCsrf(req))) {
    return Response.json({ error: "Ungültiges CSRF-Token." }, { status: 403 });
  }
  // Serverseitig widerrufen: Token-Version hochzählen → das JWT (und jede
  // Kopie davon) ist ab sofort ungültig, nicht nur das Cookie gelöscht.
  const session = await readCookieSession();
  if (session?.sub) {
    try {
      await revokeSessions(session.sub);
    } catch (e) {
      console.error("[studio] Session-Widerruf fehlgeschlagen:", e);
    }
  }
  const res = NextResponse.json({ ok: true });
  const expire = { path: "/", maxAge: 0, secure: isProd, sameSite: "lax" as const };
  res.cookies.set(SESSION_COOKIE, "", { ...expire, httpOnly: true });
  res.cookies.set(CSRF_COOKIE, "", expire);
  return res;
}
