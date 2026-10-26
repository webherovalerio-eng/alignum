/**
 * migrate-private-blob — Umzug alter ÖFFENTLICHER Blob-Store (alignum-studio)
 * → neuer PRIVATER Blob-Store (alignum-private, fra1).
 *
 * Was passiert:
 *   1. Liest ALLE Blobs des alten Stores (list mit Pagination) und kopiert sie
 *      mit GLEICHEM Pathname in den privaten Store (Content-Type + max-age
 *      bleiben erhalten). Pathnames: `{postId}/{hex}.jpg` (Studio-Bilder) und
 *      `kv/<sha256>.json` (KV-Einträge: Posts, Index, Session-Versionen,
 *      Rate-Limits, Zähler). Der KV-Pfad hängt nur von AUTH_SECRET + Key ab →
 *      identischer Pathname = die App findet jeden Eintrag wieder.
 *   2. Schreibt beim Kopieren gespeicherte Referenzen um: in Post-Dokumenten
 *      (`kv/…json`, Feld `v` = Post-JSON) wird `images[].url` von der alten
 *      Blob-URL (`https://<store>.public.blob.vercel-storage.com/{key}`) auf die
 *      eigene Route `/studio-media/{key}` gesetzt.
 *   3. Prüft zusätzlich alle KV-Dokumente, die schon im privaten Store liegen,
 *      und schreibt dort verbliebene Alt-URLs um (wiederholbar).
 *
 * Bewusst NICHT kopiert:
 *   - abgelaufene KV-Einträge (exp in der Vergangenheit),
 *   - Magic-Link-Einträge (`{email}`; single-use, 10 min TTL) — sonst würde ein
 *     im alten Store bereits verbrauchter Link im neuen Store wieder gültig.
 *     Offene Login-Links müssen nach der Umstellung neu angefordert werden.
 *
 * Idempotent: kopiert nur, was im privaten Store fehlt oder dort ÄLTER ist als
 * im alten Store (uploadedAt). Ein Eintrag, den die neue App nach dem Deploy
 * bereits im privaten Store geschrieben hat, wird also nie mit einem älteren
 * Stand überschrieben. Umschreiben ist wiederholbar (bereits umgeschriebene
 * Dokumente bleiben unverändert). Löscht NICHTS — weder alt noch neu.
 *
 * Standard = DRY-RUN (liest nur). Echte Ausführung nur mit --apply.
 *
 * Aufruf (Tokens NICHT in die Shell-History schreiben, z. B. aus einer Datei laden):
 *   OLD_TOKEN=<RW-Token alter Store = BLOB_READ_WRITE_TOKEN> \
 *   NEW_TOKEN=<RW-Token privater Store = PRIVATE_READ_WRITE_TOKEN> \
 *     node scripts/migrate-private-blob.mjs            # Dry-Run
 *     node scripts/migrate-private-blob.mjs --apply    # ausführen
 *   Optional: --verbose (jede Datei einzeln protokollieren)
 *
 * Läuft ohne Build (reines Node-ESM, nur @vercel/blob).
 */
import path from "node:path";
import { pathToFileURL } from "node:url";

export const MEDIA_ROUTE = "/studio-media/";
export const IMAGE_KEY_RE = /^[a-z0-9]{4,32}\/[a-f0-9]{12}\.jpg$/;
const LEGACY_HOST_RE = /\.public\.blob\.vercel-storage\.com$/;
const KV_RE = /^kv\/[a-f0-9]{64}\.json$/;

// --- Reine Transformationen (testbar) --------------------------------------

/** Ist das Objekt ein Studio-Post (am Schema erkannt, wie studio-pull)? */
function isPost(v) {
  return (
    v &&
    typeof v === "object" &&
    typeof v.id === "string" &&
    typeof v.status === "string" &&
    Array.isArray(v.images)
  );
}

