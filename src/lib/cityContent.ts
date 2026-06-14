import { spin } from "./spintax";
import { hash, mulberry32 } from "./spintax-internals";
import { type City } from "@/data/cities";

/**
 * Display-Title für die City-Hero — visuell die große Headline (rendert
 * als <p>, nicht als <h1>!). Das Haupt-Keyword steckt separat in der H1
 * (siehe CityHero). Hier rotieren wir kreative Varianten pro Stadt,
 * sodass jede City-Page eine andere Hauptzeile bekommt.
 *
 * Rückgabe als { prefix, suffix } damit der city.name als hervorgehobenes
 * <span> dazwischen rendert werden kann.
 */
const DISPLAY_TITLE_TEMPLATES: { prefix: string; suffix: string }[] = [
  { prefix: "Unsere Projekte in", suffix: "" },
  { prefix: "Referenzen in", suffix: "" },
  { prefix: "Wir für", suffix: "" },
  { prefix: "Schreinerei für", suffix: "" },
  { prefix: "Wir kommen nach", suffix: "" },
  { prefix: "Möbel für", suffix: "" },
  { prefix: "Maßarbeit für", suffix: "" },
];

export function buildCityDisplayTitle(city: City): { prefix: string; suffix: string } {
  const rng = mulberry32(hash(`display-${city.slug}`));
  const idx = Math.floor(rng() * DISPLAY_TITLE_TEMPLATES.length);
  return DISPLAY_TITLE_TEMPLATES[idx];
}

/**
 * Body-Text mit Spintax über Alignum-Projekte für die jeweilige Stadt.
 * Wird unter dem H2 in CityIntent verwendet.
 */
export function buildCityProjectsCopy(city: City): string {
  const seed = `projects-${city.slug}`;
  return spin(
    `{Für Kunden aus|Für Auftraggeber in|Für Häuser und Wohnungen in} ${city.name} {haben wir|fertigen wir|bauen wir} {seit Jahren|seit über drei Jahrzehnten|seit Jahrzehnten} {Möbelstücke|Schreiner­arbeiten|Einbauten} {nach Maß|als Unikat|in Massivholz}. {Vom|Vom kleinen|Vom maßgefertigten} {Esstisch über die freitragende Treppe bis zur kompletten Einbauküche|Sideboard über die Innentür bis zum kompletten Bad|Massivholzbett über das Bücherregal bis zur Schiebewand} – {jedes Projekt|jede Arbeit|jedes Stück} {beginnt mit einem|startet mit einem|fängt mit einem} {Aufmaß bei Ihnen vor Ort|persönlichen Gespräch|Besuch bei Ihnen zu Hause}.`,
    seed,
  );
}

/**
 * Spintax-Templates für Alignum City-Pages.
 *
 * WICHTIG (alignum-city-pages Skill): Sprache muss klar machen, dass Alignum
 * NICHT lokal in der Stadt sitzt, sondern dort ARBEITET / LIEFERT / MONTIERT.
 * - „Schreinerei {Stadt}" als Keyword in der H1 – OK
 * - „Schreiner FÜR {Stadt}", „Schreinerei AUS Edingen-Neckarhausen für {Stadt}" – PRÄFERIERT
 * - „Schreinerei IN {Stadt}", „lokal IN {Stadt}", „ansässig IN {Stadt}" – TABU
 */

export function buildCityIntro(city: City) {
  const seed = `intro-${city.slug}`;
  return spin(
    `{Sie suchen|Sie wünschen sich|Sie wollen} {einen Schreiner|eine Schreinerei|einen Tischlermeister-Betrieb} {für|in} ${city.name}, {der|die|das} {bei Ihnen vor Ort arbeitet|Aufmaß und Montage vor Ort übernimmt|persönlich zu Ihnen kommt}? {Alignum|Unsere Werkstatt|Wir bei Alignum} {sitzt|ist ansässig|hat seinen Sitz} in Edingen-Neckarhausen und {fertigt|baut|produziert} {seit über 30 Jahren|seit 1992|seit Jahrzehnten} {Möbel aus Massivholz|maßgefertigte Schreiner­arbeiten|individuelle Massivholzmöbel} {für Kunden in|für Auftraggeber aus|für Häuser und Wohnungen in} ${city.name} und der gesamten Rhein-Neckar-Region.`,
    seed,
  );
}

