import { kvGetJSON } from "@/studio/kv";

/**
 * Report-Endpunkt für den monatlichen SEO-Report (WEBhero-intern).
 *
 * Zweiteilung, weil die Daten aus verschiedenen Welten kommen:
 *  - GET  → liefert die Kennzahlen, die NUR die App kennt: den Anfrage-Zähler
 *           aus dem KV (die Search Console kennt keine Formular-Anfragen).
 *  - POST → verschickt den fertig gebauten Report per Resend. Der monatliche
 *           Cloud-Agent holt Rankings (DataForSEO) + GSC selbst, baut das HTML
 *           und schickt es hierher — weil der Resend-Schlüssel nur in der App
 *           liegt.
 *
 * Beide Aktionen sind mit REPORT_SECRET (Header x-report-secret) geschützt.
 * Der Empfänger ist FEST auf info@webhero-valerio.de verdrahtet — der
 * Endpunkt kann also nicht als offenes Mail-Relay missbraucht werden.
 */
export const runtime = "nodejs";

const RECIPIENT = "info@webhero-valerio.de"; // FEST: Report geht immer & nur hierhin
const FROM = process.env.MAIL_FROM ?? "Alignum <info@alignum.de>";

function ym(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function authorized(req: Request): boolean {
  const secret = process.env.REPORT_SECRET;
  const given = req.headers.get("x-report-secret");
  return Boolean(secret && given && secret === given);
}

export async function GET(req: Request) {
  if (!authorized(req))
    return Response.json({ error: "unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const month = url.searchParams.get("month") || ym();
  const [y, m] = month.split("-").map(Number);
  const prev = ym(new Date(y, (m || 1) - 2, 1));

  const anfragen = (await kvGetJSON<number>(`report:anfragen:${month}`)) ?? 0;
  const anfragenPrev = (await kvGetJSON<number>(`report:anfragen:${prev}`)) ?? 0;

  return Response.json({ month, anfragen, prevMonth: prev, anfragenPrev });
}

export async function POST(req: Request) {
  if (!authorized(req))
    return Response.json({ error: "unauthorized" }, { status: 401 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey)
    return Response.json({ error: "resend not configured" }, { status: 503 });

  let body: { subject?: string; html?: string };
  try {
    body = (await req.json()) as { subject?: string; html?: string };
  } catch {
    return Response.json({ error: "bad json" }, { status: 400 });
  }
  const subject = (body.subject || "SEO-Report Alignum").slice(0, 200);
  const html = body.html || "";
  if (!html) return Response.json({ error: "html fehlt" }, { status: 400 });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: [RECIPIENT], subject, html }),
  });
  const out = (await res.json().catch(() => ({}))) as { id?: string };
  if (!res.ok)
    return Response.json({ error: "resend failed", detail: out }, { status: 502 });

  return Response.json({ ok: true, id: out.id, to: RECIPIENT });
}
