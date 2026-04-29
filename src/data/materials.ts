// Heimische Hölzer aus dem Alignum-Holzkatalog
export type Material = {
  slug: string;
  name: string;
  short: string;
  description: string;
  uses: string[];
  hardness: "weich" | "mittel" | "hart";
  color: string; // hsl token reference, used as accent fallback
  image: string; // /images/woods/...
};

export const MATERIALS: Material[] = [
  {
    slug: "stiel-eiche",
    name: "Stiel-Eiche",
    short: "Hart, lebendig, ehrlich.",
    description:
      "Die Königin unserer Werkstatt. Sehr hart, sehr langlebig, mit lebendigen Maserbildern. Nimmt Öl und Lauge perfekt an, altert würdevoll.",
    uses: ["Tische", "Treppen", "Türen", "Küchen", "Massivholzparkett"],
    hardness: "hart",
    color: "32 45% 45%",
    image: "/images/woods/stiel-eiche.jpg",
  },
  {
    slug: "nussbaum",
    name: "Nussbaum",
    short: "Tiefe Töne, klassische Eleganz.",
    description:
      "Edles, dunkles Holz mit warmen Schattierungen von Schokoladenbraun bis fast Schwarz. Hervorragend für Kommoden, Schreibtische und alles, das Status haben soll.",
    uses: ["Kommoden", "Schreibtische", "Esstische", "Wandverkleidungen"],
    hardness: "hart",
    color: "22 40% 22%",
    image: "/images/woods/nussbaum.jpg",
  },
  {
    slug: "esche",
    name: "Esche",
    short: "Hell, elastisch, unterschätzt.",
    description:
      "Hell wie Skandinavien. Erstaunlich elastisch, perfekt für gebogene Lehnen und filigrane Konstruktionen. Maserung kontrastreich, ohne aufdringlich zu sein.",
    uses: ["Stühle", "Bänke", "Bücherregale", "Sportgeräte"],
    hardness: "hart",
    color: "40 25% 70%",
    image: "/images/woods/esche.jpg",
  },
  {
    slug: "kirschbaum",
    name: "Kirschbaum",
    short: "Patiniert mit der Zeit.",
    description:
      "Von zart-rosa frisch bis tief-rotbraun nach Jahren – Kirsche entwickelt sich. Perfekt für Liebhaberstücke, die mit ihren Besitzern reifen sollen.",
    uses: ["Schreibtische", "Sideboards", "Musikinstrumente", "Schatullen"],
    hardness: "mittel",
    color: "12 50% 40%",
    image: "/images/woods/kirschbaum.jpg",
  },
  {
    slug: "buche",
    name: "Buche",
    short: "Robust, neutral, wirtschaftlich.",
    description:
      "Sehr verbreitetes europäisches Hartholz. Cremefarben bis rötlich, sehr fein gemasert, exzellent für hochfrequente Nutzung.",
    uses: ["Treppenstufen", "Arbeitsplatten", "Sitzmöbel", "Spielzeug"],
    hardness: "hart",
    color: "28 30% 65%",
    image: "/images/woods/buche.jpg",
  },
  {
    slug: "laerche",
    name: "Lärche",
    short: "Außen wie innen ein Charakter.",
    description:
      "Das einzige heimische Nadelholz, das auch im Außenbereich überzeugt. Warm goldgelb, harzhaltig, mit Charakter.",
    uses: ["Außentüren", "Tore", "Fassaden", "Saunabau"],
    hardness: "mittel",
    color: "30 60% 50%",
    image: "/images/woods/laerche.jpg",
  },
  {
    slug: "birnbaum",
    name: "Birnbaum",
    short: "Fein, ruhig, präzise.",
    description:
      "Sehr feine, fast unsichtbare Maserung. Lässt sich phantastisch schnitzen und drechseln. Edler Charakter ohne Drama.",
    uses: ["Furniere", "Drechselarbeiten", "Intarsien", "Designmöbel"],
    hardness: "hart",
    color: "30 35% 55%",
    image: "/images/woods/birnbaum.jpg",
  },
  {
    slug: "ahorn",
    name: "Berg-Ahorn",
    short: "Skandinavisch hell, nordisch klar.",
    description:
      "Cremeweiß bis hell-rötlich, sehr feine Textur. Ideal für moderne, helle Interieurs und Räume, die ruhiger wirken sollen.",
    uses: ["Küchenfronten", "Schreibtische", "Bodenbeläge", "Treppen"],
    hardness: "hart",
    color: "44 30% 75%",
    image: "/images/woods/ahorn.jpg",
  },
  {
    slug: "kirschbaum-alt",
    name: "Birke",
    short: "Nordisch, fein, leicht.",
    description:
      "Hell, sehr feinporig, mit sanften Maserwellen. Weich genug für Drechselarbeiten, fest genug für anspruchsvolle Möbel.",
    uses: ["Schubladenkästen", "Skulpturen", "Instrumente", "Paneele"],
    hardness: "mittel",
    color: "44 22% 80%",
    image: "/images/woods/birke.jpg",
  },
  {
    slug: "zwetschge",
    name: "Zwetschge",
    short: "Tief, warm, selten.",
    description:
      "Eine Rarität in unserer Werkstatt. Kontrastreiche Maserung mit purpurnen Tönen, eignet sich für Statement-Stücke.",
    uses: ["Schmuckschatullen", "Furniere", "Drechselarbeiten"],
    hardness: "hart",
    color: "10 40% 30%",
    image: "/images/woods/zwetschge.jpg",
  },
  {
    slug: "elsbeere",
    name: "Elsbeere",
    short: "Geheimtipp aus dem Wald.",
    description:
      "Eine der seltensten heimischen Holzarten. Sehr dichte Struktur, golden-rötlicher Schimmer. Liebhaberholz im Möbelbau.",
    uses: ["Designerstücke", "Furniere", "Streichinstrumente"],
    hardness: "hart",
    color: "22 30% 50%",
    image: "/images/woods/elsbeere.jpg",
  },
  {
    slug: "platane",
    name: "Platane",
    short: "Lebendig, ungewöhnlich, echt.",
    description:
      "Mittlerer Härtegrad, beige bis hell-rötlich, mit charakteristischer Spiegelmaserung – ein Holz mit Persönlichkeit.",
    uses: ["Furniere", "Schubladenfronten", "Sideboards"],
    hardness: "mittel",
    color: "28 25% 60%",
    image: "/images/woods/platane.jpg",
  },
];
