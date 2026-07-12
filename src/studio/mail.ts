/**
 * Mailversand fürs Studio — nutzt dieselbe Resend-REST-Anbindung wie das
 * Anfrageformular (kein SDK). Ohne RESEND_API_KEY (lokal) wird nicht gesendet;
 * der Aufrufer loggt in Dev stattdessen den Link in die Server-Konsole.
 */
import { siteUrl } from "./config";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const MAIL_FROM = process.env.MAIL_FROM ?? "Alignum <info@alignum.de>";

export interface SendResult {
  sent: boolean;
  devFallback?: boolean;
}

export async function sendMail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, devFallback: true };

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
  return { sent: true };
}

// --- Templates -------------------------------------------------------------
export function magicLinkEmail(link: string, minutes: number) {
  const subject = "Dein Login-Link fürs Alignum-Studio";
  const text = [
    "Hallo,",
    "",
    "hier ist dein einmaliger Login-Link fürs Alignum-Studio:",
    link,
    "",
    `Der Link ist ${minutes} Minuten gültig und funktioniert nur einmal.`,
    "Falls du keinen Login angefordert hast, ignoriere diese E-Mail einfach.",
    "",
    "— Alignum",
  ].join("\n");
  const html = `
  <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a">
    <p>Hallo,</p>
    <p>hier ist dein einmaliger Login-Link fürs <strong>Alignum-Studio</strong>:</p>
    <p style="margin:24px 0">
      <a href="${link}" style="background:#111;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;display:inline-block">
        Jetzt einloggen
      </a>
    </p>
    <p style="font-size:13px;color:#666">
      Der Link ist ${minutes} Minuten gültig und funktioniert nur einmal.<br>
      Falls du keinen Login angefordert hast, ignoriere diese E-Mail einfach.
    </p>
    <p style="font-size:13px;color:#999;margin-top:24px">— Alignum</p>
  </div>`;
  return { subject, html, text };
}

export function submissionNotifyEmail(opts: {
  postId: string;
  ortName: string;
  holzart: string;
  moebeltyp: string;
  imageCount: number;
}) {
  const subject = `Freigegeben: ${opts.moebeltyp} ${opts.ortName}`;
  const studioLink = `${siteUrl()}/studio/${opts.postId}`;
  const text = [
    "Jan hat einen Beitrag im Studio freigegeben (Text wurde generiert).",
    "",
    `Möbeltyp: ${opts.moebeltyp}`,
    `Ort: ${opts.ortName}`,
    `Holzart: ${opts.holzart}`,
    `Ausgewählte Bilder: ${opts.imageCount}`,
    "",
    `Im Studio ansehen: ${studioLink}`,
  ].join("\n");
  const html = `
  <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a">
    <p>Jan hat einen Beitrag im Studio freigegeben (Text wurde generiert).</p>
    <table style="border-collapse:collapse;font-size:14px">
      <tr><td style="padding:4px 12px 4px 0;color:#666">Möbeltyp</td><td><strong>${opts.moebeltyp}</strong></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Ort</td><td>${opts.ortName}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Holzart</td><td>${opts.holzart}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Bilder</td><td>${opts.imageCount}</td></tr>
    </table>
    <p style="margin:20px 0">
      <a href="${studioLink}" style="background:#111;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;display:inline-block">Im Studio ansehen</a>
    </p>
  </div>`;
  return { subject, html, text };
}
