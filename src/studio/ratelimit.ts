/**
 * Einfache, geteilte Rate-Limits über den KV-Zähler (kvIncr mit TTL beim ersten
 * Treffer). Schützt den Login-Endpunkt gegen Brute-Force/Spam (OWASP Auth).
 */
import { kvIncr } from "./kv";

export interface RateResult {
  ok: boolean;
  count: number;
  max: number;
}

export async function hitRateLimit(
  bucket: string,
  id: string,
  max: number,
  windowS: number,
): Promise<RateResult> {
  const count = await kvIncr(`rl:${bucket}:${id}`, windowS);
  return { ok: count <= max, count, max };
}
