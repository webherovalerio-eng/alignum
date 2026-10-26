import { guard } from "@/studio/api";
import { isImageKey, openImage } from "@/studio/blob";

export const runtime = "nodejs";

/**
 * Einzige Auslieferung der Studio-Bilder (privater Blob-Store, lokal
 * `.studio-dev/blob/`). Studio-Bilder sind NICHT veröffentlicht → nur mit
 * gültiger Studio-Session (guard: Session + Allowlist + Token-Version).
 *
 * - Pfad muss exakt `{postId}/{12 hex}.jpg` sein (kein `..`, kein `kv/…` →
 *   KV-Einträge wie Sessions/Magic-Links sind hierüber nie abrufbar).
 * - `Cache-Control: private, no-store` — keine Ablage in geteilten Caches/CDN.
 * - Fester Content-Type (Uploads werden serverseitig immer als JPEG neu
 *   kodiert) + `nosniff`.
 *
 * Die öffentliche Website nutzt diese Route NICHT: veröffentlichte Projektbilder
 * liegen als statische Dateien unter public/images/projects/ (alignum-projects-
 * Skill via studio-pull).
 */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const g = await guard(req);
  if (g instanceof Response) return g;

  const { path } = await ctx.params;
  const key = path.join("/");
  if (!isImageKey(key)) return notFound();

  let img;
  try {
    img = await openImage(key);
  } catch (e) {
    console.error("[studio] Bild-Auslieferung fehlgeschlagen:", e);
    return new Response(null, { status: 502, headers: baseHeaders() });
  }
  if (!img) return notFound();

  const headers = baseHeaders();
  headers.set("Content-Type", "image/jpeg");
  headers.set("Content-Disposition", "inline");
  if (img.size) headers.set("Content-Length", String(img.size));
  return new Response(img.stream, { headers });
}

function baseHeaders(): Headers {
  return new Headers({
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow",
  });
}

function notFound(): Response {
  return new Response(null, { status: 404, headers: baseHeaders() });
}
