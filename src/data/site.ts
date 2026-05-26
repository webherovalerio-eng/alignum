export const SITE = {
  name: "Alignum",
  tagline: "Schreiner aus Leidenschaft",
  domain: "alignum.de",
  url: "https://alignum.de",
  description:
    "Alignum – Schreinerei in Mannheim. Massivholzmöbel, Küchen, Treppen, Türen, Shoji und Maßmöbel aus traditionellem Handwerk und moderner Technik. Seit über 30 Jahren.",
  // public-facing email shown on site & impressum
  email: "info@alignum.de",
  // form submission goes here for now (mailto)
  formMailto: "info@webhero-valerio.de",
  phone: "+49 6203 839010",
  phoneDisplay: "06203 839010",
  address: {
    street: "Mannheimer Straße 80",
    zip: "68535",
    city: "Edingen-Neckarhausen",
    country: "Deutschland",
  },
  serviceArea: "Mannheim & Rhein-Neckar-Region",
  hours: [
    { day: "Mo – Fr", time: "08:00 – 18:00" },
    { day: "Samstag", time: "Nach Vereinbarung" },
  ],
  social: {
    google: "https://share.google/Lm0M38HvoFrCuOAfF",
    /**
     * Direkter Link zum „Bewertung schreiben"-Dialog im Google Knowledge
     * Panel — NICHT zum Profil. Der #lrd-Hash mit ",3,l" am Ende triggert
     * direkt das Write-Review-Modal.
     *
     * Format: https://www.google.com/search?q=...&...#lrd={ftid},3,l
     * - ftid = first hex (lat/long) : second hex (CID) aus den GMB-Daten
     * - ,3,l = Aktion „write review", Sprache local
     *
     * Wenn Jan einen kürzeren g.page/r/.../review-Link aus seinem GMB-
     * Dashboard liefert, hier ersetzen — das ist noch direkter (1 Tap
     * statt 2 auf Mobile).
     */
    googleReview:
      "https://www.google.com/search?q=Alignum+M%C3%B6belbau+Edingen-Neckarhausen&hl=de#lrd=0x4797c5e0297caf2f:0x3570da2f91f2f8e4,3,l",
    instagram: "",
  },
  founded: 1992,
  owner: {
    name: "Jan",
    fullName: "Jan Gerathewohl",
    role: "Tischlermeister & Inhaber",
    image: "/images/team/jan-schreinerei.jpg",
  },
  team: [
    { name: "Jan Gerathewohl", role: "Tischlermeister & Inhaber" },
  ],
  brandStatement:
    "Bei der Auswahl unserer Materialien liegen die Kriterien neben der Gestaltungsfrage auch immer in der Berücksichtigung der ökologischen und gesundheitlichen Auswirkungen.",
};

export const SERVICE_HUB_TITLE = "Leistungen";
