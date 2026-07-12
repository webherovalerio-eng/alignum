/**
 * Zentrale Konfiguration für das Alignum-Studio (Jans internes Redaktions-Backend).
 *
 * Sicherheitsrelevante Konstanten leben bewusst an EINER Stelle (OWASP ASVS V1:
 * Architektur/Konfiguration zentralisieren). Werte, die pro Umgebung variieren,
 * kommen aus Env-Vars; Fallbacks sind sicher gewählt.
 */

export type StudioRole = "jan" | "reviewer" | "admin";

export const isProd = process.env.NODE_ENV === "production";

/**
 * Allowlist: NUR diese Adressen dürfen einen Magic-Link anfordern.
 * Kein offenes Signup — das ist ein Ein-Mann-Backend + Reviewer.
 * Override per Env `STUDIO_ALLOWED_EMAILS` (Komma-Liste) möglich; sonst Default.
 */
const DEFAULT_USERS: Record<string, StudioRole> = {
  "info@alignum.de": "jan", // Jan (Inhaber, lädt Projekte ein)
  "vale.dc@hotmail.de": "admin", // Valerio (WEBhero, Reviewer/Admin)
};

export function studioUsers(): Record<string, StudioRole> {
  const raw = process.env.STUDIO_ALLOWED_EMAILS?.trim();
  if (!raw) return DEFAULT_USERS;
  // Format: "email" oder "email:role", Komma-getrennt.
  const map: Record<string, StudioRole> = {};
  for (const part of raw.split(",")) {
    const [email, role] = part.split(":").map((s) => s.trim().toLowerCase());
    if (!email) continue;
    map[email] = (role as StudioRole) || "jan";
  }
  return Object.keys(map).length ? map : DEFAULT_USERS;
}

/** Normalisiert eine E-Mail für Allowlist-Vergleich (lowercase, trim). */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Rolle für eine Allowlist-Adresse — oder null, wenn nicht berechtigt. */
export function roleFor(email: string): StudioRole | null {
  return studioUsers()[normalizeEmail(email)] ?? null;
}

// --- Cookies ---------------------------------------------------------------
// `__Host-`-Prefix erzwingt Secure + Path=/ + kein Domain-Attribut (OWASP
// Session-Mgmt Cheat Sheet). Über http-localhost lehnt der Browser `__Host-`
// ab, deshalb in Dev ein Name ohne Prefix.
export const SESSION_COOKIE = isProd ? "__Host-studio_session" : "studio_session";
export const CSRF_COOKIE = isProd ? "__Host-studio_csrf" : "studio_csrf";

export const SESSION_TTL_S = 60 * 60 * 24 * 7; // 7 Tage
export const MAGIC_TTL_S = 60 * 10; // 10 Minuten (kurzlebig, single-use)

/** Basis-Optionen für serverseitig gesetzte Cookies. */
export function sessionCookieOptions(maxAgeS: number) {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeS,
  };
}

/** CSRF-Cookie ist NICHT httpOnly (Double-Submit: JS muss es lesen können). */
export function csrfCookieOptions(maxAgeS: number) {
  return {
    httpOnly: false,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeS,
  };
}

export const CSRF_HEADER = "x-studio-csrf";

// --- Rate-Limits (Login) ---------------------------------------------------
export const LOGIN_RL = {
  perIp: { max: 10, windowS: 60 * 15 }, // 10 Versuche / 15 min pro IP
  perEmail: { max: 5, windowS: 60 * 15 }, // 5 Versuche / 15 min pro Adresse
};

// --- Upload-Limits ---------------------------------------------------------
export const UPLOAD = {
  maxImagesPerPost: 40,
  maxImageBytes: 15 * 1024 * 1024, // 15 MB pro Datei (Rohfoto)
  maxTotalBytes: 200 * 1024 * 1024, // 200 MB pro Beitrag
  allowedTypes: new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
    "image/avif",
  ]),
  /** Kantenlänge, auf die beim Re-Encode maximal herunterskaliert wird. */
  maxEdge: 2400,
};

// --- Textfeld-Limits (Injection/DoS) --------------------------------------
export const FIELD = {
  notiz: 4000,
  holzart: 80,
  moebeltyp: 80,
  ort: 120,
};

// --- KI-Generierung ---------------------------------------------------------
/** Modell für die Content-Generierung (Default: Opus 4.8). */
export const GEN_MODEL = process.env.STUDIO_GEN_MODEL || "claude-opus-4-8";

/**
 * Hartes Monatslimit für KI-Generierungen (Kosten-/Missbrauchsschutz).
 * Serverseitig in KV gezählt — kann nicht clientseitig umgangen werden.
 */
export const MONTHLY_LIMIT = Math.max(
  0,
  Number(process.env.STUDIO_MONTHLY_LIMIT || "8"),
);

/** Öffentliche Basis-URL (für Magic-Link-Absender). */
export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.SITE_URL?.replace(/\/$/, "") ||
    "https://alignum.de"
  );
}
