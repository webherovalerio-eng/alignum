import { spin } from "./spintax";
import { type City } from "@/data/cities";

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

export function buildCityClosing(city: City) {
  const seed = `close-${city.slug}`;
  return spin(
    `{Egal ob|Ob nun|Gleich ob} {Küche|Treppe|Tür|Schrank|Bett|Esstisch}, {Massivholzbett|Schiebetür|Shoji|Regal|Sideboard|Kommode} {oder|beziehungsweise|sowie} {Sonderanfertigung|Spezialprojekt|Auftragsarbeit} – {Alignum ist Ihre Schreinerei für|wir sind Ihre Schreiner für|wir sind der Tischlermeister für} ${city.name}. {Lassen Sie uns sprechen|Schreiben Sie uns|Vereinbaren Sie ein Erstgespräch} – {unverbindlich|ohne Verpflichtung|wir freuen uns}.`,
    seed,
  );
}
