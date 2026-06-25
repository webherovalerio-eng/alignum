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
    name: "Eiche",
    short: "Hart, lebendig, ehrlich.",
    description:
      "Die Königin unserer Werkstatt. Sehr hart, sehr langlebig, mit lebendigen Maserbildern. Altert würdevoll.",
    uses: ["Tische", "Treppen", "Türen", "Küchen"],
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
    uses: ["Kommoden", "Schreibtische", "Esstische", "Wandverkleidungen", "Shoji"],
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
    uses: ["Stühle", "Bänke", "Bücherregale", "Tische", "Shoji"],
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
    uses: ["Schreibtische", "Sideboards", "Schatullen", "Tische", "Shoji"],
    hardness: "mittel",
    color: "12 50% 40%",
    image: "/images/woods/kirschbaum.jpg",
  },
  {
    slug: "buche",
    name: "Buche & Kernbuche",
    short: "Robust, neutral, wirtschaftlich.",
    description:
      "Sehr verbreitetes europäisches Hartholz. Cremefarben bis rötlich, sehr fein gemasert, exzellent für hochfrequente Nutzung.",
    uses: ["Treppenstufen", "Arbeitsplatten", "Sitzmöbel", "Spielzeug", "Kommoden", "Schubladenkästen"],
    hardness: "hart",
    color: "28 30% 65%",
    image: "/images/woods/buche.jpg",
  },
  {
    slug: "laerche",
    name: "Lärche",
    short: "Außen wie innen ein Charakter.",
    description:
      "Ein Nadelholz, das auch im Außenbereich überzeugt. Warm goldgelb, harzhaltig, mit Charakter.",
    uses: ["Außentüren", "Tore", "Fassaden"],
    hardness: "mittel",
    color: "30 60% 50%",
    image: "/images/woods/laerche.jpg",
  },
  {
    slug: "kiefer",
    name: "Kiefer",
    short: "Warm, harzig, preiswert.",
    description:
      "Helles, harzhaltiges Nadelholz mit lebendiger Maserung – unsere preiswerte Alternative zur Lärche. Warm im Ton und vielseitig, drinnen wie draußen.",
    uses: ["Außentüren", "Tore", "Treppen", "Innenausbau"],
    hardness: "weich",
    color: "38 52% 60%",
    image: "/images/woods/kiefer.jpg",
  },
  {
    slug: "ahorn",
    name: "Ahorn",
    short: "Skandinavisch hell, nordisch klar.",
    description:
      "Cremeweiß bis hell-rötlich, sehr feine Textur. Ideal für moderne, helle Interieurs und Räume, die ruhiger wirken sollen.",
    uses: ["Küchenfronten", "Schreibtische", "Treppen", "Kommoden", "Raumteiler", "Shoji"],
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
    uses: ["Kommoden", "Schränke", "Shoji"],
    hardness: "mittel",
    color: "44 22% 80%",
    image: "/images/woods/birke.jpg",
  },
  {
    slug: "ulme",
    name: "Ulme / Rüster",
    short: "Lebhaft, warm, ausdrucksstark.",
    description:
      "Lebhafte, dekorative Maserung in warmem Braun. Robust und charaktervoll – ein ausdrucksstarkes Holz für Möbel, die auffallen sollen, von der Tischplatte bis zur Schrankfront.",
    uses: ["Tische", "Stühle", "Kommoden", "Schränke"],
    hardness: "hart",
    color: "26 45% 38%",
    image: "/images/woods/ulme.jpg",
  },
  {
    slug: "elsbeere",
    name: "Elsbeere",
    short: "Geheimtipp aus dem Wald.",
    description:
      "Eine der seltensten heimischen Holzarten. Sehr dichte Struktur, golden-rötlicher Schimmer. Liebhaberholz im Möbelbau.",
    uses: ["Designerstücke", "Tische", "Stühle", "Bänke"],
    hardness: "hart",
    color: "22 30% 50%",
    image: "/images/woods/elsbeere.jpg",
  },
  {
    slug: "pappel",
    name: "Yellow Poplar (Pappel)",
    short: "Leicht, hell, maßstabil.",
    description:
      "Helles, leichtes Holz mit ruhiger, gleichmäßiger Maserung. Maßstabil und angenehm zu bearbeiten – nimmt Lack und Farbe gleichmäßig an und eignet sich für leichte Konstruktionen, Rahmen und Verkleidungen.",
    uses: ["Treppenwangen", "Bilderrahmen", "Leichtbauholz"],
    hardness: "weich",
    color: "45 25% 78%",
    image: "/images/woods/pappel.jpg",
  },
];
