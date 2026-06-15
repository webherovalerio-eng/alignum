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
