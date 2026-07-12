"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

const ERROR_MESSAGES: Record<string, string> = {
  link: "Der Login-Link war ungültig oder abgelaufen. Bitte fordere einen neuen an.",
  denied: "Diese Adresse ist nicht für das Studio freigeschaltet.",
};

export function LoginForm({ initialError }: { initialError?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState(
    initialError ? (ERROR_MESSAGES[initialError] ?? "") : "",
  );
  const [devLink, setDevLink] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    setDevLink(null);
    try {
      const res = await fetch("/api/studio/auth/request/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company: "" }),
      });
      const data = (await res.json()) as {
        message?: string;
        error?: string;
        devLink?: string;
      };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Es ist ein Fehler aufgetreten.");
        return;
      }
      setStatus("sent");
      setMessage(data.message ?? "Login-Link gesendet.");
      if (data.devLink) setDevLink(data.devLink);
    } catch {
      setStatus("error");
      setMessage("Netzwerkfehler. Bitte erneut versuchen.");
    }
  }

  return (
    <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-card p-8 shadow-[var(--shadow-elev)] sm:p-10">
      <p className="font-brand mb-3 text-xs text-primary">Alignum Studio</p>
      <h1 className="font-display mb-2 text-2xl text-card-foreground">
        Anmelden
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Wir senden dir einen einmaligen Login-Link per E-Mail.
      </p>

      {status === "sent" ? (
        <div className="rounded-[var(--radius)] bg-muted p-4 text-sm text-foreground">
          {message}
          {devLink && (
            <p className="mt-3 break-all">
              <a className="text-primary underline" href={devLink}>
                DEV-Login-Link öffnen
              </a>
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {/* Honeypot — für Menschen unsichtbar */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              E-Mail-Adresse
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@alignum.de"
              className="h-11 w-full rounded-[var(--radius)] border border-input bg-background px-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/40"
            />
          </div>
          {message && (
            <p
              className={
                status === "error"
                  ? "text-sm text-destructive"
                  : "text-sm text-muted-foreground"
              }
            >
              {message}
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={status === "sending" || !email}
          >
            {status === "sending" ? "Wird gesendet …" : "Login-Link senden"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Nur für berechtigte Alignum-Accounts.
      </p>
    </div>
  );
}