export function buildCityWhyUs(city: City) {
  const seed = `why-${city.slug}`;
  return spin(
    `{Warum|Weshalb} {Kunden aus|Bauherren aus|Hausbesitzer in} ${city.name} {regelmäßig|immer wieder|gerne} {bei uns anfragen|den Weg zu unserer Werkstatt finden|Alignum beauftragen}? {Drei Gründe|Im Wesentlichen drei Dinge|Im Kern}: {echtes Handwerk|gelebte Schreiner­tradition|kompromissloses Handwerk}, {ehrliche Materialien|ausschließlich Massivholz|heimische Hölzer} {und|sowie} {persönlicher Kontakt|persönliche Betreuung|der direkte Draht zum Meister} – {ohne|kein|null} {Filialen, Verkäufer oder Zwischenhändler|anonyme Beratung|Möbelhaus-Schema}.`,
    seed,
  );
}

export function buildCityArea(city: City) {
  const seed = `area-${city.slug}`;

  return spin(
    `{Von unserer Werkstatt in Edingen-Neckarhausen|Aus Edingen-Neckarhausen|Unsere Werkstatt liegt} {erreichen wir|fahren wir|kommen wir} ${city.name} {im Liefergebiet|in unserem Liefer­radius|in der Region} regelmäßig an. {Diese Anfahrt|Den Weg zu Ihnen|Die Strecke} {fahren wir|legen wir zurück|nehmen wir} {gerne|selbstverständlich|ohne Mehrkosten} – {für das Aufmaß|für ein Beratungs­gespräch|für die Besichtigung} {ebenso|genauso} {wie für|wie zur} {Lieferung und Montage|die Endmontage|den Aufbau bei Ihnen}. {Schreiner­arbeiten für|Möbel für|Auftrags­arbeiten für} ${city.name} {sind für uns Alltag|gehören zu unserem täglichen Geschäft|sind kein Sonderfall}.`,
    seed,
  );
}

/**
 * „Secret Sauce" — keyword-dichter Lauftext am Seitenende (Local-SEO).
 * Eigene Spintax, unabhängig von CityIntent: hebt die Keyword-Density für
 * „Schreinerei {Stadt}" / „Schreiner für {Stadt}" am Ende der Seite, ohne den
 * Lesefluss oben zu stören. Gibt zwei Absätze zurück.
 */
export function buildCitySecretSauce(city: City): string[] {
  const p1 = spin(
    `{Als Schreinerei für|Als Möbelbauer für|Als Tischlermeister-Betrieb für} ${city.name} {planen, fertigen und montieren wir|entwerfen und bauen wir|realisieren wir} {Möbel nach Maß|Massivholzmöbel|individuelle Einbauten} – {von der Küche über die Treppe bis zur Innentür|vom Esstisch bis zur kompletten Raumeinrichtung|vom Einzelstück bis zum kompletten Ausbau}. {Unsere Werkstatt|Der Betrieb|Alignum} {sitzt in|liegt in|arbeitet aus} Edingen-Neckarhausen und {ist von|liegt günstig zu|kommt regelmäßig nach} ${city.name} {schnell zu erreichen|gut angebunden|ins Liefergebiet}.`,
    `sauce1-${city.slug}`,
  );
  const p2 = spin(
    `{Wer in|Wer rund um|Wer im Raum} ${city.name} {einen Schreiner sucht|eine Schreinerei sucht|Möbel nach Maß sucht}, {bekommt bei Alignum|findet bei uns|erhält bei uns} {echtes Handwerk statt Massenware|Massivholz statt Spanplatte|persönliche Beratung statt Möbelhaus}. {Ob|Gleich ob|Egal ob} {Küche, Schrank oder Treppe|Tisch, Tür oder Bett|Bad, Regal oder Schiebewand} – {Schreinerarbeiten für|Maßmöbel für|Tischlerarbeiten für} ${city.name} {sind für uns Alltag|gehören zu unserem täglichen Geschäft|fertigen wir das ganze Jahr}. {Vereinbaren Sie ein unverbindliches Aufmaß|Fragen Sie Ihr Projekt an|Sprechen Sie direkt mit dem Meister} – {wir kommen zu Ihnen nach|wir beraten Sie vor Ort in|wir sind für Sie da in} ${city.name}.`,
    `sauce2-${city.slug}`,
  );
  return [p1, p2];
}

export function buildCityClosing(city: City) {
  const seed = `close-${city.slug}`;
  return spin(
    `{Egal ob|Ob nun|Gleich ob} {Küche|Treppe|Tür|Schrank|Bett|Esstisch}, {Massivholzbett|Schiebetür|Shoji|Regal|Sideboard|Kommode} {oder|beziehungsweise|sowie} {Sonderanfertigung|Spezialprojekt|Auftragsarbeit} – {Alignum ist Ihre Schreinerei für|wir sind Ihre Schreiner für|wir sind der Tischlermeister für} ${city.name}. {Lassen Sie uns sprechen|Schreiben Sie uns|Vereinbaren Sie ein Erstgespräch} – {unverbindlich|ohne Verpflichtung|wir freuen uns}.`,
    seed,
  );
}
