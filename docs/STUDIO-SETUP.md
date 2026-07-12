# Alignum Studio — Setup & Betrieb

Internes Redaktions-Backend: Jan lädt Projektfotos hoch, wählt die besten aus,
trägt Ort/Holzart/Möbeltyp + Notiz ein und reicht ein. Daraus entsteht
Social-Media- und **Supporting-Content für die City-Pages** (via
`alignum-projects`-Skill).

## Architektur

| Teil | Läuft wo | Kosten |
|---|---|---|
| **Studio** (Login, Upload, Auswahl, Generieren, Review, Freigabe) | Vercel (deployed) | Hosting |
| **KI-Generierung** (Projekt-Text + Social-Post) | In-App via Anthropic API | ~10–20 ct/Beitrag |

Ablauf: Jan lädt Fotos hoch, wählt aus, trägt Ort/Möbeltyp/Holzart + Notiz ein →
**„Text generieren"** ruft die Anthropic API auf → Jan prüft/passt an → **„Freigeben"**.

**Hartes Monatslimit:** max. 8 Generierungen/Monat (serverseitig in KV gezählt,
nicht umgehbar). Anpassbar über `STUDIO_MONTHLY_LIMIT`.

> Der frühere CLI-Weg (`npm run studio:pull` + `alignum-projects`-Skill, 0 €)
> bleibt als Skript vorhanden, ist aber nicht mehr der Standard.

## Go-Live (einmalig)

Alles außer diesen Schritten ist bereits im Code. Studio-Flächen sind additiv,
`noindex` und ändern **nichts** am öffentlichen SEO-Frontend.

1. **Vercel KV (Upstash Redis)** im Projekt hinzufügen
   (Vercel → Storage → KV/Upstash → Connect). Setzt `UPSTASH_REDIS_REST_URL` +
   `UPSTASH_REDIS_REST_TOKEN` automatisch. → Magic-Link-Tokens, Rate-Limits,
   Post-Index. **Pflicht** (Tokens müssen instanzübergreifend geteilt werden).
2. **Vercel Blob** hinzufügen (Storage → Blob → Connect). Setzt
   `BLOB_READ_WRITE_TOKEN`. → hochgeladene Bilder. **Pflicht.**
3. **`AUTH_SECRET`** erzeugen und als Env (Production) setzen:
   `openssl rand -base64 32`
4. **`NEXT_PUBLIC_SITE_URL`** = `https://alignum.de` setzen.
5. **`ANTHROPIC_API_KEY`** setzen (console.anthropic.com → API Keys) — für die
   Text-Generierung. Optional: `STUDIO_MONTHLY_LIMIT` (Default 8).
6. (`RESEND_API_KEY`, `MAIL_FROM` sind bereits gesetzt — der Magic-Link nutzt
   dieselbe Resend-Anbindung wie das Anfrageformular.)
7. **Deploy:** `git push` (Vercel-GitHub-Integration).

> Die Generierung braucht bis zu ~40 s (Opus 4.8). Die Function ist auf
> `maxDuration = 60` gesetzt — dafür wird der **Pro-Plan / Fluid Compute**
> benötigt (Hobby-Plan cappt Functions bei 10 s). Euer Anfrageformular nutzt
> bereits `maxDuration = 20`, ihr seid also voraussichtlich fein.

Siehe `.env.example` für die vollständige Liste.

## Nutzung — Jan

1. `alignum.de/login` → E-Mail `info@alignum.de` → Login-Link kommt per Mail.
2. „Neuer Beitrag" → Fotos oder ganzen **Ordner** hochladen.
3. Passende Bilder antippen (Auswahl), Ort/Möbeltyp/Holzart + Notiz eintragen.
4. „Einreichen & generieren lassen".

## Generierung — Valerio (CLI, dein Abo)

1. Env lokal holen: `vercel env pull .env.local`
2. Eingereichte Beiträge ziehen: `npm run studio:pull`
   → legt `Projekte Holzsorten/<Holz>/<Möbel Stadt>/` mit Bildern + `_brief.txt` an.
3. `alignum-projects`-Skill auf den Ordner laufen lassen (dein Abo).
4. (Phase 2) Entwurf zurück ins Studio → Jan prüft, passt an, gibt frei → live.

## Reviewer-Zugang (du)

`vale.dc@hotmail.de` steht auf der Allowlist — du forderst unter `/login`
deinen **eigenen** Link an (an deine Hotmail). So bleibt die
E-Mail-Allowlist als Sicherheitskontrolle intakt (kein Weiterleiten fremder
Login-Links). Später entfernbar in `src/studio/config.ts` oder via
`STUDIO_ALLOWED_EMAILS`.

## Sicherheit (OWASP)

- Magic-Link: 256-bit-Token, **single-use**, **gehasht** gespeichert (SHA-256),
  TTL 10 min, konstantzeit-Prüfung; keine User-Enumeration.
- Rate-Limits auf `/login` (pro IP + pro Adresse), Honeypot.
- Session: signiertes JWT (jose/HS256) im `__Host-`-HttpOnly-Cookie; Allowlist
  wird bei **jedem** Request neu geprüft → sofortiger Entzug möglich.
- CSRF: Double-Submit-Token auf allen mutierenden Requests (+ SameSite=Lax).
- Uploads: Typ-/Größen-Allowlist, Re-Encode via `sharp` (strippt EXIF/Metadaten).
- `noindex` + `robots.txt`-Disallow + Auth-Gate (`proxy.ts`) für alle Studio-Flächen.

## Lokal entwickeln

```
RESEND_API_KEY= npm run dev
```
Ohne KV/Blob/AUTH_SECRET greift der Dev-Fallback (In-Memory + `.studio-dev/`),
und der Magic-Link wird in die Server-Konsole geloggt statt gemailt.
