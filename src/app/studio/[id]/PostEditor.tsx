"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { studioFetch } from "@/studio/client";
import { cn } from "@/lib/cn";
import type { Post, PostImage, PostStatus, PostDraft } from "@/studio/types";

const HOLZ_OPTIONS = [
  "Eiche",
  "Nussbaum",
  "Esche",
  "Buche",
  "Kirsche",
  "Ahorn",
  "Ulme",
  "Zeder",
  "Fichte",
  "Lärche",
];
const MOEBEL_OPTIONS = [
  "Einbauschrank",
  "Ankleide",
  "Küche",
  "Esstisch",
  "Sideboard",
  "Kommode",
  "Bett",
  "Regal",
  "Treppe",
  "Innentür",
  "Haustür",
  "Waschtisch",
  "Shoji",
];

type City = { slug: string; name: string };
type Usage = { used: number; limit: number; remaining: number };

export function PostEditor({
  initialPost,
  cities,
  initialUsage,
}: {
  initialPost: Post;
  cities: City[];
  initialUsage: Usage;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<PostImage[]>(initialPost.images);
  const [ort, setOrt] = useState(initialPost.ort);
  const [holzart, setHolzart] = useState(initialPost.holzart);
  const [moebeltyp, setMoebeltyp] = useState(initialPost.moebeltyp);
  const [notiz, setNotiz] = useState(initialPost.notiz);
  const [status, setStatus] = useState<PostStatus>(initialPost.status);
  const [draft, setDraft] = useState<PostDraft | null>(initialPost.draft ?? null);
  const [remaining, setRemaining] = useState(initialUsage.remaining);

  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const editable = status === "neu" || status === "entwurf";
  const selectedCount = images.filter((i) => i.selected).length;

  function markDirty() {
    setDirty(true);
    setError("");
  }

  function ortNameFor(slug: string): string {
    return cities.find((c) => c.slug === slug)?.name ?? "";
  }

  async function handleFiles(list: FileList | null) {
    if (!list) return;
    const IMG_RE = /\.(jpe?g|png|webp|avif|heic|heif|gif|tiff?)$/i;
    const all = Array.from(list);
    const files = all.filter(
      (f) => f.type.startsWith("image/") || f.type === "" || IMG_RE.test(f.name),
    );
    if (!files.length) {
      setError(all.length ? "Keine unterstützten Bilddateien ausgewählt." : "");
      return;
    }
    setUploading(true);
    setUploadTotal(files.length);
    setUploadDone(0);
    setError("");
    let addedTotal = 0;
    let rejectedTotal = all.length - files.length;
    const BATCH = 6;
    try {
      for (let i = 0; i < files.length; i += BATCH) {
        const batch = files.slice(i, i + BATCH);
        const fd = new FormData();
        for (const f of batch) fd.append("files", f);
        const res = await studioFetch(
          `/api/studio/posts/${initialPost.id}/upload`,
          { method: "POST", body: fd },
        );
        if (res.ok) {
          const data = (await res.json()) as {
            images: PostImage[];
            added?: number;
            rejected?: number;
          };
          setImages(data.images);
          addedTotal += data.added ?? 0;
          rejectedTotal += data.rejected ?? 0;
        } else {
          const d = (await res.json().catch(() => ({}))) as { error?: string };
          setError(d.error ?? "Upload fehlgeschlagen.");
          break;
        }
        setUploadDone(Math.min(files.length, i + batch.length));
      }
      if (rejectedTotal > 0) {
        setError(
          addedTotal === 0
            ? `Keines der ${rejectedTotal} Bilder konnte verarbeitet werden. Bitte als JPEG/PNG hochladen (iPhone: Einstellungen → Kamera → Formate → „Maximale Kompatibilität").`
            : `${rejectedTotal} Datei(en) übersprungen (nicht unterstütztes Format oder zu groß).`,
        );
      }
    } finally {
      setUploading(false);
    }
  }

  function toggleSelect(key: string) {
    if (!editable) return;
    setImages((imgs) =>
      imgs.map((i) => (i.key === key ? { ...i, selected: !i.selected } : i)),
    );
    markDirty();
  }

  function patchDraft(p: Partial<PostDraft>) {
    setDraft((d) => (d ? { ...d, ...p } : d));
    markDirty();
  }

  async function save(): Promise<boolean> {
    setSaving(true);
    setError("");
    try {
      const res = await studioFetch(`/api/studio/posts/${initialPost.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ort,
          ortName: ortNameFor(ort),
          holzart,
          moebeltyp,
          notiz,
          selectedKeys: images.filter((i) => i.selected).map((i) => i.key),
          ...(draft ? { draft } : {}),
        }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        setError(d.error ?? "Speichern fehlgeschlagen.");
        return false;
      }
      setDirty(false);
      return true;
    } catch {
      setError("Netzwerkfehler beim Speichern.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function generate() {
    setError("");
    if (selectedCount === 0)
      return setError("Bitte zuerst mindestens ein Bild auswählen.");
    if (!ort) return setError("Bitte einen Ort auswählen.");
    if (!moebeltyp.trim()) return setError("Bitte den Möbeltyp angeben.");
    if (!holzart.trim()) return setError("Bitte die Holzart angeben.");
    if (remaining <= 0)
      return setError("Monatslimit erreicht. Nächsten Monat wieder verfügbar.");

    // Aktuelle Angaben speichern, damit die Generierung sie nutzt.
    const ok = await save();
    if (!ok) return;

    setGenerating(true);
    try {
      const res = await studioFetch(
        `/api/studio/posts/${initialPost.id}/generate`,
        { method: "POST" },
      );
      const data = (await res.json()) as {
        draft?: PostDraft;
        usage?: Usage;
        error?: string;
      };
      if (data.usage) setRemaining(data.usage.remaining);
      if (!res.ok || !data.draft) {
        setError(data.error ?? "Generierung fehlgeschlagen.");
        return;
      }
      setDraft(data.draft);
      setDirty(false);
    } catch {
      setError("Netzwerkfehler bei der Generierung.");
    } finally {
      setGenerating(false);
    }
  }

  async function approve() {
    setError("");
    if (!draft) return setError("Bitte zuerst den Text generieren.");
    const ok = await save();
    if (!ok) return;
    setSubmitting(true);
    try {
      const res = await studioFetch(
        `/api/studio/posts/${initialPost.id}/submit`,
        { method: "POST" },
      );
      const data = (await res.json()) as { error?: string; status?: PostStatus };
      if (!res.ok) {
        setError(data.error ?? "Freigabe fehlgeschlagen.");
        return;
      }
      setStatus(data.status ?? "freigegeben");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove() {
    if (!confirm("Diesen Beitrag wirklich löschen?")) return;
    const res = await studioFetch(`/api/studio/posts/${initialPost.id}`, {
      method: "DELETE",
    });
    if (res.ok) router.push("/studio");
  }

  // ── Freigegeben: schreibgeschützte Ansicht mit generiertem Text ──────────
  if (!editable) {
    return (
      <div className="space-y-6">
        <div className="rounded-[var(--radius-lg)] border border-primary/30 bg-primary/5 p-6">
          <p className="font-brand text-xs text-primary">Freigegeben</p>
          <h1 className="font-display mt-1 text-xl text-foreground">
            {moebeltyp} · {ortNameFor(ort) || initialPost.ortName}
          </h1>
        </div>
        {draft && <DraftView draft={draft} />}
        <ImageGallery images={images.filter((i) => i.selected)} />
      </div>
    );
  }

  const busy = uploading || saving || generating || submitting;

  return (
    <div className="space-y-8">
      <input
        ref={fileRef}
        type="file"
        accept="image/*,.heic,.heif"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={folderRef}
        type="file"
        multiple
        className="hidden"
        {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {/* Schritt 1: Bilder */}
      <section>
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-label text-sm font-semibold text-foreground">
              1 · Fotos hochladen
            </h2>
            <p className="text-xs text-muted-foreground">
              Einzelne Bilder oder einen ganzen Ordner. Werden automatisch
              optimiert.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              Bilder
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => folderRef.current?.click()}
              disabled={uploading}
            >
              Ordner
            </Button>
          </div>
        </div>

        {uploading && (
          <p className="mb-3 text-xs text-primary">
            Lade hoch … {uploadDone}/{uploadTotal}
          </p>
        )}

        {images.length === 0 ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-40 w-full items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border bg-card/50 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Fotos hier hochladen
          </button>
        ) : (
          <>
            <p className="mb-2 text-xs text-muted-foreground">
              {images.length} Bild(er) · {selectedCount} ausgewählt. Tippe die
              passenden an.
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {images.map((img) => (
                <button
                  key={img.key}
                  type="button"
                  onClick={() => toggleSelect(img.key)}
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-[var(--radius)] border-2 transition-all",
                    img.selected
                      ? "border-primary ring-2 ring-primary/40"
                      : "border-transparent opacity-80 hover:opacity-100",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.filename}
                    className="h-full w-full object-cover"
                  />
                  {img.selected && (
                    <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Schritt 2: Angaben */}
      <section className="space-y-4">
        <h2 className="font-label text-sm font-semibold text-foreground">
          2 · Angaben zum Projekt
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ort">
            <select
              value={ort}
              onChange={(e) => {
                setOrt(e.target.value);
                markDirty();
              }}
              className="h-11 w-full rounded-[var(--radius)] border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">Stadt wählen …</option>
              {cities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Möbeltyp">
            <input
              list="moebel-options"
              value={moebeltyp}
              onChange={(e) => {
                setMoebeltyp(e.target.value);
                markDirty();
              }}
              placeholder="z. B. Einbauschrank"
              className="h-11 w-full rounded-[var(--radius)] border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            />
            <datalist id="moebel-options">
              {MOEBEL_OPTIONS.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
          </Field>
          <Field label="Holzart">
            <input
              list="holz-options"
              value={holzart}
              onChange={(e) => {
                setHolzart(e.target.value);
                markDirty();
              }}
              placeholder="z. B. Eiche"
              className="h-11 w-full rounded-[var(--radius)] border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            />
            <datalist id="holz-options">
              {HOLZ_OPTIONS.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
          </Field>
        </div>
        <Field label="Notiz (worum geht es? Besonderheiten?)">
          <textarea
            value={notiz}
            onChange={(e) => {
              setNotiz(e.target.value);
              markDirty();
            }}
            rows={4}
            placeholder="Ein paar Sätze zum Projekt – Kontext, Besonderheiten, Kundenwunsch …"
            className="w-full rounded-[var(--radius)] border border-input bg-background p-3 text-sm text-foreground outline-none focus:border-primary"
          />
        </Field>
      </section>

      {/* Schritt 3: Generierung */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-label text-sm font-semibold text-foreground">
              3 · Text generieren
            </h2>
            <p className="text-xs text-muted-foreground">
              Erzeugt Projekt-Text + Social-Post. Noch{" "}
              <strong className={remaining <= 0 ? "text-destructive" : "text-primary"}>
                {remaining}/{initialUsage.limit}
              </strong>{" "}
              Generierungen diesen Monat.
            </p>
          </div>
          <Button
            type="button"
            variant={draft ? "outline" : "primary"}
            size="sm"
            onClick={generate}
            disabled={busy || remaining <= 0}
          >
            {generating
              ? "Generiere …"
              : draft
                ? "Neu generieren"
                : "Text generieren"}
          </Button>
        </div>

        {draft && (
          <div className="space-y-4 rounded-[var(--radius-lg)] border border-border bg-card/50 p-4">
            <Field label="Meta-Title (SEO)">
              <input
                value={draft.metaTitle}
                onChange={(e) => patchDraft({ metaTitle: e.target.value })}
                className="h-11 w-full rounded-[var(--radius)] border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </Field>
            <Field label="Meta-Description (SEO)">
              <textarea
                value={draft.metaDescription}
                onChange={(e) => patchDraft({ metaDescription: e.target.value })}
                rows={2}
                className="w-full rounded-[var(--radius)] border border-input bg-background p-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </Field>
            <Field label="Einleitung">
              <textarea
                value={draft.intro}
                onChange={(e) => patchDraft({ intro: e.target.value })}
                rows={3}
                className="w-full rounded-[var(--radius)] border border-input bg-background p-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </Field>
            <Field label="Projekt-Text (Markdown)">
              <textarea
                value={draft.body}
                onChange={(e) => patchDraft({ body: e.target.value })}
                rows={12}
                className="w-full rounded-[var(--radius)] border border-input bg-background p-3 font-mono text-sm text-foreground outline-none focus:border-primary"
              />
            </Field>
            <Field label="Social-Media-Post">
              <textarea
                value={draft.socialCaption}
                onChange={(e) => patchDraft({ socialCaption: e.target.value })}
                rows={6}
                className="w-full rounded-[var(--radius)] border border-input bg-background p-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </Field>
            <Field label="Hashtags (mit Leerzeichen getrennt)">
              <input
                value={draft.hashtags.join(" ")}
                onChange={(e) =>
                  patchDraft({
                    hashtags: e.target.value
                      .split(/[\s,]+/)
                      .map((h) => h.replace(/^#/, ""))
                      .filter(Boolean),
                  })
                }
                className="h-11 w-full rounded-[var(--radius)] border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </Field>
          </div>
        )}
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Aktionen */}
      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <Button onClick={approve} disabled={busy || !draft}>
          {submitting ? "Wird freigegeben …" : "Freigeben"}
        </Button>
        <Button
          variant="outline"
          onClick={save}
          disabled={busy || !dirty}
        >
          {saving ? "Speichert …" : dirty ? "Speichern" : "Gespeichert"}
        </Button>
        <button
          onClick={remove}
          className="ml-auto text-sm text-muted-foreground transition-colors hover:text-destructive"
        >
          Löschen
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function copy(text: string) {
  navigator.clipboard?.writeText(text).catch(() => {});
}

function DraftView({ draft }: { draft: PostDraft }) {
  return (
    <div className="space-y-5">
      <div className="rounded-[var(--radius-lg)] border border-border bg-card/50 p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-label text-sm font-semibold text-foreground">
            Projekt-Text
          </h3>
          <button
            onClick={() => copy(draft.body)}
            className="text-xs text-primary hover:underline"
          >
            Kopieren
          </button>
        </div>
        <p className="text-sm font-medium text-foreground">{draft.intro}</p>
        <pre className="mt-3 whitespace-pre-wrap font-sans text-sm text-muted-foreground">
          {draft.body}
        </pre>
      </div>
      <div className="rounded-[var(--radius-lg)] border border-border bg-card/50 p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-label text-sm font-semibold text-foreground">
            Social-Media-Post
          </h3>
          <button
            onClick={() =>
              copy(
                draft.socialCaption +
                  (draft.hashtags.length
                    ? "\n\n" + draft.hashtags.map((h) => `#${h}`).join(" ")
                    : ""),
              )
            }
            className="text-xs text-primary hover:underline"
          >
            Kopieren
          </button>
        </div>
        <pre className="whitespace-pre-wrap font-sans text-sm text-muted-foreground">
          {draft.socialCaption}
        </pre>
        {draft.hashtags.length > 0 && (
          <p className="mt-3 text-sm text-primary">
            {draft.hashtags.map((h) => `#${h}`).join(" ")}
          </p>
        )}
      </div>
    </div>
  );
}

function ImageGallery({ images }: { images: PostImage[] }) {
  if (!images.length) return null;
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
      {images.map((img) => (
        <div
          key={img.key}
          className="aspect-square overflow-hidden rounded-[var(--radius)]"
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
  );
}
