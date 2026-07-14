/**
 * KI-Generierung von Supporting-Content (Projekt-/City-Page-Text) + Social-Post.
 * Ruft die Anthropic Messages API per fetch auf (kein SDK — analog zum
 * Resend-Mailversand) und erzwingt strukturiertes JSON via output_config.format.
 */
import { GEN_MODEL } from "./config";
import type { PostDraft } from "./types";

const ENDPOINT = "https://api.anthropic.com/v1/messages";

// JSON-Schema für structured outputs. Keine Längen-Constraints (nicht
// unterstützt) — Längen stehen im Prompt.
const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    metaTitle: { type: "string" },
    metaDescription: { type: "string" },
    summary: { type: "string" },
    body: { type: "string" },
    features: { type: "array", items: { type: "string" } },
    socialCaption: { type: "string" },
    hashtags: { type: "array", items: { type: "string" } },
  },
  required: [
    "title",
    "metaTitle",
    "metaDescription",
    "summary",
    "body",
    "features",
    "socialCaption",
    "hashtags",
  ],
  additionalProperties: false,
} as const;

const SYSTEM_PROMPT = `Du bist Content-Redakteur der Schreinerei „Alignum Möbelbau".

FAKTEN ÜBER ALIGNUM (nur diese verwenden, nichts erfinden):
- EINE Werkstatt in Edingen-Neckarhausen bei Mannheim. KEINE Filialen in anderen Städten.
- Alignum fertigt in der eigenen Werkstatt und LIEFERT + MONTIERT in der gesamten Rhein-Neckar-Region.
- Handwerkliche Premium-Möbel nach Maß: Küchen, Einbauschränke, Büromöbel, Badmöbel, Treppen, Türen, Betten, Shoji.
- Positionierung: hochwertig, ehrlich, präzise, zeitlos. Kein Marktschreier-Ton, keine Superlativ-Flut.

AUFGABE: Aus dem Projekt-Brief einen deutschen Projekt-Referenz-Eintrag im FESTEN
Alignum-Format erzeugen (wie die bestehenden Projekt-Detailseiten), der die City-Page
der Zielstadt für Local SEO stärkt, PLUS einen Instagram-Post.

FOTOS: Sofern dem Brief Fotos des FERTIGEN Möbels beigefügt sind, sind sie die PRIMÄRE
Faktenbasis für die Beschreibung. Beschreibe KONKRET, was tatsächlich sichtbar ist:
Bauweise (z. B. wandhängend oder stehend), Farben & Oberflächen (z. B. Hochglanz-Weiß,
Ölung), Fronten & Beschläge/Mechanik (z. B. grifflos, Push-to-Open), Materialkombination,
Beleuchtung, Glas/Vitrine, Aufteilung der Fächer. Leite daraus spezifische, glaubwürdige
Aussagen ab — wie ein Schreinermeister, der sein fertiges Stück zeigt. Erfinde NICHTS, das
weder auf den Fotos sichtbar noch in Jans Notiz belegt ist (keine Maße/Preise/Namen raten).

REGELN:
- Anrede: „Sie" (formell). Deutsch. Ton: schreinermeister-stolz, fachlich präzise, für Laien verständlich. Keine Werbe-Phrasen, keine Superlative.
- WICHTIG: Regionale Nähe korrekt — Alignum kommt AUS Edingen-Neckarhausen und liefert/montiert in {ORT}. NIEMALS eine Werkstatt/Filiale in {ORT} behaupten.
- Local-SEO: „{MÖBELTYP} {ORT}", „Schreinerei {ORT}", „{MÖBELTYP} nach Maß" natürlich einbauen — kein Keyword-Stuffing.
- Nur belegbare Aussagen. Der Brief (Notiz) ist die Faktenbasis; nichts dazuerfinden. Keine Preise, keine erfundenen Kundennamen, keine Garantie-Versprechen.

AUSGABE-FELDER (als JSON):
- title: Sprechender Seitentitel (H1), OHNE SEO-Zusatz/Pipe, z. B. „Fernsehschrank mit Vitrine aus Ahorn". Enthält den Möbeltyp.
- metaTitle: max 60 Zeichen, Reihenfolge Möbeltyp + Ort + Holzart + Marke „Alignum".
- metaDescription: max 155 Zeichen, konkret, sinngemäß „… nach Maß gefertigt für einen Kunden in {ORT}." mit sanftem CTA.
- summary: 1–2 Sätze Card-/Lead-Text unter der H1 — packend, nennt Möbeltyp + {ORT}.
- body: GENAU 4 Absätze, durch EINE Leerzeile getrennt, KEINE Überschriften, KEIN Markdown. Reihenfolge fix:
  (1) Kontext: Kunde/Raum/Stadt, Ausgangslage. (2) Lösung: was gebaut, Aussehen, Materialien. (3) Holz-Story: warum {HOLZART}, Eigenschaften/Charakter. (4) Prozess: Aufmaß → Fertigung in Edingen-Neckarhausen → Lieferung & Montage in {ORT}, realistische Zeitangabe.
- features: 4–6 sehr kurze Bullets „Was wir gebaut haben" (konkrete Bauteile/Eigenschaften, je ≤ 8 Wörter, KEINE Satzzeichen am Ende).
- socialCaption: Instagram-Text (ca. 80–150 Wörter), Hook in Zeile 1, danach kurze Projektgeschichte, am Ende dezenter CTA.
- hashtags: 6–10 relevante Hashtags (Handwerk + Holzart + Region/Ort), ohne das #-Zeichen.`;

