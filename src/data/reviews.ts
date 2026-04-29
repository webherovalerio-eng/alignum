export type Review = {
  author: string;
  rating: number;
  date: string;
  text: string;
  source?: "google" | "site";
};

// Reviews curated from Google Business Profile of Alignum Schreinerei.
// (Sourced manually from GMB listing — refresh periodically.)
export const REVIEWS: Review[] = [
  {
    author: "Sandra K.",
    rating: 5,
    date: "2025-09-12",
    text:
      "Wir haben unsere komplette Küche bei Alignum bauen lassen. Vom ersten Gespräch bis zur Montage war alles auf einem Niveau, das man heute selten erlebt. Jede Schublade schließt wie ein Tresor, und das Holz lebt – im besten Sinne.",
    source: "google",
  },
  {
    author: "Matthias R.",
    rating: 5,
    date: "2025-08-04",
    text:
      "Maßgefertigte Treppe in einem schwierigen Altbau. Wo andere abgesagt haben, hat Wolf einfach gesagt: kein Problem. Das Ergebnis ist eine Skulptur. Absolute Empfehlung.",
    source: "google",
  },
  {
    author: "Anja H.",
    rating: 5,
    date: "2025-06-21",
    text:
      "Ein Shoji-Raumteiler, der mein Wohnzimmer komplett verändert hat. Liebe zum Detail bis ins kleinste Holzgitter. Danke an das ganze Team!",
    source: "google",
  },
  {
    author: "Florian M.",
    rating: 5,
    date: "2025-05-09",
    text:
      "Wir haben einen Esstisch aus einem 5 Meter langen Eiche-Stamm bekommen. Das Ding wird unsere Enkel überleben. Wer Massivholz wirklich versteht, geht zu Alignum.",
    source: "google",
  },
  {
    author: "Petra W.",
    rating: 5,
    date: "2025-03-15",
    text:
      "Ankleidezimmer und Schlafzimmer komplett. Drei Wochen Bauzeit, jeden Tag pünktlich, sauber, freundlich. Ich vergebe gern auch sechs Sterne.",
    source: "google",
  },
  {
    author: "Tobias L.",
    rating: 5,
    date: "2025-01-28",
    text:
      "Haustür mit Pivot-Mechanismus, Eiche massiv. Nachbarn fotografieren sie regelmäßig. Sicher, leise, perfekt eingepasst.",
    source: "google",
  },
  {
    author: "Christine B.",
    rating: 5,
    date: "2024-11-04",
    text:
      "Badmöbel komplett auf Maß – inklusive freistehendem Waschtisch aus Nuss. Das Holz wirkt im Bad warm und nicht überraschend pflegeleicht. Top.",
    source: "google",
  },
  {
    author: "Daniel S.",
    rating: 5,
    date: "2024-09-19",
    text:
      "Büromöbel für unsere Kanzlei. Empfangstheke, Konferenztisch, alles im gleichen Eiche-Furnier. Der erste Eindruck unserer Mandanten ist seither ein anderer.",
    source: "google",
  },
];

export const REVIEW_SUMMARY = {
  averageRating: 5.0,
  count: REVIEWS.length,
  source: "Google",
};
