import Link from "next/link";
import { Logo } from "./Logo";
import { SITE } from "@/data/site";
import { SERVICES, SERVICE_HUB } from "@/data/services";
import { CITIES } from "@/data/cities";

export function Footer() {
  const featuredCities = CITIES.slice(0, 16);
  return (
    <footer className="relative mt-32 border-t border-border bg-card/40">
      <div className="container-prose pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-5">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-sm">
              Schreinerei in Mannheim. Möbel, Küchen, Treppen und Türen aus
              traditionellem Handwerk und moderner Technik – seit über 30 Jahren.
            </p>
            <div className="text-sm space-y-1.5">
              <p className="font-medium">Kontakt</p>
              <p className="text-muted-foreground">{SITE.address.zip} {SITE.address.city}</p>
              <p>
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="underline-grain">
                  {SITE.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${SITE.email}`} className="underline-grain">
                  {SITE.email}
                </a>
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <p className="font-medium">Leistungen</p>
            <ul className="space-y-2 text-sm">
              {SERVICES.slice(0, 8).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/${SERVICE_HUB}/${s.slug}/`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/${SERVICE_HUB}/`} className="text-primary hover:underline">
                  Alle Leistungen →
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <p className="font-medium">Projekte in</p>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              {featuredCities.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/${c.slug}/`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <p className="font-medium">Kanzlei</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about-us/" className="text-muted-foreground hover:text-foreground">Über uns</Link></li>
              <li><Link href="/garantie/" className="text-muted-foreground hover:text-foreground">Garantie</Link></li>
              <li><Link href="/impressum/" className="text-muted-foreground hover:text-foreground">Impressum</Link></li>
              <li><Link href="/datenschutzerklaerung/" className="text-muted-foreground hover:text-foreground">Datenschutz</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {SITE.name} – {SITE.tagline}</p>
          <p>
            Handgefertigt in Mannheim. Website mit ♥ entwickelt von{" "}
            <a href="https://webhero-valerio.de" className="underline-grain text-foreground">
              WEBhero
            </a>
            .
          </p>
        </div>
      </div>

      {/* Giant brand letter */}
      <div className="pointer-events-none select-none overflow-hidden">
        <div className="font-display text-[clamp(8rem,28vw,28rem)] leading-[0.85] text-center -mb-[0.18em] bg-gradient-to-b from-foreground/[0.06] to-transparent bg-clip-text text-transparent">
          alignum
        </div>
      </div>
    </footer>
  );
}
