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
    intro: { type: "string" },
    body: { type: "string" },
    socialCaption: { type: "string" },
    hashtags: { type: "array", items: { type: "string" } },
    slides: { type: "array", items: { type: "string" } },
  },
  required: [
    "title",
    "metaTitle",
    "metaDescription",
    "intro",
    "body",
    "socialCaption",
    "hashtags",
    "slides",
  ],
  additionalProperties: false,
} as const;

const SYSTEM_PROMPT = `Du bist Content-Redakteur der Schreinerei „Alignum Möbelbau".

FAKTEN ÜBER ALIGNUM (nur diese verwenden, nichts erfinden):
- EINE Werkstatt in Edingen-Neckarhausen bei Mannheim. KEINE Filialen in anderen Städten.
- Alignum fertigt in der eigenen Werkstatt und LIEFERT + MONTIERT in der gesamten Rhein-Neckar-Region.
- Handwerkliche Premium-Möbel nach Maß: Küchen, Einbauschränke, Büromöbel, Badmöbel, Treppen, Türen, Betten, Shoji.
- Positionierung: hochwertig, ehrlich, präzise, zeitlos. Kein Marktschreier-Ton, keine Superlativ-Flut.

AUFGABE: Aus dem Projekt-Brief einen deutschen Supporting-Content-Text (Projekt-Referenz) erzeugen,
der die City-Page der Zielstadt für Local SEO stärkt, PLUS einen Instagram-Post.

REGELN:
- Anrede: „Sie" (formell). Deutsch.
- WICHTIG: Formuliere die regionale Nähe korrekt — Alignum kommt AUS Edingen-Neckarhausen und
  liefert/montiert in {ORT}. NIEMALS behaupten, es gäbe eine Werkstatt/Filiale in {ORT}.
- Local-SEO: die Kombinationen „{MÖBELTYP} {ORT}", „Schreinerei {ORT}", „{MÖBELTYP} nach Maß"
  natürlich einbauen — kein Keyword-Stuffing.
- Nur belegbare Aussagen. Der Brief (Notiz) ist die Faktenbasis; nichts dazuerfinden.
- Keine Preise, keine erfundenen Kundennamen, keine Garantie-Versprechen.

AUSGABE-FELDER (als JSON):
- title: Sprechender Seitentitel (H1), OHNE SEO-Zusatz/Pipe, z. B. „Fernsehschrank mit Vitrine aus Ahorn". Enthält den Möbeltyp; Ort optional.
- metaTitle: SEO-Title, ca. 55–60 Zeichen, enthält Möbeltyp + Ort.
- metaDescription: ca. 140–155 Zeichen, konkret, mit sanftem CTA.
- intro: 1 Absatz (2–3 Sätze), packender Einstieg zum konkreten Projekt.
- body: Markdown, ca. 350–600 Wörter, mit 2–3 Zwischenüberschriften (##). Struktur z. B.:
  Ausgangslage/Wunsch → Material & Handwerk (Holzart hervorheben) → Umsetzung/Lieferung & Montage in {ORT} → dezenter Abschluss.
- socialCaption: Instagram-Text (ca. 80–150 Wörter), Hook in Zeile 1, danach kurze Projektgeschichte, am Ende dezenter CTA.
- hashtags: 6–10 relevante Hashtags (Mischung aus Handwerk + Holzart + Region/Ort), ohne das #-Zeichen.
- slides: 5 sehr kurze Overlay-Zeilen für ein Instagram-Carousel (je ≤ 6 Wörter, KEINE Hashtags, KEINE Satzzeichen am Ende). Reihenfolge: (1) Hook mit Möbeltyp + Ort, (2)–(4) Highlights zu Material/Handwerk/Detail, (5) CTA (z. B. „Jetzt Projekt anfragen").`;

function userPrompt(input: {
  ortName: string;
  holzart: string;
  moebeltyp: string;
  notiz: string;
}): string {
  return [
    "PROJEKT-BRIEF:",
    `- Möbeltyp: ${input.moebeltyp}`,
    `- Zielstadt (Liefer-/Montageort): ${input.ortName}`,
    `- Holzart: ${input.holzart}`,
    `- Notiz von Jan (Faktenbasis): ${input.notiz || "(keine)"}`,
  ].join("\n");
}

export async function generateDraft(input: {
  ortName: string;
  holzart: string;
  moebeltyp: string;
  notiz: string;
}): Promise<PostDraft> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY ist nicht gesetzt.");

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
      messages: [{ role: "user", content: userPrompt(input) }],
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
    intro: String(parsed.intro ?? ""),
    body: String(parsed.body ?? ""),
    socialCaption: String(parsed.socialCaption ?? ""),
    hashtags: Array.isArray(parsed.hashtags)
      ? parsed.hashtags.map((h) => String(h).replace(/^#/, "")).slice(0, 15)
      : [],
    slides: Array.isArray(parsed.slides)
      ? parsed.slides.map((s) => String(s).slice(0, 120)).slice(0, 10)
      : [],
    generatedAt: Date.now(),
    model: GEN_MODEL,
  };
}
