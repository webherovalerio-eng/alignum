"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import type { PostDraft, PostImage } from "@/studio/types";

/**
 * Redaktionelle Vorschau des generierten Entwurfs — Struktur folgt dem
 * `alignum-projects`-Skill (summary + 4 Absätze + features):
 *  – oben die Projektseite im Look der echten /projekte-Seite, Texte inline
 *    editierbar (Titel, Lead, Projekt-Text, „Was wir gebaut haben");
 *  – darunter das feste 6-Slide-Carousel (Cover · Idee · Lösung · Holz · Bauteile
 *    · CTA), datengetrieben aus denselben Feldern, plus Editier-Box.
 * Alle Änderungen gehen über `patch` in den Draft (und werden wie gehabt gespeichert).
 */
export function DraftPreview({
  draft,
  patch,
  images,
  ortName,
  holzart,
  moebeltyp,
}: {
  draft: PostDraft;
  patch: (p: Partial<PostDraft>) => void;
  images: PostImage[]; // ausgewählte Bilder
  ortName: string;
  holzart: string;
  moebeltyp: string;
}) {
  const title = draft.title?.trim() || moebeltyp || draft.metaTitle;
  const lead = draft.summary ?? draft.intro ?? "";
  const paras = draft.body ? draft.body.split(/\n{2,}/) : [];
  const features = draft.features ?? [];
  const cover = images[0];
  const gallery = images.slice(1);

  const setPara = (i: number, value: string) => {
    const arr = paras.length ? [...paras] : [""];
    arr[i] = value;
    patch({ body: arr.join("\n\n") });
  };
  const setFeature = (i: number, value: string) => {
    const arr = [...features];
    arr[i] = value;
    patch({ features: arr });
  };
  const addFeature = () => patch({ features: [...features, ""] });
  const removeFeature = (i: number) =>
    patch({ features: features.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-8">
      {/* ─────────────── Projektseite (Vorschau) ─────────────── */}
      <section className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background">
        <div className="border-b border-border bg-card/60 px-4 py-2 text-xs text-muted-foreground">
          Vorschau · so erscheint das Projekt auf der Website · Texte anklicken zum Bearbeiten
        </div>

        <div className="mx-auto max-w-2xl px-5 py-8 sm:px-8 sm:py-10">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 px-3 py-1 text-xs text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            Referenzprojekt{ortName ? ` · ${ortName}` : ""}
          </p>

          <AutoTextarea
            value={title}
            onChange={(v) => patch({ title: v })}
            placeholder="Projekttitel …"
            className="font-display text-[clamp(1.8rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-tight text-foreground"
          />

          <div className="mt-4">
            <AutoTextarea
              value={lead}
              onChange={(v) => patch({ summary: v })}
              placeholder="Lead / Kurzbeschreibung …"
              className="text-lg leading-relaxed text-muted-foreground"
            />
          </div>

          {cover && (
            <div className="mt-7 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover.url}
                alt={title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Eckdaten */}
          <div className="mt-7 flex flex-wrap gap-2">
            {[
              ["Standort", ortName],
              ["Material", holzart],
              ["Möbel", moebeltyp],
            ]
              .filter(([, v]) => v)
              .map(([label, v]) => (
                <span
                  key={label}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground/80"
                >
                  <span className="text-muted-foreground">{label}: </span>
                  {v}
                </span>
              ))}
          </div>

          {/* Projekt-Text — 4 Absätze, erster größer (wie echte Seite) */}
          <div className="mt-7 space-y-4">
            {(paras.length ? paras : [""]).map((p, i) => (
              <AutoTextarea
                key={i}
                value={p}
                onChange={(v) => setPara(i, v)}
                placeholder={i === 0 ? "Erster Absatz …" : "Absatz …"}
                className={
                  i === 0
                    ? "font-display text-xl leading-snug text-foreground"
                    : "text-base leading-relaxed text-foreground/85"
                }
              />
            ))}
          </div>

          {/* Was wir gebaut haben */}
          <div className="mt-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-primary">
              Was wir gebaut haben
            </p>
            <ul className="space-y-2">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-2 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    ✓
                  </span>
                  <AutoTextarea
                    value={f}
                    onChange={(v) => setFeature(i, v)}
                    placeholder="Bauteil / Eigenschaft …"
                    className="text-foreground/90"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    aria-label="Punkt entfernen"
                    className="mt-1 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={addFeature}
              className="mt-2 text-xs text-primary hover:underline"
            >
              + Punkt hinzufügen
            </button>
          </div>

          {/* Galerie */}
          {gallery.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {gallery.map((img) => (
                <div
                  key={img.key}
                  className="aspect-square overflow-hidden rounded-xl border border-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.filename}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─────────────── Social-Carousel (feste 6 Slides) ─────────────── */}
      <section className="space-y-4">
        <h3 className="font-label text-sm font-semibold text-foreground">
          Instagram-Carousel · 6 Slides
        </h3>

        <div className="flex snap-x gap-3 overflow-x-auto pb-2">
          <SlideCover img={cover} title={title} sub={lead} ortName={ortName} />
          <SlideText n={2} eyebrow="Die Idee" text={paras[0] ?? ""} />
          <SlideText n={3} eyebrow="Die Lösung" text={paras[1] ?? ""} img={images[1]} />
          <SlideText
            n={4}
            eyebrow={holzart ? `Das Holz · ${holzart}` : "Das Holz"}
            text={paras[2] ?? ""}
            img={images[2]}
          />
          <SlideFeatures n={5} features={features} />
          <SlideCta n={6} />
        </div>

        {/* Editier-Box: Slide-Texte + Caption + Hashtags */}
        <div className="space-y-4 rounded-[var(--radius-lg)] border border-border bg-card/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Texte auf den Slides
          </p>
          <SlideField label="1 · Cover-Titel" value={title} onChange={(v) => patch({ title: v })} />
          <SlideField label="1 · Cover-Untertitel" value={lead} onChange={(v) => patch({ summary: v })} />
          <SlideField label="2 · Die Idee" value={paras[0] ?? ""} onChange={(v) => setPara(0, v)} />
          <SlideField label="3 · Die Lösung" value={paras[1] ?? ""} onChange={(v) => setPara(1, v)} />
          <SlideField label="4 · Das Holz" value={paras[2] ?? ""} onChange={(v) => setPara(2, v)} />
          <div>
            <span className="mb-1 block text-xs text-muted-foreground">
              5 · Was wir gebaut haben
            </span>
            <p className="text-xs text-muted-foreground/70">
              (wird oben unter „Was wir gebaut haben“ bearbeitet)
            </p>
          </div>
          <div>
            <span className="mb-1 block text-xs text-muted-foreground">6 · CTA</span>
            <p className="rounded-[var(--radius)] border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
              Aufmaß bei Ihnen. Fertigung bei uns. · alignum.de/anfrage (fest)
            </p>
          </div>

          <label className="block border-t border-border pt-4">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Caption
            </span>
            <AutoTextarea
              value={draft.socialCaption}
              onChange={(v) => patch({ socialCaption: v })}
              placeholder="Instagram-Caption …"
              className="rounded-[var(--radius)] border border-input bg-background p-3 text-sm text-foreground focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Hashtags
            </span>
            <input
              value={draft.hashtags.join(" ")}
              onChange={(e) =>
                patch({
                  hashtags: e.target.value
                    .split(/[\s,]+/)
                    .map((h) => h.replace(/^#/, ""))
                    .filter(Boolean),
                })
              }
              className="h-10 w-full rounded-[var(--radius)] border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            />
            {draft.hashtags.length > 0 && (
              <p className="mt-2 text-xs text-primary">
                {draft.hashtags.map((h) => `#${h}`).join(" ")}
              </p>
            )}
          </label>
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────── Carousel-Slides ───────────────────────── */

const SLIDE = "relative aspect-[4/5] w-48 shrink-0 snap-center overflow-hidden rounded-xl border border-border";

function SlideBadge({ n }: { n: number }) {
  return (
    <span className="absolute right-2 top-2 z-10 rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-white/80">
      {n}/6
    </span>
  );
}

function SlideCover({
  img,
  title,
  sub,
  ortName,
}: {
  img?: PostImage;
  title: string;
  sub: string;
  ortName: string;
}) {
  return (
    <figure className={cn(SLIDE, "bg-black")}>
      <SlideBadge n={1} />
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
      <figcaption className="absolute inset-x-0 bottom-0 p-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary">
          Referenz{ortName ? ` · ${ortName}` : ""}
        </p>
        <p className="font-display text-base font-semibold leading-tight text-white [text-wrap:balance]">
          {title}
        </p>
        {sub && <p className="mt-1 line-clamp-2 text-[11px] text-white/80">{sub}</p>}
      </figcaption>
    </figure>
  );
}

function SlideText({
  n,
  eyebrow,
  text,
  img,
}: {
  n: number;
  eyebrow: string;
  text: string;
  img?: PostImage;
}) {
  return (
    <figure className={cn(SLIDE, "bg-surface-deep")}>
      <SlideBadge n={n} />
      {img && (
        <div className="relative h-1/2 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.url} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className={cn("flex flex-col p-3", img ? "h-1/2" : "h-full justify-center")}>
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <p className="mt-1 line-clamp-6 text-[13px] leading-snug text-white/90">
          {text || "…"}
        </p>
      </div>
    </figure>
  );
}

function SlideFeatures({ n, features }: { n: number; features: string[] }) {
  return (
    <figure className={cn(SLIDE, "bg-card")}>
      <SlideBadge n={n} />
      <div className="flex h-full flex-col p-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary">
          Was wir gebaut haben
        </p>
        <ul className="mt-2 space-y-1.5">
          {features.slice(0, 6).map((f, i) => (
            <li key={i} className="flex items-start gap-1.5 text-[12px] text-foreground/90">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
              {f}
            </li>
          ))}
          {features.length === 0 && (
            <li className="text-[12px] text-muted-foreground">…</li>
          )}
        </ul>
      </div>
    </figure>
  );
}

function SlideCta({ n }: { n: number }) {
  return (
    <figure className={cn(SLIDE, "bg-primary")}>
      <SlideBadge n={n} />
      <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
        <p className="font-display text-lg font-semibold leading-tight text-primary-foreground">
          Aufmaß bei Ihnen. Fertigung bei uns.
        </p>
        <p className="rounded-full bg-primary-foreground/15 px-3 py-1 text-[11px] text-primary-foreground">
          alignum.de/anfrage
        </p>
      </div>
    </figure>
  );
}

/* ───────────────────────── Eingabe-Helfer ───────────────────────── */

function SlideField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      <AutoTextarea
        value={value}
        onChange={onChange}
        className="rounded-[var(--radius)] border border-input bg-background p-2.5 text-sm text-foreground focus:border-primary"
      />
    </label>
  );
}

/** Automatisch mitwachsendes, randloses Textfeld (liest sich wie Fließtext). */
function AutoTextarea({
  value,
  onChange,
  className,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      className={cn(
        "block w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-muted-foreground/50",
        className,
      )}
    />
  );
}
