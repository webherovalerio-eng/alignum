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
     * Signierter Direkt-Link zum „Bewertung schreiben"-Dialog für Alignum.
     * Öffnet das Write-Review-Modal direkt im Knowledge Panel — kein
     * Profil-Zwischenstop. Enthält ludocid (CID) und lsig (Google-Signatur)
     * für authentifizierte Direktansteuerung des Modals.
     *
     * Quelle: vom GMB-Dashboard via „Bewertung anfordern" generiert.
     */
    googleReview:
      "https://www.google.com/search?hl=de-DE&gl=de&q=ALIGNUM+M%C3%96BELBAU,+Mannheimer+Str.+80,+68535+Edingen-Neckarhausen&ludocid=3850817579248711908&lsig=AB86z5Uz-R0mYnw1glilE3t_J5KU#lrd=0x4797c5e0297caf2f:0x3570da2f91f2f8e4,3",
    instagram: "",
  },
  founded: 1992,
  owner: {
    name: "Jan",
    fullName: "Jan Gerathewohl",
    role: "Tischlermeister & Inhaber",
    image: "/images/team/jan-gerathewohl.jpg",
  },
  team: [
    { name: "Jan Gerathewohl", role: "Tischlermeister & Inhaber" },
  ],
  brandStatement:
    "Bei der Auswahl unserer Materialien liegen die Kriterien neben der Gestaltungsfrage auch immer in der Berücksichtigung der ökologischen und gesundheitlichen Auswirkungen.",
};

export const SERVICE_HUB_TITLE = "Leistungen";
