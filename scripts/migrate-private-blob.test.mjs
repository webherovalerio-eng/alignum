/**
 * Offline-Tests für scripts/migrate-private-blob.mjs — In-Memory-Stores statt
 * Vercel Blob (kein Netz, keine echten Stores).  Aufruf: npm test
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { migrate, transformKvEntry, keyFromLegacyUrl } from "./migrate-private-blob.mjs";

const OLD_HOST = "https://bc5epnygdullmah8.public.blob.vercel-storage.com";
const KEY = "mh1abc12/0123456789ab.jpg";
const kvPath = (c) => `kv/${c.repeat(64)}.json`;

function memStore(initial = {}, { page = 2 } = {}) {
  const m = new Map(Object.entries(initial));
  let clock = 1000;
  const writes = [];
  return {
    m,
    writes,
    tick: (t) => (clock = t),
    async list(cursor) {
      const all = [...m.keys()].sort();
      const start = cursor ? Number(cursor) : 0;
      const blobs = all.slice(start, start + page).map((p) => ({
        pathname: p,
        uploadedAt: new Date(m.get(p).at),
        url: `${OLD_HOST}/${p}`,
        size: m.get(p).body.length,
      }));
      const next = start + page;
      return { blobs, hasMore: next < all.length, cursor: String(next) };
    },
    async read(b) {
      const e = m.get(typeof b === "string" ? b : b.pathname);
      return e ? { body: Buffer.from(e.body), contentType: e.type, cacheControl: "public, max-age=2592000" } : null;
    },
    async write(p, body, opts) {
      writes.push({ p, opts });
      m.set(p, { body: Buffer.from(body), type: opts.contentType, at: ++clock });
    },
  };
}

const post = (url) => ({
  id: "mh1abc12",
  status: "entwurf",
  moebeltyp: "Kommode",
  images: [{ key: KEY, url, filename: "a.jpg", bytes: 3, selected: true }],
});
const kvDoc = (v, exp = null) => JSON.stringify({ v: JSON.stringify(v), exp });

test("keyFromLegacyUrl akzeptiert nur Bild-Keys auf dem öffentlichen Blob-Host", () => {
  assert.equal(keyFromLegacyUrl(`${OLD_HOST}/${KEY}`), KEY);
  assert.equal(keyFromLegacyUrl(`${OLD_HOST}/kv/${"a".repeat(64)}.json`), null);
  assert.equal(keyFromLegacyUrl(`https://evil.example/${KEY}`), null);
});

test("transformKvEntry: Post-URLs umschreiben, Magic-Links/abgelaufene überspringen", () => {
  const now = 10_000;
  const t = transformKvEntry(kvDoc(post(`${OLD_HOST}/${KEY}`)), now);
  assert.equal(t.action, "copy");
  assert.equal(t.rewritten, 1);
  assert.equal(JSON.parse(JSON.parse(t.body).v).images[0].url, `/studio-media/${KEY}`);
  // wiederholbar: zweiter Durchlauf ändert nichts
  assert.equal(transformKvEntry(t.body, now).rewritten, 0);
  assert.equal(transformKvEntry(kvDoc({ email: "x@y.de" }, now + 1), now).action, "skip-magiclink");
  assert.equal(transformKvEntry(kvDoc(3, now - 1), now).action, "skip-expired");
  assert.equal(transformKvEntry(JSON.stringify({ v: "3", exp: null }), now).rewritten, 0);
});

test("migrate: Dry-Run schreibt nichts", async () => {
  const oldS = memStore({
    [KEY]: { body: "jpg", type: "image/jpeg", at: 1 },
    [kvPath("a")]: { body: kvDoc(post(`${OLD_HOST}/${KEY}`)), type: "application/json", at: 1 },
  });
  const newS = memStore();
  const s = await migrate({ oldStore: oldS, newStore: newS, apply: false, now: 5 });
  assert.equal(newS.writes.length, 0);
  assert.equal(s.copied, 2);
  assert.equal(s.refsRewritten, 1);
  assert.equal(oldS.writes.length, 0);
});

test("migrate --apply: kopiert, schreibt um, ist idempotent, überschreibt nichts Neueres", async () => {
  const oldS = memStore({
    [KEY]: { body: "jpg", type: "image/jpeg", at: 1 },
    [kvPath("a")]: { body: kvDoc(post(`${OLD_HOST}/${KEY}`)), type: "application/json", at: 1 },
    [kvPath("b")]: { body: kvDoc({ email: "x@y.de" }, 999_999), type: "application/json", at: 1 },
    [kvPath("c")]: { body: kvDoc(7, 1), type: "application/json", at: 1 },
    [kvPath("d")]: { body: JSON.stringify({ v: "2", exp: null }), type: "application/json", at: 1 },
  });
  // Im privaten Store hat die neue App "d" bereits NEUER geschrieben.
  const newS = memStore({
    [kvPath("d")]: { body: JSON.stringify({ v: "5", exp: null }), type: "application/json", at: 50 },
  });
  newS.tick(100);

  const s1 = await migrate({ oldStore: oldS, newStore: newS, apply: true, now: 5 });
  assert.equal(s1.copied, 2);
  assert.equal(s1.skippedMagicLink, 1);
  assert.equal(s1.skippedExpired, 1);
  assert.equal(s1.skippedUpToDate, 1);
  assert.equal(s1.errors, 0);
  assert.equal(newS.m.get(KEY).type, "image/jpeg");
  assert.equal(newS.writes.find((w) => w.p === KEY).opts.cacheControlMaxAge, 2592000);
  const migrated = JSON.parse(JSON.parse(newS.m.get(kvPath("a")).body.toString()).v);
  assert.equal(migrated.images[0].url, `/studio-media/${KEY}`);
  assert.equal(JSON.parse(newS.m.get(kvPath("d")).body.toString()).v, "5"); // nicht überschrieben
  assert.ok(!newS.m.has(kvPath("b")));
  assert.equal(oldS.writes.length, 0); // alter Store unangetastet

  const writesBefore = newS.writes.length;
  const s2 = await migrate({ oldStore: oldS, newStore: newS, apply: true, now: 5 });
  assert.equal(s2.copied, 0);
  assert.equal(s2.docsRewritten, 0);
  assert.equal(newS.writes.length, writesBefore);

  // Alter Stand wird nach dem ersten Lauf geändert → zweiter Lauf zieht nach.
  oldS.m.set(KEY, { body: "jpg2", type: "image/jpeg", at: 10_000 });
  const s3 = await migrate({ oldStore: oldS, newStore: newS, apply: true, now: 5 });
  assert.equal(s3.copied, 1);
  assert.equal(newS.m.get(KEY).body.toString(), "jpg2");
});

test("migrate: Phase 2 schreibt Alt-URLs um, die schon im privaten Store liegen", async () => {
  const oldS = memStore();
  const newS = memStore({
    [kvPath("e")]: { body: kvDoc(post(`${OLD_HOST}/${KEY}`)), type: "application/json", at: 1 },
  });
  const s = await migrate({ oldStore: oldS, newStore: newS, apply: true, now: 5 });
  assert.equal(s.docsRewritten, 1);
  const p = JSON.parse(JSON.parse(newS.m.get(kvPath("e")).body.toString()).v);
  assert.equal(p.images[0].url, `/studio-media/${KEY}`);
});
