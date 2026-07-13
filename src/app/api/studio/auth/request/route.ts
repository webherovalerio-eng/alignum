import type { NextRequest } from "next/server";
import {
  normalizeEmail,
  roleFor,
  LOGIN_RL,
  MAGIC_TTL_S,
  isProd,
} from "@/studio/config";
import { hitRateLimit } from "@/studio/ratelimit";
import { createMagicToken } from "@/studio/magiclink";
import { sendMail, magicLinkEmail } from "@/studio/mail";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Generische Antwort — verrät NICHT, ob eine Adresse berechtigt ist
// (Schutz gegen User-Enumeration, OWASP Auth).
const GENERIC = {
  ok: true,
  message:
    "Falls diese Adresse berechtigt ist, wurde ein Login-Link gesendet. Bitte E-Mail-Postfach prüfen.",
};

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const ipRl = await hitRateLimit(
    "login_ip",
    ip,
    LOGIN_RL.perIp.max,
    LOGIN_RL.perIp.windowS,
  );
  if (!ipRl.ok) {
    return Response.json(
      { error: "Zu viele Anfragen. Bitte später erneut versuchen." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  // Honeypot: Bots füllen dieses Feld, Menschen nie.
  if (typeof body.company === "string" && body.company.trim()) {
    return Response.json(GENERIC);
  }

  const email = normalizeEmail(String(body.email ?? "").slice(0, 200));
  if (!EMAIL_RE.test(email)) {
    return Response.json(
      { error: "Bitte eine gültige E-Mail-Adresse eingeben." },
      { status: 400 },
    );
  }

  const emailRl = await hitRateLimit(
    "login_email",
    email,
    LOGIN_RL.perEmail.max,
    LOGIN_RL.perEmail.windowS,
  );

  const role = roleFor(email);
  // Nur berechtigte Adresse + nicht überschrittenes Email-Limit → Link senden.
  if (role && emailRl.ok) {
    const token = await createMagicToken(email);
    // Link zeigt auf denselben Origin wie der Request (Env hat Vorrang für Prod,
    // damit der Custom-Domain-Origin garantiert korrekt ist).
    const origin =
      (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL)?.replace(
        /\/$/,
        "",
      ) || req.nextUrl.origin;
    const link = `${origin}/login/verify/?token=${token}`;
    const tpl = magicLinkEmail(link, Math.round(MAGIC_TTL_S / 60));
    try {
      const res = await sendMail({ to: email, ...tpl });
      if (!res.sent) {
        // Dev ohne RESEND_API_KEY: Link in Server-Konsole + (nur Dev) zurückgeben.
        console.warn(`[studio] DEV Magic-Link (${email}): ${link}`);
        if (!isProd) {
          return Response.json({ ...GENERIC, devLink: link });
        }
      }
    } catch (err) {
      console.error("[studio] Magic-Link-Versand fehlgeschlagen:", err);
      // Trotzdem generisch antworten (keine Enumeration/kein Info-Leak).
    }
  }

  return Response.json(GENERIC);
}
