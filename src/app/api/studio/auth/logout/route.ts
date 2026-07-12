import { NextResponse } from "next/server";
import { SESSION_COOKIE, CSRF_COOKIE, isProd } from "@/studio/config";
import { verifyCsrf } from "@/studio/csrf";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // Auch Logout gegen CSRF absichern (sonst könnte man Nutzer ausloggen).
  if (!(await verifyCsrf(req))) {
    return Response.json({ error: "Ungültiges CSRF-Token." }, { status: 403 });
  }
  const res = NextResponse.json({ ok: true });
  const expire = { path: "/", maxAge: 0, secure: isProd, sameSite: "lax" as const };
  res.cookies.set(SESSION_COOKIE, "", { ...expire, httpOnly: true });
  res.cookies.set(CSRF_COOKIE, "", expire);
  return res;
}
