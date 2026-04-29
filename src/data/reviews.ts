// Echte Google-Bewertungen, gescraped 2026-04-29 vom GMB-Profil
// Place: ALIGNUM MÖBELBAU · 49.4542161, 8.5940851
// 26 Reviews insgesamt (Avg 5.0). 8 Reviews mit Text — die restlichen sind reine Sterne-Bewertungen.

export type Review = {
  author: string;
  authorMeta?: string;
  rating: number;
  date: string;
  text: string;
  ownerReply?: string;
  source: "google" | "site";
};

export const REVIEWS: Review[] = [
  {
    author: "Bella M.",
    authorMeta: "Local Guide · 15 Rezensionen · 8 Fotos",
    rating: 5,
    date: "vor einem Jahr",
    text: "Wir haben mittlerweile ein Sideboard, eine Vitrine und einen Weinschrank bei Alignum Möbelbau in Edingen-Neckarhausen fertigen lassen. Jedesmal sind wir absolut begeistert von der professionellen und tollen Arbeit. Wir lieben alle Stücke und freuen uns täglich darüber.",
    ownerReply:
      "Vielen Dank für Ihre nette und freundliche Bewertung! Auch für mich ist es jedesmal eine Freude, Ihre spannende Projekte zu entwickeln und in die Welt zu setzen 😊",
    source: "google",
  },
  {
    author: "Gabriella Clemens",
    authorMeta: "1 Rezension · 5 Fotos",
    rating: 5,
    date: "vor 11 Monaten",
    text: "Vielen Dank für die professionelle Planung, Absprachen und den Einbau unserer Treppe und der Einbauschränke. Herr Preussner findet tolle Lösungen auch in herausfordernden Wohnräumen. Er ist zuverlässig, schnell und dabei immer freundlich!",
    source: "google",
  },
  {
    author: "Stefan S",
    authorMeta: "2 Rezensionen",
    rating: 5,
    date: "vor 9 Monaten",
    text: "Wir können Alignum wärmstens empfehlen. Wir hatten eine Vorstellung einer individuellen Einbauküche, die wir mit Herrn Preussner besprechen und konkreter planen konnten. Herr Preussner hat sich viel Zeit für uns genommen, viele Ideen und Vorschläge eingebracht – das Ergebnis ist genau das, was wir uns gewünscht haben.",
    ownerReply:
      "Hallo Herr Stefan S., vielen Dank für Ihre so nette und freundliche Bewertung! Ich denke, Sie haben gut getroffen, was unser täglicher Ansporn ist.",
    source: "google",
  },
  {
    author: "Matthias Heppe",
    authorMeta: "Local Guide · 44 Rezensionen · 6 Fotos",
    rating: 5,
    date: "vor 2 Jahren",
    text: "Jedesmal wieder diese tolle Erfahrung: Man hat eine Idee für ein Möbel und Alignum realisiert diese Idee! Dafür braucht es nur die Maße und wenige Worte, schon wird eine Skizze auf's Papier gezaubert.",
    ownerReply:
      "Lieber Herr Heppe, vielen Dank für Ihre freundlichen Worte! Es ist uns allen in meiner Firma ein großer Antrieb und eine große Freude, für so nette Menschen wie Sie arbeiten zu dürfen!",
    source: "google",
  },
  {
    author: "Michelle Klasen",
    authorMeta: "Local Guide · 12 Rezensionen · 5 Fotos",
    rating: 5,
    date: "vor einem Jahr",
    text: "Eine absolute Empfehlung. Herr Preußner mit seiner sehr freundlichen, herzlichen, ruhigen, offenen und immer transparenten Art macht es einem sehr leicht, dem Handwerk Vertrauen zu schenken.",
    ownerReply:
      "Liebe Frau Klasen, vielen Dank für Ihre lieben Worte! Es ist für uns immer wieder eine große Freude, Menschen wie Ihnen zu begegnen.",
    source: "google",
  },
  {
    author: "Manuel Reinmuth",
    authorMeta: "5 Rezensionen · 2 Fotos",
    rating: 5,
    date: "vor 2 Jahren",
    text: "Massivholz-Treppe – über eine Empfehlung sind wir auf Alignum aufmerksam geworden. Von Anfang an war alles äußerst professionell. Professionalität verbunden mit einem sehr fairen Preis und einer großartigen Beratung.",
    source: "google",
  },
  {
    author: "Stock Oliver",
    authorMeta: "Local Guide · 33 Rezensionen · 5 Fotos",
    rating: 5,
    date: "vor 2 Jahren",
    text: "Nach mehreren zur vollsten Zufriedenheit ausgeführten Auftragsarbeiten sind wir absolut überzeugt von Alignum.",
    ownerReply:
      "Hallo Herr Stock, jeder Betrieb kann froh sein, mit so netten Menschen wie Ihnen zusammen zu arbeiten! Da weiß man einfach, dass wir das Richtige tun.",
    source: "google",
  },
  {
    author: "Fa Q",
    authorMeta: "7 Rezensionen · 2 Fotos",
    rating: 5,
    date: "vor 2 Jahren",
    text: 'Auf der Suche nach ansässigen Möbelbauern sind wir auf Alignum gestossen. Zum Glück möchte man sagen. Nach gemeinsamer Planung und einem folgenden Entwurf des Projekts „Familienbett" konnte dieses schnell realisiert werden.',
    source: "google",
  },
];

