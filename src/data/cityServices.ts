/**
 * Service×Stadt-Landingpages — datenbasiert aus der Search-Console-Analyse
 * (siehe project_alignum_seo_gsc). Greift Longtails wie „schreinerküche
 * mannheim", „büromöbel heidelberg", „einbauschrank bruchsal" gezielt ab.
 *
 * URL-Schema: /{citySlug}/{comboSlug}/  (z.B. /schreinerei-mannheim/kuechenbau/)
 * Gerendert über die gemergte Route src/app/[citySlug]/[slug]/page.tsx, die
 * zwischen Projekt-Detail und dieser City-Service-Landing dispatcht.
 *
 * Bewusst NUR Top-Städte (höchste Impressionen/Nachfrage) × Kern-Leistungen
 * inkl. Shoji — Qualität vor Masse (8×8 = 64 Seiten statt ~1000).
 */

/** Top-Städte nach GSC-Impressionen + Service+Stadt-Longtail-Volumen. */
export const TOP_CITY_SLUGS: string[] = [
  "schreinerei-mannheim",
  "schreinerei-heidelberg",
  "schreinerei-ludwigshafen-am-rhein",
  "schreinerei-weinheim",
  "schreinerei-schwetzingen",
  "schreinerei-walldorf",
  "schreinerei-bruchsal",
  "schreinerei-speyer",
];

export type CityService = {
  /** URL-Segment, kurz: /{citySlug}/{slug}/ */
  slug: string;
  /** Verknüpfter Service aus services.ts (für Features, FAQ, Back-Link) */
  serviceSlug: string;
  /** H1-Keyword ohne Stadt — wird als „{h1} {Stadt}" gerendert */
  h1: string;
  /** Bildkategorie aus photos.ts */
  imageCategory: string;
  /** Kurz-Tagline für Meta-Title (nach „{h1} {Stadt} – …") */
  metaTagline: string;
  /** Lead-Satz unter der H1 (Stadt wird via {city} interpoliert) */
  lead: string;
  /** Optionales Cover (z.B. echtes Referenzprojekt) statt PHOTOS[imageCategory][0] */
  cover?: string;
};

export const CITY_SERVICES: CityService[] = [
  {
    slug: "kuechenbau",
    serviceSlug: "kuechenbau-in-der-naehe",
    h1: "Schreinerküche",
    imageCategory: "kuechen",
    metaTagline: "Küche nach Maß vom Schreiner",
    lead: "Massivholzküchen nach Maß – geplant, gefertigt und montiert für Ihr Zuhause in {city}.",
  },
  {
    slug: "einbauschrank",
    serviceSlug: "moebelbauer",
    h1: "Einbauschränke",
    imageCategory: "schraenke",
    metaTagline: "Schrank nach Maß vom Schreiner",
    lead: "Einbauschränke, Ankleiden und Schiebetüren nach Maß – millimetergenau für jede Wand in {city}.",
  },
  {
    slug: "bueromoebel",
    serviceSlug: "bueromoebel",
    h1: "Büromöbel",
    imageCategory: "bueromoebel",
    metaTagline: "Büromöbel nach Maß vom Schreiner",
    lead: "Schreibtische, Konferenztische und Empfangstheken nach Maß – repräsentativ und langlebig für Ihr Büro in {city}.",
  },
  {
    slug: "badmoebel",
    serviceSlug: "badmoebel",
    h1: "Badmöbel",
    imageCategory: "badmoebel",
    metaTagline: "Badmöbel nach Maß vom Schreiner",
    lead: "Waschtische, Hochschränke und Spiegelmodule aus wasserfestem Massivholz – nach Maß für Ihr Bad in {city}.",
    cover: "/images/projects/badunterschrank-mannheim-ulme/badunterschrank-mannheim-ulme-01.jpg",
  },
  {
    slug: "treppenbau",
    serviceSlug: "treppenbau-in-der-nahe",
    h1: "Treppenbau",
    imageCategory: "treppen",
    metaTagline: "Holztreppen nach Maß vom Schreiner",
    lead: "Freitragende Treppen, Wangentreppen und Treppensanierung aus Massivholz – statisch geplant, montiert in {city}.",
  },
  {
    slug: "tueren",
    serviceSlug: "tuerenbauer-in-der-naehe",
    h1: "Türen & Innentüren",
    imageCategory: "tueren",
    metaTagline: "Türen nach Maß vom Schreiner",
    lead: "Haustüren, Innentüren und Tore nach Maß – passgenau gefertigt und montiert für Ihr Haus in {city}.",
  },
  {
    slug: "massivholzbetten",
    serviceSlug: "massivholzbetten",
    h1: "Massivholzbetten",
    imageCategory: "betten",
    metaTagline: "Bett nach Maß vom Schreiner",
    lead: "Massivholzbetten in jeder Größe – ehrliche Verbindungen, kein Spanplatten-Knarzen, gefertigt für Ihr Schlafzimmer in {city}.",
  },
  {
    slug: "shoji",
    serviceSlug: "shoji",
    h1: "Shoji",
    imageCategory: "shoji",
    metaTagline: "Japanische Schiebewände nach Maß",
    lead: "Authentische Shoji-Schiebewände mit echtem Washi-Reispapier – Räume teilen, ohne sie zu trennen, gefertigt für {city}.",
  },
];

/* ─────────────── Helpers ─────────────── */

const COMBO_SLUGS = new Set(CITY_SERVICES.map((c) => c.slug));

export function isTopCity(citySlug: string): boolean {
  return TOP_CITY_SLUGS.includes(citySlug);
}

export function getCityService(slug: string): CityService | undefined {
  return CITY_SERVICES.find((c) => c.slug === slug);
}

/** Ist `slug` ein Kombi-Slug (im Gegensatz zu einem Projekt-Slug)? */
export function isCityServiceSlug(slug: string): boolean {
  return COMBO_SLUGS.has(slug);
}

/** Alle gültigen (citySlug, comboSlug)-Paare für generateStaticParams. */
export function cityServicePairs(): { citySlug: string; slug: string }[] {
  return TOP_CITY_SLUGS.flatMap((citySlug) =>
    CITY_SERVICES.map((c) => ({ citySlug, slug: c.slug })),
  );
}

export function cityServicePath(citySlug: string, comboSlug: string): string {
  return `/${citySlug}/${comboSlug}/`;
}
