// Heimische Hölzer aus dem Alignum-Holzkatalog
export type Material = {
  slug: string;
  name: string;
  short: string;
  description: string;
  uses: string[];
  hardness: "weich" | "mittel" | "hart";
  color: string; // hsl token reference, used as accent
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
  },
];
