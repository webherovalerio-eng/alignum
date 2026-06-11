import Image from "next/image";
import { Reveal, MaskWords } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/data/site";

export const metadata = buildMetadata({
  title: "Brandbook — Alignum",
  description:
    "Alle Brand-Assets von Alignum auf einen Blick: Logo, Farbpalette, Typografie, Bildsprache und Sprach-Tonalität.",
  path: "/brand/",
  noindex: true,
});

const COLORS = [
  { token: "primary", hex: "#d48408", hsl: "39 90% 43%", name: "Alignum-Gold", role: "Akzent, CTAs, aktive States" },
  { token: "surface-deep", hex: "#0f0f0f", hsl: "0 0% 6%", name: "Surface Deep", role: "Statement-Panels, Hero-Backgrounds" },
  { token: "background", hex: "#fbf8f3", hsl: "36 33% 97%", name: "Parchment", role: "Light-Mode Body-Background" },
  { token: "foreground", hex: "#141414", hsl: "0 0% 8%", name: "Tiefschwarz", role: "Light-Mode Text" },
  { token: "card", hex: "#fefcf7", hsl: "36 33% 99%", name: "Card Cream", role: "Cards, gehobene Surfaces" },
  { token: "muted", hex: "#ece6db", hsl: "36 18% 93%", name: "Muted Cream", role: "Subtile Backgrounds, Band-Rhythmus" },
  { token: "border", hex: "#c9bea9", hsl: "32 14% 78%", name: "Border", role: "Trennlinien, Card-Border" },
];

const TYPOGRAPHY = [
  {
    name: "Cinzel",
    role: "Brand-Caps · Logo · Eyebrows",
    cssVar: "--font-brand",
    desc:
      "Free Google-Fonts-Variante von Trajan Pro. Römische Capitalis, lapidare Anmutung — identisch zum ALIGNUM-MÖBELBAU-Schriftzug im Logo.",
    sample: "ALIGNUM · MÖBELBAU",
    className: "font-brand",
    style: { fontSize: "32px", letterSpacing: "0.32em" },
  },
  {
    name: "Fraunces",
    role: "Display · Headlines · Hero-Titel",
    cssVar: "--font-display",
    desc:
      "Variable Serif von Undercase Type. Modern-klassisch mit optischen Größen und SOFT-Achse — perfekt für große Hero-Headlines, Section-Titles, Italics.",
    sample: "Schreiner aus Leidenschaft.",
    className: "font-display",
    style: { fontSize: "56px", letterSpacing: "-0.025em" },
  },
  {
    name: "Inter",
    role: "Body · Buttons · UI",
    cssVar: "--font-sans",
    desc:
      "Funktionale, hoch lesbare Sans-Serif für alle Body-Texte, Buttons, Form-Inputs, Meta-Daten. Bewährter Standard für moderne Webseiten.",
    sample: "Maßgefertigte Möbel aus Massivholz — Küchen, Treppen, Türen.",
    className: "",
    style: { fontSize: "22px" },
  },
];

const VOICE = {
  do: [
    'Sprich persönlich („wir", „Jan", „bei Ihnen").',
    'Sei fachlich präzise (Massivholz, Furnier, Soft-Close — nicht „Holz-Möbel").',
    'Mach klare Bilder im Text („Treppe, die schwebt", „aus einem Stamm geschnitten").',
    'Erwähne den Standort ehrlich: Werkstatt in Edingen-Neckarhausen, Liefergebiet Region.',
    'Höchstens zwei Adjektive vor einem Substantiv.',
  ],
  dont: [
    'Keine Floskeln („maßgeschneiderte Lösungen für höchste Ansprüche").',
    'Kein Marketing-Sprech („Premium-Erlebnis", „revolutionäre Qualität").',
    'Keine Behauptung lokaler Präsenz wo keine ist („vor Ort in {Stadt}").',
    'Keine 5-Jahre-Garantie versprechen, wenn nicht konkret beworben.',
    'Keine Stadt-Zuordnungen für Projekte erfinden.',
  ],
};

