/**
 * Monatliches Generierungs-Kontingent (Kosten-/Missbrauchsschutz).
 * Zähler liegt in KV unter `studio:gen:YYYY-MM` und wird serverseitig geprüft —
 * clientseitig NICHT umgehbar. Reservierung vor dem teuren API-Call, Rollback
 * bei Fehler oder Limit-Überschreitung.
 */
import { kvGet, kvIncr, kvDecr } from "./kv";
import { MONTHLY_LIMIT } from "./config";

// 40 Tage TTL: hält den Zähler über den Monat, räumt alte Monate selbst auf.
const TTL_S = 60 * 60 * 24 * 40;

function monthKey(): string {
  return `studio:gen:${new Date().toISOString().slice(0, 7)}`; // z. B. studio:gen:2026-07
}

export interface Usage {
  used: number;
  limit: number;
  remaining: number;
}

export async function getMonthlyUsage(): Promise<Usage> {
  const raw = await kvGet(monthKey());
  const used = raw ? Math.max(0, parseInt(raw, 10) || 0) : 0;
  return { used, limit: MONTHLY_LIMIT, remaining: Math.max(0, MONTHLY_LIMIT - used) };
}

/**
 * Reserviert eine Generierung. Increment ZUERST (fängt Races ab), dann prüfen:
 * über Limit → Rollback + ok:false. Bei Erfolg gibt der Aufrufer bei einem
 * Fehler die Reservierung via releaseGeneration() wieder frei.
 */
export async function reserveGeneration(): Promise<{ ok: boolean; usage: Usage }> {
  const n = await kvIncr(monthKey(), TTL_S);
  if (n > MONTHLY_LIMIT) {
    await kvDecr(monthKey());
    return {
      ok: false,
      usage: { used: MONTHLY_LIMIT, limit: MONTHLY_LIMIT, remaining: 0 },
    };
  }
  return {
    ok: true,
    usage: { used: n, limit: MONTHLY_LIMIT, remaining: Math.max(0, MONTHLY_LIMIT - n) },
  };
}

export async function releaseGeneration(): Promise<void> {
  const n = await kvDecr(monthKey());
  // Nie unter 0 (falls parallel dekrementiert wurde).
  if (n < 0) await kvIncr(monthKey(), TTL_S);
}
