"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LinkButton } from "@/components/ui/Button";
import { SERVICES, SERVICE_HUB } from "@/data/services";
import { cn } from "@/lib/cn";

const NAV_PRIMARY = [
  { href: `/${SERVICE_HUB}/`, label: "Leistungen", hasMenu: true },
  { href: "/about-us/", label: "Über uns" },
  { href: "/garantie/", label: "Garantie" },
  { href: "/kontakt/", label: "Kontakt" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Top contrast veil — sorgt dafür, dass Header-Text auf JEDEM Hero-Bild lesbar ist */}
      <div
        aria-hidden
        className={cn(
          "fixed top-0 inset-x-0 z-40 h-32 pointer-events-none transition-opacity duration-500",
          scrolled ? "opacity-0" : "opacity-100",
        )}
        style={{
          background:
            "linear-gradient(to bottom, hsl(0 0% 0% / 0.55) 0%, hsl(0 0% 0% / 0.25) 50%, hsl(0 0% 0% / 0) 100%)",
        }}
      />

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-[backdrop-filter,background-color,padding,border-color] duration-500",
          scrolled
            ? "py-2 backdrop-blur-xl bg-background/85 border-b border-border"
            : "py-4 backdrop-blur-md bg-background/10 border-b border-transparent",
        )}
      >
        <div className="container-prose flex items-center justify-between gap-4">
          <Logo onDark={!scrolled} />

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_PRIMARY.map((item) =>
              item.hasMenu ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setSubmenuOpen(true)}
                  onMouseLeave={() => setSubmenuOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-1 px-4 py-2 text-sm transition-colors",
                      scrolled
                        ? "text-foreground/80 hover:text-foreground"
                        : "text-white/95 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]",
                    )}
                  >
                    {item.label}
                    <ChevronDown className="size-3.5" />
                  </Link>
                  <AnimatePresence>
                    {submenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
                      >
                        <div className="w-[640px] rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-[var(--shadow-elev)] p-4">
                          <div className="grid grid-cols-2 gap-1">
                            {SERVICES.map((s) => (
                              <Link
                                key={s.slug}
                                href={`/${SERVICE_HUB}/${s.slug}/`}
                                className="group flex flex-col gap-0.5 rounded-lg p-3 hover:bg-muted transition-colors"
                              >
                                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                  {s.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {s.short}
                                </span>
                              </Link>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Alle Leistungen auf einen Blick
                            </span>
                            <Link
                              href={`/${SERVICE_HUB}/`}
                              className="text-xs text-primary underline-offset-4 hover:underline"
                            >
                              Übersicht ansehen →
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-sm transition-colors",
                    scrolled
                      ? "text-foreground/80 hover:text-foreground"
                      : "text-white/95 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <LinkButton href="/anfrage/" size="sm" className="hidden md:inline-flex">
              Anfrage starten
            </LinkButton>
            <button
              type="button"
              aria-label="Menü öffnen"
              onClick={() => setMobileOpen((s) => !s)}
              className={cn(
                "lg:hidden inline-flex size-10 items-center justify-center rounded-full border transition-colors",
                scrolled
                  ? "border-border bg-card text-foreground"
                  : "border-white/40 bg-foreground/30 text-white backdrop-blur",
              )}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-background border-l border-border overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Logo />
                <button
                  type="button"
                  aria-label="Menü schließen"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-border"
                >
                  <X className="size-5" />
                </button>
              </div>
              <nav className="flex flex-col p-4 gap-1">
                <Link
                  href={`/${SERVICE_HUB}/`}
                  className="px-4 py-3 text-base font-medium border-b border-border"
                  onClick={() => setMobileOpen(false)}
                >
                  Leistungen
                </Link>
                <div className="grid grid-cols-2 gap-1 py-2">
                  {SERVICES.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/${SERVICE_HUB}/${s.slug}/`}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg p-3 text-sm hover:bg-muted"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
                <Link href="/about-us/" onClick={() => setMobileOpen(false)} className="px-4 py-3 border-t border-border">Über uns</Link>
                <Link href="/garantie/" onClick={() => setMobileOpen(false)} className="px-4 py-3 border-b border-border">Garantie</Link>
                <Link href="/kontakt/" onClick={() => setMobileOpen(false)} className="px-4 py-3">Kontakt</Link>
                <div className="mt-4 px-2 flex items-center justify-between">
                  <ThemeToggle />
                  <LinkButton href="/anfrage/" size="md" onClick={() => setMobileOpen(false)}>
                    Anfrage starten
                  </LinkButton>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
