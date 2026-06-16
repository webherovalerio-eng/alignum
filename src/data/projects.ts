/**
 * Referenz-Projekte für Alignum — Local-SEO-Premium-Content.
 *
 * Jeder Eintrag wird automatisch:
 *  - Auf der eigenen Detail-Seite `/{citySlug}/{slug}/` gerendert
 *    (Supporting-Content unter der City-Page; /projekte/{slug}/ → 308-Redirect)
 *  - Auf der City-Page der jeweiligen Stadt als „Projekte in {Stadt}" gelistet
 *  - Auf der Service-Page der jeweiligen Disziplin als „Beispielprojekte" gelistet
 *  - In den Sitemap aufgenommen
 *  - In Footer-Listings „Letzte Projekte" verlinkt
 *
 * Slug-Konvention: `{kategorie}-{stadt}-{material}` oder kurz beschreibend.
 * Beispiele: fernsehschrank-mannheim-ahorn, shoji-schiebetuer-darmstadt
 */

export type Project = {
  slug: string;
  /** Stadt-Slug aus src/data/cities.ts (z.B. "schreinerei-mannheim") */
  city: string;
  /** Service-Slug aus src/data/services.ts (z.B. "moebelbauer") */
  service: string;
  /** Material-Slug aus src/data/materials.ts (z.B. "ahorn") — optional */
  material?: string;
  /**
   * Anzeige-Name des Holzes im Carousel (Slide „Das Holz"), falls er vom
   * Katalog-Namen abweicht — z.B. "Wildeiche" statt "Stiel-Eiche".
   * Fällt auf material.name zurück.
   */
  woodLabel?: string;
  /**
   * Optionales Vollbild (root-relative Pfad), das im Carousel direkt nach dem
   * Cover als textfreie Establishing-Aufnahme eingeschoben wird — z.B. das
   * Gesamt-Ensemble. Ohne Wert entfällt der Slide (Carousel bleibt 6-teilig).
   */
  establishingImage?: string;
  /**
   * Überschrift im Carousel-Slide „Was wir gebaut haben". Beschreibt das
   * konkret gebaute Möbel, falls die Service-Kategorie zu allgemein ist —
   * z.B. "Esstisch & Kommode" statt der Kategorie "Tische und Stühle".
   * Fällt auf service.name zurück.
   */
  builtLabel?: string;
  title: string;
  /** Suchmaschinen-Title (60 chars) und H1 */
  metaTitle: string;
  /** Meta-Description (150 chars) */
  metaDescription: string;
  /** Kurztext für Cards (max ~140 chars) */
  summary: string;
  /** Body-Paragraphen — Story des Projekts */
  body: string[];
  /** Bullet-Points „Was wir gebaut haben" */
  features: string[];
  year?: number;
  /** Bilderliste, root-relative paths */
  images: string[];
  /** Hauptbild für Cards + OG */
  cover: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "fernsehschrank-mannheim-ahorn",
    city: "schreinerei-mannheim",
    service: "moebelbauer",
    material: "ahorn",
    title: "Fernsehschrank aus Ahorn — Projekt Mannheim",
    metaTitle: "Fernsehschrank aus Ahorn nach Maß | Projekt in Mannheim",
    metaDescription:
      "Wand­hängendes TV-Lowboard mit massiver Ahornplatte und Hochschrank in Hochglanz-Weiß — gefertigt von Alignum für einen Kunden in Mannheim. Maßmöbel aus heimischem Holz.",
    summary:
      "Wandhängendes TV-Lowboard mit massiver Ahornplatte und passendem Vitrinen-Hochschrank — gefertigt für ein Wohnzimmer in Mannheim.",
    body: [
      "Für einen Kunden in Mannheim haben wir ein wandhängendes TV-Möbel entwickelt, das die warme Wandfarbe des Raums aufgreift und durch eine massive Ahornplatte ergänzt. Die schwebende Konstruktion lässt den Bodenbelag durchgängig erscheinen — der Raum wirkt dadurch deutlich größer als mit einem klassisch stehenden Möbel.",
      "Die Korpusse fertigen wir in Hochglanz-Weiß mit grifflosen Push-to-Open-Mechaniken. Die obere Ablage besteht aus europäischem Berg-Ahorn (Acer pseudoplatanus) – ein Massivholz, das mit seiner cremig-hellen Farbe und der feinen, fast unsichtbaren Maserung perfekt zu modernen Interieurs passt. Wir haben die Platte aus einem einzigen Stamm aufgetrennt, damit Maserung und Farbverlauf von links nach rechts durchgehen.",
      "Der passende Vitrinen-Hochschrank wiederholt das Materialspiel: weißer Korpus, Ahorn-Boden, Glastüren mit Ahorn-Rahmen. Beleuchtet wird er von innen über dimmbare LED-Spots, die wir bauseits an die bestehende Hauselektrik angeschlossen haben.",
      "Vom ersten Aufmaßtermin in Mannheim bis zur Montage vergingen sieben Wochen. Geliefert und montiert haben wir an einem Werktag — der Kunde konnte am Abend desselben Tages bereits Fernsehen.",
    ],
    features: [
      "Wandhängendes TV-Lowboard mit Push-to-Open-Fronten",
      "Massive Ahorn-Ablage aus einem Stamm (Farbverlauf durchgehend)",
      "Vitrinen-Hochschrank mit dimmbarer LED-Innenbeleuchtung",
      "Korpusse in Hochglanz-Weiß, Ahorn-Akzente",
      "Maßanfertigung passend zur vorhandenen Wandfarbe und Steckdosen­positionen",
      "Aufmaß, Lieferung und Montage in Mannheim",
    ],
    year: 2025,
    images: [
      "/images/projects/fernsehschrank-mannheim-ahorn/fernsehschrank-mannheim-ahorn-01.jpg",
      "/images/projects/fernsehschrank-mannheim-ahorn/fernsehschrank-mannheim-ahorn-02.jpg",
      "/images/projects/fernsehschrank-mannheim-ahorn/fernsehschrank-mannheim-ahorn-03.jpg",
      "/images/projects/fernsehschrank-mannheim-ahorn/fernsehschrank-mannheim-ahorn-04.jpg",
      "/images/projects/fernsehschrank-mannheim-ahorn/fernsehschrank-mannheim-ahorn-05.jpg",
      "/images/projects/fernsehschrank-mannheim-ahorn/fernsehschrank-mannheim-ahorn-06.jpg",
      "/images/projects/fernsehschrank-mannheim-ahorn/fernsehschrank-mannheim-ahorn-07.jpg",
    ],
    cover:
      "/images/projects/fernsehschrank-mannheim-ahorn/fernsehschrank-mannheim-ahorn-01.jpg",
  },
  {
    slug: "shoji-schiebetuer-darmstadt-ahorn",
    city: "schreinerei-darmstadt",
    service: "shoji",
    material: "ahorn",
    title: "Shoji-Schiebetüren aus Ahorn — Projekt Darmstadt",
    metaTitle: "Shoji Schiebetüren aus Ahorn | Projekt in Darmstadt",
    metaDescription:
      "Vierflügelige, raumhohe Shoji-Schiebewand aus Ahorn mit transluzenter Bespannung — von Alignum gefertigt für einen Kunden in Darmstadt. Montage inklusive.",
    summary:
      "Vierflügelige, raumhohe Shoji-Schiebewand aus hellem Ahorn mit transluzenter Bespannung — gefertigt für einen Flur in Darmstadt.",
    body: [
      "Für einen Kunden in Darmstadt haben wir eine komplette Wandseite im Flur in eine Shoji-Schiebewand verwandelt. Der Raum mit seinem Eichenparkett wirkte vorher eng und dunkel — der Wunsch war eine Front, die Stauraum verschließt, ohne wie eine massive Schrankwand zu wirken. Eine klassische Schiebetür aus Vollholz hätte das Licht geschluckt; die Shoji-Lösung macht das Gegenteil.",
      "Entstanden sind vier raumhohe Schiebeelemente aus massivem Ahorn mit transluzenter Bespannung in Washi-Optik. Das feine Sprossenraster folgt der traditionellen japanischen Aufteilung: schmale, präzise gefräste Quersprossen, die das Licht in ruhige Felder gliedern. Die Elemente laufen auf zwei Spuren und lassen sich flächenbündig hintereinander schieben — die Front bleibt grifflos und vollkommen ruhig. Trifft Tageslicht oder die Flurleuchte auf die Bespannung, leuchtet die ganze Wand sanft auf.",
      "Ahorn ist für Shoji die erste Wahl unter den heimischen Hölzern: europäischer Bergahorn ist cremig-hell, fast weiß, mit einer so feinen Maserung, dass die Rahmen optisch hinter die Bespannung zurücktreten. Genau diese Zurückhaltung braucht eine Shoji-Wand — das Holz gibt die Struktur vor, ohne sich in den Vordergrund zu spielen. Gegen das warme Eichenparkett setzt der helle Ahorn einen feinen, bewusst leisen Kontrast.",
      "Nach dem Aufmaßtermin in Darmstadt haben wir die Elemente in unserer Werkstatt in Edingen-Neckarhausen gefertigt und bespannt. Von Aufmaß bis Montage vergehen bei einer Schiebewand dieser Größe rund sechs Wochen — montiert war die fertige Anlage an einem Vormittag, inklusive Justierung der Laufschienen.",
    ],
    features: [
      "Vier raumhohe Shoji-Schiebeelemente aus massivem Ahorn",
      "Transluzente Bespannung in Washi-Optik — lichtdurchlässig, aber blickdicht",
      "Feines Sprossenraster nach traditioneller japanischer Aufteilung",
      "Zweispurige Laufschienen — Elemente flächenbündig hintereinander verschiebbar",
      "Grifflose Front ohne sichtbare Beschläge",
      "Aufmaß, Lieferung und Montage in Darmstadt",
    ],
    images: [
      "/images/projects/shoji-schiebetuer-darmstadt-ahorn/shoji-schiebetuer-darmstadt-ahorn-01.jpg",
      "/images/projects/shoji-schiebetuer-darmstadt-ahorn/shoji-schiebetuer-darmstadt-ahorn-02.jpg",
      "/images/projects/shoji-schiebetuer-darmstadt-ahorn/shoji-schiebetuer-darmstadt-ahorn-03.jpg",
      "/images/projects/shoji-schiebetuer-darmstadt-ahorn/shoji-schiebetuer-darmstadt-ahorn-04.jpg",
      "/images/projects/shoji-schiebetuer-darmstadt-ahorn/shoji-schiebetuer-darmstadt-ahorn-05.jpg",
      "/images/projects/shoji-schiebetuer-darmstadt-ahorn/shoji-schiebetuer-darmstadt-ahorn-06.jpg",
      "/images/projects/shoji-schiebetuer-darmstadt-ahorn/shoji-schiebetuer-darmstadt-ahorn-07.jpg",
      "/images/projects/shoji-schiebetuer-darmstadt-ahorn/shoji-schiebetuer-darmstadt-ahorn-08.jpg",
    ],
    cover:
      "/images/projects/shoji-schiebetuer-darmstadt-ahorn/shoji-schiebetuer-darmstadt-ahorn-01.jpg",
  },
  {
    slug: "badunterschrank-mannheim-ulme",
    city: "schreinerei-mannheim",
    service: "badmoebel",
    title: "Badunterschrank aus Ulme — Projekt Mannheim",
    metaTitle: "Badunterschrank aus Ulme nach Maß | Projekt in Mannheim",
    metaDescription:
      "Wandhängender Waschtisch-Unterschrank aus massiver Ulme mit grifflosen Schubladen und durchgehender Maserung — gefertigt von Alignum für ein Badezimmer in Mannheim.",
    summary:
      "Wandhängender Waschtisch-Unterschrank aus massiver Ulme mit grifflosen Schubladen und lebendiger, durchgehender Maserung — gefertigt für ein Bad in Mannheim.",
    body: [
      "Für ein Badezimmer in Mannheim haben wir einen wandhängenden Waschtisch-Unterschrank aus massiver Ulme entwickelt. Der Raum war hell gefliest und eher kühl – der Wunsch war ein warmes, natürliches Gegengewicht, das dem Bad Charakter gibt, ohne es voll zu stellen. Die schwebende Montage lässt den Steinboden durchlaufen und macht das kleine Bad optisch größer.",
      "Der Korpus trägt ein keramisches Aufsatzbecken und zwei grifflose Schubladen mit Push-to-Open-Mechanik. Wir haben die Fronten so aus dem Stamm aufgetrennt, dass die markante Ulmen-Maserung von links nach rechts durchläuft – ein durchgehendes Bild über beide Schubladen, das es so nur einmal gibt. Die geschwungene Griffmulde an der Unterkante nimmt das natürliche Linienspiel des Holzes auf.",
      "Ulme ist für ein Bad eine bewusste Wahl: Das heimische Holz hat eine lebendige, fast flammenartige Maserung mit warmen rotbraunen Tönen und ist von Natur aus zäh und formstabil. Mit der richtigen Oberfläche – wir verwenden ein wasserabweisendes Hartwachsöl und versiegelte Kanten – hält massives Holz im Bad jahrzehntelang, auch bei täglicher Feuchtigkeit.",
      "Vom Aufmaß in Mannheim bis zur Montage vergingen rund fünf Wochen. Geliefert und an der bestehenden Wandinstallation montiert haben wir an einem Vormittag – inklusive Anschluss an Zu- und Ablauf des vorhandenen Beckens.",
    ],
    features: [
      "Wandhängender Waschtisch-Unterschrank aus massiver Ulme",
      "Zwei grifflose Schubladen mit Push-to-Open",
      "Durchgehende Maserung über beide Fronten (aus einem Stamm)",
      "Geschwungene Griffmulde an der Unterkante",
      "Wasserabweisendes Hartwachsöl und versiegelte Kanten",
      "Aufmaß, Lieferung und Montage in Mannheim",
    ],
    year: 2025,
    images: [
      "/images/projects/badunterschrank-mannheim-ulme/badunterschrank-mannheim-ulme-01.jpg",
      "/images/projects/badunterschrank-mannheim-ulme/badunterschrank-mannheim-ulme-02.jpg",
      "/images/projects/badunterschrank-mannheim-ulme/badunterschrank-mannheim-ulme-03.jpg",
      "/images/projects/badunterschrank-mannheim-ulme/badunterschrank-mannheim-ulme-04.jpg",
      "/images/projects/badunterschrank-mannheim-ulme/badunterschrank-mannheim-ulme-05.jpg",
      "/images/projects/badunterschrank-mannheim-ulme/badunterschrank-mannheim-ulme-06.jpg",
      "/images/projects/badunterschrank-mannheim-ulme/badunterschrank-mannheim-ulme-07.jpg",
      "/images/projects/badunterschrank-mannheim-ulme/badunterschrank-mannheim-ulme-08.jpg",
      "/images/projects/badunterschrank-mannheim-ulme/badunterschrank-mannheim-ulme-09.jpg",
    ],
    cover:
      "/images/projects/badunterschrank-mannheim-ulme/badunterschrank-mannheim-ulme-01.jpg",
  },
  {
    slug: "treppenverkleidung-gauangelloch-kiefer",
    city: "schreinerei-leimen",
    service: "treppenbau-in-der-nahe",
    title: "Treppenverkleidung aus Kiefer — Projekt Gauangelloch",
    metaTitle: "Treppenverkleidung Kiefer | Projekt Gauangelloch",
    metaDescription:
      "Bestehende Treppe neu verkleidet mit hellen Kiefer-Stufen und vertikalem Lamellen-Geländer — von Alignum für einen Kunden in Gauangelloch bei Leimen.",
    summary:
      "Eine in die Jahre gekommene Treppe komplett neu verkleidet: helle Kiefer-Stufen und ein vertikales Lamellen-Geländer — gefertigt für einen Kunden in Gauangelloch bei Leimen.",
    body: [
      "Für einen Kunden in Gauangelloch bei Leimen haben wir eine bestehende, in die Jahre gekommene Treppe komplett neu eingekleidet. Die alte Konstruktion war solide, aber dunkel und wirkte schwer – ein kompletter Neubau wäre teurer gewesen und hätte einen tiefen Eingriff in den Treppenraum bedeutet. Stattdessen haben wir die vorhandene Tragstruktur erhalten und sie mit neuen Massivholz-Elementen verkleidet.",
      "Auf die Stufen kamen passgenau aufgemessene Kiefer-Trittstufen, die dem Treppenhaus sofort eine helle, freundliche Anmutung geben. Das Herzstück ist das vertikale Lamellen-Geländer: schmale, exakt gefräste Holzstäbe, die als ruhiges Raster nach oben laufen, den Treppenlauf transparent halten und das Licht weich hindurchlassen. So trennt die Treppe die Etagen, ohne den Raum optisch zu zerschneiden.",
      "Kiefer ist für eine Treppenverkleidung eine bewusste Wahl: Das heimische Nadelholz ist hell, warm im Ton und leicht genug, um filigrane Lamellen ohne wuchtige Wirkung zu fertigen – zugleich tritt- und formstabil. Mit einer klaren, matten Oberfläche behält es seinen natürlichen Charakter und vergilbt kaum.",
      "Nach dem Aufmaß in Gauangelloch haben wir die Stufen und das Lamellen-Geländer in unserer Werkstatt in Edingen-Neckarhausen vorgefertigt und vor Ort montiert. Eine Verkleidung dieser Art ist innerhalb weniger Tage eingebaut – ohne Abriss, ohne wochenlange Baustelle im Haus.",
    ],
    features: [
      "Bestehende Treppe erhalten und neu verkleidet (kein Komplett-Neubau)",
      "Helle Kiefer-Trittstufen, passgenau aufgemessen",
      "Vertikales Lamellen-Geländer aus exakt gefrästen Holzstäben",
      "Transparenter Treppenlauf – trennt, ohne den Raum zu zerschneiden",
      "Klare matte Oberfläche, natürlicher Holzcharakter",
      "Aufmaß, Vorfertigung und Montage für Gauangelloch bei Leimen",
    ],
    year: 2025,
    images: [
      "/images/projects/treppenverkleidung-gauangelloch-kiefer/treppenverkleidung-gauangelloch-kiefer-01.jpg",
      "/images/projects/treppenverkleidung-gauangelloch-kiefer/treppenverkleidung-gauangelloch-kiefer-02.jpg",
      "/images/projects/treppenverkleidung-gauangelloch-kiefer/treppenverkleidung-gauangelloch-kiefer-03.jpg",
      "/images/projects/treppenverkleidung-gauangelloch-kiefer/treppenverkleidung-gauangelloch-kiefer-04.jpg",
      "/images/projects/treppenverkleidung-gauangelloch-kiefer/treppenverkleidung-gauangelloch-kiefer-05.jpg",
      "/images/projects/treppenverkleidung-gauangelloch-kiefer/treppenverkleidung-gauangelloch-kiefer-06.jpg",
      "/images/projects/treppenverkleidung-gauangelloch-kiefer/treppenverkleidung-gauangelloch-kiefer-07.jpg",
      "/images/projects/treppenverkleidung-gauangelloch-kiefer/treppenverkleidung-gauangelloch-kiefer-08.jpg",
    ],
    cover:
      "/images/projects/treppenverkleidung-gauangelloch-kiefer/treppenverkleidung-gauangelloch-kiefer-01.jpg",
  },
  {
    slug: "beistelltisch-ladenburg-nussbaum",
    city: "schreinerei-ladenburg",
    service: "tische-und-stuehle",
    material: "nussbaum",
    title: "Beistelltisch aus Nussbaum — Projekt Ladenburg",
    metaTitle: "Beistelltisch aus Nussbaum | Projekt in Ladenburg",
    metaDescription:
      "Skulpturaler Beistelltisch aus massivem Nussbaum mit zwei ovalen Ablagen und geschwungener Mittelsäule — gefertigt von Alignum für einen Kunden in Ladenburg.",
    summary:
      "Skulpturaler Beistelltisch aus massivem Nussbaum: zwei ovale Ablagen, verbunden durch eine geschwungene Mittelsäule — ein Einzelstück für einen Kunden in Ladenburg.",
    body: [
      "Für einen Kunden in Ladenburg haben wir einen Beistelltisch entworfen, der mehr Skulptur als Möbel ist. Gewünscht war kein Standard-Tischchen, sondern ein kleines Statement neben dem Sofa – etwas, das man auch dann gerne ansieht, wenn nichts darauf steht.",
      "Entstanden ist ein Beistelltisch aus massivem Nussbaum mit zwei ovalen Ablageflächen, die eine geschwungene Mittelsäule auf zwei Ebenen versetzt zueinander hält. Die organische Form folgt der Maserung des Holzes, alle Kanten sind weich gerundet und von Hand geschliffen. So wirkt das Stück aus jedem Blickwinkel anders.",
      "Nussbaum ist für ein solches Liebhaberstück die erste Wahl: Das heimische Hartholz hat tiefe, warme Schokoladentöne und eine lebendige Maserung, die jeder Rundung Tiefe gibt. Geölt entwickelt es mit den Jahren eine seidige Patina.",
      "Vom ersten Entwurf bis zur Übergabe in Ladenburg war es ein kurzer, persönlicher Prozess – ein Einzelstück, das direkt aus der Werkstatt in Edingen-Neckarhausen zum Kunden ging.",
    ],
    features: [
      "Beistelltisch aus massivem Nussbaum",
      "Zwei ovale Ablagen auf versetzten Ebenen",
      "Geschwungene Mittelsäule als tragendes Element",
      "Alle Kanten von Hand gerundet und geschliffen",
      "Geölte Oberfläche mit seidiger Haptik",
      "Einzelstück, gefertigt für einen Kunden in Ladenburg",
    ],
    year: 2025,
    images: [
      "/images/projects/beistelltisch-ladenburg-nussbaum/beistelltisch-ladenburg-nussbaum-01.jpg",
      "/images/projects/beistelltisch-ladenburg-nussbaum/beistelltisch-ladenburg-nussbaum-02.jpg",
      "/images/projects/beistelltisch-ladenburg-nussbaum/beistelltisch-ladenburg-nussbaum-03.jpg",
      "/images/projects/beistelltisch-ladenburg-nussbaum/beistelltisch-ladenburg-nussbaum-04.jpg",
      "/images/projects/beistelltisch-ladenburg-nussbaum/beistelltisch-ladenburg-nussbaum-05.jpg",
      "/images/projects/beistelltisch-ladenburg-nussbaum/beistelltisch-ladenburg-nussbaum-06.jpg",
      "/images/projects/beistelltisch-ladenburg-nussbaum/beistelltisch-ladenburg-nussbaum-07.jpg",
    ],
    cover:
      "/images/projects/beistelltisch-ladenburg-nussbaum/beistelltisch-ladenburg-nussbaum-01.jpg",
  },
  {
    slug: "tisch-schwetzingen-nussbaum",
    city: "schreinerei-schwetzingen",
    service: "tische-und-stuehle",
    material: "nussbaum",
    title: "Esstisch aus Nussbaum — Projekt Schwetzingen",
    metaTitle: "Esstisch aus Nussbaum nach Maß | Projekt Schwetzingen",
    metaDescription:
      "Großer Esstisch aus massivem Nussbaum mit schräg gestellten Beinen und durchgehender Maserung — gefertigt von Alignum für einen Kunden in Schwetzingen.",
    summary:
      "Großer Esstisch aus massivem Nussbaum mit schräg gestellten Beinen und ruhiger, durchgehender Tischplatte — gefertigt für einen Kunden in Schwetzingen.",
    body: [
      "Für einen Kunden in Schwetzingen haben wir einen großzügigen Esstisch aus massivem Nussbaum gefertigt – ein Tisch, an dem eine ganze Familie samt Gästen Platz findet und der über Generationen halten soll.",
      "Die Tischplatte ist aus sorgfältig zusammengesetzten Nussbaum-Bohlen gearbeitet, sodass die Maserung über die gesamte Länge ruhig durchläuft. Getragen wird sie von schräg nach außen gestellten Beinen, die dem schweren Tisch optische Leichtigkeit geben und gleichzeitig viel Beinfreiheit lassen.",
      "Nussbaum ist das klassische Holz für den großen Esstisch: dunkel, warm, mit einer Maserung, die Charakter hat, ohne unruhig zu wirken. Eine offenporige Ölung lässt das Holz atmen und macht kleine Gebrauchsspuren später leicht ausbesserbar.",
      "Vom Aufmaß in Schwetzingen bis zur Lieferung haben wir den Tisch in unserer Werkstatt in Edingen-Neckarhausen gebaut und vor Ort aufgestellt – passgenau auf den Raum und die gewünschte Sitzplatzzahl.",
    ],
    features: [
      "Großer Esstisch aus massivem Nussbaum",
      "Tischplatte mit durchgehender Maserung",
      "Schräg gestellte Beine für Leichtigkeit und Beinfreiheit",
      "Offenporige Ölung, später leicht aufzufrischen",
      "Maßanfertigung auf Raum und Sitzplatzzahl",
      "Aufmaß, Fertigung und Lieferung nach Schwetzingen",
    ],
    year: 2025,
    images: [
      "/images/projects/tisch-schwetzingen-nussbaum/tisch-schwetzingen-nussbaum-01.jpg",
      "/images/projects/tisch-schwetzingen-nussbaum/tisch-schwetzingen-nussbaum-02.jpg",
      "/images/projects/tisch-schwetzingen-nussbaum/tisch-schwetzingen-nussbaum-03.jpg",
      "/images/projects/tisch-schwetzingen-nussbaum/tisch-schwetzingen-nussbaum-04.jpg",
      "/images/projects/tisch-schwetzingen-nussbaum/tisch-schwetzingen-nussbaum-05.jpg",
      "/images/projects/tisch-schwetzingen-nussbaum/tisch-schwetzingen-nussbaum-06.jpg",
      "/images/projects/tisch-schwetzingen-nussbaum/tisch-schwetzingen-nussbaum-07.jpg",
    ],
    cover:
      "/images/projects/tisch-schwetzingen-nussbaum/tisch-schwetzingen-nussbaum-01.jpg",
  },
  {
    slug: "kommode-edingen-ulme",
    city: "schreinerei-edingen-neckarhausen",
    service: "kommoden",
    title: "Kommode mit Ulme-Rahmen — Projekt Edingen-Neckarhausen",
    metaTitle: "Kommode aus Ulme nach Maß | Projekt Edingen-Neckarhausen",
    metaDescription:
      "Kommode mit warmem Ulme-Rahmen und matten weißen Schubladenfronten mit grifflosen Metall-Griffleisten — gefertigt von Alignum in Edingen-Neckarhausen.",
    summary:
      "Kommode mit warmem Massivholz-Rahmen aus Ulme und matten weißen Schubladenfronten – die Kombination aus Holz und Weiß macht sie zum ruhigen Solitär.",
    body: [
      "Für ein Schlafzimmer haben wir eine Kommode entworfen, die zwei Welten verbindet: die Wärme von Massivholz und die Ruhe einer reduzierten, weißen Front. So fügt sich das Stück in ein modernes Interieur ein, ohne kühl zu wirken.",
      "Der umlaufende Rahmen und die Korpuskanten bestehen aus massiver Ulme mit ihrer charakteristisch lebendigen Maserung. Davor sitzen mattweiße Schubladenfronten mit schmalen, eingelassenen Metall-Griffleisten – eine klare, grifflose Linie, die den Holzton umso mehr zur Geltung bringt. Die Schubladen laufen auf Vollauszügen mit Soft-Close.",
      "Ulme ist ein unterschätztes heimisches Holz: zäh, formstabil und mit einer warmen, fast flammenartigen Zeichnung, die sich gut gegen das schlichte Weiß behauptet. Genau dieser Kontrast war hier gewünscht.",
      "Entworfen, gefertigt und montiert haben wir die Kommode in und aus unserer Werkstatt in Edingen-Neckarhausen – ein Maßstück, abgestimmt auf den vorhandenen Raum.",
    ],
    features: [
      "Kommode mit massivem Ulme-Rahmen",
      "Mattweiße Schubladenfronten, grifflos",
      "Schmale eingelassene Metall-Griffleisten",
      "Vollauszüge mit Soft-Close",
      "Warmer Holz-Weiß-Kontrast für moderne Räume",
      "Maßanfertigung aus der Werkstatt Edingen-Neckarhausen",
    ],
    year: 2025,
    images: [
      "/images/projects/kommode-edingen-ulme/kommode-edingen-ulme-01.jpg",
      "/images/projects/kommode-edingen-ulme/kommode-edingen-ulme-02.jpg",
      "/images/projects/kommode-edingen-ulme/kommode-edingen-ulme-03.jpg",
      "/images/projects/kommode-edingen-ulme/kommode-edingen-ulme-04.jpg",
      "/images/projects/kommode-edingen-ulme/kommode-edingen-ulme-05.jpg",
      "/images/projects/kommode-edingen-ulme/kommode-edingen-ulme-06.jpg",
      "/images/projects/kommode-edingen-ulme/kommode-edingen-ulme-07.jpg",
      "/images/projects/kommode-edingen-ulme/kommode-edingen-ulme-08.jpg",
      "/images/projects/kommode-edingen-ulme/kommode-edingen-ulme-09.jpg",
      "/images/projects/kommode-edingen-ulme/kommode-edingen-ulme-10.jpg",
    ],
    cover:
      "/images/projects/kommode-edingen-ulme/kommode-edingen-ulme-01.jpg",
  },
  {
    slug: "tisch-bank-edingen-ulme",
    city: "schreinerei-edingen-neckarhausen",
    service: "tische-und-stuehle",
    title: "Esstisch mit Bank aus Ulme — Projekt Edingen-Neckarhausen",
    metaTitle: "Esstisch mit Bank aus Ulme | Projekt Edingen",
    metaDescription:
      "Heller Esstisch mit passender Sitzbank aus massiver Ulme, weich gerundete Kanten, skandinavisch-warme Anmutung — gefertigt von Alignum in Edingen-Neckarhausen.",
    summary:
      "Heller Esstisch mit passender Sitzbank aus massiver Ulme – weich gerundete Beine, warme Maserung, eine ruhige Tafel für den Alltag.",
    body: [
      "Für einen Essbereich haben wir ein aufeinander abgestimmtes Set aus Tisch und Bank gefertigt – ein Ensemble, das den Raum füllt, ohne ihn zu verstellen, und das den Alltag aushält.",
      "Tisch und Bank sind aus massiver Ulme gearbeitet, mit weich gerundeten Beinen und sanft gebrochenen Kanten. Die helle, warme Tönung des Holzes und die ruhige Formensprache geben dem Set eine skandinavisch-zurückhaltende Anmutung – die Bank schiebt sich platzsparend unter den Tisch, wenn sie nicht gebraucht wird.",
      "Ulme bringt hier genau die richtige Mischung mit: hell und freundlich im Ton, dabei zäh und alltagstauglich. Die natürliche Maserung bleibt unter einer matten Oberfläche gut sichtbar, ohne aufdringlich zu sein.",
      "Gefertigt haben wir Tisch und Bank in unserer Werkstatt in Edingen-Neckarhausen – als Maßanfertigung, abgestimmt auf Raum, Höhe und gewünschte Länge.",
    ],
    features: [
      "Esstisch mit passender Sitzbank aus massiver Ulme",
      "Weich gerundete Beine und gebrochene Kanten",
      "Helle, skandinavisch-warme Anmutung",
      "Bank platzsparend unter den Tisch schiebbar",
      "Matte Oberfläche, natürliche Maserung sichtbar",
      "Maßanfertigung aus der Werkstatt Edingen-Neckarhausen",
    ],
    year: 2025,
    images: [
      "/images/projects/tisch-bank-edingen-ulme/tisch-bank-edingen-ulme-01.jpg",
      "/images/projects/tisch-bank-edingen-ulme/tisch-bank-edingen-ulme-02.jpg",
      "/images/projects/tisch-bank-edingen-ulme/tisch-bank-edingen-ulme-03.jpg",
      "/images/projects/tisch-bank-edingen-ulme/tisch-bank-edingen-ulme-04.jpg",
      "/images/projects/tisch-bank-edingen-ulme/tisch-bank-edingen-ulme-05.jpg",
      "/images/projects/tisch-bank-edingen-ulme/tisch-bank-edingen-ulme-06.jpg",
      "/images/projects/tisch-bank-edingen-ulme/tisch-bank-edingen-ulme-07.jpg",
      "/images/projects/tisch-bank-edingen-ulme/tisch-bank-edingen-ulme-08.jpg",
      "/images/projects/tisch-bank-edingen-ulme/tisch-bank-edingen-ulme-09.jpg",
      "/images/projects/tisch-bank-edingen-ulme/tisch-bank-edingen-ulme-10.jpg",
    ],
    cover:
      "/images/projects/tisch-bank-edingen-ulme/tisch-bank-edingen-ulme-01.jpg",
  },
  {
    slug: "einbauschrank-mannheim-eiche",
    city: "schreinerei-mannheim",
    service: "moebelbauer",
    material: "stiel-eiche",
    title: "Einbauschrank in Weiß und Eiche — Projekt Mannheim",
    metaTitle: "Einbauschrank nach Maß in Eiche | Projekt Mannheim",
    metaDescription:
      "Raumhohe Einbauschrankwand mit weißen Fronten, Eiche-Innenleben, grifflosen Eiche-Griffmulden und LED-beleuchteten Fächern — von Alignum für einen Kunden in Mannheim.",
    summary:
      "Raumhohe Einbauschrankwand mit weißen Fronten und warmem Eiche-Innenleben – grifflose Eiche-Griffmulden, LED-beleuchtete Fächer, Schubladen aus Eiche. Gefertigt für ein Schlafzimmer in Mannheim.",
    body: [
      "Für ein Schlafzimmer in Mannheim haben wir eine raumhohe Einbauschrankwand geplant, die eine komplette Wand vom Boden bis zur Decke nutzt. Aus einem leeren Raum mit Eichenparkett wurde so eine ruhige, vollflächige Stauraumlösung, die jede Nische und jeden Zentimeter Höhe einbezieht.",
      "Die Fronten sind in mattem Weiß gehalten und vollkommen grifflos – geöffnet wird über schmale, in massiver Eiche eingelassene Griffmulden, die sich warm vom Weiß absetzen. Hinter den Türen verbergen sich Eiche-Schubladen mit Vollauszug, offene LED-beleuchtete Fächer und Kleiderstangen. So bleibt die Front außen vollkommen ruhig, während innen alles seinen Platz hat.",
      "Massive Eiche bildet den warmen Gegenpol zum reduzierten Weiß: als Griffmulde, als Schubladenkorpus und als feiner Rahmen. Eiche ist hart, langlebig und altert würdevoll – genau das richtige Holz für ein Möbel, das jeden Tag benutzt wird.",
      "Vom Aufmaß in Mannheim bis zur Montage haben wir die Schrankwand in unserer Werkstatt in Edingen-Neckarhausen vorgefertigt und vor Ort millimetergenau eingepasst – inklusive Anschluss der Innenbeleuchtung.",
    ],
    features: [
      "Raumhohe Einbauschrankwand, Boden bis Decke",
      "Matte weiße Fronten, vollständig grifflos",
      "Griffmulden aus massiver Eiche",
      "Eiche-Schubladen mit Vollauszug",
      "LED-beleuchtete offene Fächer",
      "Aufmaß, Vorfertigung und Montage in Mannheim",
    ],
    year: 2025,
    images: [
      "/images/projects/einbauschrank-mannheim-eiche/einbauschrank-mannheim-eiche-10.jpg",
      "/images/projects/einbauschrank-mannheim-eiche/einbauschrank-mannheim-eiche-08.jpg",
      "/images/projects/einbauschrank-mannheim-eiche/einbauschrank-mannheim-eiche-02.jpg",
      "/images/projects/einbauschrank-mannheim-eiche/einbauschrank-mannheim-eiche-03.jpg",
      "/images/projects/einbauschrank-mannheim-eiche/einbauschrank-mannheim-eiche-04.jpg",
      "/images/projects/einbauschrank-mannheim-eiche/einbauschrank-mannheim-eiche-05.jpg",
      "/images/projects/einbauschrank-mannheim-eiche/einbauschrank-mannheim-eiche-06.jpg",
      "/images/projects/einbauschrank-mannheim-eiche/einbauschrank-mannheim-eiche-07.jpg",
      "/images/projects/einbauschrank-mannheim-eiche/einbauschrank-mannheim-eiche-09.jpg",
    ],
    cover:
      "/images/projects/einbauschrank-mannheim-eiche/einbauschrank-mannheim-eiche-10.jpg",
  },
  {
    slug: "einbauschrank-schwetzingen-eiche",
    city: "schreinerei-schwetzingen",
    service: "moebelbauer",
    material: "stiel-eiche",
    title: "Einbauschrank aus Eiche — Projekt Schwetzingen",
    metaTitle: "Einbauschrank aus Eiche nach Maß | Projekt Schwetzingen",
    metaDescription:
      "Raumhoher, griffloser Einbauschrank aus warmer Eiche, passgenau in die Nische gebaut — von Alignum für einen Kunden in Schwetzingen.",
    summary:
      "Raumhoher, griffloser Einbauschrank aus warmer Eiche, passgenau in eine Nische gebaut – ruhige Front, voller Stauraum. Gefertigt für einen Kunden in Schwetzingen.",
    body: [
      "Für einen Kunden in Schwetzingen haben wir eine vorhandene Nische in einen raumhohen Einbauschrank verwandelt. Statt eines freistehenden Möbels, das immer ein Stück Wand verschenkt, schließt der Schrank flächenbündig mit der Wand ab und wirkt wie ein Teil des Raums.",
      "Die durchgehenden Fronten sind aus warmer Eiche gefertigt, grifflos und mit feiner, ruhiger Maserung. Innen sorgen Einlegeböden, Schubladen und Kleiderstangen für flexiblen Stauraum. Die schlichte Front lässt das Holz und seine Maserung wirken, ohne durch Griffe unterbrochen zu werden.",
      "Eiche ist für einen Einbauschrank das ideale Holz: sehr hart, langlebig und mit einem warmen, lebendigen Maserbild, das jeden Raum erdet. Geölt bleibt die natürliche Haptik erhalten.",
      "Nach dem Aufmaß in Schwetzingen haben wir den Schrank in unserer Werkstatt in Edingen-Neckarhausen gefertigt und vor Ort passgenau montiert.",
    ],
    features: [
      "Raumhoher Einbauschrank, flächenbündig zur Wand",
      "Grifflose Fronten aus warmer Eiche",
      "Flexible Innenausstattung: Böden, Schubladen, Stangen",
      "Ruhige, durchgehende Maserung",
      "Geölte Oberfläche mit natürlicher Haptik",
      "Aufmaß, Fertigung und Montage in Schwetzingen",
    ],
    year: 2025,
    images: [
      "/images/projects/einbauschrank-schwetzingen-eiche/einbauschrank-schwetzingen-eiche-01.jpg",
      "/images/projects/einbauschrank-schwetzingen-eiche/einbauschrank-schwetzingen-eiche-02.jpg",
      "/images/projects/einbauschrank-schwetzingen-eiche/einbauschrank-schwetzingen-eiche-03.jpg",
      "/images/projects/einbauschrank-schwetzingen-eiche/einbauschrank-schwetzingen-eiche-04.jpg",
      "/images/projects/einbauschrank-schwetzingen-eiche/einbauschrank-schwetzingen-eiche-05.jpg",
    ],
    cover:
      "/images/projects/einbauschrank-schwetzingen-eiche/einbauschrank-schwetzingen-eiche-01.jpg",
  },
  {
    slug: "fensterschrank-edingen-eiche",
    city: "schreinerei-edingen-neckarhausen",
    service: "moebelbauer",
    material: "stiel-eiche",
    title: "Fensterschrank mit Sitzbank aus Eiche — Projekt Edingen",
    metaTitle: "Fensterschrank aus Eiche nach Maß | Projekt Edingen",
    metaDescription:
      "Eingebauter Fensterschrank aus Eiche mit Fensterbank-Sitz und seitlichen Regalen, passgenau um die Fensternische gebaut — von Alignum in Edingen-Neckarhausen.",
    summary:
      "Eingebauter Fensterschrank aus Eiche: Fensterbank zum Sitzen, seitliche Regale und Unterschränke, passgenau um die Fensternische gebaut.",
    body: [
      "Für ein Haus in Edingen-Neckarhausen haben wir eine Fensternische in ein eingebautes Möbel verwandelt: einen Fensterschrank, der die Fensterbank zur Sitzbank macht und den Platz links und rechts des Fensters mit Regalen und Unterschränken nutzt.",
      "Die gesamte Einbauten sind aus Eiche gefertigt und exakt um die vorhandene Fensteröffnung herum konstruiert. Unter der gepolsterten Fensterbank verbergen sich Stauraumfächer, seitlich gliedern offene Regalböden die Wand. So entsteht aus einem ungenutzten Fensterbereich ein Lese- und Rückzugsplatz mit viel Ablage.",
      "Eiche gibt dem Einbau die nötige Robustheit und eine warme, ruhige Ausstrahlung – ideal für ein Möbel, das gleichzeitig Sitzplatz, Regal und Fensterrahmen ist.",
      "Geplant, gefertigt und montiert haben wir den Fensterschrank aus unserer Werkstatt in Edingen-Neckarhausen – ein Maßeinbau, der sich vollständig in die Architektur des Raums einfügt.",
    ],
    features: [
      "Eingebauter Fensterschrank rund um die Fensternische",
      "Fensterbank als Sitzplatz mit Stauraum darunter",
      "Seitliche offene Regale und Unterschränke",
      "Komplett aus massiver Eiche",
      "Passgenau in die vorhandene Architektur eingefügt",
      "Geplant und gefertigt in Edingen-Neckarhausen",
    ],
    year: 2025,
    images: [
      "/images/projects/fensterschrank-edingen-eiche/fensterschrank-edingen-eiche-01.jpg",
      "/images/projects/fensterschrank-edingen-eiche/fensterschrank-edingen-eiche-02.jpg",
      "/images/projects/fensterschrank-edingen-eiche/fensterschrank-edingen-eiche-03.jpg",
      "/images/projects/fensterschrank-edingen-eiche/fensterschrank-edingen-eiche-04.jpg",
      "/images/projects/fensterschrank-edingen-eiche/fensterschrank-edingen-eiche-05.jpg",
      "/images/projects/fensterschrank-edingen-eiche/fensterschrank-edingen-eiche-06.jpg",
      "/images/projects/fensterschrank-edingen-eiche/fensterschrank-edingen-eiche-07.jpg",
      "/images/projects/fensterschrank-edingen-eiche/fensterschrank-edingen-eiche-08.jpg",
      "/images/projects/fensterschrank-edingen-eiche/fensterschrank-edingen-eiche-09.jpg",
      "/images/projects/fensterschrank-edingen-eiche/fensterschrank-edingen-eiche-10.jpg",
    ],
    cover:
      "/images/projects/fensterschrank-edingen-eiche/fensterschrank-edingen-eiche-01.jpg",
  },
  {
    slug: "garderobe-gauangelloch-kiefer",
    city: "schreinerei-leimen",
    service: "moebelbauer",
    title: "Garderobe mit Sitzbank aus Kiefer — Projekt Gauangelloch",
    metaTitle: "Garderobe nach Maß in Kiefer | Projekt Gauangelloch",
    metaDescription:
      "Eingebaute Flurgarderobe mit weißen Schränken, Kiefer-Sitzbank und vertikaler Lamellen-Rückwand — von Alignum für einen Kunden in Gauangelloch bei Leimen.",
    summary:
      "Eingebaute Flurgarderobe: weiße Hoch- und Unterschränke, eine Sitzbank aus Kiefer und eine warme Lamellen-Rückwand. Gefertigt für einen Kunden in Gauangelloch bei Leimen.",
    body: [
      "Für einen Flur in Gauangelloch bei Leimen haben wir eine eingebaute Garderobe entworfen, die Stauraum, Sitzplatz und einen warmen Blickfang vereint – auf engem Raum, vom Boden bis zur Decke geplant.",
      "Weiße Hochschränke und ein Unterschrank fassen eine offene Nische ein, in der eine massive Sitzbank aus Kiefer zum Schuhe-Anziehen einlädt. Den Hintergrund bildet eine vertikale Lamellen-Wand aus Kiefer, die der sonst weißen Garderobe Wärme und Struktur gibt. So wird aus reiner Stauraum-Funktion ein gestalteter Eingangsbereich.",
      "Kiefer ist hier bewusst gewählt: Das helle, warme Nadelholz bringt Freundlichkeit in den Flur und setzt einen ruhigen Kontrast zu den weißen Fronten. Die schmalen Lamellen lassen die Rückwand lebendig wirken, ohne aufdringlich zu sein.",
      "Geplant, gefertigt und montiert haben wir die Garderobe aus unserer Werkstatt in Edingen-Neckarhausen – passgenau in den vorhandenen Flur eingebaut.",
    ],
    features: [
      "Eingebaute Flurgarderobe, Boden bis Decke",
      "Weiße Hoch- und Unterschränke",
      "Sitzbank aus massiver Kiefer",
      "Vertikale Lamellen-Rückwand aus Kiefer",
      "Warmer Holz-Weiß-Kontrast im Eingangsbereich",
      "Aufmaß, Fertigung und Montage in Gauangelloch bei Leimen",
    ],
    year: 2025,
    images: [
      "/images/projects/garderobe-gauangelloch-kiefer/garderobe-gauangelloch-kiefer-01.jpg",
      "/images/projects/garderobe-gauangelloch-kiefer/garderobe-gauangelloch-kiefer-02.jpg",
      "/images/projects/garderobe-gauangelloch-kiefer/garderobe-gauangelloch-kiefer-03.jpg",
      "/images/projects/garderobe-gauangelloch-kiefer/garderobe-gauangelloch-kiefer-04.jpg",
      "/images/projects/garderobe-gauangelloch-kiefer/garderobe-gauangelloch-kiefer-05.jpg",
      "/images/projects/garderobe-gauangelloch-kiefer/garderobe-gauangelloch-kiefer-06.jpg",
      "/images/projects/garderobe-gauangelloch-kiefer/garderobe-gauangelloch-kiefer-07.jpg",
      "/images/projects/garderobe-gauangelloch-kiefer/garderobe-gauangelloch-kiefer-08.jpg",
      "/images/projects/garderobe-gauangelloch-kiefer/garderobe-gauangelloch-kiefer-09.jpg",
      "/images/projects/garderobe-gauangelloch-kiefer/garderobe-gauangelloch-kiefer-10.jpg",
    ],
    cover:
      "/images/projects/garderobe-gauangelloch-kiefer/garderobe-gauangelloch-kiefer-01.jpg",
  },
  {
    slug: "garderobenschrank-edingen-lackiert",
    city: "schreinerei-edingen-neckarhausen",
    service: "moebelbauer",
    title: "Garderobenschrank in Weiß lackiert — Projekt Edingen",
    metaTitle: "Garderobenschrank nach Maß, weiß lackiert | Edingen",
    metaDescription:
      "Raumhohe, grifflose Schrankwand in mattweißem Lack mit indirekter LED-Beleuchtung, passgenau in den Flur gebaut — von Alignum in Edingen-Neckarhausen.",
    summary:
      "Raumhohe, grifflose Schrankwand in mattweißem Lack mit indirekter LED-Beleuchtung – ruhig, flächenbündig, viel Stauraum. Gefertigt für einen Flur in Edingen-Neckarhausen.",
    body: [
      "Für einen Flur in Edingen-Neckarhausen haben wir eine raumhohe Schrankwand gefertigt, die eine ganze Wand vom Boden bis zur Decke füllt und doch fast unsichtbar bleibt – durch ihre ruhige, mattweiße Front und die flächenbündige Bauweise.",
      "Die Fronten sind in mattem Weiß lackiert und grifflos ausgeführt; geöffnet werden sie über grifflose Mechaniken und schmale Griffkanten. Eine indirekte LED-Beleuchtung in der Deckenfuge lässt die Schrankwand leicht wirken und nimmt ihr jede Schwere. Dahinter steckt vollwertiger Stauraum mit Stangen, Böden und Auszügen.",
      "Eine lackierte Oberfläche war hier die bewusste Wahl: Sie ergibt eine vollkommen ruhige, glatte Fläche ohne Maserung, die sich perfekt in einen modernen, reduzierten Flur einfügt und das Licht weich reflektiert.",
      "Geplant, lackiert und montiert haben wir die Schrankwand aus unserer Werkstatt in Edingen-Neckarhausen – passgenau auf die Maße des Flurs und mit Anschluss der indirekten Beleuchtung.",
    ],
    features: [
      "Raumhohe Schrankwand, Boden bis Decke",
      "Mattweiß lackierte, grifflose Fronten",
      "Indirekte LED-Beleuchtung in der Deckenfuge",
      "Flächenbündige, ruhige Optik",
      "Vollwertiger Stauraum: Stangen, Böden, Auszüge",
      "Gefertigt und montiert in Edingen-Neckarhausen",
    ],
    year: 2025,
    images: [
      "/images/projects/garderobenschrank-edingen-lackiert/garderobenschrank-edingen-lackiert-08.jpg",
      "/images/projects/garderobenschrank-edingen-lackiert/garderobenschrank-edingen-lackiert-10.jpg",
      "/images/projects/garderobenschrank-edingen-lackiert/garderobenschrank-edingen-lackiert-02.jpg",
      "/images/projects/garderobenschrank-edingen-lackiert/garderobenschrank-edingen-lackiert-03.jpg",
      "/images/projects/garderobenschrank-edingen-lackiert/garderobenschrank-edingen-lackiert-04.jpg",
      "/images/projects/garderobenschrank-edingen-lackiert/garderobenschrank-edingen-lackiert-05.jpg",
      "/images/projects/garderobenschrank-edingen-lackiert/garderobenschrank-edingen-lackiert-06.jpg",
      "/images/projects/garderobenschrank-edingen-lackiert/garderobenschrank-edingen-lackiert-07.jpg",
      "/images/projects/garderobenschrank-edingen-lackiert/garderobenschrank-edingen-lackiert-09.jpg",
    ],
    cover:
      "/images/projects/garderobenschrank-edingen-lackiert/garderobenschrank-edingen-lackiert-08.jpg",
  },
  {
    slug: "haustuer-heidelberg-eiche",
    city: "schreinerei-heidelberg",
    service: "tuerenbauer-in-der-naehe",
    material: "stiel-eiche",
    title: "Haustür aus Eiche restauriert — Projekt Heidelberg",
    metaTitle: "Haustür aus Eiche restauriert | Projekt Heidelberg",
    metaDescription:
      "Historische Eichen-Haustür mit Glasfeldern aufgearbeitet und neu beschlagen — von Alignum für einen Kunden in der Heidelberger Altstadt. Restauration statt Austausch.",
    summary:
      "Historische Eichen-Haustür mit Glasfeldern fachgerecht aufgearbeitet, neu geölt und beschlagen – Charakter erhalten statt austauschen. Für einen Kunden in Heidelberg.",
    body: [
      "Für ein Altbau in Heidelberg haben wir eine historische Haustür aus Eiche aufgearbeitet, statt sie durch ein Neuteil zu ersetzen. Die Tür gehört zum Charakter des Hauses – mit ihren hohen Glasfeldern, dem geprägten Oberlicht und der gewachsenen Patina war ein Austausch keine Option.",
      "Wir haben die Tür ausgehängt, in der Werkstatt zerlegt, schadhafte Stellen ausgebessert, das Holz neu aufgebaut und mit einer schützenden Oberfläche versehen. Beschläge, Schloss und Dichtungen wurden erneuert, sodass die alte Tür wieder satt schließt und dem Wetter standhält – ihren historischen Ausdruck behält sie dabei vollständig.",
      "Eiche ist der Grund, warum sich diese Aufarbeitung lohnt: Das Holz ist nach Jahrzehnten noch kerngesund und lässt sich hervorragend restaurieren. Eine neue Tür von der Stange erreicht diese Tiefe und Substanz nicht.",
      "Aus- und Wiedereinbau erfolgten in Heidelberg, die Aufarbeitung in unserer Werkstatt in Edingen-Neckarhausen – eine Restauration, die das Original bewahrt.",
    ],
    features: [
      "Historische Eichen-Haustür fachgerecht aufgearbeitet",
      "Hohe Glasfelder und Oberlicht erhalten",
      "Holz ausgebessert und neu aufgebaut",
      "Beschläge, Schloss und Dichtungen erneuert",
      "Historischer Charakter vollständig bewahrt",
      "Aus- und Wiedereinbau in Heidelberg",
    ],
    year: 2025,
    images: [
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-11.jpg",
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-12.jpg",
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-13.jpg",
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-14.jpg",
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-15.jpg",
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-16.jpg",
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-17.jpg",
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-18.jpg",
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-01.jpg",
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-02.jpg",
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-03.jpg",
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-04.jpg",
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-05.jpg",
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-06.jpg",
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-07.jpg",
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-08.jpg",
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-09.jpg",
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-10.jpg",
    ],
    cover:
      "/images/projects/haustuer-heidelberg-eiche/haustuer-heidelberg-eiche-11.jpg",
  },
  {
    slug: "hoftor-hockenheim-kiefer",
    city: "schreinerei-hockenheim",
    service: "tuerenbauer-in-der-naehe",
    title: "Hoftor-Anlage aus Kiefer — Projekt Hockenheim",
    metaTitle: "Hoftor-Anlage aus Kiefer nach Maß | Projekt Hockenheim",
    metaDescription:
      "Hoftor-Anlage aus Kiefer mit integrierter, verglaster Pforte und Sprossenteilung — passgenau gefertigt von Alignum für einen Kunden in Hockenheim.",
    summary:
      "Hoftor-Anlage aus massiver Kiefer mit integrierter verglaster Pforte und feiner Sprossenteilung – passgenau gefertigt für einen Kunden in Hockenheim.",
    body: [
      "Für einen Kunden in Hockenheim haben wir eine komplette Hoftor-Anlage aus Kiefer gefertigt – mit einer integrierten, begehbaren Pforte, die sich harmonisch in das große Tor einfügt.",
      "Die Pforte ist im oberen Bereich verglast und mit einer feinen, handwerklich verzapften Sprossenteilung gegliedert; darunter sitzen vertikale Massivholz-Füllungen. Rahmen und Sprossen sind aus Kiefer gearbeitet, sauber verzapft und verleimt – eine Konstruktion, die Wind und Wetter trägt und sich satt schließen lässt.",
      "Kiefer ist für Tor und Pforte ein dankbares Holz: hell, harzhaltig und mit der richtigen Oberfläche gut für den Außenbereich geeignet. Die warme Tönung gibt der Anlage einen freundlichen, einladenden Charakter.",
      "Gefertigt haben wir die Hoftor-Anlage in unserer Werkstatt in Edingen-Neckarhausen und vor Ort in Hockenheim montiert – inklusive Justierung von Bändern und Schloss.",
    ],
    features: [
      "Komplette Hoftor-Anlage aus Kiefer",
      "Integrierte, begehbare Pforte",
      "Verglaster Oberteil mit verzapfter Sprossenteilung",
      "Vertikale Massivholz-Füllungen",
      "Wetterfeste Oberfläche für den Außenbereich",
      "Fertigung und Montage in Hockenheim",
    ],
    year: 2025,
    images: [
      "/images/projects/hoftor-hockenheim-kiefer/hoftor-hockenheim-kiefer-10.jpg",
      "/images/projects/hoftor-hockenheim-kiefer/hoftor-hockenheim-kiefer-08.jpg",
      "/images/projects/hoftor-hockenheim-kiefer/hoftor-hockenheim-kiefer-09.jpg",
      "/images/projects/hoftor-hockenheim-kiefer/hoftor-hockenheim-kiefer-01.jpg",
      "/images/projects/hoftor-hockenheim-kiefer/hoftor-hockenheim-kiefer-02.jpg",
      "/images/projects/hoftor-hockenheim-kiefer/hoftor-hockenheim-kiefer-03.jpg",
      "/images/projects/hoftor-hockenheim-kiefer/hoftor-hockenheim-kiefer-04.jpg",
      "/images/projects/hoftor-hockenheim-kiefer/hoftor-hockenheim-kiefer-05.jpg",
      "/images/projects/hoftor-hockenheim-kiefer/hoftor-hockenheim-kiefer-06.jpg",
      "/images/projects/hoftor-hockenheim-kiefer/hoftor-hockenheim-kiefer-07.jpg",
    ],
    cover:
      "/images/projects/hoftor-hockenheim-kiefer/hoftor-hockenheim-kiefer-10.jpg",
  },
  {
    slug: "wohnungseingangstuer-heidelberg-kiefer",
    city: "schreinerei-heidelberg",
    service: "tuerenbauer-in-der-naehe",
    title: "Wohnungseingangstür mit Ätzglas — Projekt Heidelberg",
    metaTitle: "Wohnungseingangstür nach Maß | Projekt Heidelberg",
    metaDescription:
      "Dreiteilige weiße Wohnungseingangstür mit Oberlicht, Seitenteil und dekorativem Ätzglas, klassisch profiliert — von Alignum für einen Kunden in Heidelberg.",
    summary:
      "Dreiteilige weiße Wohnungseingangstür mit Oberlicht, Seitenteil und dekorativem Ätzglas – klassisch profiliert, passgenau in den Altbau gebaut. Für einen Kunden in Heidelberg.",
    body: [
      "Für eine Wohnung in einem Heidelberger Altbau haben wir eine dreiteilige Eingangstür gefertigt – Türblatt, Oberlicht und Seitenteil als eine zusammenhängende, klassisch profilierte Anlage, die zur Stilistik des Hauses passt.",
      "Die Felder sind mit dekorativem Ätzglas gefüllt, das Licht ins Treppenhaus und in den Flur lässt, ohne den Blick freizugeben. Rahmen und Profile sind sauber gearbeitet und deckend weiß lackiert; klassische Messingknäufe runden das Bild ab. So entsteht aus einer reinen Funktionstür ein repräsentativer Eingang.",
      "Der Korpus ist aus Kiefer gefertigt – ein stabiles, gut zu verarbeitendes Holz, das unter dem deckenden Lack eine vollkommen ruhige Oberfläche ergibt. Genau richtig für eine Tür, die viele Jahre täglich benutzt wird.",
      "Gefertigt haben wir die Anlage in unserer Werkstatt in Edingen-Neckarhausen und in Heidelberg passgenau in die vorhandene Öffnung eingebaut.",
    ],
    features: [
      "Dreiteilige Wohnungseingangstür: Blatt, Oberlicht, Seitenteil",
      "Dekoratives Ätzglas in den Feldern",
      "Klassische Profilierung, deckend weiß lackiert",
      "Messing-Beschläge",
      "Korpus aus stabiler Kiefer",
      "Fertigung und Einbau in Heidelberg",
    ],
    year: 2025,
    images: [
      "/images/projects/wohnungseingangstuer-heidelberg-kiefer/wohnungseingangstuer-heidelberg-kiefer-09.jpg",
      "/images/projects/wohnungseingangstuer-heidelberg-kiefer/wohnungseingangstuer-heidelberg-kiefer-10.jpg",
      "/images/projects/wohnungseingangstuer-heidelberg-kiefer/wohnungseingangstuer-heidelberg-kiefer-01.jpg",
      "/images/projects/wohnungseingangstuer-heidelberg-kiefer/wohnungseingangstuer-heidelberg-kiefer-02.jpg",
      "/images/projects/wohnungseingangstuer-heidelberg-kiefer/wohnungseingangstuer-heidelberg-kiefer-03.jpg",
      "/images/projects/wohnungseingangstuer-heidelberg-kiefer/wohnungseingangstuer-heidelberg-kiefer-04.jpg",
      "/images/projects/wohnungseingangstuer-heidelberg-kiefer/wohnungseingangstuer-heidelberg-kiefer-05.jpg",
      "/images/projects/wohnungseingangstuer-heidelberg-kiefer/wohnungseingangstuer-heidelberg-kiefer-06.jpg",
      "/images/projects/wohnungseingangstuer-heidelberg-kiefer/wohnungseingangstuer-heidelberg-kiefer-07.jpg",
      "/images/projects/wohnungseingangstuer-heidelberg-kiefer/wohnungseingangstuer-heidelberg-kiefer-08.jpg",
    ],
    cover:
      "/images/projects/wohnungseingangstuer-heidelberg-kiefer/wohnungseingangstuer-heidelberg-kiefer-09.jpg",
  },
  {
    slug: "hoftor-haustuer-mannheim-laerche",
    city: "schreinerei-mannheim",
    service: "tuerenbauer-in-der-naehe",
    material: "laerche",
    title: "Haustür aus Lärche mit Oberlicht — Projekt Mannheim",
    metaTitle: "Haustür aus Lärche nach Maß | Projekt Mannheim",
    metaDescription:
      "Massive Lärchen-Haustür mit strahlenförmigem Oberlicht im Sandstein-Rundbogen, vertikale Bohlen, Briefeinwurf — von Alignum für einen Kunden in Mannheim.",
    summary:
      "Massive Haustür aus Lärche mit strahlenförmigem Oberlicht, eingepasst in einen Sandstein-Rundbogen – warm, wetterfest, unverwechselbar. Für einen Kunden in Mannheim.",
    body: [
      "Für ein Haus mit historischem Sandstein-Rundbogen in Mannheim haben wir eine massive Haustür aus Lärche gefertigt, die sich exakt in die vorhandene Bogenöffnung einfügt – inklusive eines strahlenförmig aufgebauten Oberlichts, das den Rundbogen aufnimmt.",
      "Das Türblatt ist aus vertikalen Lärchen-Bohlen aufgebaut, mit eingelassenem Briefeinwurf und schlichtem Drücker. Über der Tür fächert sich das Oberlicht in einem Sonnen-Motiv auf, das dem Eingang Charakter gibt und das Tageslicht in den Flur lässt. Tür und Oberlicht sind passgenau in den unregelmäßigen Sandsteinbogen eingearbeitet.",
      "Lärche ist für eine Haustür die ideale Wahl: Das heimische Nadelholz ist von Natur aus witterungsbeständig und harzreich, mit einer warmen, goldgelben Tönung, die unter Sonnenlicht förmlich leuchtet. So überdauert die Tür Jahrzehnte im Außenbereich.",
      "Gefertigt haben wir Tür und Oberlicht in unserer Werkstatt in Edingen-Neckarhausen und in Mannheim passgenau in den historischen Bogen eingesetzt.",
    ],
    features: [
      "Massive Haustür aus witterungsbeständiger Lärche",
      "Strahlenförmiges Oberlicht im Sonnen-Motiv",
      "Passgenau in den Sandstein-Rundbogen eingearbeitet",
      "Vertikale Bohlen mit eingelassenem Briefeinwurf",
      "Warme, goldgelbe Lärchen-Tönung",
      "Fertigung und Einbau in Mannheim",
    ],
    year: 2025,
    images: [
      "/images/projects/hoftor-haustuer-mannheim-laerche/hoftor-haustuer-mannheim-laerche-01.jpg",
      "/images/projects/hoftor-haustuer-mannheim-laerche/hoftor-haustuer-mannheim-laerche-02.jpg",
      "/images/projects/hoftor-haustuer-mannheim-laerche/hoftor-haustuer-mannheim-laerche-03.jpg",
      "/images/projects/hoftor-haustuer-mannheim-laerche/hoftor-haustuer-mannheim-laerche-04.jpg",
      "/images/projects/hoftor-haustuer-mannheim-laerche/hoftor-haustuer-mannheim-laerche-05.jpg",
      "/images/projects/hoftor-haustuer-mannheim-laerche/hoftor-haustuer-mannheim-laerche-06.jpg",
      "/images/projects/hoftor-haustuer-mannheim-laerche/hoftor-haustuer-mannheim-laerche-07.jpg",
      "/images/projects/hoftor-haustuer-mannheim-laerche/hoftor-haustuer-mannheim-laerche-08.jpg",
    ],
    cover:
      "/images/projects/hoftor-haustuer-mannheim-laerche/hoftor-haustuer-mannheim-laerche-01.jpg",
  },
  {
    slug: "badmoebel-roteiche-mannheim",
    city: "schreinerei-mannheim",
    service: "badmoebel",
    title: "Badmöbel aus Roteiche — Projekt Mannheim",
    metaTitle: "Badmöbel aus Roteiche nach Maß | Projekt Mannheim",
    metaDescription:
      "Komplette Badmöblierung aus Roteiche: Hochschrank, Spiegelschrank und Waschtisch-Unterschränke mit Schubladen — von Alignum für einen Kunden in Mannheim.",
    summary:
      "Komplette Badmöblierung aus warmer Roteiche: Hochschrank, breiter Spiegelschrank und Waschtisch-Unterschränke mit Schubladen – gefertigt für ein Bad in Mannheim.",
    body: [
      "Für ein Bad in Mannheim haben wir eine komplette, aufeinander abgestimmte Möblierung aus Roteiche gefertigt – vom raumhohen Hochschrank über den breiten Spiegelschrank bis zu den Waschtisch-Unterschränken. So bekommt das ganze Bad eine durchgehende, warme Holzhandschrift.",
      "Der Hochschrank nimmt Handtücher und Vorräte auf, der Spiegelschrank über der Waschtischzeile bietet hinter den Türen Stauraum und gibt zugleich viel Spiegelfläche. Darunter sorgen Schubladen-Unterschränke für griffbereite Ordnung. Alle Fronten sind aus Roteiche mit ihrer lebhaften, warmen Maserung gearbeitet.",
      "Roteiche bringt eine kräftigere, rötlichere Tönung mit als die heimische Stiel-Eiche – das gibt dem Bad eine besonders warme Atmosphäre. Mit einer feuchtraumgeeigneten Oberfläche behandelt, hält das Holz auch im Bad dauerhaft stand.",
      "Geplant, gefertigt und montiert haben wir die Badmöbel aus unserer Werkstatt in Edingen-Neckarhausen – passgenau auf den vorhandenen Grundriss in Mannheim.",
    ],
    features: [
      "Komplette Badmöblierung aus Roteiche",
      "Raumhoher Hochschrank für Handtücher und Vorräte",
      "Breiter Spiegelschrank mit Stauraum",
      "Waschtisch-Unterschränke mit Schubladen",
      "Feuchtraumgeeignete Oberfläche",
      "Aufmaß, Fertigung und Montage in Mannheim",
    ],
    year: 2025,
    images: [
      "/images/projects/badmoebel-roteiche-mannheim/badmoebel-roteiche-mannheim-01.jpg",
      "/images/projects/badmoebel-roteiche-mannheim/badmoebel-roteiche-mannheim-02.jpg",
      "/images/projects/badmoebel-roteiche-mannheim/badmoebel-roteiche-mannheim-03.jpg",
      "/images/projects/badmoebel-roteiche-mannheim/badmoebel-roteiche-mannheim-04.jpg",
      "/images/projects/badmoebel-roteiche-mannheim/badmoebel-roteiche-mannheim-05.jpg",
      "/images/projects/badmoebel-roteiche-mannheim/badmoebel-roteiche-mannheim-06.jpg",
    ],
    cover:
      "/images/projects/badmoebel-roteiche-mannheim/badmoebel-roteiche-mannheim-01.jpg",
  },
  {
    slug: "badschrank-wiesloch-eiche",
    city: "schreinerei-wiesloch",
    service: "badmoebel",
    material: "stiel-eiche",
    title: "Waschtisch und Spiegelschrank aus Eiche — Projekt Wiesloch",
    metaTitle: "Badmöbel aus Eiche nach Maß | Projekt Wiesloch",
    metaDescription:
      "Wandhängender Eiche-Waschtisch mit grifflosen Schubladen und breiter Spiegelschrank vor anthrazitfarbenen Fliesen — von Alignum für einen Kunden in Wiesloch.",
    summary:
      "Wandhängender Waschtisch aus Eiche mit grifflosen Schubladen und ein breiter, raumhoher Spiegelschrank vor dunklen Fliesen – warmer Kontrast für ein modernes Bad in Wiesloch.",
    body: [
      "Für ein modernes Bad in Wiesloch haben wir einen wandhängenden Waschtisch und einen breiten Spiegelschrank aus Eiche gefertigt. Vor den großformatigen anthrazitfarbenen Fliesen setzt das warme Holz einen bewussten, freundlichen Kontrast.",
      "Der schwebende Waschtisch-Unterschrank trägt ein weißes Aufsatzbecken und bietet darunter zwei grifflose Schubladen mit durchgehender Maserung. Der raumbreite Spiegelschrank verschwindet optisch hinter der Spiegelfläche und schließt oben mit einer schmalen Eiche-Blende ab, in die eine indirekte Beleuchtung integriert ist.",
      "Eiche ist im Bad eine bewährte Wahl: Mit feuchtraumgeeigneter Oberfläche und sauber versiegelten Kanten trotzt das harte Holz der täglichen Feuchtigkeit und altert würdevoll. Die ruhige Maserung passt zur reduzierten, modernen Formensprache.",
      "Geplant, gefertigt und montiert haben wir die Badmöbel aus unserer Werkstatt in Edingen-Neckarhausen – passgenau für das Bad in Wiesloch.",
    ],
    features: [
      "Wandhängender Waschtisch-Unterschrank aus Eiche",
      "Grifflose Schubladen mit durchgehender Maserung",
      "Raumbreiter Spiegelschrank mit indirekter Beleuchtung",
      "Warmer Holzkontrast vor anthrazitfarbenen Fliesen",
      "Feuchtraumgeeignete Oberfläche, versiegelte Kanten",
      "Aufmaß, Fertigung und Montage in Wiesloch",
    ],
    year: 2025,
    images: [
      "/images/projects/badschrank-wiesloch-eiche/badschrank-wiesloch-eiche-01.jpg",
      "/images/projects/badschrank-wiesloch-eiche/badschrank-wiesloch-eiche-02.jpg",
      "/images/projects/badschrank-wiesloch-eiche/badschrank-wiesloch-eiche-03.jpg",
      "/images/projects/badschrank-wiesloch-eiche/badschrank-wiesloch-eiche-04.jpg",
      "/images/projects/badschrank-wiesloch-eiche/badschrank-wiesloch-eiche-05.jpg",
      "/images/projects/badschrank-wiesloch-eiche/badschrank-wiesloch-eiche-06.jpg",
    ],
    cover:
      "/images/projects/badschrank-wiesloch-eiche/badschrank-wiesloch-eiche-01.jpg",
  },
  {
    slug: "treppe-wandscheibe-edingen-eiche",
    city: "schreinerei-edingen-neckarhausen",
    service: "treppenbau-in-der-nahe",
    material: "stiel-eiche",
    title: "Treppe mit Wandscheibe aus Eiche — Projekt Edingen",
    metaTitle: "Treppe mit Wandscheibe aus Eiche | Projekt Edingen",
    metaDescription:
      "Gewendelte Treppe mit Eiche-Stufen, geschwungener weißer Wandscheibe mit integriertem Stauraum und LED-Stufenbeleuchtung — von Alignum in Edingen-Neckarhausen.",
    summary:
      "Gewendelte Treppe mit Eiche-Stufen, einer geschwungenen weißen Wandscheibe mit verborgenem Stauraum und LED-Stufenbeleuchtung – gefertigt in Edingen-Neckarhausen.",
    body: [
      "Für ein Haus in Edingen-Neckarhausen haben wir eine gewendelte Treppe mit einer markanten, geschwungenen Wandscheibe gebaut. Die weiße Scheibe folgt elegant dem Treppenlauf, fasst ihn seitlich ein und nimmt zugleich verborgenen Stauraum auf.",
      "Die Stufen sind aus massiver Eiche mit lebendiger Maserung gefertigt, in die Setzstufen ist eine indirekte LED-Beleuchtung eingelassen, die die Treppe abends weich erleuchtet. Die geschwungene Wandscheibe verbirgt hinter grifflosen Klappen Stauraum, der die sonst ungenutzte Fläche unter der Treppe nutzbar macht.",
      "Eiche ist für Treppenstufen das ideale Holz: hart, abriebfest und mit einem warmen Maserbild, das jeden Tritt aushält und dabei schön bleibt. Gegen das Weiß der Wandscheibe wirkt es besonders edel.",
      "Geplant, gefertigt und montiert haben wir Treppe und Wandscheibe aus unserer Werkstatt in Edingen-Neckarhausen – mit Statikplanung und millimetergenauem Einbau.",
    ],
    features: [
      "Gewendelte Treppe mit massiven Eiche-Stufen",
      "Geschwungene weiße Wandscheibe als Blickfang",
      "Verborgener Stauraum unter der Treppe",
      "Indirekte LED-Stufenbeleuchtung",
      "Warmer Holz-Weiß-Kontrast",
      "Statikplanung, Fertigung und Einbau in Edingen-Neckarhausen",
    ],
    year: 2025,
    images: [
      "/images/projects/treppe-wandscheibe-edingen-eiche/treppe-wandscheibe-edingen-eiche-05.jpg",
      "/images/projects/treppe-wandscheibe-edingen-eiche/treppe-wandscheibe-edingen-eiche-01.jpg",
      "/images/projects/treppe-wandscheibe-edingen-eiche/treppe-wandscheibe-edingen-eiche-02.jpg",
      "/images/projects/treppe-wandscheibe-edingen-eiche/treppe-wandscheibe-edingen-eiche-03.jpg",
      "/images/projects/treppe-wandscheibe-edingen-eiche/treppe-wandscheibe-edingen-eiche-04.jpg",
      "/images/projects/treppe-wandscheibe-edingen-eiche/treppe-wandscheibe-edingen-eiche-06.jpg",
    ],
    cover:
      "/images/projects/treppe-wandscheibe-edingen-eiche/treppe-wandscheibe-edingen-eiche-05.jpg",
  },
  {
    slug: "treppe-wandscheibe-mannheim-eiche",
    city: "schreinerei-mannheim",
    service: "treppenbau-in-der-nahe",
    material: "stiel-eiche",
    title: "Treppe mit Wandscheibe aus Eiche — Projekt Mannheim",
    metaTitle: "Treppe mit Wandscheibe aus Eiche | Projekt Mannheim",
    metaDescription:
      "Halbgewendelte Treppe mit Eiche-Stufen, weißen Setzstufen und einer raumteilenden weißen Wandscheibe — von Alignum für einen Kunden in Mannheim.",
    summary:
      "Halbgewendelte Treppe mit warmen Eiche-Stufen, weißen Setzstufen und einer raumteilenden weißen Wandscheibe – klare Linien, viel Licht. Gefertigt für einen Kunden in Mannheim.",
    body: [
      "Für ein Haus in Mannheim haben wir eine halbgewendelte Treppe mit einer raumteilenden Wandscheibe gebaut, die die beiden Treppenläufe trennt und dem Treppenhaus eine klare, ruhige Struktur gibt.",
      "Die Trittstufen sind aus massiver Eiche gefertigt und sitzen auf weißen Setzstufen – ein klarer, zweifarbiger Aufbau, der die Treppe leicht und grafisch wirken lässt. Die weiße Wandscheibe übernimmt zugleich die Funktion des Geländers und hält den Treppenlauf optisch offen.",
      "Eiche ist die Königin unter den Treppenhölzern: hart, langlebig und mit einer warmen, lebendigen Maserung, die jeden Tritt aushält. Gegen das klare Weiß der Setzstufen und der Wandscheibe kommt das Holz besonders schön zur Geltung.",
      "Geplant, gefertigt und montiert haben wir Treppe und Wandscheibe aus unserer Werkstatt in Edingen-Neckarhausen – mit Statikplanung und passgenauem Einbau in Mannheim.",
    ],
    features: [
      "Halbgewendelte Treppe mit massiven Eiche-Stufen",
      "Weiße Setzstufen für einen klaren, grafischen Aufbau",
      "Raumteilende weiße Wandscheibe statt klassischem Geländer",
      "Offener, leichter Treppenlauf",
      "Warmer Holz-Weiß-Kontrast",
      "Statikplanung, Fertigung und Einbau in Mannheim",
    ],
    year: 2025,
    images: [
      "/images/projects/treppe-wandscheibe-mannheim-eiche/treppe-wandscheibe-mannheim-eiche-10.jpg",
      "/images/projects/treppe-wandscheibe-mannheim-eiche/treppe-wandscheibe-mannheim-eiche-07.jpg",
      "/images/projects/treppe-wandscheibe-mannheim-eiche/treppe-wandscheibe-mannheim-eiche-01.jpg",
      "/images/projects/treppe-wandscheibe-mannheim-eiche/treppe-wandscheibe-mannheim-eiche-02.jpg",
      "/images/projects/treppe-wandscheibe-mannheim-eiche/treppe-wandscheibe-mannheim-eiche-03.jpg",
      "/images/projects/treppe-wandscheibe-mannheim-eiche/treppe-wandscheibe-mannheim-eiche-04.jpg",
      "/images/projects/treppe-wandscheibe-mannheim-eiche/treppe-wandscheibe-mannheim-eiche-05.jpg",
      "/images/projects/treppe-wandscheibe-mannheim-eiche/treppe-wandscheibe-mannheim-eiche-06.jpg",
      "/images/projects/treppe-wandscheibe-mannheim-eiche/treppe-wandscheibe-mannheim-eiche-08.jpg",
      "/images/projects/treppe-wandscheibe-mannheim-eiche/treppe-wandscheibe-mannheim-eiche-09.jpg",
    ],
    cover:
      "/images/projects/treppe-wandscheibe-mannheim-eiche/treppe-wandscheibe-mannheim-eiche-10.jpg",
  },
  {
    slug: "balkon-sichtschutz-mannheim-laerche",
    city: "schreinerei-mannheim",
    service: "regale-und-raumtrenner",
    material: "laerche",
    title: "Balkon-Sichtschutz aus Lärche — Projekt Mannheim",
    metaTitle: "Balkon-Sichtschutz aus Lärche nach Maß | Mannheim",
    metaDescription:
      "Vertikaler Lamellen-Sichtschutz aus Lärche für Balkon und Terrasse, wetterfest und lichtdurchlässig — von Alignum für einen Kunden in Mannheim.",
    summary:
      "Vertikaler Lamellen-Sichtschutz aus Lärche für Balkon und Terrasse – wetterfest, blickdicht und doch licht- und luftdurchlässig. Gefertigt für einen Kunden in Mannheim.",
    body: [
      "Für eine Terrasse in Mannheim haben wir einen Sichtschutz aus Lärche gefertigt, der vor Blicken schützt, ohne den Raum abzuriegeln. Vom Wohnzimmer aus betrachtet rahmt er den Ausblick ins Grüne und gibt der Terrasse einen ruhigen, natürlichen Abschluss.",
      "Der Sichtschutz besteht aus schmalen, vertikalen Lärchen-Lamellen mit gleichmäßigen Abständen. So bleibt er blickdicht, lässt aber Licht und Luft hindurch – kein massiver Riegel, sondern ein leichtes, gegliedertes Element, das den Außenbereich strukturiert.",
      "Lärche ist für den Außenbereich das ideale heimische Holz: harzreich, von Natur aus witterungsbeständig und mit einer warmen Tönung, die mit der Zeit silbrig-edel vergraut, wenn man sie lässt. Genau richtig für ein Element, das ganzjährig draußen steht.",
      "Gefertigt haben wir den Sichtschutz in unserer Werkstatt in Edingen-Neckarhausen und vor Ort in Mannheim montiert.",
    ],
    features: [
      "Vertikaler Lamellen-Sichtschutz aus Lärche",
      "Blickdicht, dabei licht- und luftdurchlässig",
      "Witterungsbeständiges, harzreiches Lärchenholz",
      "Strukturierter, natürlicher Terrassen-Abschluss",
      "Optional natürlich vergrauend",
      "Fertigung und Montage in Mannheim",
    ],
    year: 2025,
    images: [
      "/images/projects/balkon-sichtschutz-mannheim-laerche/balkon-sichtschutz-mannheim-laerche-01.jpg",
      "/images/projects/balkon-sichtschutz-mannheim-laerche/balkon-sichtschutz-mannheim-laerche-02.jpg",
      "/images/projects/balkon-sichtschutz-mannheim-laerche/balkon-sichtschutz-mannheim-laerche-03.jpg",
      "/images/projects/balkon-sichtschutz-mannheim-laerche/balkon-sichtschutz-mannheim-laerche-04.jpg",
      "/images/projects/balkon-sichtschutz-mannheim-laerche/balkon-sichtschutz-mannheim-laerche-05.jpg",
      "/images/projects/balkon-sichtschutz-mannheim-laerche/balkon-sichtschutz-mannheim-laerche-06.jpg",
      "/images/projects/balkon-sichtschutz-mannheim-laerche/balkon-sichtschutz-mannheim-laerche-07.jpg",
      "/images/projects/balkon-sichtschutz-mannheim-laerche/balkon-sichtschutz-mannheim-laerche-08.jpg",
      "/images/projects/balkon-sichtschutz-mannheim-laerche/balkon-sichtschutz-mannheim-laerche-09.jpg",
    ],
    cover:
      "/images/projects/balkon-sichtschutz-mannheim-laerche/balkon-sichtschutz-mannheim-laerche-01.jpg",
  },
  {
    slug: "shoji-einbauschrank-schriesheim-ahorn",
    city: "schreinerei-schriesheim",
    service: "shoji",
    material: "ahorn",
    title: "Shoji-Einbauschrank aus Ahorn — Projekt Schriesheim",
    metaTitle: "Shoji-Einbauschrank aus Ahorn | Projekt Schriesheim",
    metaDescription:
      "Einbauschrank mit Shoji-Schiebetüren aus hellem Ahorn, Washi-Bespannung und floralem Kumiko-Motiv — von Alignum für einen Kunden in Schriesheim.",
    summary:
      "Einbauschrank mit Shoji-Schiebetüren aus hellem Ahorn und Washi-Bespannung – mit einem feinen floralen Kumiko-Motiv als handwerklichem Akzent. Für einen Kunden in Schriesheim.",
    body: [
      "Für einen Kunden in Schriesheim haben wir einen Einbauschrank mit Shoji-Schiebetüren gefertigt – eine Lösung, die Stauraum verschließt und dabei wie ein Stück japanische Architektur wirkt, nicht wie eine Schrankwand.",
      "Die raumhohen Schiebeelemente sind aus hellem Ahorn gearbeitet und mit transluzentem Washi bespannt. In das feine Sprossenraster haben wir ein florales Kumiko-Motiv eingearbeitet – einzelne blattförmige Holzfiguren, die als ruhiger, handwerklicher Akzent im Raster sitzen. Trifft Licht auf die Bespannung, leuchtet die ganze Front sanft auf.",
      "Ahorn ist für Shoji die erste Wahl unter den heimischen Hölzern: cremig-hell, fein gemasert und so zurückhaltend, dass die Rahmen optisch hinter die Bespannung zurücktreten. Genau diese Ruhe braucht ein Shoji-Element.",
      "Gefertigt und bespannt haben wir die Elemente in unserer Werkstatt in Edingen-Neckarhausen und in Schriesheim auf den Laufschienen montiert.",
    ],
    features: [
      "Einbauschrank mit raumhohen Shoji-Schiebetüren",
      "Heller Ahorn-Rahmen mit feinem Sprossenraster",
      "Transluzente Washi-Bespannung",
      "Florales Kumiko-Motiv als handwerklicher Akzent",
      "Grifflose, ruhige Schiebefront",
      "Fertigung und Montage in Schriesheim",
    ],
    images: [
      "/images/projects/shoji-einbauschrank-schriesheim-ahorn/shoji-einbauschrank-schriesheim-ahorn-01.jpg",
      "/images/projects/shoji-einbauschrank-schriesheim-ahorn/shoji-einbauschrank-schriesheim-ahorn-02.jpg",
      "/images/projects/shoji-einbauschrank-schriesheim-ahorn/shoji-einbauschrank-schriesheim-ahorn-03.jpg",
      "/images/projects/shoji-einbauschrank-schriesheim-ahorn/shoji-einbauschrank-schriesheim-ahorn-04.jpg",
      "/images/projects/shoji-einbauschrank-schriesheim-ahorn/shoji-einbauschrank-schriesheim-ahorn-05.jpg",
      "/images/projects/shoji-einbauschrank-schriesheim-ahorn/shoji-einbauschrank-schriesheim-ahorn-06.jpg",
      "/images/projects/shoji-einbauschrank-schriesheim-ahorn/shoji-einbauschrank-schriesheim-ahorn-07.jpg",
      "/images/projects/shoji-einbauschrank-schriesheim-ahorn/shoji-einbauschrank-schriesheim-ahorn-08.jpg",
      "/images/projects/shoji-einbauschrank-schriesheim-ahorn/shoji-einbauschrank-schriesheim-ahorn-09.jpg",
      "/images/projects/shoji-einbauschrank-schriesheim-ahorn/shoji-einbauschrank-schriesheim-ahorn-10.jpg",
    ],
    cover:
      "/images/projects/shoji-einbauschrank-schriesheim-ahorn/shoji-einbauschrank-schriesheim-ahorn-01.jpg",
  },
  {
    slug: "shoji-kleiderschrank-mannheim-ahorn",
    city: "schreinerei-mannheim",
    service: "shoji",
    material: "ahorn",
    title: "Shoji-Kleiderschrank aus Ahorn — Projekt Mannheim",
    metaTitle: "Shoji-Kleiderschrank aus Ahorn | Projekt Mannheim",
    metaDescription:
      "Raumhoher Kleiderschrank mit Shoji-Schiebetüren aus Ahorn und Washi-Bespannung, mit offenem Ahorn-Regal kombiniert — von Alignum für einen Kunden in Mannheim.",
    summary:
      "Raumhoher Kleiderschrank mit Shoji-Schiebetüren aus Ahorn und Washi-Bespannung, kombiniert mit einem offenen Ahorn-Regal – Stauraum, der ein Zimmer beruhigt. Für einen Kunden in Mannheim.",
    body: [
      "Für ein Schlafzimmer unter einer Dachschräge in Mannheim haben wir einen raumhohen Kleiderschrank mit Shoji-Schiebetüren gebaut, der die ganze Wand nutzt und dem Raum zugleich eine ruhige, japanisch inspirierte Atmosphäre gibt.",
      "Die Schiebetüren sind aus hellem Ahorn gefertigt und mit transluzentem Washi bespannt – das klassische Shoji-Raster gliedert die Front in ruhige Felder. Angrenzend haben wir ein offenes Ahorn-Regal eingebaut, das sich der Dachschräge anpasst und den Schrank zur kompletten Wandlösung ergänzt. Geschlossen wirkt die Front leicht und hell, geöffnet gleiten die Türen geräuschlos zur Seite.",
      "Ahorn hält das Ensemble hell und ruhig: cremig-weiß, fein gemasert, ideal für ein Schlafzimmer, das entschleunigen soll. Schrank und Regal sind aus demselben Holz, sodass die ganze Wand wie aus einem Guss wirkt.",
      "Gefertigt und bespannt haben wir alles in unserer Werkstatt in Edingen-Neckarhausen und in Mannheim passgenau unter die Dachschräge montiert.",
    ],
    features: [
      "Raumhoher Kleiderschrank mit Shoji-Schiebetüren",
      "Heller Ahorn-Rahmen mit Washi-Bespannung",
      "Klassisches Shoji-Sprossenraster",
      "Kombiniert mit offenem, schrägenangepasstem Ahorn-Regal",
      "Geräuschlos gleitende, grifflose Front",
      "Fertigung und Montage in Mannheim",
    ],
    images: [
      "/images/projects/shoji-kleiderschrank-mannheim-ahorn/shoji-kleiderschrank-mannheim-ahorn-10.jpg",
      "/images/projects/shoji-kleiderschrank-mannheim-ahorn/shoji-kleiderschrank-mannheim-ahorn-08.jpg",
      "/images/projects/shoji-kleiderschrank-mannheim-ahorn/shoji-kleiderschrank-mannheim-ahorn-01.jpg",
      "/images/projects/shoji-kleiderschrank-mannheim-ahorn/shoji-kleiderschrank-mannheim-ahorn-02.jpg",
      "/images/projects/shoji-kleiderschrank-mannheim-ahorn/shoji-kleiderschrank-mannheim-ahorn-03.jpg",
      "/images/projects/shoji-kleiderschrank-mannheim-ahorn/shoji-kleiderschrank-mannheim-ahorn-04.jpg",
      "/images/projects/shoji-kleiderschrank-mannheim-ahorn/shoji-kleiderschrank-mannheim-ahorn-05.jpg",
      "/images/projects/shoji-kleiderschrank-mannheim-ahorn/shoji-kleiderschrank-mannheim-ahorn-06.jpg",
      "/images/projects/shoji-kleiderschrank-mannheim-ahorn/shoji-kleiderschrank-mannheim-ahorn-07.jpg",
      "/images/projects/shoji-kleiderschrank-mannheim-ahorn/shoji-kleiderschrank-mannheim-ahorn-09.jpg",
    ],
    cover:
      "/images/projects/shoji-kleiderschrank-mannheim-ahorn/shoji-kleiderschrank-mannheim-ahorn-10.jpg",
  },
  {
    slug: "shoji-oberlicht-roteiche",
    city: "schreinerei-edingen-neckarhausen",
    service: "shoji",
    title: "Shoji-Oberlicht aus Roteiche — Projekt aus unserer Werkstatt",
    metaTitle: "Shoji-Oberlicht aus Roteiche nach Maß | Alignum",
    metaDescription:
      "Festverglastes Oberlicht mit Roteiche-Rahmen, an die Dachschräge angepasst, das Licht in einen innenliegenden Raum holt — gefertigt von Alignum in Edingen-Neckarhausen.",
    summary:
      "Festverglastes Oberlicht mit Roteiche-Rahmen, an die Dachschräge angepasst – holt Tageslicht aus dem Nachbarraum in einen sonst fensterlosen Bereich.",
    body: [
      "Ein innenliegender Raum ohne eigenes Fenster wirkt schnell dunkel und abgeschlossen. Für genau diese Situation haben wir ein festverglastes Oberlicht mit Roteiche-Rahmen gefertigt, das hoch oben in der Wand sitzt und Tageslicht aus dem hellen Nachbarraum hereinholt.",
      "Der Rahmen ist passgenau an die schräge Decke angearbeitet, sodass das Oberlicht der Dachneigung folgt und wie selbstverständlich in die Wand gehört. Die Roteiche ist sauber profiliert und geölt; das Glas sitzt rahmenbündig und gibt den Blick zur Decke des Nachbarraums frei, ohne Einblick in Augenhöhe.",
      "Roteiche bringt eine warme, leicht rötliche Tönung mit, die dem schlichten weißen Raum einen freundlichen Akzent gibt. Das harte Holz lässt sich präzise profilieren und bleibt über Jahrzehnte formstabil.",
      "Geplant, gefertigt und eingebaut haben wir das Oberlicht in unserer Werkstatt in Edingen-Neckarhausen – eine kleine, aber wirkungsvolle Lösung für mehr Licht im Innenraum.",
    ],
    features: [
      "Festverglastes Oberlicht mit Roteiche-Rahmen",
      "An die Dachschräge angepasste Form",
      "Holt Tageslicht in fensterlose Innenräume",
      "Profilierter, geölter Massivholzrahmen",
      "Rahmenbündige Verglasung",
      "Gefertigt in Edingen-Neckarhausen",
    ],
    images: [
      "/images/projects/shoji-oberlicht-roteiche/shoji-oberlicht-roteiche-01.jpg",
      "/images/projects/shoji-oberlicht-roteiche/shoji-oberlicht-roteiche-02.jpg",
      "/images/projects/shoji-oberlicht-roteiche/shoji-oberlicht-roteiche-03.jpg",
      "/images/projects/shoji-oberlicht-roteiche/shoji-oberlicht-roteiche-04.jpg",
      "/images/projects/shoji-oberlicht-roteiche/shoji-oberlicht-roteiche-05.jpg",
      "/images/projects/shoji-oberlicht-roteiche/shoji-oberlicht-roteiche-06.jpg",
      "/images/projects/shoji-oberlicht-roteiche/shoji-oberlicht-roteiche-07.jpg",
      "/images/projects/shoji-oberlicht-roteiche/shoji-oberlicht-roteiche-08.jpg",
      "/images/projects/shoji-oberlicht-roteiche/shoji-oberlicht-roteiche-09.jpg",
      "/images/projects/shoji-oberlicht-roteiche/shoji-oberlicht-roteiche-10.jpg",
    ],
    cover:
      "/images/projects/shoji-oberlicht-roteiche/shoji-oberlicht-roteiche-01.jpg",
  },
  {
    slug: "shoji-schrank-kernbuche",
    city: "schreinerei-edingen-neckarhausen",
    service: "shoji",
    material: "buche",
    title: "Schrank aus Kernbuche mit Shoji-Front — Werkstatt-Projekt",
    metaTitle: "Schrank aus Kernbuche mit Shoji-Front | Alignum",
    metaDescription:
      "Regalschrank aus Kernbuche mit verdeckten Shoji-Schiebetüren und handgezinkten Massivholz-Schubladen — gefertigt von Alignum in Edingen-Neckarhausen.",
    summary:
      "Regalschrank aus warmer Kernbuche mit Shoji-Schiebefront und handgezinkten Massivholz-Schubladen – sichtbares Handwerk bis ins kleinste Detail.",
    body: [
      "Für ein Wohnzimmer haben wir einen großzügigen Regalschrank aus Kernbuche gefertigt, dessen offene Fächer sich hinter Shoji-Schiebetüren verbergen lassen – offen als Bücher- und Sammlerregal, geschlossen als ruhige, lichtdurchlässige Wand.",
      "Das Innenleben zeigt, worauf wir stolz sind: massive Kernbuche-Böden, verstellbar, und Schubladen, die vollständig aus Massivholz und von Hand gezinkt sind. Die sichtbaren Schwalbenschwanz-Verbindungen an den Schubladen sind kein Zierrat, sondern klassische Schreinerkunst – eine Verbindung, die ein Möbelleben lang hält.",
      "Kernbuche ist eine besonders lebendige Variante der Buche: mit warmen, rötlich-braunen Kernzonen, die dem Möbel Charakter geben. Das Holz ist hart, dicht und nimmt die feinen Verbindungen präzise auf.",
      "Gefertigt haben wir den Schrank komplett in unserer Werkstatt in Edingen-Neckarhausen – ein Stück, an dem man die Handarbeit an jeder Schublade ablesen kann.",
    ],
    features: [
      "Regalschrank aus warmer Kernbuche",
      "Verdeckbare Shoji-Schiebefront",
      "Handgezinkte Massivholz-Schubladen (Schwalbenschwanz)",
      "Verstellbare Massivholz-Böden",
      "Sichtbares Schreinerhandwerk bis ins Detail",
      "Gefertigt in Edingen-Neckarhausen",
    ],
    images: [
      "/images/projects/shoji-schrank-kernbuche/shoji-schrank-kernbuche-10.jpg",
      "/images/projects/shoji-schrank-kernbuche/shoji-schrank-kernbuche-09.jpg",
      "/images/projects/shoji-schrank-kernbuche/shoji-schrank-kernbuche-01.jpg",
      "/images/projects/shoji-schrank-kernbuche/shoji-schrank-kernbuche-02.jpg",
      "/images/projects/shoji-schrank-kernbuche/shoji-schrank-kernbuche-03.jpg",
      "/images/projects/shoji-schrank-kernbuche/shoji-schrank-kernbuche-04.jpg",
      "/images/projects/shoji-schrank-kernbuche/shoji-schrank-kernbuche-05.jpg",
      "/images/projects/shoji-schrank-kernbuche/shoji-schrank-kernbuche-06.jpg",
      "/images/projects/shoji-schrank-kernbuche/shoji-schrank-kernbuche-07.jpg",
      "/images/projects/shoji-schrank-kernbuche/shoji-schrank-kernbuche-08.jpg",
    ],
    cover:
      "/images/projects/shoji-schrank-kernbuche/shoji-schrank-kernbuche-10.jpg",
  },
  {
    slug: "shoji-garderobenschrank-raeuchereiche",
    city: "schreinerei-edingen-neckarhausen",
    service: "shoji",
    title: "Shoji-Garderobenschrank aus Räuchereiche — Werkstatt-Projekt",
    metaTitle: "Shoji-Garderobenschrank aus Räuchereiche | Alignum",
    metaDescription:
      "Einbauschrank mit Shoji-Schiebetüren aus dunkler Räuchereiche und Washi-Bespannung, innen Eiche-Schubladen — gefertigt von Alignum in Edingen-Neckarhausen.",
    summary:
      "Einbauschrank mit Shoji-Schiebetüren aus dunkler Räuchereiche und Washi-Bespannung – ein dramatischer Kontrast aus tiefem Holz und hellem Reispapier. Innen Eiche-Schubladen.",
    body: [
      "Wer Shoji mit dunklem Holz kombiniert, bekommt ein ganz anderes, dramatischeres Bild als die klassisch helle Variante. Für dieses Stück haben wir einen Einbauschrank mit Shoji-Schiebetüren aus Räuchereiche gefertigt – tiefdunkles Holz, das das helle Washi-Papier förmlich aufleuchten lässt.",
      "Die raumhohen Schiebeelemente tragen ein feines schwarzbraunes Sprossenraster aus Räuchereiche, dahinter transluzentes Washi. Hinter den Türen sitzen helle Eiche-Schubladen und Fächer – der Kontrast zwischen dunkler Front und hellem Innenleben macht jedes Öffnen zum Moment.",
      "Räuchereiche entsteht, wenn Eiche unter Ammoniak ausräuchert und dabei von innen heraus nachdunkelt – das Ergebnis ist ein tiefes, warmes Braun mit der ganzen Härte und Langlebigkeit der Eiche. Gegen das helle Reispapier ergibt das einen besonders edlen, ruhigen Kontrast.",
      "Gefertigt und bespannt haben wir den Schrank in unserer Werkstatt in Edingen-Neckarhausen – eine moderne, dunkle Interpretation der jahrhundertealten Shoji-Idee.",
    ],
    features: [
      "Einbauschrank mit Shoji-Schiebetüren aus Räuchereiche",
      "Dunkles Sprossenraster mit transluzentem Washi",
      "Heller Kontrast innen: Eiche-Schubladen und -Fächer",
      "Tiefdunkles, durchgeräuchertes Eichenholz",
      "Grifflose, geräuschlos gleitende Front",
      "Gefertigt in Edingen-Neckarhausen",
    ],
    images: [
      "/images/projects/shoji-garderobenschrank-raeuchereiche/shoji-garderobenschrank-raeuchereiche-01.jpg",
      "/images/projects/shoji-garderobenschrank-raeuchereiche/shoji-garderobenschrank-raeuchereiche-02.jpg",
      "/images/projects/shoji-garderobenschrank-raeuchereiche/shoji-garderobenschrank-raeuchereiche-03.jpg",
      "/images/projects/shoji-garderobenschrank-raeuchereiche/shoji-garderobenschrank-raeuchereiche-04.jpg",
      "/images/projects/shoji-garderobenschrank-raeuchereiche/shoji-garderobenschrank-raeuchereiche-05.jpg",
      "/images/projects/shoji-garderobenschrank-raeuchereiche/shoji-garderobenschrank-raeuchereiche-06.jpg",
      "/images/projects/shoji-garderobenschrank-raeuchereiche/shoji-garderobenschrank-raeuchereiche-07.jpg",
      "/images/projects/shoji-garderobenschrank-raeuchereiche/shoji-garderobenschrank-raeuchereiche-08.jpg",
      "/images/projects/shoji-garderobenschrank-raeuchereiche/shoji-garderobenschrank-raeuchereiche-09.jpg",
      "/images/projects/shoji-garderobenschrank-raeuchereiche/shoji-garderobenschrank-raeuchereiche-10.jpg",
    ],
    cover:
      "/images/projects/shoji-garderobenschrank-raeuchereiche/shoji-garderobenschrank-raeuchereiche-01.jpg",
  },
  {
    slug: "shoji-schiebetuer-maxdorf-zeder",
    city: "schreinerei-maxdorf",
    service: "shoji",
    title: "Shoji-Schiebewand aus Zeder — Projekt Maxdorf",
    metaTitle: "Shoji-Schiebewand aus Zeder | Projekt Maxdorf",
    metaDescription:
      "Dreiteilige raumhohe Shoji-Schiebewand aus Zeder mit Washi-Bespannung und klassischem Sprossenraster — von Alignum für einen Kunden in Maxdorf.",
    summary:
      "Dreiteilige, raumhohe Shoji-Schiebewand aus warmer Zeder mit Washi-Bespannung und klassischem Sprossenraster – teilt den Raum, ohne ihn zu verschließen. Für einen Kunden in Maxdorf.",
    body: [
      "Für einen Kunden in Maxdorf haben wir eine raumhohe Shoji-Schiebewand aus Zeder gefertigt, die einen offenen Wohnbereich gliedert, ohne ihn hart zu trennen. Geöffnet verschwindet die Wand fast, geschlossen schafft sie einen ruhigen, abgeschirmten Bereich.",
      "Drei raumhohe Schiebeelemente laufen auf mehreren Spuren hintereinander und lassen sich flexibel zusammenschieben. Die Rahmen sind aus Zeder mit ihrer warmen, gold-bräunlichen Tönung gearbeitet, das klassische Sprossenraster gliedert die transluzente Washi-Bespannung in ruhige Felder. Fällt Licht auf die Wand, leuchtet sie sanft und taucht den Raum in weiches Licht.",
      "Zeder ist ein wunderbares Holz für Shoji: leicht, aromatisch und mit einer warmen Farbe, die der Schiebewand sofort Charakter gibt. Das geringe Gewicht kommt den raumhohen Schiebeelementen zugute – sie gleiten besonders leichtgängig.",
      "Gefertigt und bespannt haben wir die Schiebewand in unserer Werkstatt in Edingen-Neckarhausen und in Maxdorf auf den Laufschienen montiert.",
    ],
    features: [
      "Dreiteilige, raumhohe Shoji-Schiebewand aus Zeder",
      "Mehrspurige Laufschienen, flexibel verschiebbar",
      "Transluzente Washi-Bespannung",
      "Klassisches Sprossenraster, warme Zeder-Tönung",
      "Teilt den Raum, ohne ihn zu verschließen",
      "Fertigung und Montage in Maxdorf",
    ],
    images: [
      "/images/projects/shoji-schiebetuer-maxdorf-zeder/shoji-schiebetuer-maxdorf-zeder-01.jpg",
      "/images/projects/shoji-schiebetuer-maxdorf-zeder/shoji-schiebetuer-maxdorf-zeder-02.jpg",
      "/images/projects/shoji-schiebetuer-maxdorf-zeder/shoji-schiebetuer-maxdorf-zeder-03.jpg",
      "/images/projects/shoji-schiebetuer-maxdorf-zeder/shoji-schiebetuer-maxdorf-zeder-04.jpg",
      "/images/projects/shoji-schiebetuer-maxdorf-zeder/shoji-schiebetuer-maxdorf-zeder-05.jpg",
      "/images/projects/shoji-schiebetuer-maxdorf-zeder/shoji-schiebetuer-maxdorf-zeder-06.jpg",
      "/images/projects/shoji-schiebetuer-maxdorf-zeder/shoji-schiebetuer-maxdorf-zeder-07.jpg",
      "/images/projects/shoji-schiebetuer-maxdorf-zeder/shoji-schiebetuer-maxdorf-zeder-08.jpg",
      "/images/projects/shoji-schiebetuer-maxdorf-zeder/shoji-schiebetuer-maxdorf-zeder-09.jpg",
      "/images/projects/shoji-schiebetuer-maxdorf-zeder/shoji-schiebetuer-maxdorf-zeder-10.jpg",
    ],
    cover:
      "/images/projects/shoji-schiebetuer-maxdorf-zeder/shoji-schiebetuer-maxdorf-zeder-01.jpg",
  },
  {
    slug: "tisch-kommode-hochhausen-eiche",
    city: "schreinerei-hassmersheim",
    service: "tische-und-stuehle",
    material: "stiel-eiche",
    woodLabel: "Wildeiche",
    builtLabel: "Esstisch & Kommode",
    establishingImage:
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-01.jpg",
    title: "Esstisch und Kommoden aus Wildeiche — Projekt Hochhausen",
    metaTitle: "Esstisch aus Wildeiche nach Maß | Projekt Hochhausen",
    metaDescription:
      "Massiver Esstisch aus Wildeiche mit Baumkante auf X-Stahlgestell, dazu ein passendes Sideboard aus Anthrazit und Wildeiche — von Alignum für einen Kunden in Hochhausen am Neckar (Haßmersheim).",
    summary:
      "Massiver Esstisch aus Wildeiche mit Baumkante auf einem X-förmigen Stahlgestell, dazu ein passendes Sideboard aus Anthrazit und Wildeiche – ein Ensemble aus einer Hand für einen Kunden in Hochhausen am Neckar bei Haßmersheim.",
    body: [
      "Für einen Kunden in Hochhausen am Neckar bei Haßmersheim haben wir ein ganzes Ensemble aus Wildeiche gefertigt: einen großen Esstisch und dazu passende Kommoden, alle aus demselben Holz und in derselben Handschrift.",
      "Die Tischplatte zeigt die Eiche in ihrer wildesten, ehrlichsten Form – mit lebendigen Astbildern, natürlichen Rissen und einer sichtbaren Baumkante. Getragen wird die schwere Platte von einem markanten X-förmigen Stahlgestell, das einen klaren, modernen Kontrast zum rustikalen Holz setzt. Das passende Sideboard kombiniert einen anthrazitfarbenen Korpus mit Fronten aus Wildeiche und beleuchteten Nischen – gleiches Holz, gleiche Handschrift.",
      "Wildeiche ist für Liebhaber gemacht: Wo andere Hölzer Äste und Risse verstecken, feiert die Wildeiche sie. Jede Platte ist ein Unikat, das sich nicht wiederholen lässt – geölt fühlt sich die Oberfläche warm und lebendig an.",
      "Gefertigt haben wir Tisch und Kommoden in unserer Werkstatt in Edingen-Neckarhausen und nach Hochhausen am Neckar geliefert – ein aufeinander abgestimmtes Ensemble aus einer Hand.",
    ],
    features: [
      "Massiver Esstisch aus Wildeiche mit Baumkante",
      "Markantes X-förmiges Stahlgestell",
      "Passendes Sideboard: anthrazit + Wildeiche mit beleuchteten Nischen",
      "Lebendiges Astbild – jedes Stück ein Unikat",
      "Tisch und Sideboard aus einer Hand, gleiche Handschrift",
      "Aufmaß, Fertigung und Lieferung nach Hochhausen am Neckar",
    ],
    year: 2025,
    images: [
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-01.jpg",
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-02.jpg",
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-03.jpg",
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-04.jpg",
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-05.jpg",
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-06.jpg",
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-07.jpg",
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-08.jpg",
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-09.jpg",
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-10.jpg",
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-11.jpg",
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-12.jpg",
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-13.jpg",
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-14.jpg",
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-15.jpg",
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-16.jpg",
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-17.jpg",
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-18.jpg",
    ],
    cover:
      "/images/projects/tisch-kommode-hochhausen-eiche/tisch-kommode-hochhausen-eiche-01.jpg",
  },
];

/* ─────────────── Helpers ─────────────── */

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/**
 * Kanonische URL eines Projekts: liegt als Supporting-Content UNTER der
 * jeweiligen City-Page, z.B. /schreinerei-mannheim/fernsehschrank-mannheim-ahorn/.
 * Die alte /projekte/{slug}/-URL leitet per 308 hierher um.
 */
export function projectPath(p: Project): string {
  return `/${p.city}/${p.slug}/`;
}

export function getProjectsByCity(citySlug: string): Project[] {
  return PROJECTS.filter((p) => p.city === citySlug);
}

export function getProjectsByService(serviceSlug: string): Project[] {
  return PROJECTS.filter((p) => p.service === serviceSlug);
}

export function getProjectsByMaterial(materialSlug: string): Project[] {
  return PROJECTS.filter((p) => p.material === materialSlug);
}
