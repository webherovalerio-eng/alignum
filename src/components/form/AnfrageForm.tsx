"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SERVICES } from "@/data/services";
import { SITE } from "@/data/site";
import { cn } from "@/lib/cn";

type FormState = {
  service: string;
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
const BUDGETS = ["bis 3.000 €", "3.000 – 8.000 €", "8.000 – 20.000 €", "20.000 – 50.000 €", "über 50.000 €"];
const TIMELINES = ["Sofort", "in 1–3 Monaten", "in 3–6 Monaten", "Flexibel"];

const STEPS = ["Leistung", "Projekt", "Kontakt", "Übersicht"];

export function AnfrageForm({ initialService }: { initialService?: string }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormState>({
    service: initialService ?? "",
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
    if (initialService) setForm((f) => ({ ...f, service: initialService }));
  }, [initialService]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const canNext = useMemo(() => {
    if (step === 0) return form.service.length > 0;
    if (step === 1) return form.scope && form.timeline && form.description.trim().length >= 10;
    if (step === 2) return form.name.trim() && form.email.trim() && form.email.includes("@");
    return true;
  }, [step, form]);

  const serviceObj = SERVICES.find((s) => s.slug === form.service);

  function buildMailto() {
    const subject = `Neue Anfrage von ${form.name} – ${serviceObj?.name ?? "Schreinerei"}`;
    const lines = [
      `Anfrage über alignum.de`,
      `————————————————————`,
      ``,
      `LEISTUNG`,
      `${serviceObj?.name ?? form.service}`,
      ``,
      `PROJEKT`,
      `Umfang: ${form.scope}`,
      `Budget: ${form.budget || "—"}`,
      `Timeline: ${form.timeline}`,
      ``,
      `BESCHREIBUNG`,
      form.description,
      ``,
      `MASSE / RÄUME`,
      form.measurements || "—",
      ``,
      `KONTAKT`,
      `Name: ${form.name}`,
      `E-Mail: ${form.email}`,
      `Telefon: ${form.phone || "—"}`,
      `Ort: ${form.city || "—"}`,
      `Bevorzugte Erreichbarkeit: ${form.contactPref}`,
    ];
    const body = encodeURIComponent(lines.join("\n"));
    return `mailto:${SITE.formMailto}?subject=${encodeURIComponent(subject)}&body=${body}`;
  }

  function handleSubmit() {
    const href = buildMailto();
    window.location.href = href;
    setSubmitted(true);
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
                value={form.service}
                onChange={(v) => update("service", v)}
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
                serviceName={serviceObj?.name ?? "—"}
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
                  onClick={handleSubmit}
                >
                  <Send className="size-4" /> Anfrage absenden
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <SuccessState />
        )}
      </AnimatePresence>
    </div>
  );
}

function Step1({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <h2 className="font-display text-3xl sm:text-4xl mb-3">
        Was dürfen wir für Sie bauen?
      </h2>
      <p className="text-muted-foreground mb-8">
        Wählen Sie die Leistung, die am besten passt. Sie können später
        weitere ergänzen.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SERVICES.map((s) => {
          const active = value === s.slug;
          return (
            <button
              type="button"
              key={s.slug}
              onClick={() => onChange(s.slug)}
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
        label="Beschreibung des Projekts"
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
          Wir antworten innerhalb eines Werktags.
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

function Step4({ form, serviceName }: { form: FormState; serviceName: string }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl sm:text-4xl mb-3">
          Sieht das richtig aus?
        </h2>
        <p className="text-muted-foreground">
          Mit Klick auf „Anfrage absenden" öffnet sich Ihr E-Mail-Programm – die
          Anfrage ist bereits ausgefüllt, Sie müssen nur noch absenden.
        </p>
      </div>

      <dl className="rounded-2xl border border-border bg-card divide-y divide-border">
        <Row k="Leistung" v={serviceName} />
        <Row k="Umfang" v={form.scope} />
        {form.budget && <Row k="Budget" v={form.budget} />}
        <Row k="Timeline" v={form.timeline} />
        <Row k="Beschreibung" v={form.description} />
        {form.measurements && <Row k="Maße / Räume" v={form.measurements} />}
        <Row k="Kontakt" v={`${form.name} · ${form.email}${form.phone ? ` · ${form.phone}` : ""}${form.city ? ` · ${form.city}` : ""}`} />
      </dl>
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

function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="rounded-2xl border border-border bg-card p-10 text-center grain-overlay"
    >
      <span className="inline-flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground mb-6">
        <Sparkles className="size-7" />
      </span>
      <h2 className="font-display text-3xl sm:text-4xl mb-3">Danke!</h2>
      <p className="text-muted-foreground max-w-sm mx-auto">
        Ihre Anfrage ist auf dem Weg. Falls sich Ihr E-Mail-Programm nicht
        geöffnet hat, schreiben Sie uns einfach an{" "}
        <a className="text-primary" href={`mailto:${SITE.formMailto}`}>
          {SITE.formMailto}
        </a>
        .
      </p>
    </motion.div>
  );
}