export const REVIEW_SUMMARY = {
  averageRating: 5.0,
  count: 26,
  source: "Google",
  url: "https://www.google.com/maps/place/ALIGNUM+M%C3%96BELBAU/@49.4542161,8.5940851,17z/data=!4m6!3m5!1s0x4797c5e0297caf2f:0x3570da2f91f2f8e4",
};

// ──────────────────────────────────────────────────────────────
// Echte Kundenfotos vom GMB-Profil
// ──────────────────────────────────────────────────────────────
export type GmbPhoto = {
  src: string;
  attribution?: string;
  source: "owner" | "customer";
};

export const GMB_PHOTOS: GmbPhoto[] = [
  // Owner / Werkstatt-Bilder (gmb-001 bis gmb-009)
  ...Array.from({ length: 9 }, (_, i) => ({
    src: `/images/gmb/gmb-${String(i + 1).padStart(3, "0")}.jpg`,
    source: "owner" as const,
  })),
  // Customer-Bilder mit Attribution (gmb-010 bis gmb-028)
  { src: "/images/gmb/gmb-010.jpg", attribution: "Bella M.", source: "customer" },
  { src: "/images/gmb/gmb-011.jpg", attribution: "Bella M.", source: "customer" },
  { src: "/images/gmb/gmb-012.jpg", attribution: "Bella M.", source: "customer" },
  { src: "/images/gmb/gmb-013.jpg", attribution: "Bella M.", source: "customer" },
  { src: "/images/gmb/gmb-014.jpg", attribution: "Gabriella Clemens", source: "customer" },
  { src: "/images/gmb/gmb-015.jpg", attribution: "Gabriella Clemens", source: "customer" },
  { src: "/images/gmb/gmb-016.jpg", attribution: "Gabriella Clemens", source: "customer" },
  { src: "/images/gmb/gmb-017.jpg", attribution: "Gabriella Clemens", source: "customer" },
  { src: "/images/gmb/gmb-018.jpg", attribution: "Stock Oliver", source: "customer" },
  { src: "/images/gmb/gmb-019.jpg", attribution: "Stock Oliver", source: "customer" },
  { src: "/images/gmb/gmb-020.jpg", attribution: "Stock Oliver", source: "customer" },
  { src: "/images/gmb/gmb-021.jpg", attribution: "Michelle Klasen", source: "customer" },
  { src: "/images/gmb/gmb-022.jpg", attribution: "Michelle Klasen", source: "customer" },
  { src: "/images/gmb/gmb-023.jpg", attribution: "Michelle Klasen", source: "customer" },
  { src: "/images/gmb/gmb-024.jpg", attribution: "Fa Q", source: "customer" },
  { src: "/images/gmb/gmb-025.jpg", attribution: "Fa Q", source: "customer" },
  { src: "/images/gmb/gmb-026.jpg", attribution: "Manuel Reinmuth", source: "customer" },
  { src: "/images/gmb/gmb-027.jpg", attribution: "Manuel Reinmuth", source: "customer" },
  { src: "/images/gmb/gmb-028.jpg", attribution: "Matthias Heppe", source: "customer" },
];

export const GMB_OWNER_PHOTOS = GMB_PHOTOS.filter((p) => p.source === "owner");
export const GMB_CUSTOMER_PHOTOS = GMB_PHOTOS.filter((p) => p.source === "customer");
