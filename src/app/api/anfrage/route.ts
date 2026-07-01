import type { NextRequest } from "next/server";
import { buildAnfrageEmails, type AnfrageData } from "@/lib/anfrageEmail";

// Node-Runtime: brauchen Buffer für Base64-Anhänge + FormData mit Dateien.
export const runtime = "nodejs";
export const maxDuration = 20;

const RESEND_ENDPOINT = "https://api.resend.com/emails";

// Absender MUSS eine in Resend verifizierte Domain sein, sonst 403.
const MAIL_FROM = process.env.MAIL_FROM ?? "Alignum <info@alignum.de>";
const MAIL_TO = process.env.MAIL_TO ?? "info@alignum.de";

const MAX_FILES = 5;
const MAX_TOTAL_BYTES = 8 * 1024 * 1024; // 8 MB gesamt

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

  let data: AnfrageData;
  try {
    data = JSON.parse(String(form.get("payload") ?? "{}")) as AnfrageData;
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

  const { notify, confirm } = buildAnfrageEmails(data, {
    attachments: attachments.length,
  });

  try {
    // 1. Benachrichtigung an die Werkstatt (Antwort geht an den Kunden).
    await sendEmail(apiKey, {
      from: MAIL_FROM,
      to: [MAIL_TO],
      reply_to: data.email,
      subject: notify.subject,
      html: notify.html,
      text: notify.text,
      ...(attachments.length ? { attachments } : {}),
    });

    // 2. Bestätigung an den Absender.
    await sendEmail(apiKey, {
      from: MAIL_FROM,
      to: [data.email],
      subject: confirm.subject,
      html: confirm.html,
      text: confirm.text,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[anfrage] Mailversand fehlgeschlagen:", err);
    return Response.json({ error: "Versand fehlgeschlagen." }, { status: 502 });
  }
}