/** Setzt images[].url auf `/studio-media/{key}`. Gibt Anzahl Änderungen zurück. */
export function rewritePostImages(post) {
  let changed = 0;
  for (const img of post.images) {
    if (!img || typeof img !== "object") continue;
    let key = img.key;
    if (!(typeof key === "string" && IMAGE_KEY_RE.test(key))) {
      // Kein gültiger Key → aus Alt-URL ableiten, falls möglich.
      key = keyFromLegacyUrl(img.url);
      if (!key) continue;
      img.key = key;
    }
    const want = `${MEDIA_ROUTE}${key}`;
    if (img.url !== want) {
      img.url = want;
      changed++;
    }
  }
  return changed;
}

export function keyFromLegacyUrl(url) {
  if (typeof url !== "string") return null;
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" || !LEGACY_HOST_RE.test(u.hostname)) return null;
    const p = u.pathname.replace(/^\//, "");
    return IMAGE_KEY_RE.test(p) ? p : null;
  } catch {
    return null;
  }
}

/**
 * Wandelt ein KV-Dokument (`{v: string, exp: number|null}`) für den Zielstore.
 *   { action: "copy", body, rewritten }    → schreiben (body ggf. umgeschrieben)
 *   { action: "skip-expired" }             → abgelaufen, nicht kopieren
 *   { action: "skip-magiclink" }           → Magic-Link, nicht kopieren
 *   { action: "raw" }                      → kein KV-JSON, unverändert kopieren
 * `forTarget=false` (Phase 2, Dokument liegt schon im Ziel) → nur umschreiben.
 */
export function transformKvEntry(text, now, { forTarget = true } = {}) {
  let entry;
  try {
    entry = JSON.parse(text);
  } catch {
    return { action: "raw" };
  }
  if (!entry || typeof entry !== "object" || typeof entry.v !== "string")
    return { action: "raw" };
  if (forTarget && typeof entry.exp === "number" && entry.exp < now)
    return { action: "skip-expired" };

  let inner;
  try {
    inner = JSON.parse(entry.v);
  } catch {
    inner = undefined; // Zähler/Strings („3") sind auch JSON — sonst egal
  }
  if (
    forTarget &&
    inner &&
    typeof inner === "object" &&
    !Array.isArray(inner) &&
    Object.keys(inner).length === 1 &&
    typeof inner.email === "string"
  )
    return { action: "skip-magiclink" };

  if (isPost(inner)) {
    const rewritten = rewritePostImages(inner);
    if (rewritten) {
      return {
        action: "copy",
        body: JSON.stringify({ ...entry, v: JSON.stringify(inner) }),
        rewritten,
      };
    }
  }
  return { action: "copy", body: text, rewritten: 0 };
}

/** max-age aus einem Cache-Control-Header (für put cacheControlMaxAge). */
export function maxAgeOf(cacheControl) {
  const m = /max-age=(\d+)/.exec(cacheControl || "");
  return m ? Math.max(60, parseInt(m[1], 10)) : undefined;
}

// --- Migration (Stores injiziert → testbar ohne Netz) ----------------------

