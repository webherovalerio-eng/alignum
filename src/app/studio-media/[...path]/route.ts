import { isProd } from "@/studio/config";
import { readDevImage } from "@/studio/blob";

export const runtime = "nodejs";

/**
 * Liefert lokal (Dev) gespeicherte Studio-Bilder aus. In Produktion nutzt das
 * Studio direkte Vercel-Blob-URLs; diese Route ist dort deaktiviert (404).
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  if (isProd) return new Response(null, { status: 404 });
  const { path } = await ctx.params;
  const key = path.join("/");
  // Pfad-Traversal-Schutz.
  if (key.includes("..")) return new Response(null, { status: 400 });
  const buf = await readDevImage(key);
  if (!buf) return new Response(null, { status: 404 });
  const ext = key.split(".").pop()?.toLowerCase();
  const type =
    ext === "png"
      ? "image/png"
      : ext === "webp"
        ? "image/webp"
        : "image/jpeg";
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": type,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
