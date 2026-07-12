/**
 * studio-pull — CLI-Bridge zwischen dem Studio und dem alignum-projects-Skill.
 *
 * Lädt alle EINGEREICHTEN Beiträge herunter: Metadaten aus KV, die von Jan
 * ausgewählten Bilder aus Vercel Blob → in die Ordnerstruktur, die der
 * alignum-projects-Skill erwartet:  <OUT>/<Holzart>/<Möbeltyp Stadt>/
 *
 * Danach die Generierung mit DEINEM Claude-Abo über die CLI:
 *   → alignum-projects-Skill auf den erzeugten Ordner laufen lassen.
 *
 * Voraussetzung: dieselben Env-Vars wie die Produktion (KV + Blob).
 * Aufruf:  node scripts/studio-pull.mjs ["Projekte Holzsorten"]
 */
import { Redis } from "@upstash/redis";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

if (!url || !token) {
  console.error(
    "✗ KV-Env fehlt. Setze UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN\n" +
      "  (z. B. via `vercel env pull .env.local`).",
  );
  process.exit(1);
}

const redis = new Redis({ url, token, automaticDeserialization: false });
const OUT = process.argv[2] || "Projekte Holzsorten";

function briefText(post) {
  return [
    `# Studio-Beitrag ${post.id}`,
    ``,
    `Möbeltyp: ${post.moebeltyp}`,
    `Ort: ${post.ortName} (${post.ort})`,
    `Holzart: ${post.holzart}`,
    `Eingereicht: ${new Date(post.updatedAt).toISOString()}`,
    ``,
    `## Notiz von Jan`,
    post.notiz || "(keine)",
    ``,
    `## Ausgewählte Bilder`,
    ...post.images.filter((i) => i.selected).map((i) => `- ${i.filename}`),
  ].join("\n");
}

async function main() {
  const idsRaw = await redis.get("studio:posts:index");
  const ids = idsRaw ? JSON.parse(idsRaw) : [];
  let pulled = 0;

  for (const id of ids) {
    const raw = await redis.get(`studio:post:${id}`);
    if (!raw) continue;
    const post = JSON.parse(raw);
    if (post.status !== "eingereicht") continue;

    const selected = post.images.filter((i) => i.selected);
    if (!selected.length) continue;

    const folder = path.join(
      OUT,
      post.holzart || "Unsortiert",
      `${post.moebeltyp} ${post.ortName}`.trim(),
    );
    await mkdir(folder, { recursive: true });
    await writeFile(path.join(folder, "_brief.txt"), briefText(post), "utf8");

    let n = 1;
    for (const img of selected) {
      const res = await fetch(img.url);
      if (!res.ok) {
        console.warn(`  ⚠ Bild übersprungen (${res.status}): ${img.url}`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(
        path.join(folder, `${String(n).padStart(2, "0")}.jpg`),
        buf,
      );
      n++;
    }
    console.log(`✓ ${folder}  (${selected.length} Bilder)`);
    pulled++;
  }

  if (!pulled) {
    console.log("Keine eingereichten Beiträge gefunden.");
  } else {
    console.log(
      `\n${pulled} Beitrag/Beiträge nach "${OUT}" geladen.\n` +
        `Nächster Schritt: alignum-projects-Skill auf diesen Ordner laufen lassen.`,
    );
  }
}

main().catch((e) => {
  console.error("✗ Fehler:", e);
  process.exit(1);
});
