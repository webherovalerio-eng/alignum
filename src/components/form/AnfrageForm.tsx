"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Send, Sparkles, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SERVICES } from "@/data/services";
import { SITE } from "@/data/site";
import { cn } from "@/lib/cn";

type FormState = {
  services: string[];
  scope: string;
  budget: string;
  timeline: string;
  description: string;
  measurements: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  contactPref: "email" | "phone" | "either";
};

const SCOPES = ["Komplett-Projekt", "Einzelmöbel", "Sanierung / Umbau", "Beratung & Planung"];
const BUDGETS = ["bis 3.000 €", "3.000 – 8.000 €", "8.000 – 20.000 €", "20.000 – 50.000 €", "über 50.000 €", "Weiß ich noch nicht"];
const TIMELINES = ["in 1–3 Monaten", "in 3–6 Monaten", "Flexibel"];

const STEPS = ["Leistung", "Projekt", "Kontakt", "Übersicht"];

const MAX_FILES = 5;
const MAX_TOTAL_BYTES = 8 * 1024 * 1024; // 8 MB gesamt

export function AnfrageForm({ initialService }: { initialService?: string }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const [form, setForm] = useState<FormState>({
    services: initialService ? [initialService] : [],
    scope: "",
    budget: "",
    timeline: "",
    description: "",
    measurements: "",
    name: "",
    email: "",
    phone: "",
    city: "",
    contactPref: "either",
  });

  useEffect(() => {
    if (initialService)
      setForm((f) => ({
        ...f,
        services: f.services.includes(initialService)
          ? f.services
          : [...f.services, initialService],
      }));
  }, [initialService]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  /** Leistung an-/abwählen (Multiple-Choice). */
  function toggleService(slug: string) {
    setForm((f) => ({
      ...f,
      services: f.services.includes(slug)
        ? f.services.filter((s) => s !== slug)
        : [...f.services, slug],
    }));
  }

  /** Datei-Anhänge hinzufügen (mit Limit + Dedupe). */
  function addFiles(list: FileList | null) {
    if (!list) return;
    setError(null);
    const incoming = Array.from(list);
    setFiles((prev) => {
      const combined = [...prev];
      for (const f of incoming) {
        if (combined.length >= MAX_FILES) break;
        if (!combined.some((c) => c.name === f.name && c.size === f.size)) combined.push(f);
      }
      const total = combined.reduce((s, f) => s + f.size, 0);
      if (total > MAX_TOTAL_BYTES) {
        setError("Die Dateien sind zusammen zu groß (max. 8 MB). Bitte kleinere Dateien wählen.");
        return prev;
      }
      return combined.slice(0, MAX_FILES);
    });
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  const canNext = useMemo(() => {
    if (step === 0) return form.services.length > 0;
    // Beschreibung & Maße sind optional — nur Umfang + Zeitrahmen nötig.
    if (step === 1) return Boolean(form.scope && form.timeline);
    if (step === 2) return form.name.trim() && form.email.trim() && form.email.includes("@");
    return true;
  }, [step, form]);

  const serviceNames = form.services.map(
    (slug) => SERVICES.find((s) => s.slug === slug)?.name ?? slug,
  );

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("payload", JSON.stringify({ ...form, serviceNames }));
      files.forEach((f) => fd.append("files", f));
      const res = await fetch("/api/anfrage", { method: "POST", body: fd });
      if (!res.ok) throw new Error(String(res.status));
      setSubmitted(true);
    } catch {
      setError(
        `Senden fehlgeschlagen. Bitte versuchen Sie es erneut oder schreiben Sie direkt an ${SITE.email}.`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative">
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Schritt {Math.min(step + 1, STEPS.length)} von {STEPS.length}
          </p>
          <p className="text-xs text-muted-foreground">{STEPS[step]}</p>
        </div>
        <div className="relative h-1 bg-border rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          />
        </div>
        <div className="mt-3 flex justify-between text-xs">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={cn(
                "transition-colors",
                i <= step ? "text-foreground font-medium" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          >
            {step === 0 && (
              <Step1
                values={form.services}
                onToggle={toggleService}
              />
            )}
            {step === 1 && (
              <Step2
                form={form}
                update={update}
              />
            )}
            {step === 2 && (
              <Step3
                form={form}
                update={update}
              />
            )}
            {step === 3 && (
              <Step4
                form={form}
                serviceNames={serviceNames}
                files={files}
                onAddFiles={addFiles}
                onRemoveFile={removeFile}
              />
            )}

            {/* Nav */}
            <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
              <Button
                type="button"
                variant="ghost"
                size="md"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className={cn(step === 0 && "invisible")}
              >
                <ArrowLeft className="size-4" /> Zurück
              </Button>

              {step < STEPS.length - 1 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  disabled={!canNext}
                  onClick={() => setStep((s) => s + 1)}
                >
                  Weiter <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  disabled={submitting}
                  onClick={handleSubmit}
                >
                  <Send className="size-4" /> {submitting ? "Wird gesendet …" : "Anfrage absenden"}
                </Button>
              )}
            </div>

            {error && (
              <p className="mt-4 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </motion.div>
        ) : (
          <SuccessState prefEmail={form.contactPref !== "phone"} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Step1({
  values,
  onToggle,
}: {
  values: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-3xl sm:text-4xl mb-3">
        Was dürfen wir für Sie bauen?
      </h2>
      <p className="text-muted-foreground mb-8">
        Wählen Sie eine oder mehrere Leistungen – Mehrfachauswahl ist möglich.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SERVICES.map((s) => {
          const active = values.includes(s.slug);
          return (
            <button
              type="button"
              key={s.slug}
              onClick={() => onToggle(s.slug)}
              className={cn(
                "group relative text-left rounded-xl border p-5 transition-all",
                active
                  ? "border-primary bg-primary/5 shadow-[var(--shadow-glow)]"
                  : "border-border bg-card hover:border-primary/40",
              )}
              aria-pressed={active}
            >
              <span className="font-display text-lg block mb-1.5">{s.name}</span>
              <span className="text-xs text-muted-foreground line-clamp-2">{s.short}</span>
              <span
                className={cn(
                  "absolute top-3 right-3 inline-flex size-6 items-center justify-center rounded-full",
                  active ? "bg-primary text-primary-foreground" : "border border-border",
                )}
              >
                {active && <Check className="size-3" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step2({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl sm:text-4xl mb-3">
          Erzählen Sie uns vom Projekt.
        </h2>
        <p className="text-muted-foreground">
          Je mehr wir wissen, desto präziser unser erstes Angebot.
        </p>
      </div>

      <fieldset>
        <legend className="text-sm font-medium mb-3">Umfang</legend>
        <div className="flex flex-wrap gap-2">
          {SCOPES.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => update("scope", s)}
              className={cn(
                "px-4 py-2 rounded-full border text-sm transition-colors",
                form.scope === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/40",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium mb-3">Budget (unverbindlich)</legend>
        <div className="flex flex-wrap gap-2">
          {BUDGETS.map((b) => (
            <button
              type="button"
              key={b}
              onClick={() => update("budget", b)}
              className={cn(
                "px-4 py-2 rounded-full border text-sm transition-colors",
                form.budget === b
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/40",
              )}
            >
              {b}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium mb-3">Wann soll's losgehen?</legend>
        <div className="flex flex-wrap gap-2">
          {TIMELINES.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => update("timeline", t)}
              className={cn(
                "px-4 py-2 rounded-full border text-sm transition-colors",
                form.timeline === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/40",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <Field
        label="Beschreibung des Projekts (optional)"
        as="textarea"
        rows={5}
        value={form.description}
        placeholder="Beschreiben Sie kurz, was Ihnen vorschwebt – Material, Stil, Funktion …"
        onChange={(v) => update("description", v)}
      />

      <Field
        label="Maße oder Räume (optional)"
        value={form.measurements}
        placeholder="z. B. Küche 4,80 × 2,60 m, Wand 3,40 m hoch …"
        onChange={(v) => update("measurements", v)}
      />
    </div>
  );
}

function Step3({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl sm:text-4xl mb-3">
          Wie erreichen wir Sie?
        </h2>
        <p className="text-muted-foreground">
          Wir melden uns persönlich bei Ihnen.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Name *" value={form.name} placeholder="Max Mustermann" onChange={(v) => update("name", v)} />
        <Field label="E-Mail *" type="email" value={form.email} placeholder="max@beispiel.de" onChange={(v) => update("email", v)} />
        <Field label="Telefon" type="tel" value={form.phone} placeholder="0621 …" onChange={(v) => update("phone", v)} />
        <Field label="Ort" value={form.city} placeholder="Mannheim" onChange={(v) => update("city", v)} />
      </div>

      <fieldset>
        <legend className="text-sm font-medium mb-3">Bevorzugte Erreichbarkeit</legend>
        <div className="flex flex-wrap gap-2">
          {[
            { v: "either", l: "Egal" },
            { v: "email", l: "Per E-Mail" },
            { v: "phone", l: "Per Telefon" },
          ].map((p) => (
            <button
              type="button"
              key={p.v}
              onClick={() => update("contactPref", p.v as FormState["contactPref"])}
              className={cn(
                "px-4 py-2 rounded-full border text-sm transition-colors",
                form.contactPref === p.v
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/40",
              )}
            >
              {p.l}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function Step4({
  form,
  serviceNames,
  files,
  onAddFiles,
  onRemoveFile,
}: {
  form: FormState;
  serviceNames: string[];
  files: File[];
  onAddFiles: (list: FileList | null) => void;
  onRemoveFile: (idx: number) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl sm:text-4xl mb-3">
          Sieht das richtig aus?
        </h2>
        <p className="text-muted-foreground">
          Mit Klick auf „Anfrage absenden" schicken wir Ihre Anfrage direkt an
          unsere Werkstatt – und Sie erhalten eine Bestätigung per E-Mail.
        </p>
      </div>

      <dl className="rounded-2xl border border-border bg-card divide-y divide-border">
        <Row
          k={serviceNames.length > 1 ? "Leistungen" : "Leistung"}
          v={serviceNames.join(", ") || "—"}
        />
        <Row k="Umfang" v={form.scope} />
        {form.budget && <Row k="Budget" v={form.budget} />}
        <Row k="Timeline" v={form.timeline} />
        {form.description.trim() && <Row k="Beschreibung" v={form.description} />}
        {form.measurements && <Row k="Maße / Räume" v={form.measurements} />}
        <Row k="Kontakt" v={`${form.name} · ${form.email}${form.phone ? ` · ${form.phone}` : ""}${form.city ? ` · ${form.city}` : ""}`} />
      </dl>

      {/* Datei-Upload (optional) */}
      <div>
        <p className="text-sm font-medium mb-2">Skizzen oder Bilder (optional)</p>
        <label
          htmlFor="anfrage-files"
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-background px-4 py-4 text-sm text-muted-foreground transition-colors hover:border-primary/50"
        >
          <Paperclip className="size-4 shrink-0 text-primary" />
          <span>Foto, Skizze oder PDF anhängen – max. 5 Dateien, 8 MB gesamt</span>
          <input
            id="anfrage-files"
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="sr-only"
            onChange={(e) => {
              onAddFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        {files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {files.map((f, i) => (
              <li
                key={`${f.name}-${i}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm"
              >
                <span className="truncate">{f.name}</span>
                <span className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {(f.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveFile(i)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={`${f.name} entfernen`}
                  >
                    <X className="size-4" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 px-5 py-4 text-sm">
      <dt className="sm:w-32 shrink-0 text-muted-foreground">{k}</dt>
      <dd className="text-foreground whitespace-pre-wrap">{v}</dd>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  as = "input",
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  as?: "input" | "textarea";
  rows?: number;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const common =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors";
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-medium mb-2 block">{label}</span>
      {as === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={cn(common, "resize-y")}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={common}
        />
      )}
    </label>
  );
}

function SuccessState({ prefEmail }: { prefEmail: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="text-center"
    >
      <div className="relative rounded-2xl border border-border bg-card p-8 sm:p-12 grain-overlay">
        {/* Animated check ring */}
        <motion.span
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="relative inline-flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground mb-6 shadow-[var(--shadow-glow)]"
        >
          <Sparkles className="size-9" />
          <motion.span
            aria-hidden
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-primary"
          />
        </motion.span>

        <h2 className="font-display text-3xl sm:text-4xl mb-3">
          Danke, Ihre Anfrage ist <span className="text-primary italic">angekommen.</span>
        </h2>

        <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
          Eine Bestätigung ist bereits in Ihrem Postfach. Jan liest jede Anfrage
          persönlich und meldet sich bei Ihnen
          {prefEmail ? " – per E-Mail oder Telefon" : " – telefonisch"}, je
          nachdem wie Sie es bevorzugen.
        </p>

        {/* Was als nächstes passiert */}
        <div className="mt-8 pt-8 border-t border-border text-left max-w-sm mx-auto space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium mb-3 text-center">
            So geht es weiter
          </p>

          {[
            { n: "1", t: "Wir prüfen Ihre Anfrage", b: "Jan schaut sich Ihre Skizze, Maße und Wünsche an." },
            { n: "2", t: "Wir melden uns persönlich", b: "Per E-Mail mit ersten Rückfragen oder direkt mit Terminvorschlag." },
            { n: "3", t: "Aufmaß bei Ihnen vor Ort", b: "Kostenlos und unverbindlich. Erst danach gibt's ein Angebot." },
          ].map((s) => (
            <div key={s.n} className="flex items-start gap-3">
              <span className="shrink-0 inline-flex size-7 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-medium font-display">
                {s.n}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{s.t}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.b}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Direkter Kontakt */}
        <p className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Lieber direkt?{" "}
          <a className="text-primary underline-grain" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>{" "}
          oder anrufen:{" "}
          <a className="text-primary underline-grain" href={`tel:${SITE.phone.replace(/\s/g, "")}`}>
            {SITE.phoneDisplay}
          </a>
        </p>
      </div>
    </motion.div>
  );
}
