import { spin } from "./spintax";
import { type City } from "@/data/cities";

export function buildCityIntro(city: City) {
  const seed = `intro-${city.slug}`;
  const intro = spin(
    `{Sie suchen|Sie wollen|Sie wünschen sich} {eine Schreinerei|einen Schreiner|einen Tischlermeister} in ${city.name}, {die|der} {nicht nur sägt, sondern denkt|nicht nur fertigt, sondern gestaltet|jedes Möbel als Unikat versteht}? Bei {Alignum|uns} {bauen wir|fertigen wir|entwickeln wir} {seit über 30 Jahren|seit Jahrzehnten|seit 1992} {Massivholzmöbel|Möbel aus Massivholz|maßgefertigte Möbel} {für Privatkunden|für anspruchsvolle Auftraggeber|für Kunden} in {ganz ${city.name}|${city.name} und Umgebung|${city.name} sowie der gesamten Rhein-Neckar-Region}.`,
    seed,
  );
  return intro;
}

export function buildCityWhyUs(city: City) {
  const seed = `why-${city.slug}`;
  return spin(
    `{Warum|Weshalb} {Kunden|Bauherren|Hausbesitzer} aus ${city.name} {regelmäßig|immer wieder|gerne} {zu uns kommen|in unsere Werkstatt finden|den Weg zu Alignum suchen}? {Drei Gründe|Im Wesentlichen drei Dinge|Im Kern}: {echtes Handwerk|gelebte Schreiner­tradition|kompromissloses Handwerk}, {ehrliche Materialien|ehrliche Hölzer|ausschließlich Massivholz} {und|sowie} {Zeit|Sorgfalt|Geduld} – {drei Dinge|drei Werte|drei Selbstverständlichkeiten}, die {anderswo|in der Branche|im Möbelhandel} {immer seltener werden|kaum noch zu finden sind|leider verschwinden}.`,
    seed,
  );
}

export function buildCityArea(city: City) {
  const seed = `area-${city.slug}`;
  const distance = city.distanceKm ?? 0;
  const distanceText =
    distance === 0
      ? "in unserer direkten Nachbarschaft"
      : distance < 15
        ? "praktisch direkt vor unserer Werkstatttür"
        : distance < 30
          ? "in kurzer Anfahrt von unserer Werkstatt"
          : "im erweiterten Liefergebiet unserer Werkstatt";

  return spin(
    `{Mit ${distance} km Entfernung|Bei einer Anfahrt von etwa ${distance} km|${city.name} liegt ${distanceText}, ca. ${distance} km} {liegt ${city.name}|von unserer Werkstatt im Rhein-Neckar-Raum|entfernt}. {Wir kommen|Unser Team kommt|Wolf Preussner persönlich kommt} {selbstverständlich|natürlich|gerne} {zu Ihnen|vor Ort|nach ${city.name}} – {für das Aufmaß|für ein Erstgespräch|für die Beratung} {ohne Mehrkosten|kostenfrei|inklusive}. {Auch Lieferung und Montage|Lieferung wie Montage|Sowohl Anlieferung als auch Montage} {erfolgen|erledigen wir|übernimmt unser Team} {durch unsere eigenen Schreiner|mit eigenem Werkstatt­personal|durch ausgebildete Tischler}.`,
    seed,
  );
}

export function buildCityClosing(city: City) {
  const seed = `close-${city.slug}`;
  return spin(
    `{Egal ob|Ob nun|Gleich ob} {Küche|Treppe|Tür|Schrank|Bett|Esstisch}, {Massivholzbett|Schiebetür|Shoji|Regal|Sideboard|Kommode} {oder|beziehungsweise|sowie} {Sonderanfertigung|Spezialprojekt|Auftragsarbeit} – {wir sind|Alignum ist|unsere Werkstatt ist} {Ihre Schreinerei|Ihr Tischlermeister|Ihr Ansprechpartner} {in|für|aus} ${city.name}. {Lassen Sie uns sprechen|Schreiben Sie uns|Vereinbaren Sie ein Erstgespräch} – {unverbindlich|ohne Verpflichtung|wir freuen uns}.`,
    seed,
  );
}
