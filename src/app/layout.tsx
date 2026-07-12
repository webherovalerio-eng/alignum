import type { Metadata, Viewport } from "next";
import { Source_Sans_3, Montserrat, Cinzel } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HideOnStudio } from "@/components/layout/HideOnStudio";
import { JsonLd } from "@/components/seo/JsonLd";
import { ConsentProvider } from "@/components/consent/ConsentContext";
import { GoogleAnalytics } from "@/components/consent/GoogleAnalytics";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { ConsentSettings } from "@/components/consent/ConsentSettings";
import { SITE } from "@/data/site";
import { localBusinessJsonLd } from "@/lib/seo";

// Alle Fonts via next/font: werden beim Build heruntergeladen und vom
// eigenen Server ausgeliefert — kein Request an Google im Browser (DSGVO).

// Fließtext — angenehmer lesbar als Montserrat bei längeren Texten.
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans-stack",
  display: "swap",
  style: ["normal", "italic"],
});

// H3 + Labels — klarer, moderner Kontrast zur Serifenschrift.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-label-stack",
  display: "swap",
});

// Überschriften (H1/H2) + Brand-Schrift, identisch zum Logo-Schriftzug
// (ALIGNUM MÖBELBAU). Cinzel ist die Free-Google-Fonts-Variante von
// Trajan Pro — römische Capitalis, setzt alles in Versalformen.
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-brand-stack",
  display: "swap",
  weight: ["400", "500", "600"],
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
    <html lang="de" suppressHydrationWarning className={`${sourceSans.variable} ${montserrat.variable} ${cinzel.variable}`}>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>
          <ConsentProvider>
            <HideOnStudio>
              <SmoothScroll />
            </HideOnStudio>
            <HideOnStudio>
              <Header />
            </HideOnStudio>
            <main className="relative">{children}</main>
            <HideOnStudio>
              <Footer />
            </HideOnStudio>
            <JsonLd id="ld-business" data={localBusinessJsonLd()} />

            {/* DSGVO — GA wird nur geladen wenn consent.analytics === true */}
            <GoogleAnalytics />
            <HideOnStudio>
              <CookieBanner />
            </HideOnStudio>
            <ConsentSettings />
          </ConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
