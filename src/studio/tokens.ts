/**
 * Krypto-Primitive über die Web-Crypto-API (Node ≥18 / Edge kompatibel).
 * OWASP: hohe Entropie für Tokens, Hashing at rest, konstantzeit-Vergleich.
 */

/** Zufalls-Token als Hex-String (Default 32 Byte = 256 bit Entropie). */
export function randomTokenHex(bytes = 32): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return toHex(arr);
}

/** SHA-256 eines Strings als Hex (für Token-Speicherung „at rest"). */
export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(new Uint8Array(digest));
}

/** Konstantzeit-Vergleich zweier Strings (verhindert Timing-Leaks). */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function toHex(arr: Uint8Array): string {
  let s = "";
  for (const b of arr) s += b.toString(16).padStart(2, "0");
  return s;
}
