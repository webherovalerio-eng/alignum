"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Heart,
  RefreshCw,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { StarRating } from "./StarRating";
import { Logo } from "@/components/layout/Logo";
import { generateReview } from "@/data/reviewTemplates";
import { SITE } from "@/data/site";
import { cn } from "@/lib/cn";

type Step = "stars" | "positive" | "negative" | "ai-text" | "contact" | "done";

const GOOGLE_REVIEW_URL = SITE.social.google;
const NEGATIVE_THRESHOLD = 4; // <= 4 Sterne → Negativ-Branch

export function BewertungFlow() {
  const [step, setStep] = useState<Step>("stars");
  const [rating, setRating] = useState(0);
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);

  // Negative-Branch state
  const [negative, setNegative] = useState({
    feedback: "",
    name: "",
    email: "",
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  function handleStars(n: number) {
    setRating(n);
    // small delay so the user sees their selection before the screen switches
    setTimeout(() => {
      setStep(n >= 5 ? "positive" : "negative");
    }, 380);
  }

  function regenerate() {
    setGeneratedText(generateReview());
    setCopied(false);
  }

  function goToAiText() {
    setGeneratedText(generateReview());
    setCopied(false);
    setStep("ai-text");
  }

  async function copyAndOpenGoogle() {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      // 700 ms Pause, dann Google öffnen — UX: User sieht den Copy-Confirm
      setTimeout(() => {
        window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
        setStep("done");
      }, 700);
    } catch {
      // Fallback: einfach direkt zu Google
      window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
      setStep("done");
    }
  }

  function submitNegative() {
    if (!negative.feedback.trim()) return;
    setFeedbackSubmitted(true);
    setStep("contact");
  }

  function sendNegativeMail(includeContact: boolean) {
    const lines = [
      "Interne Rückmeldung über alignum.de/bewertung",
      "—".repeat(40),
      "",
      `Sterne: ${rating} / 5`,
      "",
      "WAS WIR VERBESSERN KÖNNTEN",
      negative.feedback,
    ];
    if (includeContact && (negative.name || negative.email)) {
      lines.push("", "KONTAKT");
      if (negative.name) lines.push(`Name: ${negative.name}`);
      if (negative.email) lines.push(`E-Mail: ${negative.email}`);
    }
    const subject = `Feedback (${rating}⭐) – ${negative.name || "Anonym"}`;
    const body = encodeURIComponent(lines.join("\n"));
    const href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = href;
    setStep("done");
  }

  function reset() {
    setStep("stars");
    setRating(0);
    setGeneratedText("");
    setCopied(false);
    setNegative({ feedback: "", name: "", email: "" });
    setFeedbackSubmitted(false);
  }

  // Progress dots
  const progress = useMemo(() => {
    if (step === "stars") return 1;
    if (step === "positive" || step === "negative") return 2;
    if (step === "ai-text" || (step === "contact" && feedbackSubmitted)) return 3;
    if (step === "done") return 4;
    return 1;
  }, [step, feedbackSubmitted]);

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-3xl border border-border bg-card shadow-[var(--shadow-elev)] grain-overlay overflow-hidden">
      {/* Top brand bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/60 backdrop-blur">
        <Logo />
        <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Bewertung
        </span>
      </div>

      {/* Progress strip */}
      <div className="h-1 bg-border">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "25%" }}
          animate={{ width: `${progress * 25}%` }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        />
      </div>

      <div className="p-8 sm:p-10 min-h-[420px]">
        <AnimatePresence mode="wait">
          {step === "stars" && (
            <StepStars key="stars" value={rating} onChange={handleStars} />
          )}
          {step === "positive" && (
            <StepPositive
              key="positive"
              onGoogle={() => {
                window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
                setStep("done");
              }}
              onAi={goToAiText}
            />
          )}
          {step === "ai-text" && (
            <StepAiText
              key="ai-text"
              text={generatedText}
              copied={copied}
              onRegenerate={regenerate}
              onCopyAndOpen={copyAndOpenGoogle}
            />
          )}
          {step === "negative" && (
            <StepNegative
              key="negative"
              value={negative.feedback}
              onChange={(v) => setNegative((s) => ({ ...s, feedback: v }))}
              onSubmit={submitNegative}
            />
          )}
          {step === "contact" && (
            <StepContact
              key="contact"
              name={negative.name}
              email={negative.email}
              onName={(v) => setNegative((s) => ({ ...s, name: v }))}
              onEmail={(v) => setNegative((s) => ({ ...s, email: v }))}
              onSkip={() => sendNegativeMail(false)}
              onSubmit={() => sendNegativeMail(true)}
            />
          )}
          {step === "done" && <StepDone key="done" rating={rating} onReset={reset} />}
        </AnimatePresence>
      </div>

      {/* Bottom nav — Back-Button erscheint nur in Branches */}
      {(step === "positive" || step === "negative" || step === "ai-text") && (
        <div className="px-6 py-3 border-t border-border flex justify-start">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStep(step === "ai-text" ? "positive" : "stars")}
          >
            <ArrowLeft className="size-3.5" /> Zurück
          </Button>
        </div>
      )}
    </div>
  );
}

/* ─────────────── Step components ─────────────── */

