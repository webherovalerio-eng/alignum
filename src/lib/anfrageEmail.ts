/**
 * E-Mail-Vorlagen für das Anfrageformular — im Alignum-Look (Schwarz/Weiß/Gold,
 * Cinzel-Schriftzug). Reine Funktion ohne Versand-Logik, damit sie sowohl von
 * der API-Route als auch vom Test-Skript genutzt werden kann.
 *
 * E-Mail-Realität: <style> + Webfonts + prefers-color-scheme funktionieren nur
 * in einigen Clients (Apple Mail, iOS). Deshalb ist die Inline-Variante (helles,
 * elegantes „Papier") die verlässliche Basis; der <style>-Block liefert Cinzel
 * und einen Dark-Mode-Swap als Progressive Enhancement.
 */

export type AnfrageData = {
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

const PHONE_DISPLAY = "06203 839010";
const PHONE_HREF = "+496203839010";
const EMAIL = "info@alignum.de";
const ADDRESS = "Mannheimer Straße 80 · 68535 Edingen-Neckarhausen";

function esc(s: string) {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function rowsToHtml(rows: [string, string][]) {
  return rows
    .map(([k, v], i) => {
      const sep = i === 0 ? "" : "border-top:1px solid #efe9dd;";
      return `<tr>
        <td class="rowsep rowk" style="${sep}padding:12px 16px 12px 0;vertical-align:top;width:150px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8b8478;">${esc(k)}</td>
        <td class="rowsep rowv" style="${sep}padding:12px 0;vertical-align:top;font-size:14px;line-height:1.55;color:#1c1a17;white-space:pre-wrap;">${esc(v)}</td>
      </tr>`;
    })
    .join("");
}

function shell(o: {
  preheader: string;
  kicker: string;
  heading: string;
  intro: string;
  rowsHtml: string;
  footerHtml: string;
}) {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<style>
  :root { color-scheme: light dark; supported-color-schemes: light dark; }
  body,table,td { margin:0; padding:0; }
  a { color:#b8760a; text-decoration:none; }
  .email-bg { background:#f1ede4; }
  .card { background:#ffffff; border-color:#e8e2d6; }
  .hair { background:#e8e2d6; }
  .tx { color:#1c1a17; }
  .body-tx { color:#3a352e; }
  .mut { color:#8b8478; }
  .wm { color:#c07d0a; }
  .accent { background:#c07d0a; }
  @media (prefers-color-scheme: dark) {
    .email-bg { background:#141210 !important; }
    .card { background:#1e1b17 !important; border-color:#34302a !important; }
    .hair { background:#34302a !important; }
    .tx { color:#f2ede3 !important; }
    .body-tx { color:#d9d2c6 !important; }
    .mut { color:#a49c8e !important; }
    .wm { color:#e3a63a !important; }
    .accent { background:#e3a63a !important; }
    .rowsep { border-color:#2b2823 !important; }
    .rowk { color:#a49c8e !important; }
    .rowv { color:#f2ede3 !important; }
    a { color:#e3a63a !important; }
  }
</style>
</head>
<body class="email-bg" style="background:#f1ede4;margin:0;padding:0;font-family:'Source Sans 3',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(o.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="email-bg" style="background:#f1ede4;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="card" style="width:600px;max-width:600px;background:#ffffff;border:1px solid #e8e2d6;border-radius:16px;">
        <tr><td style="padding:36px 40px 0 40px;">
          <div class="wm" style="font-family:'Cinzel',Georgia,'Times New Roman',serif;font-size:26px;font-weight:600;letter-spacing:0.24em;color:#c07d0a;text-transform:uppercase;">Alignum</div>
          <div class="mut" style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#8b8478;margin-top:7px;">Möbelbau &middot; Schreinerei</div>
          <div class="accent" style="height:2px;width:46px;background:#c07d0a;margin-top:20px;font-size:0;line-height:0;">&nbsp;</div>
        </td></tr>
        <tr><td style="padding:26px 40px 4px 40px;">
          <p class="mut" style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#8b8478;margin:0 0 10px 0;">${esc(o.kicker)}</p>
          <h1 class="tx" style="font-family:'Cinzel',Georgia,'Times New Roman',serif;font-weight:600;font-size:25px;line-height:1.25;color:#1c1a17;margin:0 0 14px 0;">${esc(o.heading)}</h1>
          <p class="body-tx" style="font-size:15px;line-height:1.65;color:#3a352e;margin:0 0 8px 0;">${o.intro}</p>
        </td></tr>
        <tr><td style="padding:14px 40px 6px 40px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${o.rowsHtml}</table>
        </td></tr>
        <tr><td style="padding:20px 40px 36px 40px;">
          <div class="hair" style="height:1px;background:#e8e2d6;margin-bottom:18px;font-size:0;line-height:0;">&nbsp;</div>
          ${o.footerHtml}
        </td></tr>
      </table>
      <div class="mut" style="font-family:'Source Sans 3',Helvetica,Arial,sans-serif;font-size:11px;color:#8b8478;margin-top:16px;letter-spacing:0.04em;">Alignum Möbelbau &middot; ${ADDRESS}</div>
    </td></tr>
  </table>
</body>
</html>`;
}

function confirmFooter() {
  return `<p class="body-tx" style="font-size:14px;line-height:1.6;color:#3a352e;margin:0 0 14px 0;">Sie erreichen uns jederzeit direkt:</p>
    <p style="font-size:14px;line-height:1.7;margin:0;">
      <a href="tel:${PHONE_HREF}" style="color:#b8760a;text-decoration:none;">${PHONE_DISPLAY}</a><br>
      <a href="mailto:${EMAIL}" style="color:#b8760a;text-decoration:none;">${EMAIL}</a>
    </p>
    <p class="mut" style="font-size:13px;line-height:1.6;color:#8b8478;margin:16px 0 0 0;">Herzliche Grüße<br>Ihr Alignum-Team</p>`;
}

function notifyFooter(data: AnfrageData) {
  const mail = data.email
    ? `<a href="mailto:${esc(data.email)}" style="color:#b8760a;text-decoration:none;">${esc(data.email)}</a>`
    : "—";
  const tel = data.phone
    ? `<a href="tel:${esc(data.phone.replace(/[^\d+]/g, ""))}" style="color:#b8760a;text-decoration:none;">${esc(data.phone)}</a>`
    : "—";
  return `<p class="mut" style="font-size:13px;line-height:1.6;color:#8b8478;margin:0 0 6px 0;">Direkt kontaktieren</p>
    <p style="font-size:14px;line-height:1.7;margin:0;">${mail}${data.phone ? " &middot; " + tel : ""}</p>`;
}

export function buildAnfrageEmails(
  data: AnfrageData,
  opts?: { attachments?: number },
) {
  const attachments = opts?.attachments ?? 0;
  const services = data.serviceNames?.length ? data.serviceNames.join(", ") : "—";
  const name = data.name?.trim() || "";

  const rows: [string, string][] = [
    ["Leistung", services],
    ["Umfang", data.scope || "—"],
    ["Budget", data.budget || "—"],
    ["Zeitrahmen", data.timeline || "—"],
    ["Beschreibung", data.description?.trim() || "—"],
    ["Maße / Räume", data.measurements?.trim() || "—"],
    ["Name", name || "—"],
    ["E-Mail", data.email || "—"],
    ["Telefon", data.phone?.trim() || "—"],
    ["Ort", data.city?.trim() || "—"],
    ["Erreichbar", CONTACT_PREF[data.contactPref ?? ""] ?? data.contactPref ?? "—"],
  ];
  const rowsHtml = rowsToHtml(rows);

  const notify = {
    subject: `Neue Anfrage · ${services} · ${name || "Kontakt"}`,
    html: shell({
      preheader: `Neue Anfrage von ${name || "einem Interessenten"} über alignum.de`,
      kicker: "Neue Anfrage · alignum.de",
      heading: services === "—" ? "Neue Anfrage" : services,
      intro: `Über das Formular auf alignum.de ist eine neue Anfrage eingegangen. Antworten Sie einfach direkt auf diese E-Mail, um <strong>${esc(name || "den Interessenten")}</strong> zu erreichen.${attachments ? ` <br>${attachments} Datei-Anhang${attachments > 1 ? "/Anhänge" : ""} beigefügt.` : ""}`,
      rowsHtml,
      footerHtml: notifyFooter(data),
    }),
    text: [
      "Neue Anfrage über alignum.de",
      "",
      ...rows.map(([k, v]) => `${k}: ${v}`),
      "",
      attachments ? `${attachments} Datei-Anhang/Anhänge beigefügt.` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  };

  const confirm = {
    subject: "Ihre Anfrage bei Alignum",
    html: shell({
      preheader: "Ihre Anfrage bei Alignum ist eingegangen – wir melden uns persönlich bei Ihnen.",
      kicker: "Ihre Anfrage",
      heading: name ? `Vielen Dank, ${name}.` : "Vielen Dank für Ihre Anfrage.",
      intro: "Wir haben Ihre Anfrage erhalten und melden uns persönlich bei Ihnen. Hier Ihre Angaben noch einmal im Überblick:",
      rowsHtml,
      footerHtml: confirmFooter(),
    }),
    text: `Hallo ${name || ""},\n\nvielen Dank für Ihre Anfrage bei Alignum. Wir haben Ihre Angaben erhalten und melden uns persönlich bei Ihnen.\n\nHerzliche Grüße\nIhr Alignum-Team\n${PHONE_DISPLAY} · ${EMAIL}`,
  };

  return { notify, confirm };
}
