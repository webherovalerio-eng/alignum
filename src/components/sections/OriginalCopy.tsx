import { Reveal } from "@/components/ui/Reveal";
import { ORIGINAL_COPY } from "@/data/originalCopy";
import { Quote } from "lucide-react";

const SKIP_PATTERNS = [
  /^(jetzt|hier|mehr|zum|zur|kontakt|termin)\b/i,
  /\b(kontaktformular|beratungstermin|aufnehmen|vereinbaren|kontaktieren)\s*$/i,
  /^(unsere|ihre|deine)\s+\w+\s*$/i,
];

const TITLE_LIKE = /^[A-ZÄÖÜ\s\-&]{8,}$/; // ALL CAPS short strings (likely eyebrows)

function isSubstantialParagraph(text: string): boolean {
  const t = text.trim();
  if (t.length < 80) return false;
  if (TITLE_LIKE.test(t)) return false;
  if (SKIP_PATTERNS.some((p) => p.test(t))) return false;
  return true;
}

function dedupeParagraphs(paragraphs: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of paragraphs) {
    const key = p.slice(0, 120).toLowerCase().replace(/\s+/g, " ");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

/**
 * Originaltext-Sektion — zeigt die echten, von Wolf Preussner geschriebenen
 * Texte aus der bestehenden alignum.de Seite. Bewahrt die persönliche
 * Schreiner-Stimme statt sie durch generische SEO-Texte zu ersetzen.
 */
export function OriginalCopy({
  slug,
  eyebrow = "Aus erster Hand",
  maxParagraphs = 6,
}: {
  slug: string;
  eyebrow?: string;
  maxParagraphs?: number;
}) {
  const copy = ORIGINAL_COPY[slug];
  if (!copy || !copy.paragraphs?.length) return null;

  const filtered = dedupeParagraphs(
    copy.paragraphs.filter(isSubstantialParagraph),
  ).slice(0, maxParagraphs);

  if (filtered.length === 0) return null;

  // Erstes Paragraph als Lead, Rest als Body
  const [lead, ...body] = filtered;

  return (
    <section className="relative py-24 sm:py-32 border-y border-border bg-card/30">
      <div className="container-prose">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4 inline-flex items-center gap-2">
              <Quote className="size-3.5" />
              {eyebrow}
            </p>
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.05] tracking-tight">
              In den Worten <span className="italic text-muted-foreground">der Werkstatt.</span>
            </h2>
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
              Die folgenden Worte sind nicht von uns getextet, sondern von
              Wolf Preussner – wie er Ihnen sein Handwerk auch im Werkstatt­gespräch
              erklären würde.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-8">
            <article className="max-w-none">
              <p className="text-xl sm:text-2xl font-display leading-[1.4] text-foreground">
                {lead}
              </p>
              {body.length > 0 && (
                <div className="mt-8 pt-8 border-t border-border space-y-5">
                  {body.map((p, i) => (
                    <p
                      key={`body-${i}`}
                      className="text-base leading-relaxed text-foreground/80"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              )}
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
