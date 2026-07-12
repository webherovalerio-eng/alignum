/**
 * Magic-Link-Tokens. Der Klartext-Token geht NUR per Mail an die berechtigte
 * Adresse; im Speicher liegt ausschließlich sein SHA-256-Hash (OWASP: Tokens
 * gehasht at rest). Single-Use: beim Einlösen sofort gelöscht.
 */
import { kvSetJSON, kvGetJSON, kvDel } from "./kv";
import { randomTokenHex, sha256Hex } from "./tokens";
import { MAGIC_TTL_S } from "./config";

interface MagicRecord {
  email: string;
}

export async function createMagicToken(email: string): Promise<string> {
  const token = randomTokenHex(32); // 256 bit
  const hash = await sha256Hex(token);
  await kvSetJSON<MagicRecord>(`ml:${hash}`, { email }, MAGIC_TTL_S);
  return token;
}

/** Prüft + entwertet den Token. Gibt die Adresse zurück oder null. */
export async function consumeMagicToken(token: string): Promise<string | null> {
  if (!token || token.length !== 64) return null; // 32 Byte hex = 64 Zeichen
  const hash = await sha256Hex(token);
  const key = `ml:${hash}`;
  const rec = await kvGetJSON<MagicRecord>(key);
  if (!rec) return null;
  await kvDel(key); // single-use: sofort entwerten (auch bei Fehler danach)
  return rec.email;
}
