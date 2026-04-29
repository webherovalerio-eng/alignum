/**
 * Spintax-Helfer für Local-SEO City-Pages.
 * Format: {alpha|beta|gamma} → wählt einen Wert deterministisch anhand seed.
 *
 * Deterministisch heißt: Stadt X bekommt jedes Mal die gleichen Auswahlen,
 * aber Stadt X und Stadt Y bekommen unterschiedliche – damit jede City-Page
 * einzigartigen Content hat.
 */

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function spin(template: string, seed: string): string {
  const rng = mulberry32(hash(seed));
  return template.replace(/\{([^{}]+)\}/g, (_, group) => {
    const opts = group.split("|");
    const idx = Math.floor(rng() * opts.length);
    return opts[idx];
  });
}
