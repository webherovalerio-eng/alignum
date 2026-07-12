import { NextResponse, type NextRequest } from "next/server";
import { decodeSession } from "@/studio/session";
import { SESSION_COOKIE, roleFor } from "@/studio/config";

/**
 * Proxy (Next-16-Nachfolger von middleware) — optimistischer Auth-Gate für die
 * internen Studio-Flächen. Die eigentliche Autorisierung passiert zusätzlich im
 * DAL/Route-Handler (Defense in Depth); hier nur schnelle Redirects + noindex.
 *
 * Läuft NICHT auf /api/studio/* (die Auth-Routen sichern sich selbst) und nicht
 * auf /studio-media/* (Dev-Bildauslieferung).
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isStudio = pathname === "/studio" || pathname.startsWith("/studio/");
  const isLogin = pathname === "/login" || pathname.startsWith("/login/");

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await decodeSession(token);
  const authed = Boolean(session?.sub && roleFor(session.sub));

  if (isStudio && !authed) {
    return NextResponse.redirect(new URL("/login/", req.url));
  }
  if (isLogin && authed) {
    return NextResponse.redirect(new URL("/studio/", req.url));
  }

  const res = NextResponse.next();
  // Interne Flächen NIE indexieren (zusätzlich zu Metadata-robots + robots.ts).
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/studio", "/studio/:path*", "/login", "/login/:path*"],
};
