export type Service = {
  slug: string;
  name: string;
  short: string;
  intro: string;
  description: string;
  features: string[];
  imageCategory: string;
  hubPath: string;
  keywords: string[];
};

export const SERVICE_HUB = "schreinerei-in-meiner-naehe";

export const SERVICES: Service[] = [
  {
    slug: "kuechenbau-in-der-naehe",
    name: "Küchenbau",
    short: "Massivholzküchen nach Maß",
    intro:
      "Maßgefertigte Küchen aus heimischer Schreinerei – jede Linie, jeder Griff, jede Holzmaserung exakt auf Ihren Raum und Ihren Alltag abgestimmt.",
    description:
      "Eine Küche ist mehr als ein Raum – sie ist der Mittelpunkt Ihres Zuhauses. Als erfahrene Schreinerei in Mannheim fertigen wir Ihre Küche aus Massivholz oder feinsten Furnieren millimetergenau nach Ihren Wünschen. Wir denken Funktion, Material und Ästhetik zusammen: vom intelligenten Stauraum über die ergonomisch perfekte Arbeitshöhe bis zur Holzart, die Ihren persönlichen Charakter widerspiegelt.",
    features: [
      "Komplette Küchenplanung – vom ersten Skizzenstrich bis zur Montage",
      "Massivholz, Furnier oder Mischbauweise mit edler Oberfläche",
      "Eingelassene Geräte führender Marken (Miele, Gaggenau, Bora)",
      "Maßanfertigung für jede Raumform – auch Dachschrägen und Erker",
    ],
    imageCategory: "kuechen",
    hubPath: SERVICE_HUB,
    keywords: ["Küchenbauer Mannheim", "Massivholzküche", "Schreinerküche", "Küche nach Maß"],
  },
  {
    slug: "badmoebel",
    name: "Badmöbel",
    short: "Wohlfühl-Bäder mit Holz",
    intro:
      "Holz im Bad? Mit der richtigen Schreinerkunst eine sinnliche Antwort auf seelenlose Standardlösungen – warm, wasserfest und unverwechselbar Ihres.",
    description:
      "Wir verbinden traditionelles Schreinerhandwerk mit modernem Bad-Design. Vom freistehenden Waschtischunterbau über raumhohe Spiegelschränke bis zu Saunabereichen – jedes Stück wird so gefertigt, dass es Feuchtigkeit, Hitze und tägliche Nutzung jahrzehntelang aushält. Spezialbeschichtungen und ausgewählte Hölzer wie Eiche, Nuss oder Teak machen das Bad zum Rückzugsort.",
    features: [
      "Wasserfeste Spezialoberflächen für Massivholz",
      "Maßgefertigte Waschtische, Hochschränke und Spiegelmodule",
      "Integration von Beleuchtung, Steckdosen und Lautsprechern",
      "Saunaplanung und Wellnessräume in Holz",
    ],
    imageCategory: "badmoebel",
    hubPath: SERVICE_HUB,
    keywords: ["Badmöbel Mannheim", "Waschtisch nach Maß", "Holz im Bad"],
  },
  {
    slug: "tische-und-stuehle",
    name: "Tische und Stühle",
    short: "Esstische, die Generationen halten",
    intro:
      "Massive Esstische aus heimischen Hölzern, perfekt austarierte Stühle, Bänke aus einem einzigen Baum – Möbelstücke, die Erinnerungen wachsen lassen.",
    description:
      "Ein Esstisch ist das vielleicht wichtigste Möbelstück eines Hauses. Wir fertigen Tafeln aus Eiche, Nuss, Esche oder Kirsche – mit lebendiger Maserung, fühlbaren Kanten und einer Verbindung, die hält. Dazu passende Stühle und Bänke, ergonomisch entwickelt und einzeln aufeinander abgestimmt.",
    features: [
      "Massivholz-Tische mit lebendigem Astbild",
      "Verschraubte oder gezapfte Tischgestelle aus Stahl oder Holz",
      "Maßanfertigung für 4 bis 16 Personen",
      "Passende Stuhl- und Bankkollektionen",
    ],
    imageCategory: "tische",
    hubPath: SERVICE_HUB,
    keywords: ["Esstisch Mannheim", "Massivholztisch", "Tischlerei Tisch"],
  },
  {
    slug: "moebelbauer",
    name: "Schrank nach Maß",
    short: "Einbauschränke ohne Kompromisse",
    intro:
      "Vom raumhohen Garderoben-Schrank bis zur fugenlos eingebauten Ankleide: maßgefertigter Stauraum, der jede Nische nutzt und jede Wand verschwinden lässt.",
    description:
      "Standard-Schränke ignorieren Ihren Raum. Wir nicht. Wir vermessen jede Wand, jeden Sockel, jede Schräge – und konstruieren Schränke, die wirken, als wären sie Teil des Hauses. Mit hochwertigen Beschlägen von Blum, Hettich oder Häfele, leisem Soft-Close und Innenausstattung, die alles aufnimmt, was Sie haben.",
    features: [
      "Begehbare Ankleiden, raumhohe Schränke, fugenlose Wand-Schränke",
      "Markenbeschläge mit lebenslanger Funktion",
      "Innenausstattung: Schubladen, Hosenauszüge, Glasböden, LED",
      "Auch unter Dachschrägen und über Treppen geplant",
    ],
    imageCategory: "schraenke",
    hubPath: SERVICE_HUB,
    keywords: ["Schrank nach Maß", "Einbauschrank Mannheim", "Möbelbauer"],
  },
  {
    slug: "massivholzbetten",
    name: "Massivholzbetten",
    short: "Schlafplätze aus echtem Holz",
    intro:
      "Betten, die im wahrsten Sinne ein Leben lang halten: aus einem Stück gefertigt, ohne Spanplatte, mit ehrlichen Verbindungen, die nicht knarzen.",
    description:
      "Ein Bett aus Massivholz ist ein Versprechen an Sie selbst. Wir fertigen Doppel- und Einzelbetten in jeder Größe, mit individuellen Kopfteilen aus Polsterleder oder Echtholz, integrierten Nachttischen und Bettkasten. Heimische Hölzer, atmungsaktive Konstruktion, frei von Schadstoffen.",
    features: [
      "Massivholz-Bettrahmen ohne Kompromiss",
      "Kopfteile in Holz, Leder oder Stoff",
      "Individuelle Maße bis Überlänge 220 cm",
      "Optional integrierte Nachttische und Stauraum",
    ],
    imageCategory: "betten",
    hubPath: SERVICE_HUB,
    keywords: ["Massivholzbett", "Bett nach Maß", "Schreiner Bett"],
  },
  {
    slug: "treppenbau-in-der-nahe",
    name: "Treppenbau",
    short: "Treppen als Skulptur",
    intro:
      "Eine Treppe verbindet nicht nur Stockwerke – sie zieht den Blick. Wir bauen Treppen, die Ihr Haus tragen und gleichzeitig zum Mittelpunkt machen.",
    description:
      "Ob freitragende Holztreppen, gewendelte Konstruktionen oder reduziertes Stahl-Holz-Design: Treppen sind unsere Königsdisziplin. Jede Stufe wird einzeln eingepasst, jede Rundung handgeschliffen, jedes Geländer auf Ihre Statik berechnet. Wir bauen für Neubau und Sanierung – mit minimalem Eingriff in Ihr Zuhause.",
    features: [
      "Freitragende Treppen, gewendelt, Faltwerk, Mittelholm",
      "Geländer aus Holz, Stahl, Glas oder Seil",
      "Massivholzstufen aus Eiche, Buche, Nuss",
      "Sanierung alter Treppen mit neuen Stufenauflagen",
    ],
    imageCategory: "treppen",
    hubPath: SERVICE_HUB,
    keywords: ["Treppenbau Mannheim", "Holztreppe", "Schreiner Treppe"],
  },
  {
    slug: "tuerenbauer-in-der-naehe",
    name: "Türen und Tore",
    short: "Türen mit Charakter",
    intro:
      "Eine Tür entscheidet, wie Ihr Haus empfängt. Wir bauen Haustüren, Innentüren und Tore, die schließen wie ein Tresor und wirken wie ein Statement.",
    description:
      "Vom raumhohen Pivot-Element über klassische Innentüren bis zur Hoftor-Anlage: Jede unserer Türen wird passgenau gefertigt, mit hochwertigen Bändern und Schlössern ausgestattet und in der Oberfläche so behandelt, dass sie Jahrzehnte tragen. Auf Wunsch mit Smart-Lock, Glaseinsatz oder integriertem Briefkasten.",
    features: [
      "Haustüren mit RC-2 Sicherheitsausstattung",
      "Innentüren raumhoch, schwellenfrei, mit Schiebebeschlag",
      "Hoftore aus Holz oder Holz-Stahl-Kombination",
      "Restauration historischer Türen",
    ],
    imageCategory: "tueren",
    hubPath: SERVICE_HUB,
    keywords: ["Türenbauer Mannheim", "Haustür Holz", "Innentür nach Maß"],
  },
  {
    slug: "shoji",
    name: "Shoji",
    short: "Japanische Schiebewände",
    intro:
      "Licht, Stille, Klarheit. Authentische Shoji-Schiebetüren aus Japan-zertifiziertem Reispapier und feinsten Holzgittern, gefertigt nach traditioneller Bauweise.",
    description:
      "Shoji sind unsere stille Leidenschaft. Wir fertigen die japanischen Schiebewände mit handverleimten Holzgittern aus Hemlock, Lärche oder Kiefer und beziehen sie mit echtem Washi-Papier. Jedes Element ist ein Stück Architektur, das Räume teilt, ohne sie zu trennen, und Licht weicher fließen lässt, als jeder Vorhang es könnte.",
    features: [
      "Authentische Shoji-Konstruktion mit verleimten Gittern",
      "Originales Washi-Papier aus Japan",
      "Schiebetüren, raumtrennende Stellwände, Fenster-Shoji",
      "Auch in moderner westlicher Variante",
    ],
    imageCategory: "shoji",
    hubPath: SERVICE_HUB,
    keywords: ["Shoji Mannheim", "Japanische Schiebewand", "Reispapier-Wand"],
  },
  {
    slug: "regale-und-raumtrenner",
    name: "Regale und Raumtrenner",
    short: "Stauraum, der Räume gliedert",
    intro:
      "Regale und Raumtrenner, die mehr können als nur Bücher tragen: Sie strukturieren Räume, schaffen Zonen und werden selbst zum Architekturelement.",
    description:
      "Wir bauen Regale und Raumtrenner, die offen wirken, aber tragen, was zu tragen ist – Bücher, Vinyl, Sammlerstücke, Pflanzen. Mit klugen Beleuchtungslösungen, integrierten Kabelkanälen und der Möglichkeit, Module später zu erweitern. Holz, Metall, Glas oder Kombinationen, immer mit handwerklicher Präzision verarbeitet.",
    features: [
      "Modulare Regalsysteme nach Maß",
      "Raumteiler beidseitig nutzbar",
      "Integration von Schiebetüren, LED, Kabelführung",
      "Wandmontage und freistehende Lösungen",
    ],
    imageCategory: "regale",
    hubPath: SERVICE_HUB,
    keywords: ["Regal nach Maß", "Raumtrenner Holz", "Bücherregal Schreiner"],
  },
  {
    slug: "bueromoebel",
    name: "Büromöbel",
    short: "Arbeitsplätze mit Würde",
    intro:
      "Schreibtische, Konferenztische, Empfangstheken, die Ihre Marke verkörpern. Höhenverstellbar, akustisch durchdacht, mit Kabelmanagement, das wirklich funktioniert.",
    description:
      "Ein Büro ist ein Werkzeug – aber eines, das Ihre Marke prägt und Ihre Mitarbeiter über Jahre täglich nutzen. Wir entwerfen Büromöbel, die ergonomisch, langlebig und repräsentativ sind. Vom höhenverstellbaren Schreibtisch im Eichenfurnier bis zur Empfangstheke aus Massivholz mit eingelassener Beleuchtung.",
    features: [
      "Höhenverstellbare Schreibtische mit Massivholzplatte",
      "Konferenztische und Empfangstheken",
      "Akustikelemente für Großraumbüros",
      "Integriertes Kabelmanagement",
    ],
    imageCategory: "bueromoebel",
    hubPath: SERVICE_HUB,
    keywords: ["Büromöbel Mannheim", "Schreibtisch nach Maß", "Empfangstheke Holz"],
  },
  {
    slug: "kommoden",
    name: "Kommoden",
    short: "Solitäre für jedes Zimmer",
    intro:
      "Kommoden, Sideboards und Anrichten – Möbelsolitäre, die Wohnzimmer, Schlafzimmer oder Flur prägen. Maßangefertigt, in Hölzern, die altern wollen.",
    description:
      "Eine Kommode ist ein Statement. Wir bauen Sideboards mit präzisen Schubläden, geheimen Fächern und versteckter Technik. Holz, das nicht furniert sondern massiv ist – mit Maserung, Charakter und einem Geruch, der sich an Ihr Zuhause anschmiegt.",
    features: [
      "Kommoden, Sideboards, Anrichten – frei oder eingebaut",
      "Soft-Close-Schubladen mit Vollauszug",
      "Versteckte Fächer, integrierte Technik",
      "Massivholz oder kunstvolle Furnierbilder",
    ],
    imageCategory: "schraenke",
    hubPath: SERVICE_HUB,
    keywords: ["Kommode nach Maß", "Sideboard Holz", "Schreinerei Kommode"],
  },
  {
    slug: "alignum-art",
    name: "Alignum-Art",
    short: "Möbel als Skulptur",
    intro:
      "Unsere Designerlinie. Möbelobjekte, die mehr Kunst sind als Möbel – limitiert, signiert, fotografiert. Für Sammler, Architekten und alle, die das Besondere wollen.",
    description:
      "Alignum-Art ist die Bühne unserer kreativen Ader. Hier entstehen Möbel, die wir in Galerien zeigen würden: skulpturale Tische, Stühle als Plastik, Lichtobjekte aus Holz. Jedes Stück ein Unikat oder limitiert, von Hand signiert, mit Echtheits-Zertifikat. Auf Anfrage entwickeln wir auch Auftragsarbeiten für Sammler.",
    features: [
      "Limitierte Designermöbel und Unikate",
      "Auftragsarbeiten für Sammler und Architekten",
      "Skulptural, gewagt, fotografierbar",
      "Echtheits-Zertifikat und Signatur",
    ],
    imageCategory: "kunstvolles",
    hubPath: SERVICE_HUB,
    keywords: ["Designmöbel Mannheim", "Möbelkunst", "Alignum Art"],
  },
];
