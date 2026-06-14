import { spin } from "./spintax";
import { type City } from "@/data/cities";
import { type CityService } from "@/data/cityServices";

/**
 * Keyword-dichte Spintax-Absätze pro Leistung×Stadt für die City-Service-
 * Landingpages. Jede Stadt bekommt durch den Seed (`{combo}-{citySlug}`)
 * eine eigene Variante → kein Duplicate Content über die 64 Seiten.
 *
 * Sprachregel (alignum-city-pages Skill): Werkstatt in Edingen-Neckarhausen,
 * „für {Stadt}" / „liefern und montieren in {Stadt}" — nie „lokal in {Stadt}".
 */
export function buildCityServiceCopy(city: City, combo: CityService): string[] {
  const c = city.name;
  const seed = `${combo.slug}-${city.slug}`;

  const TEMPLATES: Record<string, string[]> = {
    kuechenbau: [
      `{Eine Schreinerküche für|Eine Massivholzküche für|Eine Küche nach Maß für} ${c} {planen wir|entwerfen wir|fertigen wir} {millimetergenau|exakt auf Ihren Raum|individuell} – {vom intelligenten Stauraum|von der ergonomischen Arbeitshöhe|von der Holzart} bis {zur eingelassenen Technik|zum grifflosen Korpus|zur Arbeitsplatte aus Massivholz}. {Als Küchenbauer und Schreiner für|Als Küchenschreiner für|Als Schreinerei für} ${c} {arbeiten wir|fertigen wir|bauen wir} aus unserer Werkstatt in Edingen-Neckarhausen.`,
      `{Ob|Gleich ob|Egal ob} {Landhausküche, Inselküche oder schlichte Zeile|grifflose Designküche oder klassische Holzküche|kleine Küche oder große Wohnküche} – Ihre Schreinerküche in ${c} {bekommt|erhält|trägt} {echtes Massivholz statt Spanplatte|eine Maserung mit Charakter|geräte führender Marken}. {Wir kommen zum Aufmaß nach|Wir beraten Sie vor Ort in|Wir messen auf in} ${c}, {planen|skizzieren|entwerfen} und {montieren persönlich|bauen ein|liefern und montieren}.`,
    ],
    einbauschrank: [
      `{Einen Einbauschrank für|Schränke nach Maß für|Maßgefertigten Stauraum für} ${c} {konstruieren wir|bauen wir|fertigen wir} so, {dass jede Nische genutzt wird|dass keine Lücke bleibt|als wären sie Teil des Hauses} – {begehbare Ankleiden|raumhohe Schränke|fugenlose Wandschränke} {mit Soft-Close-Beschlägen|mit Markenbeschlägen|in jeder Holzart}. {Schrank nach Maß für|Kleiderschrank nach Maß für|Einbauschränke für} ${c} {ist eine unserer häufigsten Arbeiten|gehört zum Kerngeschäft|fertigen wir laufend}.`,
      `{Wir vermessen|Wir nehmen Maß an|Wir erfassen} {jede Wand, jeden Sockel, jede Schräge in|jede Nische in|den Raum in} ${c} {und planen|, planen|und konstruieren} {Schiebetüren, Schubladen und Innenausstattung|den passenden Ausbau|bis ins Detail}. {Aus unserer Werkstatt in Edingen-Neckarhausen|Aus Edingen-Neckarhausen|Von unserer Werkstatt aus} {liefern und montieren wir|kommen wir zur Montage nach|montieren wir persönlich in} ${c}.`,
    ],
    bueromoebel: [
      `{Büromöbel nach Maß für|Schreibtische und Theken für|Arbeitsplatzmöbel für} ${c} {entwerfen wir|fertigen wir|bauen wir} {ergonomisch und repräsentativ|langlebig und markenprägend|funktional und edel} – {vom höhenverstellbaren Schreibtisch|von der Empfangstheke aus Massivholz|vom Konferenztisch} bis {zum Akustikelement|zum Kabelmanagement|zur kompletten Büroeinrichtung}. {Als Schreiner für Büromöbel in|Als Tischler für Büromöbel in|Als Schreinerei für} ${c} {arbeiten wir aus|fertigen wir in|bauen wir in} Edingen-Neckarhausen.`,
      `{Ein Büro ist ein Werkzeug|Büromöbel werden täglich genutzt|Ein Arbeitsplatz prägt die Marke} – {deshalb|darum|aus diesem Grund} {fertigen wir|bauen wir|planen wir} {robust, ergonomisch und repräsentativ|für Jahre statt Saisons|mit echtem Massivholz}. {Wir kommen zum Aufmaß nach|Wir planen vor Ort in|Wir liefern und montieren in} ${c} – {für Praxen, Kanzleien und Unternehmen|für Home-Office und Großraum|für jede Bürogröße}.`,
    ],
    badmoebel: [
      `{Badmöbel nach Maß für|Wohlfühl-Bäder in Holz für|Schreiner-Badmöbel für} ${c} {verbinden|vereinen|kombinieren} {traditionelles Handwerk mit modernem Design|Wärme mit Wasserfestigkeit|Massivholz mit Funktion} – {freistehende Waschtische|raumhohe Spiegelschränke|Hochschränke und Wellnesseinbauten} {aus Eiche, Nuss oder Teak|mit Spezialoberfläche|nach Ihrem Raum}. {Als Schreiner fürs Bad in|Als Tischler fürs Bad in|Als Schreinerei für} ${c} {fertigen wir in|arbeiten wir aus|bauen wir in} Edingen-Neckarhausen.`,
      `{Holz im Bad|Massivholz im Bad|Echtholz im Bad} {hält|funktioniert|überdauert}, {wenn es richtig verarbeitet wird|mit der richtigen Oberfläche|bei guter Lüftung} – {wir verwenden Hartwachsöle und wasserabweisende Kanten|wir versiegeln fachgerecht|wir wählen die Hölzer mit Bedacht}. {Wir kommen zum Aufmaß nach|Wir planen Ihr Bad in|Wir liefern und montieren in} ${c}.`,
    ],
    treppenbau: [
      `{Eine Treppe für|Holztreppen für|Treppen nach Maß für} ${c} {sind unsere Königsdisziplin|bauen wir als Skulptur|fertigen wir Stufe für Stufe} – {freitragend, gewendelt oder als Faltwerk|in Massivholz oder Holz-Stahl|mit Geländer aus Holz, Glas oder Stahl}. {Als Treppenbauer für|Als Schreiner für Treppen in|Als Treppenbau-Betrieb für} ${c} {planen wir auch die Statik|berechnen wir jedes Geländer|arbeiten wir aus Edingen-Neckarhausen}.`,
      `{Ob Neubau oder Sanierung|Für Neubau und Altbau|Ob neue Treppe oder Aufarbeitung} – {wir passen jede Stufe einzeln ein|wir bauen mit minimalem Eingriff|wir sanieren alte Treppen mit neuen Stufenauflagen}. {Wir kommen zum Aufmaß nach|Wir planen vor Ort in|Wir liefern und montieren in} ${c}, {inklusive Statikplanung|mit verbindlichem Festpreis nach Aufmaß|persönlich durch den Meister}.`,
    ],
    tueren: [
      `{Türen und Innentüren für|Haustüren und Zimmertüren für|Türen nach Maß für} ${c} {fertigen wir passgenau|bauen wir individuell|stellen wir her} – {raumhohe Pivot-Elemente|klassische Innentüren|Haustüren mit RC-2-Sicherheit} {mit hochwertigen Bändern und Schlössern|schwellenfrei und mit Schiebebeschlag|in jeder Oberfläche}. {Als Türenbauer für|Als Schreiner für Türen in|Als Schreinerei für} ${c} {arbeiten wir aus|fertigen wir in|bauen wir in} Edingen-Neckarhausen.`,
      `{Eine Tür entscheidet, wie ein Haus empfängt|Türen prägen den ersten Eindruck|Innentüren gliedern das Zuhause} – {wir bauen sie passgenau|wir fertigen nach Maß|wir restaurieren auch historische Türen}. {Wir kommen zum Aufmaß nach|Wir planen vor Ort in|Wir liefern und montieren in} ${c} – {Haustür, Innentür oder Hoftor|raumhoch oder klassisch|massiv oder mit Glaseinsatz}.`,
    ],
    massivholzbetten: [
      `{Ein Massivholzbett für|Betten nach Maß für|Schlafplätze aus echtem Holz für} ${c} {fertigen wir aus einem Stück|bauen wir ohne Spanplatte|stellen wir mit ehrlichen Verbindungen her} – {mit Kopfteil aus Holz, Leder oder Stoff|in jeder Größe bis Überlänge|mit integriertem Nachttisch oder Bettkasten}. {Als Schreiner für Betten in|Als Tischler für Massivholzbetten in|Als Schreinerei für} ${c} {arbeiten wir aus|fertigen wir in|bauen wir in} Edingen-Neckarhausen.`,
      `{Ein Bett aus Massivholz|Ein echtes Holzbett|Ein Bett vom Schreiner} {ist ein Versprechen|hält ein Leben lang|knarzt nicht}: {heimische Hölzer, atmungsaktiv, schadstofffrei|massiv statt furniert|von Hand gefertigt}. {Wir kommen zum Aufmaß nach|Wir planen vor Ort in|Wir liefern und montieren in} ${c}.`,
    ],
    shoji: [
      `{Shoji für|Japanische Schiebewände für|Shoji-Türen für} ${c} {fertigen wir nach traditioneller Bauweise|bauen wir mit handverleimten Gittern|stellen wir aus Hemlock, Lärche oder Kiefer her} – {bezogen mit echtem Washi-Reispapier aus Japan|mit lichtdurchlässigem, blickdichtem Papier|als Schiebewand, Stellwand oder Fenster-Shoji}. {Als Schreinerei für Shoji in|Als Möbelbauer für} ${c} {arbeiten wir aus|fertigen wir in} Edingen-Neckarhausen.`,
      `{Shoji teilt Räume, ohne sie zu trennen|Shoji lässt Licht weicher fließen als jeder Vorhang|Shoji bringt Ruhe ins Zuhause} – {ob Raumteiler, Kleiderschrank-Front oder Schiebetür|ob klassisch japanisch oder modern westlich|ob ein Element oder eine ganze Wand}. {Wir kommen zum Aufmaß nach|Wir beraten Sie vor Ort in|Wir liefern und montieren in} ${c}.`,
    ],
  };

  const tpl = TEMPLATES[combo.slug] ?? [
    `{Schreiner­arbeiten für|Maßmöbel für|Tischlerarbeiten für} ${c} – {aus unserer Werkstatt in Edingen-Neckarhausen|gefertigt und montiert|nach Maß}.`,
  ];

  return tpl.map((t, i) => spin(t, `${seed}-${i}`));
}
