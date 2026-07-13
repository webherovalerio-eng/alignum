import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Anmeldung bestätigen",
  robots: { index: false, follow: false },
};

/**
 * Bestätigungsseite für den Magic-Link. Reine Anzeige (GET verbraucht KEINEN
 * Token) — erst der Formular-POST auf /api/studio/auth/verify löst ein. So
 * können E-Mail-Scanner den Link vorab prüfen, ohne den Login zu entwerten.
 */
export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; e?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-24">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-card p-8 text-center shadow-[var(--shadow-elev)] sm:p-10">
        <p className="font-brand mb-3 text-xs text-primary">Alignum Studio</p>
        <h1 className="font-display mb-2 text-2xl text-card-foreground">
          Anmeldung bestätigen
        </h1>
        {token ? (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              Klicke auf den Button, um dich einzuloggen.
            </p>
            <form method="POST" action="/api/studio/auth/verify/">
              <input type="hidden" name="token" value={token} />
              <Button type="submit" size="lg" className="w-full">
                Jetzt einloggen
              </Button>
            </form>
          </>
        ) : (
          <p className="mt-4 text-sm text-destructive">
            Ungültiger Link. Bitte unter{" "}
            <a href="/login/" className="text-primary underline">
              /login
            </a>{" "}
            einen neuen anfordern.
          </p>
        )}
      </div>
    </div>
  );
}