async function listAll(store) {
  const out = [];
  let cursor;
  do {
    const page = await store.list(cursor);
    out.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out;
}

/**
 * @param {object} o
 * @param {{list(cursor?):Promise<{blobs:{pathname:string,uploadedAt:Date|string,url?:string,size?:number}[],cursor?:string,hasMore:boolean}>, read(blob):Promise<{body:Buffer,contentType:string,cacheControl?:string}>}} o.oldStore
 * @param {{list(cursor?):Promise<any>, read(pathname):Promise<{body:Buffer,contentType:string,cacheControl?:string}|null>, write(pathname, body, opts):Promise<void>}} o.newStore
 * @param {boolean} o.apply
 */
export async function migrate({ oldStore, newStore, apply, now = Date.now(), log = () => {} }) {
  const s = {
    oldTotal: 0,
    newTotalBefore: 0,
    copied: 0,
    copiedBytes: 0,
    skippedUpToDate: 0,
    skippedExpired: 0,
    skippedMagicLink: 0,
    docsRewritten: 0,
    refsRewritten: 0,
    legacyRefsRemaining: 0,
    errors: 0,
  };
  const verb = apply ? "" : "[dry] ";

  const oldBlobs = await listAll(oldStore);
  const newBlobs = await listAll(newStore);
  s.oldTotal = oldBlobs.length;
  s.newTotalBefore = newBlobs.length;
  const inNew = new Map(newBlobs.map((b) => [b.pathname, new Date(b.uploadedAt).getTime()]));
  const handled = new Set();

  // Phase 1: alt → privat
  for (const b of oldBlobs) {
    const p = b.pathname;
    try {
      const newTime = inNew.get(p);
      if (newTime !== undefined && newTime >= new Date(b.uploadedAt).getTime()) {
        s.skippedUpToDate++;
        log(`  = ${p} (aktuell)`);
        continue;
      }
      handled.add(p);
      const src = await oldStore.read(b);
      let body = src.body;
      let rewritten = 0;
      const isKv = KV_RE.test(p) || (p.startsWith("kv/") && p.endsWith(".json"));
      if (isKv) {
        const t = transformKvEntry(src.body.toString("utf8"), now);
        if (t.action === "skip-expired") {
          s.skippedExpired++;
          log(`  - ${p} (abgelaufen)`);
          continue;
        }
        if (t.action === "skip-magiclink") {
          s.skippedMagicLink++;
          log(`  - ${p} (Magic-Link)`);
          continue;
        }
        if (t.action === "copy" && t.rewritten) {
          body = Buffer.from(t.body, "utf8");
          rewritten = t.rewritten;
        }
      }
      if (isKv && /\.public\.blob\.vercel-storage\.com/.test(body.toString("utf8")))
        s.legacyRefsRemaining++;
      if (apply) {
        await newStore.write(p, body, {
          contentType: src.contentType || "application/octet-stream",
          cacheControlMaxAge: isKv ? 60 : maxAgeOf(src.cacheControl),
        });
      }
      s.copied++;
      s.copiedBytes += body.length;
      if (rewritten) {
        s.docsRewritten++;
        s.refsRewritten += rewritten;
      }
      log(`  ${verb}+ ${p}${rewritten ? ` (${rewritten} Bild-URL(s) umgeschrieben)` : ""}`);
    } catch (e) {
      s.errors++;
      console.error(`  ✗ ${p}: ${e instanceof Error ? e.message : e}`);
    }
  }

  // Phase 2: KV-Dokumente, die schon im privaten Store liegen → Alt-URLs umschreiben
  for (const b of newBlobs) {
    const p = b.pathname;
    if (handled.has(p) || !p.startsWith("kv/") || !p.endsWith(".json")) continue;
    try {
      const cur = await newStore.read(p);
      if (!cur) continue;
      const t = transformKvEntry(cur.body.toString("utf8"), now, { forTarget: false });
      if (t.action !== "copy" || !t.rewritten) {
        if (/\.public\.blob\.vercel-storage\.com/.test(cur.body.toString("utf8")))
          s.legacyRefsRemaining++;
        continue;
      }
      if (apply) {
        await newStore.write(p, Buffer.from(t.body, "utf8"), {
          contentType: cur.contentType || "application/json",
          cacheControlMaxAge: 60,
        });
      }
      s.docsRewritten++;
      s.refsRewritten += t.rewritten;
      log(`  ${verb}~ ${p} (${t.rewritten} Bild-URL(s) im privaten Store umgeschrieben)`);
    } catch (e) {
      s.errors++;
      console.error(`  ✗ ${p}: ${e instanceof Error ? e.message : e}`);
    }
  }
  return s;
}

// --- CLI ---------------------------------------------------------------------

function storeIdOf(token) {
  return token.split("_")[3] || "";
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const apply = args.has("--apply");
  const verbose = args.has("--verbose");
  const OLD_TOKEN = process.env.OLD_TOKEN;
  const NEW_TOKEN = process.env.NEW_TOKEN;
  if (!OLD_TOKEN || !NEW_TOKEN) {
    console.error("✗ OLD_TOKEN (alter öffentlicher Store) und NEW_TOKEN (privater Store) setzen.");
    process.exit(2);
  }
  const oldId = storeIdOf(OLD_TOKEN);
  const newId = storeIdOf(NEW_TOKEN);
  if (!oldId || !newId || OLD_TOKEN === NEW_TOKEN || oldId === newId) {
    console.error("✗ OLD_TOKEN und NEW_TOKEN müssen gültige RW-Tokens ZWEIER verschiedener Stores sein.");
    process.exit(2);
  }

  const { list, put, get } = await import("@vercel/blob");

  const oldStore = {
    list: (cursor) => list({ token: OLD_TOKEN, limit: 1000, cursor }),
    async read(b) {
      // Alter Store ist öffentlich + CDN-gecacht (KV: 60 s) → Cache-Bust,
      // damit der frischeste Stand kopiert wird.
      const res = await fetch(`${b.url}?_=${Date.now()}`, {
        cache: "no-store",
        headers: { authorization: `Bearer ${OLD_TOKEN}` },
      });
      if (!res.ok) throw new Error(`Lesen fehlgeschlagen (${res.status})`);
      return {
        body: Buffer.from(await res.arrayBuffer()),
        contentType: res.headers.get("content-type") || "application/octet-stream",
        cacheControl: res.headers.get("cache-control") || "",
      };
    },
  };
  const newStore = {
    list: (cursor) => list({ token: NEW_TOKEN, limit: 1000, cursor }),
    async read(pathname) {
      const res = await get(pathname, { access: "private", token: NEW_TOKEN, useCache: false });
      if (!res || res.statusCode !== 200) return null;
      return {
        body: Buffer.from(await new Response(res.stream).arrayBuffer()),
        contentType: res.blob.contentType,
        cacheControl: res.blob.cacheControl,
      };
    },
    async write(pathname, body, { contentType, cacheControlMaxAge }) {
      await put(pathname, body, {
        access: "private",
        token: NEW_TOKEN,
        contentType,
        addRandomSuffix: false,
        allowOverwrite: true,
        ...(cacheControlMaxAge ? { cacheControlMaxAge } : {}),
      });
    },
  };

  console.log(
    `${apply ? "AUSFÜHRUNG (--apply)" : "DRY-RUN (nichts wird geschrieben; --apply zum Ausführen)"}\n` +
      `  alt:   store …${oldId.slice(-6)} (öffentlich, nur lesen)\n` +
      `  neu:   store …${newId.slice(-6)} (privat)\n`,
  );
  const s = await migrate({
    oldStore,
    newStore,
    apply,
    log: verbose ? (m) => console.log(m) : () => {},
  });
  const mb = (s.copiedBytes / 1024 / 1024).toFixed(1);
  console.log(
    [
      ``,
      `Zusammenfassung${apply ? "" : " (Dry-Run — so WÜRDE es laufen)"}:`,
      `  Blobs im alten Store:              ${s.oldTotal}`,
      `  Blobs im privaten Store (vorher):  ${s.newTotalBefore}`,
      `  ${apply ? "kopiert" : "zu kopieren"}:                       ${s.copied} (${mb} MB)`,
      `  übersprungen (schon aktuell):      ${s.skippedUpToDate}`,
      `  übersprungen (KV abgelaufen):      ${s.skippedExpired}`,
      `  übersprungen (Magic-Links):        ${s.skippedMagicLink}`,
      `  ${apply ? "umgeschrieben" : "umzuschreiben"}: ${s.docsRewritten} Dokument(e), ${s.refsRewritten} Bild-URL(s)`,
      `  KV-Dokumente mit Rest-Alt-URLs:    ${s.legacyRefsRemaining}`,
      `  Fehler:                            ${s.errors}`,
      `Im alten Store wurde nichts gelöscht oder verändert.`,
    ].join("\n"),
  );
  if (s.errors) process.exit(1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((e) => {
    console.error("✗ Fehler:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
}
