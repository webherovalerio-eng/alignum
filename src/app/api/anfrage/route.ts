import type { NextRequest } from "next/server";
import { buildAnfrageEmails, type AnfrageData } from "@/lib/anfrageEmail";
import { kvIncr } from "@/studio/kv";
import { sha256Hex } from "@/studio/tokens";

// Node-Runtime: brauchen Buffer für Base64-Anhänge + FormData mit Dateien.
export const runtime = "nodejs";
export const maxDuration = 20;

const RESEND_ENDPOINT = "https://api.resend.com/emails";

// Absender MUSS eine in Resend verifizierte Domain sein, sonst 403.
const MAIL_FROM = process.env.MAIL_FROM ?? "Alignum <info@alignum.de>";
const MAIL_TO = process.env.MAIL_TO ?? "info@alignum.de";

const MAX_FILES = 5;
const MAX_FILE_BYTES = 6 * 1024 * 1024;
const MAX_TOTAL_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "application/pdf",
]);

// Einfache In-Memory-Ratenbegrenzung pro IP (Best-Effort — Serverless-Instanzen
// sind kurzlebig). Schützt gegen naive Spam-/Bombing-Fluten am Mail-Endpunkt.
// Für verteilten Schutz später Upstash Ratelimit ergänzen.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // simpler Speicher-Deckel
  return false;
}

function str(v: unknown, max: number) {
  return typeof v === "string" ? v.slice(0, max).trim() : "";
}

