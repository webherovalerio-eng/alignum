/**
 * Feste Auswahl-Optionen des Anfrageformulars — geteilt zwischen Formular
 * (Client) und Mail-Vorlage (Server). Der Server nutzt sie als Allowlist: in
 * die Bestätigungsmail an die (frei eingebbare) Absender-Adresse kommen NUR
 * diese festen Werte, nie Freitext (sonst Spam-Relay über unsere Domain).
 */
export const SCOPES = ["Komplett-Projekt", "Einzelmöbel", "Sanierung / Umbau", "Beratung & Planung"];
export const BUDGETS = ["bis 3.000 €", "3.000 – 8.000 €", "8.000 – 20.000 €", "20.000 – 50.000 €", "über 50.000 €", "Weiß ich noch nicht"];
export const TIMELINES = ["in 1–3 Monaten", "in 3–6 Monaten", "Flexibel"];
