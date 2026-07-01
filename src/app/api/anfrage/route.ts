import type { NextRequest } from "next/server";

// Node-Runtime: brauchen Buffer für Base64-Anhänge + FormData mit Dateien.
export const runtime = "nodejs";
export const maxDuration = 20;

const RESEND_ENDPOINT = "https://api.resend.com/emails";

// Absender MUSS eine in Resend verifizierte Domain sein, sonst 403.
const MAIL_FROM = process.env.MAIL_FROM ?? "Alignum <info@alignum.de>";
const MAIL_TO = process.env.MAIL_TO ?? "info@alignum.de";

const MAX_FILES = 5;
const MAX_TOTAL_BYTES = 8 * 1024 * 1024; // 8 MB gesamt

type Payload = {
  serviceNames?: string[];
  scope?: string;
  budget?: string;
  timeline?: string;
  description?: string;
  measurements?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  contactPref?: string;
};

const CONTACT_PREF: Record<string, string> = {
  email: "E-Mail bevorzugt",
  phone: "Telefon bevorzugt",
  either: "E-Mail oder Telefon",
};

function esc(s: string) {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Mailversand ist noch nicht konfiguriert." },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  let data: Payload;
  try {
    data = JSON.parse(String(form.get("payload") ?? "{}")) as Payload;
  } catch {
    return Response.json({ error: "Ungültige Daten." }, { status: 400 });
  }

  if (!data.name?.trim() || !data.email?.trim() || !data.email.includes("@")) {
    return Response.json(
      { error: "Name und gültige E-Mail sind erforderlich." },
      { status: 400 },
    );
  }

  // Datei-Anhänge einsammeln (Größe begrenzen).
  const uploads = form
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);
  let total = 0;
  const attachments: { filename: string; content: string }[] = [];
  for (const file of uploads.slice(0, MAX_FILES)) {
    total += file.size;
    if (total > MAX_TOTAL_BYTES) break;
    const buf = Buffer.from(await file.arrayBuffer());
    attachments.push({
      filename: file.name || "anhang",
      content: buf.toString("base64"),
    });
  }

  const services = data.serviceNames?.length
    ? data.serviceNames.join(", ")
    : "—";

  const rows: [string, string][] = [
    ["Leistung", services],
    ["Umfang", data.scope || "—"],
    ["Budget", data.budget || "—"],
    ["Zeitrahmen", data.timeline || "—"],
    ["Beschreibung", data.description || "—"],
    ["Maße / Räume", data.measurements || "—"],
    ["Name", data.name],
    ["E-Mail", data.email],
    ["Telefon", data.phone || "—"],
    ["Ort", data.city || "—"],
    ["Erreichbar", CONTACT_PREF[data.contactPref ?? ""] ?? data.contactPref ?? "—"],
  ];

  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;color:#8a8378;white-space:nowrap;vertical-align:top">${esc(
          k,
        )}</td><td style="padding:6px 12px;color:#1a1a1a;white-space:pre-wrap">${esc(
          v,
        )}</td></tr>`,
    )
    .join("");

  const notifyHtml = `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:640px">
    <h2 style="font-size:18px;margin:0 0 4px">Neue Anfrage über alignum.de</h2>
    <p style="color:#8a8378;margin:0 0 16px">${esc(services)} · ${esc(data.name ?? "")}</p>
    <table style="border-collapse:collapse;width:100%;font-size:14px;border:1px solid #eee">${tableRows}</table>
    ${attachments.length ? `<p style="color:#8a8378;font-size:13px;margin-top:12px">${attachments.length} Anhang/Anhänge angehängt.</p>` : ""}
  </div>`;

  const notifyText = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  try {
    // 1. Benachrichtigung an Alignum (mit Anhängen, Antwort geht an den Kunden).
    await sendEmail(apiKey, {
      from: MAIL_FROM,
      to: [MAIL_TO],
      reply_to: data.email,
      subject: `Neue Anfrage · ${services} · ${data.name}`,
      html: notifyHtml,
      text: notifyText,
      ...(attachments.length ? { attachments } : {}),
    });

    // 2. Bestätigung an den Absender.
    const confirmHtml = `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;color:#1a1a1a">
      <p>Hallo ${esc(data.name ?? "")},</p>
      <p>vielen Dank für Ihre Anfrage bei <strong>Alignum</strong>. Wir haben Ihre Angaben erhalten und melden uns persönlich bei Ihnen.</p>
      <p style="color:#8a8378;font-size:14px;margin-bottom:6px">Ihre Angaben im Überblick:</p>
      <table style="border-collapse:collapse;font-size:14px;border:1px solid #eee">${tableRows}</table>
      <p style="margin-top:20px">Herzliche Grüße<br/>Ihr Alignum-Team</p>
    </div>`;
    await sendEmail(apiKey, {
      from: MAIL_FROM,
      to: [data.email],
      subject: "Ihre Anfrage bei Alignum",
      html: confirmHtml,
      text: `Hallo ${data.name},\n\nvielen Dank für Ihre Anfrage bei Alignum. Wir haben Ihre Angaben erhalten und melden uns persönlich bei Ihnen.\n\nHerzliche Grüße\nIhr Alignum-Team`,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[anfrage] Mailversand fehlgeschlagen:", err);
    return Response.json({ error: "Versand fehlgeschlagen." }, { status: 502 });
  }
}