function userPrompt(input: {
  ortName: string;
  holzart: string;
  moebeltyp: string;
  notiz: string;
}): string {
  return [
    "PROJEKT-BRIEF (die beigefügten Fotos zeigen das fertige Möbel):",
    `- Möbeltyp: ${input.moebeltyp}`,
    `- Zielstadt (Liefer-/Montageort): ${input.ortName}`,
    `- Holzart: ${input.holzart}`,
    `- Notiz von Jan (zusätzliche Faktenbasis): ${input.notiz || "(keine)"}`,
    "",
    "Beschreibe den body KONKRET anhand der Fotos + Notiz. Nutze sichtbare Details" +
      " (Bauweise, Farben, Fronten/Mechanik, Materialkombination, Beleuchtung) für" +
      " glaubwürdige, spezifische Aussagen — nichts erfinden.",
  ].join("\n");
}

export async function generateDraft(input: {
  ortName: string;
  holzart: string;
  moebeltyp: string;
  notiz: string;
  imageUrls?: string[];
}): Promise<PostDraft> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY ist nicht gesetzt.");

  // Ausgewählte Fotos als Bild-Blöcke voranstellen (max. 6, nur öffentliche
  // http(s)-URLs — der lokale Dev-Blob liefert relative Pfade, die die API nicht
  // erreichen kann, und wird daher übersprungen → Text-only-Fallback).
  const imageBlocks = (input.imageUrls ?? [])
    .filter((u) => typeof u === "string" && /^https?:\/\//i.test(u))
    .slice(0, 6)
    .map((url) => ({ type: "image", source: { type: "url", url } }));
  const content: unknown[] = [...imageBlocks, { type: "text", text: userPrompt(input) }];

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: GEN_MODEL,
      max_tokens: 8000,
      system: SYSTEM_PROMPT.replace(/\{ORT\}/g, input.ortName),
      output_config: { format: { type: "json_schema", schema: OUTPUT_SCHEMA } },
      messages: [{ role: "user", content }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
    stop_reason?: string;
  };
  const text = data.content?.find((b) => b.type === "text")?.text ?? "";
  let parsed: Omit<PostDraft, "generatedAt" | "model">;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Antwort konnte nicht als JSON gelesen werden.");
  }

  return {
    title: String(parsed.title ?? "").slice(0, 120),
    metaTitle: String(parsed.metaTitle ?? "").slice(0, 120),
    metaDescription: String(parsed.metaDescription ?? "").slice(0, 300),
    summary: String(parsed.summary ?? ""),
    body: String(parsed.body ?? ""),
    features: Array.isArray(parsed.features)
      ? parsed.features.map((f) => String(f).slice(0, 120)).slice(0, 8)
      : [],
    socialCaption: String(parsed.socialCaption ?? ""),
    hashtags: Array.isArray(parsed.hashtags)
      ? parsed.hashtags.map((h) => String(h).replace(/^#/, "")).slice(0, 15)
      : [],
    generatedAt: Date.now(),
    model: GEN_MODEL,
  };
}
