import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Cinzel } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { ConsentProvider } from "@/components/consent/ConsentContext";
import { GoogleAnalytics } from "@/components/consent/GoogleAnalytics";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { ConsentSettings } from "@/components/consent/ConsentSettings";
import { SITE } from "@/data/site";
import { localBusinessJsonLd } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-stack",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display-stack",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

// Brand-Schrift identisch zum Logo-Schriftzug (ALIGNUM MÖBELBAU).
// Cinzel ist die Free-Google-Fonts-Variante von Trajan Pro — römische
// Capitalis, lapidare Anmutung. Wird für Eyebrows, kleine Caps-Labels
// und Brand-Statements verwendet.
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-brand-stack",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} – ${SITE.tagline} | Schreinerei Mannheim`,
    template: `%s | ${SITE.name} Schreinerei Mannheim`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: SITE.name,
    url: SITE.url,
    title: `${SITE.name} – ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning className={`${inter.variable} ${fraunces.variable} ${cinzel.variable}`}>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>
          <ConsentProvider>
            <SmoothScroll />
            <Header />
            <main className="relative">{children}</main>
            <Footer />
            <JsonLd id="ld-business" data={localBusinessJsonLd()} />

            {/* DSGVO — GA wird nur geladen wenn consent.analytics === true */}
            <GoogleAnalytics />
            <CookieBanner />
            <ConsentSettings />
          </ConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