function StepStars({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      className="text-center flex flex-col items-center gap-7"
    >
      <Sparkles className="size-5 text-primary" />
      <div className="space-y-2">
        <h2 className="font-display text-2xl sm:text-3xl leading-tight">
          Wie zufrieden waren Sie mit unserer Arbeit?
        </h2>
        <p className="text-sm text-muted-foreground">
          Ihre Meinung hilft uns, besser zu werden.
        </p>
      </div>
      <StarRating value={value} onChange={onChange} />
      <p className="text-xs text-muted-foreground">
        Tippen Sie auf einen Stern, um fortzufahren.
      </p>
    </motion.div>
  );
}

function StepPositive({
  onGoogle,
  onAi,
}: {
  onGoogle: () => void;
  onAi: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      className="text-center flex flex-col items-center gap-7"
    >
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Heart className="size-5 fill-current" />
      </span>
      <div className="space-y-2">
        <h2 className="font-display text-2xl sm:text-3xl leading-tight">
          Vielen Dank für Ihre Bewertung!
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Würden Sie das auch öffentlich teilen? Sie haben zwei Optionen:
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <Button type="button" variant="primary" size="lg" onClick={onGoogle} className="w-full">
          <ExternalLink className="size-4" /> Direkt bei Google bewerten
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onAi}
          className="w-full"
        >
          <Sparkles className="size-4" /> Bewertungstext vorschlagen lassen
        </Button>
      </div>

      <p className="text-xs text-muted-foreground max-w-xs">
        Wir formulieren einen Vorschlag – Sie prüfen, kopieren und posten ihn bei Google.
      </p>
    </motion.div>
  );
}

function StepAiText({
  text,
  copied,
  onRegenerate,
  onCopyAndOpen,
}: {
  text: string;
  copied: boolean;
  onRegenerate: () => void;
  onCopyAndOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      className="flex flex-col gap-6"
    >
      <div className="text-center">
        <h2 className="font-display text-2xl sm:text-3xl leading-tight">
          Ihr Bewertungs-Vorschlag
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Passt der Text? Dann kopieren wir ihn und öffnen Google.
        </p>
      </div>

      <motion.div
        key={text}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-xl border border-border bg-background/60 backdrop-blur p-5 min-h-[140px]"
      >
        <p className="text-sm sm:text-base italic text-foreground/90 leading-relaxed">
          {text}
        </p>
      </motion.div>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onRegenerate}
          className="w-full"
        >
          <RefreshCw className="size-4" /> Neu generieren
        </Button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onCopyAndOpen}
          className="w-full"
          disabled={copied}
        >
          {copied ? (
            <>
              <Check className="size-4" /> Kopiert – Google öffnet sich …
            </>
          ) : (
            <>
              <Copy className="size-4" /> Kopieren & bei Google posten
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

function StepNegative({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  const valid = value.trim().length >= 10;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      className="flex flex-col gap-6"
    >
      <div>
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
          <ThumbsDown className="size-5" />
        </span>
        <h2 className="font-display text-2xl sm:text-3xl leading-tight">
          Das tut uns leid.
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Bitte teilen Sie uns mit, was wir verbessern können. Ihre Antwort
          geht direkt an Jan – nicht öffentlich.
        </p>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="Was können wir verbessern?"
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors resize-y"
      />

      <Button
        type="button"
        variant="primary"
        size="lg"
        disabled={!valid}
        onClick={onSubmit}
        className="w-full"
      >
        <Send className="size-4" /> Feedback absenden
      </Button>
    </motion.div>
  );
}

function StepContact({
  name,
  email,
  onName,
  onEmail,
  onSkip,
  onSubmit,
}: {
  name: string;
  email: string;
  onName: (v: string) => void;
  onEmail: (v: string) => void;
  onSkip: () => void;
  onSubmit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      className="flex flex-col gap-6"
    >
      <div>
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary mb-4">
          <Check className="size-5" />
        </span>
        <h2 className="font-display text-2xl sm:text-3xl leading-tight">
          Vielen Dank für Ihr Feedback!
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Möchten Sie, dass wir Sie kontaktieren?{" "}
          <span className="text-muted-foreground/70">(optional)</span>
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => onName(e.target.value)}
          placeholder="Ihr Name"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => onEmail(e.target.value)}
          placeholder="Ihre E-Mail-Adresse"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors"
        />
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" size="md" onClick={onSkip} className="flex-1">
          Überspringen
        </Button>
        <Button type="button" variant="primary" size="md" onClick={onSubmit} className="flex-1">
          Absenden
        </Button>
      </div>
    </motion.div>
  );
}

function StepDone({ rating, onReset }: { rating: number; onReset: () => void }) {
  const positive = rating >= 5;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      className="text-center flex flex-col items-center gap-6"
    >
      <span className="inline-flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
        {positive ? <ThumbsUp className="size-7" /> : <Heart className="size-7 fill-current" />}
      </span>
      <div className="space-y-2">
        <h2 className="font-display text-2xl sm:text-3xl leading-tight">
          {positive ? "Danke fürs Teilen!" : "Vielen Dank!"}
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          {positive
            ? "Ihre Bewertung hilft anderen, uns zu finden."
            : "Wir lesen jede Rückmeldung – und nehmen sie ernst."}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <LinkButton href="/" variant="outline" size="md">
          Zur Startseite
        </LinkButton>
        <Button type="button" variant="ghost" size="md" onClick={onReset}>
          Neue Bewertung
        </Button>
      </div>
    </motion.div>
  );
}

const _cn = cn;
