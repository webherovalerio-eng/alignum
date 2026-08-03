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
  readOnly = false,
}: {
  draft: PostDraft;
  patch: (p: Partial<PostDraft>) => void;
  images: PostImage[]; // ausgewählte Bilder
  ortName: string;
  holzart: string;
  moebeltyp: string;
  /** Freigegebene Ansicht: Slides/Projektseite nur anzeigen, nicht editieren. */
  readOnly?: boolean;
}) {
  const title = draft.title?.trim() || moebeltyp || draft.metaTitle;
  const lead = draft.summary ?? draft.intro ?? "";
  // Exakt an "\n\n" splitten (passend zum join in setPara) — erhält leere
  // Zwischen-Absätze, damit die Slide-Zuordnung Idee/Lösung/Holz nicht
  // verrutscht, wenn ein Feld leer bleibt.
  const paras = draft.body ? draft.body.split("\n\n") : [];
  const features = draft.features ?? [];
  const cover = images[0];
  const gallery = images.slice(1);

  const setPara = (i: number, value: string) => {
    const arr = [...paras];
    // Lücken bis zum Zielindex mit "" auffüllen — sonst entstehen undefined-
    // Löcher, die beim join/split die Slide-Zuordnung verschieben (der Grund,
    // warum vorher ein Leerzeichen ins Lösungs-Feld nötig war).
    while (arr.length <= i) arr.push("");
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
          {readOnly
            ? "Vorschau · so erscheint das Projekt auf der Website"
            : "Vorschau · so erscheint das Projekt auf der Website · Texte anklicken zum Bearbeiten"}
        </div>

        <div className="mx-auto max-w-2xl px-5 py-8 sm:px-8 sm:py-10">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 px-3 py-1 text-xs text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            Referenzprojekt{ortName ? ` · ${ortName}` : ""}
          </p>

          <AutoTextarea
            value={title}
            onChange={(v) => patch({ title: v })}
            readOnly={readOnly}
            placeholder="Projekttitel …"
            className="font-display text-[clamp(1.8rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-tight text-foreground"
          />

          <div className="mt-4">
            <AutoTextarea
              value={lead}
              onChange={(v) => patch({ summary: v })}
              readOnly={readOnly}
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
                readOnly={readOnly}
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
                    readOnly={readOnly}
                    placeholder="Bauteil / Eigenschaft …"
                    className="text-foreground/90"
                  />
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => removeFeature(i)}
                      aria-label="Punkt entfernen"
                      className="mt-1 text-muted-foreground transition-colors hover:text-destructive"
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {!readOnly && (
              <button
                type="button"
                onClick={addFeature}
                className="mt-2 text-xs text-primary hover:underline"
              >
                + Punkt hinzufügen
              </button>
            )}
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

      {/* Slide-Texte bearbeiten. Die grobe HTML-Vorschau wurde bewusst
          entfernt — die echten 1080×1350-Slides zeigt der PostEditor darunter
          (nach jedem Speichern aktualisiert). */}
      {!readOnly && (
      <section className="space-y-4">
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
      )}
    </div>
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
  readOnly = false,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
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
      readOnly={readOnly}
      className={cn(
        "block w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-muted-foreground/50",
        readOnly && "cursor-default select-text",
        className,
      )}
    />
  );
}
