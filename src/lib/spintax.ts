/**
 * Spintax-Helfer für Local-SEO City-Pages.
 * Format: {alpha|beta|gamma} → wählt einen Wert deterministisch anhand seed.
 *
 * Deterministisch heißt: Stadt X bekommt jedes Mal die gleichen Auswahlen,
 * aber Stadt X und Stadt Y bekommen unterschiedliche – damit jede City-Page
 * einzigartigen Content hat.
 */

import { hash, mulberry32 } from "./spintax-internals";

export function spin(template: string, seed: string): string {
  const rng = mulberry32(hash(seed));
  return template.replace(/\{([^{}]+)\}/g, (_, group) => {
    const opts = group.split("|");
    const idx = Math.floor(rng() * opts.length);
    return opts[idx];
  });
}
