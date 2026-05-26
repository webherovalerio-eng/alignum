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
     * Direkter Link zum Bewertungsformular von Google für Alignum Möbelbau.
     * Öffnet Google Maps mit aktiviertem Reviews-Tab (!9m1!1b1) — der
     * „Eine Bewertung schreiben"-Button ist dann sofort prominent oben.
     *
     * Wenn Jan in seinem GMB-Dashboard einen kürzeren g.page/r/.../review-
     * Link generiert, kann der hier eingetragen werden — der ist noch
     * einen Klick direkter.
     */
    googleReview:
      "https://www.google.com/maps/place/ALIGNUM+M%C3%96BELBAU/@49.4542161,8.5940851,17z/data=!4m8!3m7!1s0x4797c5e0297caf2f:0x3570da2f91f2f8e4!8m2!3d49.4542161!4d8.5940851!9m1!1b1",
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
