/**
 * Stabiler Offset pro Stadt-Slug.
 *
 * Wird genutzt, um jeder Stadtseite einen ANDEREN, aber über Deploys hinweg
 * IMMER GLEICHEN Ausschnitt echter Projekte zu zeigen. Zwei Anforderungen
 * gleichzeitig: die Seiten sollen sich voneinander unterscheiden (sonst
 * Near-Duplicate), und die internen Links sollen stehen bleiben (rotierende
 * Links nehmen der Zielseite genau die Autorität wieder weg, die man ihr
 * gerade gegeben hat). Ein reiner Hash über den Slug erfüllt beides —
 * deshalb bewusst kein Zufall und kein Datum als Eingabe.
 */
export function cityOffset(slug: string, modulo: number): number {
  if (modulo <= 0) return 0;
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % modulo;
}
