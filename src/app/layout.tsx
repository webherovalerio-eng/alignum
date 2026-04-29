import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
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
    <html lang="de" suppressHydrationWarning className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>
          <SmoothScroll />
          <Header />
          <main className="relative">{children}</main>
          <Footer />
          <JsonLd id="ld-business" data={localBusinessJsonLd()} />
        </ThemeProvider>
      </body>
    </html>
  );
}
