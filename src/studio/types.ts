import type { StudioRole } from "./config";

export type PostStatus =
  | "neu" // angelegt, Bilder werden hochgeladen/ausgewählt
  | "eingereicht" // Jan hat den Brief abgeschickt → wartet auf Generierung
  | "in_generierung" // CLI/Skill arbeitet
  | "entwurf" // Entwurf liegt vor → Review durch Jan
  | "freigegeben" // Jan hat freigegeben → bereit zum Veröffentlichen
  | "veroeffentlicht"; // live als Supporting-Content

export interface PostImage {
  key: string; // Storage-Key (Blob)
  url: string; // anzeigbare URL
  filename: string;
  bytes: number;
  width?: number;
  height?: number;
  selected: boolean; // von Jan als „passend" markiert
}

/**
 * KI-generierter Entwurf (Projekt-Referenz + Social-Post). Struktur folgt dem
 * `alignum-projects`-Skill / dem echten `Project`-Datensatz:
 *  – `summary` = Card-/Lead-Text, `body` = 4 saubere Absätze (Kontext → Lösung →
 *    Holz → Prozess, durch Leerzeile getrennt, KEINE Überschriften),
 *  – `features` = 4–6 Bullets „Was wir gebaut haben".
 * Das Carousel wird daraus datengetrieben abgeleitet (feste 6 Slides).
 */
export interface PostDraft {
  /** Sprechender Seitentitel (H1), ohne SEO-Zusatz. */
  title?: string;
  metaTitle: string;
  metaDescription: string;
  /** Card-/Lead-Text unter der H1. */
  summary?: string;
  /** @deprecated alte Entwürfe — durch `summary` ersetzt. */
  intro?: string;
  /** 4 Absätze, durch Leerzeile getrennt (Kontext/Lösung/Holz/Prozess). */
  body: string;
  /** 4–6 Bullets „Was wir gebaut haben". */
  features?: string[];
  socialCaption: string;
  hashtags: string[];
  generatedAt: number;
  model: string;
}

export interface Post {
  id: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string; // E-Mail
  status: PostStatus;
  /** City-Slug der Ziel-Stadt, z. B. "schreinerei-mannheim" (leer bis gesetzt). */
  ort: string;
  ortName: string; // Anzeigename, z. B. "Mannheim"
  holzart: string; // z. B. "Eiche"
  moebeltyp: string; // z. B. "Einbauschrank"
  notiz: string; // Freitext von Jan
  images: PostImage[];
  /** Liegt vor, sobald generiert wurde. Von Jan editierbar. */
  draft?: PostDraft;
}

export interface SessionPayload {
  sub: string; // E-Mail (Subject)
  role: StudioRole;
  [key: string]: unknown; // jose JWTPayload-Kompatibilität (iat/exp etc.)
}

export interface StudioUser {
  email: string;
  role: StudioRole;
}
