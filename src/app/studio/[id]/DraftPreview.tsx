"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { PostDraft, PostImage } from "@/studio/types";

/**
 * Redaktionelle Vorschau des generierten Entwurfs:
 *  – oben die Projektseite im Look der echten /projekte-Seite, Texte inline
 *    editierbar (Titel, Einleitung, Projekt-Text);
 *  – darunter das Instagram-Carousel (ausgewählte Bilder mit Overlay-Text) und
 *    eine Box zum Bearbeiten der Slide-Texte + Caption + Hashtags.
 * Änderungen gehen über `patch` in den Draft (und werden wie gehabt gespeichert).
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
  const cover = images[0];
  const gallery = images.slice(1);

  function setSlide(i: number, value: string) {
    const next = images.map((_, idx) =>
      idx === i ? value : (draft.slides?.[idx] ?? ""),
    );
    patch({ slides: next });
  }

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
              value={draft.intro}
              onChange={(v) => patch({ intro: v })}
              placeholder="Einleitung …"
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

          {/* Projekt-Text (Markdown, klick-to-edit) */}
          <div className="mt-7">
            <EditableMarkdown
              value={draft.body}
              onChange={(v) => patch({ body: v })}
            />
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

      {/* ─────────────── Social-Carousel ─────────────── */}
      <section className="space-y-4">
        <h3 className="font-label text-sm font-semibold text-foreground">
          Instagram-Carousel
        </h3>

        {images.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Wähle oben Bilder aus – sie erscheinen hier als Carousel-Slides.
          </p>
        ) : (
          <>
            {/* Slide-Vorschau */}
            <div className="flex snap-x gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <figure
                  key={img.key}
                  className="relative aspect-[4/5] w-48 shrink-0 snap-center overflow-hidden rounded-xl border border-border bg-black"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
                  <span className="absolute left-2 top-2 rounded bg-black/40 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-white/80">
                    {i + 1}/{images.length}
                  </span>
                  <figcaption className="absolute inset-x-0 bottom-0 p-3">
                    <p className="font-display text-base font-semibold leading-tight text-white [text-wrap:balance]">
                      {draft.slides?.[i] || ""}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>

            {/* Editier-Box: Slide-Texte + Caption + Hashtags */}
            <div className="space-y-4 rounded-[var(--radius-lg)] border border-border bg-card/50 p-4">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Texte auf den Slides
                </p>
                {images.map((img, i) => (
                  <label key={img.key} className="flex items-center gap-3">
                    <span className="w-8 shrink-0 text-xs text-muted-foreground">
                      {i + 1}.
                    </span>
                    <input
                      value={draft.slides?.[i] ?? ""}
                      onChange={(e) => setSlide(i, e.target.value)}
                      placeholder={
                        i === 0
                          ? "Hook, z. B. Möbeltyp + Ort"
                          : i === images.length - 1
                            ? "Call-to-Action"
                            : "Highlight"
                      }
                      className="h-10 w-full rounded-[var(--radius)] border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                    />
                  </label>
                ))}
              </div>

              <label className="block">
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
          </>
        )}
      </section>
    </div>
  );
}

/** Automatisch mitwachsendes, randloses Textfeld (liest sich wie Fließtext). */
function AutoTextarea({
  value,
  onChange,
  className,
  placeholder,
  onBlur,
  focusOnMount,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
  onBlur?: () => void;
  focusOnMount?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  useEffect(() => {
    if (focusOnMount && ref.current) {
      const el = ref.current;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [focusOnMount]);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      rows={1}
      className={cn(
        "block w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-muted-foreground/50",
        className,
      )}
    />
  );
}

/** Zeigt Markdown formatiert; Klick öffnet ein Textfeld zum Bearbeiten. */
function EditableMarkdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <AutoTextarea
        value={value}
        onChange={onChange}
        onBlur={() => setEditing(false)}
        focusOnMount
        className="min-h-[8rem] rounded-lg border border-primary/40 bg-background p-3 font-mono text-sm leading-relaxed text-foreground"
      />
    );
  }
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setEditing(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          setEditing(true);
        }
      }}
      title="Zum Bearbeiten klicken"
      className="-mx-2 cursor-text rounded-lg px-2 py-1 transition-colors hover:bg-primary/5"
    >
      {renderMarkdown(value)}
    </div>
  );
}

/** Minimaler Markdown-Renderer: ## / ### Überschriften + Absätze. Kein HTML → sicher. */
function renderMarkdown(md: string) {
  const blocks = md.split(/\n{2,}/).filter((b) => b.trim());
  if (!blocks.length) {
    return <p className="text-muted-foreground/60">Projekt-Text …</p>;
  }
  return blocks.map((block, i) => {
    const h = block.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      return (
        <h2
          key={i}
          className="font-display mt-6 mb-2 text-xl font-semibold leading-snug text-foreground first:mt-0"
        >
          {h[2]}
        </h2>
      );
    }
    return (
      <p
        key={i}
        className="mb-4 whitespace-pre-line text-base leading-relaxed text-foreground/85"
      >
        {block}
      </p>
    );
  });
}
