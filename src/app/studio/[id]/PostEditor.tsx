"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { studioFetch } from "@/studio/client";
import { cn } from "@/lib/cn";
import { DraftPreview } from "./DraftPreview";
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
  const [ortName, setOrtName] = useState(
    initialPost.ortName || ortNameFor(initialPost.ort),
  );
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
  const [deleting, setDeleting] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [draftView, setDraftView] = useState<"vorschau" | "felder">("vorschau");

  const editable = status === "neu" || status === "entwurf";
  const selectedCount = images.filter((i) => i.selected).length;

  function markDirty() {
    setDirty(true);
    setError("");
  }

  function ortNameFor(slug: string): string {
    return cities.find((c) => c.slug === slug)?.name ?? "";
  }

  // Ort ist frei eingebbar. Ein bekannter Stadtname wird auf den exakten
  // City-Slug gemappt (erhält die interne Verlinkung zur City-Page); freier
  // Text wird slugifiziert, damit der Ort trotzdem gespeichert werden kann.
  function slugForOrt(name: string): string {
    const t = name.trim();
    if (!t) return "";
    const match = cities.find((c) => c.name.toLowerCase() === t.toLowerCase());
    return match ? match.slug : slugify(t);
  }

  // Der aktuelle Editor-Stand als Payload. Wird bei Speichern/Generieren/Freigeben
  // MITGESCHICKT, damit der Server nicht auf einen veralteten KV-Read angewiesen
  // ist (Blob ist eventually consistent).
  function briefPayload() {
    return {
      ort: slugForOrt(ortName),
      ortName: ortName.trim(),
      holzart,
      moebeltyp,
      notiz,
      images,
    };
  }

  // Zentrales, autoritatives Schreiben der Bildliste: der Client schickt IMMER
  // die vollständige gewünschte Liste, der Server speichert sie 1:1. Dadurch kann
  // kein veralteter KV-Read mehr Bilder verschwinden/wiederauftauchen lassen.
  // Gibt die vom Server bestätigte Liste zurück oder null bei Fehler.
  async function persistImages(
    next: PostImage[],
    remove: PostImage[] = [],
  ): Promise<PostImage[] | null> {
    try {
      const res = await studioFetch(
        `/api/studio/posts/${initialPost.id}/images`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images: next, remove }),
        },
      );
      if (!res.ok) return null;
      const data = (await res.json()) as { images: PostImage[] };
      return data.images;
    } catch {
      return null;
    }
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
    // Autoritativer Ausgangsstand im Client — die neue Liste = base + neue Bilder.
    const base = images;
    let addedTotal = 0;
    let rejectedTotal = all.length - files.length;
    let failedTotal = 0;
    let aborted = false;
    const collected: PostImage[] = [];
    try {
      // Jedes (clientseitig verkleinerte) Bild einzeln in den Blob laden. Rohfotos
      // vom Handy sind mehrere MB; mehrere pro Request sprengen das 4,5-MB-Body-
      // Limit der Vercel-Function (→ 413). Verkleinert (2400px / q82, wie die
      // Server-Pipeline) bleibt jedes Bild deutlich darunter. Der /upload-Endpoint
      // schreibt den Post NICHT — persistiert wird am Ende in EINEM Request, sonst
      // überschreiben sich die Einzel-Uploads auf dem Blob-KV gegenseitig.
      for (let i = 0; i < files.length && !aborted; i++) {
        const prepared = await compressImage(files[i]);
        let ok = false;
        // Ein einzelnes fehlgeschlagenes Bild darf NICHT die ganze Serie stoppen
        // (früher: break → nur ein Teil der Bilder kam an). Ein Retry deckt
        // transiente Blob-/Netzfehler ab; danach wird das Bild übersprungen.
        for (let attempt = 0; attempt < 2 && !ok && !aborted; attempt++) {
          let res: Response | null = null;
          try {
            const fd = new FormData();
            fd.append("files", prepared);
            res = await studioFetch(
              `/api/studio/posts/${initialPost.id}/upload`,
              { method: "POST", body: fd },
            );
          } catch {
            res = null; // Netzwerkfehler → nächster Versuch
          }
          if (res && res.ok) {
            const data = (await res.json()) as {
              images: PostImage[];
              added?: number;
              rejected?: number;
            };
            const fresh = data.images ?? [];
            collected.push(...fresh);
            if (fresh.length) setImages((prev) => [...prev, ...fresh]); // Live-Vorschau
            addedTotal += data.added ?? 0;
            rejectedTotal += data.rejected ?? 0;
            ok = true;
          } else if (res && (res.status === 401 || res.status === 403)) {
            const d = (await res.json().catch(() => ({}))) as { error?: string };
            setError(d.error ?? "Sitzung abgelaufen – bitte neu anmelden.");
            aborted = true; // Auth-Fehler → Retry sinnlos, ganze Serie stoppen
          }
          // sonst: transienter Fehler → nächster Versuch (oder überspringen)
        }
        if (!ok && !aborted) failedTotal++;
        setUploadDone(i + 1);
      }

      // Die vollständige neue Liste (bisherige + neue Bilder) autoritativ
      // persistieren und die vom Server bestätigte Liste übernehmen.
      if (collected.length) {
        const saved = await persistImages([...base, ...collected]);
        if (saved) setImages(saved);
        else
          setError(
            "Bilder konnten nicht gespeichert werden. Bitte erneut versuchen.",
          );
      }

      const skipped = rejectedTotal + failedTotal;
      if (skipped > 0 && !aborted) {
        setError(
          addedTotal === 0
            ? `Keines der Bilder konnte hochgeladen werden. Bitte als JPEG/PNG versuchen (iPhone: Einstellungen → Kamera → Formate → „Maximale Kompatibilität").`
            : `${skipped} von ${files.length} Bild(ern) übersprungen (Format/Größe oder Upload-Fehler). Die übrigen ${addedTotal} sind gespeichert – fehlende ggf. einzeln erneut hochladen.`,
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

  async function deleteImage(key: string) {
    if (deleting || uploading) return;
    const before = images;
    const removed = before.find((i) => i.key === key);
    const next = before.filter((i) => i.key !== key);
    setDeleting(key);
    setError("");
    setImages(next); // optimistisch
    // Volle Restliste schreiben (nicht „ein Bild entfernen") → das Ergebnis hängt
    // NICHT von einem veralteten Server-Read ab; die Anzahl stimmt garantiert.
    const saved = await persistImages(next, removed ? [removed] : []);
    if (saved) setImages(saved);
    else {
      setImages(before); // Rollback auf den Stand vor dem Löschen
      setError("Bild konnte nicht gelöscht werden. Bitte erneut versuchen.");
    }
    setDeleting(null);
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
          ...briefPayload(),
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
    if (!ortName.trim()) return setError("Bitte einen Ort angeben.");
    if (!moebeltyp.trim()) return setError("Bitte den Möbeltyp angeben.");
    if (!holzart.trim()) return setError("Bitte die Holzart angeben.");
    if (remaining <= 0)
      return setError("Monatslimit erreicht. Nächsten Monat wieder verfügbar.");

    setGenerating(true);
    try {
      // Angaben direkt mitschicken — der Server persistiert + generiert in EINEM
      // Schritt, ohne den gerade gespeicherten Stand erneut (stale) zu lesen.
      const res = await studioFetch(
        `/api/studio/posts/${initialPost.id}/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(briefPayload()),
        },
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
    setSubmitting(true);
    try {
      // Angaben + Draft mitschicken → Server validiert/persistiert auf dem
      // aktuellen Stand, kein Verlass auf einen stale KV-Read.
      const res = await studioFetch(
        `/api/studio/posts/${initialPost.id}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...briefPayload(), draft }),
        },
      );
      const data = (await res.json()) as { error?: string; status?: PostStatus };
      if (!res.ok) {
        setError(data.error ?? "Freigabe fehlgeschlagen.");
        return;
      }
      setDirty(false);
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
            {moebeltyp} · {ortName || initialPost.ortName}
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
              passenden an · <span className="text-foreground">×</span> löscht ein
              Bild.
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {images.map((img) => (
                <div
                  key={img.key}
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-[var(--radius)] border-2 transition-all",
                    img.selected
                      ? "border-primary ring-2 ring-primary/40"
                      : "border-transparent opacity-80 hover:opacity-100",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleSelect(img.key)}
                    aria-label={img.selected ? "Auswahl aufheben" : "Auswählen"}
                    className="absolute inset-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.filename}
                      className="h-full w-full object-cover"
                    />
                  </button>
                  {img.selected && (
                    <span className="pointer-events-none absolute right-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      ✓
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteImage(img.key)}
                    disabled={deleting === img.key || uploading}
                    aria-label="Bild löschen"
                    title="Bild löschen"
                    className="absolute left-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-sm leading-none text-white opacity-80 transition-colors hover:bg-destructive hover:opacity-100 disabled:opacity-40"
                  >
                    {deleting === img.key ? "…" : "×"}
                  </button>
                </div>
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
            <input
              list="ort-options"
              value={ortName}
              onChange={(e) => {
                setOrtName(e.target.value);
                markDirty();
              }}
              placeholder="Stadt wählen oder frei eingeben …"
              className="h-11 w-full rounded-[var(--radius)] border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            />
            <datalist id="ort-options">
              {cities.map((c) => (
                <option key={c.slug} value={c.name} />
              ))}
            </datalist>
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
          <div className="space-y-4">
            {/* Umschalter: Live-Vorschau ↔ reine Felder */}
            <div className="inline-flex rounded-full border border-border bg-card/50 p-0.5 text-sm">
              {(["vorschau", "felder"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setDraftView(v)}
                  className={cn(
                    "rounded-full px-3.5 py-1 capitalize transition-colors",
                    draftView === v
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v === "vorschau" ? "Vorschau" : "Felder"}
                </button>
              ))}
            </div>

            {/* SEO-Felder — stehen nicht sichtbar auf der Seite, daher immer als Feld */}
            <div className="grid gap-3 rounded-[var(--radius-lg)] border border-border bg-card/50 p-4 sm:grid-cols-2">
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
            </div>

            {draftView === "vorschau" ? (
              <DraftPreview
                draft={draft}
                patch={patchDraft}
                images={images.filter((i) => i.selected)}
                ortName={ortNameFor(slugForOrt(ortName)) || ortName}
                holzart={holzart}
                moebeltyp={moebeltyp}
              />
            ) : (
              <div className="space-y-4 rounded-[var(--radius-lg)] border border-border bg-card/50 p-4">
                <Field label="Seitentitel (H1)">
                  <input
                    value={draft.title ?? ""}
                    onChange={(e) => patchDraft({ title: e.target.value })}
                    className="h-11 w-full rounded-[var(--radius)] border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </Field>
                <Field label="Lead / Kurzbeschreibung">
                  <textarea
                    value={draft.summary ?? draft.intro ?? ""}
                    onChange={(e) => patchDraft({ summary: e.target.value })}
                    rows={3}
                    className="w-full rounded-[var(--radius)] border border-input bg-background p-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </Field>
                <Field label="Projekt-Text (4 Absätze, durch Leerzeile getrennt)">
                  <textarea
                    value={draft.body}
                    onChange={(e) => patchDraft({ body: e.target.value })}
                    rows={12}
                    className="w-full rounded-[var(--radius)] border border-input bg-background p-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </Field>
                <Field label="Was wir gebaut haben (ein Punkt pro Zeile)">
                  <textarea
                    value={(draft.features ?? []).join("\n")}
                    onChange={(e) =>
                      patchDraft({
                        features: e.target.value
                          .split("\n")
                          .map((f) => f.trim())
                          .filter(Boolean),
                      })
                    }
                    rows={5}
                    className="w-full rounded-[var(--radius)] border border-input bg-background p-3 text-sm text-foreground outline-none focus:border-primary"
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

/** Slug aus freiem Text (deutsche Umlaute → ae/oe/ue, ß → ss). */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Verkleinert ein Bild clientseitig auf dieselben Werte wie die Server-Pipeline
 * (max. 2400px Kante, JPEG q82), damit ein Upload nicht am 4,5-MB-Body-Limit der
 * Vercel-Function scheitert. Alles defensiv: kann der Browser die Datei nicht
 * dekodieren (z. B. HEIC außerhalb von iOS) oder schlägt etwas fehl, wird die
 * Originaldatei zurückgegeben — der Server (sharp/heic-convert) verarbeitet sie.
 */
async function compressImage(file: File): Promise<File> {
  // HEIC/HEIF im Browser NICHT anfassen — Canvas-Dekodierung ist unzuverlässig
  // (außer iOS). Roh an den Server geben, der es mit heic-convert zuverlässig
  // nach JPEG wandelt. Roh-HEIC ist klein genug (< 4,5 MB) für einen Einzel-Request.
  if (/\.(heic|heif)$/i.test(file.name) || /heic|heif/i.test(file.type)) {
    return file;
  }
  const MAX_EDGE = 2400;
  try {
    if (typeof createImageBitmap !== "function") return file;
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image", // EXIF-Rotation in die Pixel backen
    }).catch(() => null);
    if (!bitmap) return file;

    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close?.();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.82),
    );
    if (!blob || blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  }
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
        <p className="text-sm font-medium text-foreground">
          {draft.summary ?? draft.intro}
        </p>
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
