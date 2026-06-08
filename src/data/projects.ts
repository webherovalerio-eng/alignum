/**
 * Referenz-Projekte für Alignum — Local-SEO-Premium-Content.
 *
 * Jeder Eintrag wird automatisch:
 *  - Auf der eigenen Detail-Seite `/projekte/{slug}/` gerendert
 *  - Auf der City-Page der jeweiligen Stadt als „Projekte in {Stadt}" gelistet
 *  - Auf der Service-Page der jeweiligen Disziplin als „Beispielprojekte" gelistet
 *  - In den Sitemap aufgenommen
 *  - In Footer-Listings „Letzte Projekte" verlinkt
 *
 * Slug-Konvention: `{kategorie}-{stadt}-{material}` oder kurz beschreibend.
 * Beispiele: fernsehschrank-mannheim-ahorn, shoji-schiebetuer-darmstadt
 */

export type Project = {
  slug: string;
  /** Stadt-Slug aus src/data/cities.ts (z.B. "schreinerei-mannheim") */
  city: string;
  /** Service-Slug aus src/data/services.ts (z.B. "moebelbauer") */
  service: string;
  /** Material-Slug aus src/data/materials.ts (z.B. "ahorn") — optional */
  material?: string;
  title: string;
  /** Suchmaschinen-Title (60 chars) und H1 */
  metaTitle: string;
  /** Meta-Description (150 chars) */
  metaDescription: string;
  /** Kurztext für Cards (max ~140 chars) */
  summary: string;
  /** Body-Paragraphen — Story des Projekts */
  body: string[];
  /** Bullet-Points „Was wir gebaut haben" */
  features: string[];
  year?: number;
  /** Bilderliste, root-relative paths */
  images: string[];
  /** Hauptbild für Cards + OG */
  cover: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "fernsehschrank-mannheim-ahorn",
    city: "schreinerei-mannheim",
    service: "moebelbauer",
    material: "ahorn",
    title: "Fernsehschrank aus Ahorn — Projekt Mannheim",
    metaTitle: "Fernsehschrank aus Ahorn nach Maß | Projekt in Mannheim",
    metaDescription:
      "Wand­hängendes TV-Lowboard mit massiver Ahornplatte und Hochschrank in Hochglanz-Weiß — gefertigt von Alignum für einen Kunden in Mannheim. Maßmöbel aus heimischem Holz.",
    summary:
      "Wandhängendes TV-Lowboard mit massiver Ahornplatte und passendem Vitrinen-Hochschrank — gefertigt für ein Wohnzimmer in Mannheim.",
    body: [
      "Für einen Kunden in Mannheim haben wir ein wandhängendes TV-Möbel entwickelt, das die warme Wandfarbe des Raums aufgreift und durch eine massive Ahornplatte ergänzt. Die schwebende Konstruktion lässt den Bodenbelag durchgängig erscheinen — der Raum wirkt dadurch deutlich größer als mit einem klassisch stehenden Möbel.",
      "Die Korpusse fertigen wir in Hochglanz-Weiß mit grifflosen Push-to-Open-Mechaniken. Die obere Ablage besteht aus europäischem Berg-Ahorn (Acer pseudoplatanus) – ein Massivholz, das mit seiner cremig-hellen Farbe und der feinen, fast unsichtbaren Maserung perfekt zu modernen Interieurs passt. Wir haben die Platte aus einem einzigen Stamm aufgetrennt, damit Maserung und Farbverlauf von links nach rechts durchgehen.",
      "Der passende Vitrinen-Hochschrank wiederholt das Materialspiel: weißer Korpus, Ahorn-Boden, Glastüren mit Ahorn-Rahmen. Beleuchtet wird er von innen über dimmbare LED-Spots, die wir bauseits an die bestehende Hauselektrik angeschlossen haben.",
      "Vom ersten Aufmaßtermin in Mannheim bis zur Montage vergingen sieben Wochen. Geliefert und montiert haben wir an einem Werktag — der Kunde konnte am Abend desselben Tages bereits Fernsehen.",
    ],
    features: [
      "Wandhängendes TV-Lowboard mit Push-to-Open-Fronten",
      "Massive Ahorn-Ablage aus einem Stamm (Farbverlauf durchgehend)",
      "Vitrinen-Hochschrank mit dimmbarer LED-Innenbeleuchtung",
      "Korpusse in Hochglanz-Weiß, Ahorn-Akzente",
      "Maßanfertigung passend zur vorhandenen Wandfarbe und Steckdosen­positionen",
      "Aufmaß, Lieferung und Montage in Mannheim",
    ],
    year: 2025,
    images: [
      "/images/projects/fernsehschrank-mannheim-ahorn/fernsehschrank-mannheim-ahorn-01.jpg",
      "/images/projects/fernsehschrank-mannheim-ahorn/fernsehschrank-mannheim-ahorn-02.jpg",
      "/images/projects/fernsehschrank-mannheim-ahorn/fernsehschrank-mannheim-ahorn-03.jpg",
      "/images/projects/fernsehschrank-mannheim-ahorn/fernsehschrank-mannheim-ahorn-04.jpg",
      "/images/projects/fernsehschrank-mannheim-ahorn/fernsehschrank-mannheim-ahorn-05.jpg",
      "/images/projects/fernsehschrank-mannheim-ahorn/fernsehschrank-mannheim-ahorn-06.jpg",
      "/images/projects/fernsehschrank-mannheim-ahorn/fernsehschrank-mannheim-ahorn-07.jpg",
    ],
    cover:
      "/images/projects/fernsehschrank-mannheim-ahorn/fernsehschrank-mannheim-ahorn-01.jpg",
  },
];

/* ─────────────── Helpers ─────────────── */

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getProjectsByCity(citySlug: string): Project[] {
  return PROJECTS.filter((p) => p.city === citySlug);
}

export function getProjectsByService(serviceSlug: string): Project[] {
  return PROJECTS.filter((p) => p.service === serviceSlug);
}

export function getProjectsByMaterial(materialSlug: string): Project[] {
  return PROJECTS.filter((p) => p.material === materialSlug);
}