const DONTS_VISUAL = [
  'Kein Gold-Shimmer-Gradient (animierter background-clip:text) auf Display-Headlines — wirkt billig.',
  'Logo NICHT in einer eigenen SVG-Variante nachzeichnen — immer die offiziellen PNG-Assets (logo.png / logo-dark.png) verwenden.',
  'Keine hardcoded Farben im JSX — alles über CSS-Variablen / Tailwind-Tokens.',
  'Logo nie mit zusätzlichem „alignum"-Text daneben — das Logo enthält den Schriftzug bereits.',
  'Keine Stock-Fotos mit Möbeln, die nicht von Alignum gefertigt wurden.',
];

export default function BrandbookPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative pt-40 pb-12 grain-overlay">
        <div className="container-prose">
          <Reveal>
            <Badge variant="outline" className="mb-6">
              <span className="size-1.5 rounded-full bg-primary" />
              Internes Brandbook · v1.0
            </Badge>
            <h1 className="font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] tracking-tight max-w-[18ch]">
              <MaskWords text="Brand­book" />
            </h1>
            <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Alle Brand-Assets, Farbtokens, Schriften, Bildsprache und
              Sprach-Tonalität von Alignum Möbelbau auf einer Seite. Für
              Jan, das Team und alle, die Inhalte für Alignum gestalten.
            </p>
          </Reveal>
        </div>
      </section>

      {/* LOGO */}
      <section className="relative py-20 border-t border-border">
        <div className="container-prose">
          <SectionHead n="01" eyebrow="Logo" title="Das Markenzeichen" />

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <Reveal>
              <div className="rounded-2xl border border-border bg-surface-deep p-12 flex items-center justify-center min-h-[260px]">
                <Image
                  src="/logo.png"
                  alt="Alignum Logo (weiß) für dunkle Hintergründe"
                  width={340}
                  height={113}
                  className="h-auto w-72"
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                <span className="font-brand text-foreground text-[10px]">Logo Light</span>{" "}
                · <code>/logo.png</code> · für dunkle Surfaces
              </p>
            </Reveal>

            <Reveal>
              <div className="rounded-2xl border border-border bg-card p-12 flex items-center justify-center min-h-[260px]">
                <Image
                  src="/logo-dark.png"
                  alt="Alignum Logo (dunkel) für helle Hintergründe"
                  width={340}
                  height={113}
                  className="h-auto w-72"
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                <span className="font-brand text-foreground text-[10px]">Logo Dark</span>{" "}
                · <code>/logo-dark.png</code> · für helle Surfaces
              </p>
            </Reveal>
          </div>

          <Reveal className="mt-8 rounded-xl border border-border bg-card p-6">
            <p className="font-brand text-[11px] text-primary mb-3">Regeln</p>
            <ul className="space-y-2 text-sm text-foreground/85 leading-relaxed">
              <li>
                <strong>Mindestabstand</strong>: außenherum mindestens die Höhe
                des „A" als Schutzraum freilassen.
              </li>
              <li>
                <strong>Mindestgröße</strong>: 24 px Höhe (digital) bzw. 8 mm
                (Print).
              </li>
              <li>
                <strong>Verwendung</strong>: immer das passende File für die
                Kontrastverhältnisse wählen (siehe Vergleich oben).
              </li>
              <li>
                <strong>Keine eigenen Varianten</strong> — niemals selbst
                nachzeichnen, einfärben oder strecken. Bei Bedarf{" "}
                <a className="text-primary underline-grain" href="mailto:info@webhero-valerio.de">
                  WEBhero ansprechen
                </a>
                .
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* FARBEN */}
      <section className="relative py-20 section-band">
        <div className="container-prose">
          <SectionHead n="02" eyebrow="Farben" title="Palette" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COLORS.map((c, i) => (
              <Reveal key={c.token} delay={i * 0.04}>
                <div className="rounded-2xl border border-border overflow-hidden bg-card">
                  <div
                    className="h-28"
                    style={{ background: `hsl(${c.hsl})` }}
                  />
                  <div className="p-5">
                    <p className="font-brand text-[10px] text-primary mb-1">
                      {c.name}
                    </p>
                    <p className="font-display text-xl mb-3">{c.token}</p>
                    <div className="space-y-1.5 text-xs">
                      <p className="flex justify-between gap-3 text-muted-foreground">
                        <span>Hex</span>
                        <code className="text-foreground">{c.hex}</code>
                      </p>
                      <p className="flex justify-between gap-3 text-muted-foreground">
                        <span>HSL</span>
                        <code className="text-foreground">{c.hsl}</code>
                      </p>
                      <p className="flex justify-between gap-3 text-muted-foreground">
                        <span>Tailwind</span>
                        <code className="text-foreground">bg-{c.token}</code>
                      </p>
                    </div>
                    <p className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground leading-relaxed">
                      {c.role}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TYPOGRAFIE */}
      <section className="relative py-20 border-t border-border">
        <div className="container-prose">
          <SectionHead n="03" eyebrow="Typografie" title="Drei Schriften, eine Stimme" />

          <div className="space-y-5">
            {TYPOGRAPHY.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.05}>
                <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
                  <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
                    <div>
                      <p className="font-brand text-[11px] text-primary">
                        {t.role}
                      </p>
                      <h3 className="font-display text-3xl sm:text-4xl mt-1">
                        {t.name}
                      </h3>
                    </div>
                    <code className="text-xs text-muted-foreground">
                      var({t.cssVar})
                    </code>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                    {t.desc}
                  </p>
                  <p
                    className={`${t.className} text-foreground border-t border-border pt-6 break-words`}
                    style={t.style}
                  >
                    {t.sample}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SPRACHE */}
      <section className="relative py-20 section-band">
        <div className="container-prose">
          <SectionHead n="04" eyebrow="Sprache" title="So klingt Alignum" />

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <Reveal>
              <div className="rounded-2xl border border-primary/40 bg-card p-7">
                <p className="font-brand text-[11px] text-primary mb-4">
                  Do — so schreiben wir
                </p>
                <ul className="space-y-3">
                  {VOICE.do.map((v) => (
                    <li
                      key={v}
                      className="flex items-start gap-3 text-sm text-foreground/85 leading-relaxed"
                    >
                      <span className="mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                        ✓
                      </span>
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal>
              <div className="rounded-2xl border border-border bg-card p-7">
                <p className="font-brand text-[11px] text-muted-foreground mb-4">
                  Don't — vermeiden
                </p>
                <ul className="space-y-3">
                  {VOICE.dont.map((v) => (
                    <li
                      key={v}
                      className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed"
                    >
                      <span className="mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground text-[10px]">
                        ×
                      </span>
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-6">
            <div className="rounded-2xl bg-surface-deep text-surface-deep-foreground p-8 sm:p-10">
              <p className="font-brand text-[11px] text-primary mb-4">
                Markenstatement
              </p>
              <p className="font-display text-2xl sm:text-3xl leading-snug italic">
                „{SITE.brandStatement}"
              </p>
              <p className="mt-4 text-sm opacity-70">
                — {SITE.owner.fullName}, {SITE.owner.role}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DON'TS VISUELL */}
      <section className="relative py-20 border-t border-border">
        <div className="container-prose">
          <SectionHead n="05" eyebrow="Don'ts visuell" title="Was wir nie tun" />

          <Reveal>
            <ul className="space-y-3">
              {DONTS_VISUAL.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-5"
                >
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-destructive/40 bg-destructive/10 text-destructive">
                    ×
                  </span>
                  <span className="text-sm text-foreground/85 leading-relaxed">
                    {d}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* DOWNLOAD / KONTAKT */}
      <section className="relative py-24 section-band">
        <div className="container-tight text-center">
          <Reveal>
            <p className="font-brand text-[11px] text-primary mb-4">Assets &amp; Kontakt</p>
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-tight mb-6">
              Logo-Files & Brand-Assets
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Alle Brand-Files liegen unter <code>/web/public/logo*.png</code>{" "}
              im Repo. Bei Bedarf SVG-Version, Briefpapier, Visitenkarten —
              kurze Nachricht reicht.
            </p>
            <p className="text-sm">
              <a
                className="inline-flex items-center px-5 py-3 rounded-full border border-border bg-card hover:border-primary hover:text-primary transition-colors"
                href="mailto:info@webhero-valerio.de?subject=Brand-Anfrage%20Alignum"
              >
                Brand-Anfrage an WEBhero stellen
              </a>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function SectionHead({
  n,
  eyebrow,
  title,
}: {
  n: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <Reveal className="mb-12">
      <div className="flex items-baseline gap-5 mb-4">
        <span className="font-brand text-[10px] text-primary">{n}</span>
        <span className="font-brand text-[10px] text-muted-foreground">
          {eyebrow}
        </span>
      </div>
      <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] tracking-tight">
        {title}
      </h2>
    </Reveal>
  );
}