/** Einzeilige Felder (landen u. a. im Betreff): Steuerzeichen/Umbrüche raus. */
function line(v: unknown, max: number) {
  return str(v, max).replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- Verteilte Limits über den KV-Zähler (greift über alle Instanzen) -------
// Pro IP (Flut von einer Quelle), pro Empfänger der Bestätigungsmail (Mail-
// Bombing einer fremden Adresse) und global pro Tag (Spam-Relay über viele
// IPs/Adressen). KV-Fehler → fail open (Formular bleibt nutzbar), aber geloggt.
const KV_IP_LIMIT = { max: 5, windowS: 10 * 60 };
const KV_IP_DAY_LIMIT = { max: 20, windowS: 24 * 60 * 60 };
const CONFIRM_PER_RECIPIENT = { max: 2, windowS: 24 * 60 * 60 };
const CONFIRM_GLOBAL_PER_DAY = 100;

async function kvOver(key: string, max: number, windowS: number): Promise<boolean> {
  try {
    return (await kvIncr(key, windowS)) > max;
  } catch (e) {
    console.error("[anfrage] Rate-Limit-Zähler fehlgeschlagen:", e);
    return false;
  }
}

/** Cloudflare Turnstile — nur aktiv, wenn TURNSTILE_SECRET_KEY gesetzt ist. */
async function turnstileOk(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // nicht konfiguriert → Verhalten wie bisher
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body },
    );
    const out = (await res.json()) as { success?: boolean };
    return out.success === true;
  } catch (e) {
    console.error("[anfrage] Turnstile-Prüfung fehlgeschlagen:", e);
    return false;
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Mailversand ist noch nicht konfiguriert." },
      { status: 503 },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (
    isRateLimited(ip) ||
    (await kvOver(`rl:anfrage_ip:${ip}`, KV_IP_LIMIT.max, KV_IP_LIMIT.windowS)) ||
    (await kvOver(`rl:anfrage_ip_day:${ip}`, KV_IP_DAY_LIMIT.max, KV_IP_DAY_LIMIT.windowS))
  ) {
    console.warn("[anfrage] Rate-Limit pro IP überschritten");
    return Response.json(
      { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
      { status: 429 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  // Honeypot: echte Nutzer füllen dieses versteckte Feld nie aus — Bots schon.
  // Still mit "ok" antworten, damit der Bot keinen Fehler zum Lernen bekommt.
  if (str(form.get("company"), 100)) {
    return Response.json({ ok: true });
  }

  if (!(await turnstileOk(str(form.get("cf-turnstile-response"), 2048), ip))) {
    return Response.json(
      { error: "Sicherheitsprüfung fehlgeschlagen. Bitte erneut versuchen." },
      { status: 400 },
    );
  }

  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get("payload") ?? "{}"));
  } catch {
    return Response.json({ error: "Ungültige Daten." }, { status: 400 });
  }
  const p = (raw ?? {}) as Record<string, unknown>;

  // Eingaben validieren + längenbegrenzen (Injection/DoS-Schutz).
  const data: AnfrageData = {
    serviceNames: Array.isArray(p.serviceNames)
      ? p.serviceNames.slice(0, 20).map((s) => line(String(s), 80))
      : [],
    scope: line(p.scope, 120),
    budget: line(p.budget, 120),
    timeline: line(p.timeline, 120),
    description: str(p.description, 5000),
    measurements: str(p.measurements, 2000),
    name: line(p.name, 120),
    email: line(p.email, 200),
    phone: line(p.phone, 60),
    city: line(p.city, 120),
    contactPref: line(p.contactPref, 20),
  };

  if (!data.name || !data.email || !EMAIL_RE.test(data.email)) {
    return Response.json(
      { error: "Name und gültige E-Mail sind erforderlich." },
      { status: 400 },
    );
  }

  // Datei-Anhänge einsammeln (Typ-Allowlist + Größenlimits).
  const uploads = form
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);
  let total = 0;
  const attachments: { filename: string; content: string }[] = [];
  for (const file of uploads.slice(0, MAX_FILES)) {
    if (!ALLOWED_TYPES.has(file.type)) continue;
    if (file.size > MAX_FILE_BYTES) continue;
    total += file.size;
    if (total > MAX_TOTAL_BYTES) break;
    const buf = Buffer.from(await file.arrayBuffer());
    attachments.push({
      filename: str(file.name, 200) || "anhang",
      content: buf.toString("base64"),
    });
  }

  const { notify, confirm } = buildAnfrageEmails(data, {
    attachments: attachments.length,
  });

  try {
    await sendEmail(apiKey, {
      from: MAIL_FROM,
      to: [MAIL_TO],
      reply_to: data.email,
      subject: notify.subject,
      html: notify.html,
      text: notify.text,
      ...(attachments.length ? { attachments } : {}),
    });
    // Bestätigung an die frei eingegebene Adresse nur, solange weder diese
    // Adresse noch das globale Tageskontingent ausgereizt ist. Die Anfrage
    // selbst (Mail an Alignum) geht in jedem Fall raus — kein Lead geht verloren.
    const day = new Date().toISOString().slice(0, 10);
    const recipient = await sha256Hex(data.email.toLowerCase());
    const confirmBlocked =
      (await kvOver(
        `rl:anfrage_confirm:${recipient}`,
        CONFIRM_PER_RECIPIENT.max,
        CONFIRM_PER_RECIPIENT.windowS,
      )) ||
      (await kvOver(`rl:anfrage_confirm_day:${day}`, CONFIRM_GLOBAL_PER_DAY, 2 * 24 * 60 * 60));
    if (confirmBlocked) {
      console.warn("[anfrage] Bestätigungsmail unterdrückt (Limit erreicht)");
    } else {
      await sendEmail(apiKey, {
        from: MAIL_FROM,
        to: [data.email],
        subject: confirm.subject,
        html: confirm.html,
        text: confirm.text,
      });
    }
    // Anfrage zählen (für den Monatsreport). Best-effort — darf den Versand
    // nie stören; die Search Console kennt keine Formular-Anfragen.
    try {
      const now = new Date();
      const key = `report:anfragen:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      await kvIncr(key, 60 * 60 * 24 * 400); // ~13 Monate TTL, alte Monate räumen sich auf
    } catch (e) {
      console.error("[anfrage] Anfrage-Zähler fehlgeschlagen:", e);
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[anfrage] Mailversand fehlgeschlagen:", err);
    return Response.json({ error: "Versand fehlgeschlagen." }, { status: 502 });
  }
}

async function sendEmail(apiKey: string, body: Record<string, unknown>) {
  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
  return res.json();
}
