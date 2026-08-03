/**
 * studio-pull — CLI-Bridge zwischen dem Studio und dem alignum-projects-Skill.
 *
 * Lädt alle FREIGEGEBENEN Beiträge herunter: Metadaten + die von Jan
 * ausgewählten Bilder → in die Ordnerstruktur, die der alignum-projects-Skill
 * erwartet:  <OUT>/<Holzart>/<Möbeltyp Stadt>/
 *
 * Backend: das Studio persistiert seinen KV auf VERCEL BLOB (nicht Upstash —
 * das braucht eine Browser-Freigabe, die headless nicht ging; siehe
 * src/studio/kv.ts). Die Post-JSONs liegen also als Blob-Objekte unter `kv/…`.
 * Der Objekt-INHALT ist Klartext-JSON, nur der Pfadname ist mit AUTH_SECRET
 * gehasht. AUTH_SECRET ist in Vercel als „sensitive" markiert und via
 * `vercel env pull` NICHT abrufbar — deshalb finden wir die Posts NICHT über
 * den gehashten Key, sondern per `list({prefix:"kv/"})` und identifizieren die
 * Post-Objekte am Schema. Das braucht nur den BLOB_READ_WRITE_TOKEN, der per
 * `vercel env pull` kommt.
 *
 * Voraussetzung: BLOB_READ_WRITE_TOKEN (z. B. via `vercel env pull .env.local`).
 * Aufruf:  node scripts/studio-pull.mjs ["Projekte Holzsorten"]
 *
 * Hinweis Idempotenz: filtert auf Status "freigegeben" und ändert ihn NICHT.
 * Jeder Lauf zieht alle aktuell freigegebenen Beiträge erneut (Ordner werden
 * überschrieben). Verarbeitete Beiträge in Jans Studio löschen oder den
 * OUT-Ordner vor einem erneuten Lauf leeren.
 */
import { list } from "@vercel/blob";
import { readFileSync, existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// .env.local laden, falls die Variablen nicht schon im Prozess gesetzt sind.
for (const file of [".env.local", ".env"]) {
  if (process.env.BLOB_READ_WRITE_TOKEN) break;
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const i = line.indexOf("=");
    if (i < 1 || line.trimStart().startsWith("#")) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    if (!(k in process.env)) process.env[k] = v;
  }
}

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
if (!TOKEN) {
  console.error(
    "✗ BLOB_READ_WRITE_TOKEN fehlt. Hol dir die Env-Vars mit\n" +
      "  `vercel env pull .env.local` (im web/-Verzeichnis).",
  );
  process.exit(1);
}

const OUT = process.argv[2] || "Projekte Holzsorten";
const STATUS = "freigegeben";

function briefText(post) {
  return [
    `# Studio-Beitrag ${post.id}`,
    ``,
    `Möbeltyp: ${post.moebeltyp}`,
    `Ort: ${post.ortName} (${post.ort})`,
    `Holzart: ${post.holzart}`,
    `Freigegeben: ${new Date(post.updatedAt).toISOString()}`,
    ``,
    `## Notiz von Jan`,
    post.notiz || "(keine)",
    ``,
    `## Regie-Anweisungen an die Redaktion`,
    post.regie || "(keine)",
    ``,
    `## Ausgewählte Bilder`,
    ...post.images.filter((i) => i.selected).map((i) => `- ${i.filename}`),
  ].join("\n");
}

/** Ist das geparste Blob-Objekt ein Studio-Post? (am Schema erkannt) */
function isPost(v) {
  return (
    v &&
    typeof v === "object" &&
    typeof v.id === "string" &&
    typeof v.status === "string" &&
    v.moebeltyp !== undefined &&
    Array.isArray(v.images)
  );
}

async function main() {
  const { blobs } = await list({ prefix: "kv/", token: TOKEN, limit: 1000 });
  let pulled = 0;

  for (const b of blobs) {
    // Cache-Bust: Blob-URLs sind CDN-gecacht (min. 60s).
    const res = await fetch(`${b.url}?_=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) continue;
    let entry;
    try {
      entry = await res.json();
    } catch {
      continue;
    }
    let post;
    try {
      post = JSON.parse(entry.v);
    } catch {
      continue;
    }
    if (!isPost(post) || post.status !== STATUS) continue;

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
      const r = await fetch(img.url);
      if (!r.ok) {
        console.warn(`  ⚠ Bild übersprungen (${r.status}): ${img.filename}`);
        continue;
      }
      const buf = Buffer.from(await r.arrayBuffer());
      const ext = (img.filename.split(".").pop() || "jpg").toLowerCase();
      await writeFile(
        path.join(folder, `${String(n).padStart(2, "0")}.${ext}`),
        buf,
      );
      n++;
    }
    console.log(`✓ ${folder}  (${selected.length} Bilder)`);
    pulled++;
  }

  if (!pulled) {
    console.log(`Keine ${STATUS}en Beiträge gefunden.`);
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
