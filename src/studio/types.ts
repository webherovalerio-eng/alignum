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

/** KI-generierter Entwurf (Projekt-/Supporting-Content + Social-Post). */
export interface PostDraft {
  /** Sprechender Seitentitel (H1), ohne SEO-Zusatz. */
  title?: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  body: string; // Markdown
  socialCaption: string;
  hashtags: string[];
  /** Kurze Overlay-Texte für die Carousel-Slides (je 1 Zeile). */
  slides?: string[];
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
