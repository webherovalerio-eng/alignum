import { spin } from "@/lib/spintax";

/**
 * Pool positiver Bewertungstexte für den Bewertungs-Flow.
 * Jeder Eintrag enthält Spintax-Varianten, sodass nicht zwei Bewertungen
 * 1:1 gleich aussehen. Bei jeder Generierung wird ein zufälliger Template
 * gewählt + die Spintax mit aktueller Timestamp seed aufgelöst.
 */

const TEMPLATES: string[] = [
  // 1 — Allgemein zufrieden
  `{Wir sind|Ich bin|Wir waren} {sehr|absolut|wirklich} zufrieden mit der Werkstatt – {schneller|reibungsloser|persönlicher} Erstkontakt, {faire|transparente|nachvollziehbare} Preise und {sauber|präzise|perfekt} ausgeführte Arbeit. {Sehr empfehlenswert.|Klare Empfehlung.|Würden wir jederzeit wieder beauftragen.}`,

  // 2 — Persönliche Beratung (Jan)
  `{Jan|Herr Gerathewohl|Der Inhaber persönlich} {hat sich viel Zeit genommen|war bei jedem Termin selbst vor Ort|hat unser Projekt persönlich begleitet}, {alle Details mit uns durchgesprochen|nichts dem Zufall überlassen|von Anfang an mitgedacht}. {Ergebnis|Das fertige Möbel|Unser Auftrag} hat unsere Erwartungen {übertroffen|deutlich übertroffen|weit übertroffen}. {Danke!|Vielen Dank!|Wir sind begeistert.}`,

  // 3 — Massivholz-Qualität
  `{Massivholz|Echtes Holz|Die Holzqualität} der besten Sorte, {makellos verarbeitet|tadellose Verarbeitung|saubere Fugen}. Man {merkt|spürt|sieht}, dass hier jemand {sein Handwerk versteht|wirklich kann was er tut|seinen Beruf lebt}. {Klasse!|Top!|Großartig!}`,

  // 4 — Tisch / Esstisch
  `{Unser Esstisch|Unsere Tafel|Der Tisch} aus Massivholz ist {ein echtes Schmuckstück|das Highlight unseres Esszimmers|jeden Cent wert}. {Liebevolle Details|Wunderschöne Maserung|Perfekte Kanten}, {millimetergenaue Passung|tolle Arbeit|sauberste Verarbeitung}. {Vielen Dank an das Team!|Wir sind begeistert.|Empfehlung pur.}`,

  // 5 — Schrank / Einbau
  `{Einbauschrank|Unser Schrank|Der Schrank nach Maß} passt {millimetergenau|perfekt|wie angegossen} in unsere Nische. {Sehr|Wirklich|Ausgesprochen} hochwertige Beschläge, {leise|softclose, leise|geräuschlos schließend} und mit {viel Liebe zum Detail|kluger Innenausstattung|durchdachten Lösungen} gefertigt. {Top Arbeit!|Danke!|Klare Empfehlung.}`,

  // 6 — Treppe
  `{Unsere|Die neue} Holztreppe ist {ein architektonisches Highlight|der Hingucker im Haus|das Schmuckstück unseres Hauses} geworden. {Stabil|Massiv|Robust} gebaut, {wunderschön gearbeitet|mit Liebe zum Detail|formvollendet}. {Top|Klasse|Sehr empfehlenswert} – {jederzeit wieder|absolute Empfehlung|wir würden wieder hier bauen lassen}.`,

  // 7 — Küche
  `{Unsere Küche|Die maßgefertigte Küche|Die neue Schreinerküche} ist {wirklich|ein|absoluter} Traum. {Funktional|Durchdacht|Klug geplant}, {ästhetisch|wunderschön|stilvoll} und {hochwertig verarbeitet|sauber gebaut|in jedem Detail überzeugend}. {Genau, was wir wollten.|Übertrifft alles Erwartete.|Wir freuen uns jeden Tag.}`,

  // 8 — Termintreue
  `{Termin|Liefertermin|Zeitplan} {wurde eingehalten|stimmte auf den Tag|hielt punktgenau}, {Montage sauber|alles sauber montiert|aufgeräumt hinterlassen} und {nichts zu beanstanden|keine Mängel|alles bestens}. {Sehr professionell.|So muss Handwerk.|Top.}`,

  // 9 — Beratung & Planung
  `{Schon das erste Gespräch|Bereits die Beratung|Das Aufmaß} {hat überzeugt|war auf höchstem Niveau|fühlte sich an wie eine Innenarchitekten-Beratung}. {Ideen wurden aufgenommen|Eigene Wünsche perfekt umgesetzt|Vorschläge waren mehr als wir uns vorstellen konnten} und {realistisch eingeordnet|in ein machbares Konzept gebracht|kreativ verfeinert}. {Das macht den Unterschied.|So stellt man sich Handwerk vor.|Sehr empfehlenswert.}`,

  // 10 — Türen / Shoji
  `{Unsere|Die} {neuen Türen|Shoji-Schiebewände|Innentüren} {sind ein Genuss|begeistern uns täglich|machen den Raum erst komplett}. {Hochwertig|Wertig|Edel} gefertigt, {schließen geräuschlos|gleiten lautlos|laufen butterweich} und {sehen einfach toll aus|fügen sich perfekt in den Raum|sind richtige Schmuckstücke}. {Empfehlung!|Top!|Danke!}`,

  // 11 — Preis-Leistung
  `{Fairer|Transparenter|Ehrlicher} {Preis|Festpreis|Angebotspreis}, {keine versteckten Kosten|alles im vereinbarten Rahmen|Endpreis wie zugesagt}. Dafür {herausragende Qualität|Handwerk auf Meisterniveau|deutlich über dem, was man erwartet hätte}. {Sehr empfehlenswert.|Wir kommen wieder.|Gerne wieder.}`,

  // 12 — Langjähriger Kunde
  `{Wir lassen seit Jahren|Mein zweites Projekt|Schon mehrfach haben wir} {bei Alignum|in dieser Schreinerei|von Jan und seinem Team} fertigen lassen. {Jedes Mal|Bei jedem Auftrag|Immer wieder} {tadellose Qualität|herausragende Arbeit|perfektes Ergebnis}. {Das macht Vertrauen.|So geht Handwerk.|Wir bleiben Kunde.}`,
];

/**
 * Liefert einen zufällig gewählten + spintaxierten Bewertungstext.
 * Bei jedem Aufruf wird ein anderer Seed verwendet, sodass auch derselbe
 * Template-Index bei mehrmaligem Klick auf „Neu generieren" andere Worte
 * produziert.
 */
export function generateReview(): string {
  const idx = Math.floor(Math.random() * TEMPLATES.length);
  const seed = `${Date.now()}-${Math.random()}`;
  return spin(TEMPLATES[idx], seed);
}

export const TEMPLATE_COUNT = TEMPLATES.length;
