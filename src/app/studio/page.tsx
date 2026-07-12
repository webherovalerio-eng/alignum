import Link from "next/link";
import { listPosts } from "@/studio/posts";
import { NewPostButton } from "./NewPostButton";
import { StatusBadge } from "./StatusBadge";

export const dynamic = "force-dynamic";

export default async function StudioHome() {
  const posts = await listPosts();

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground">Beiträge</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Projekte für Social-Media &amp; Supporting-Content der City-Pages.
          </p>
        </div>
        <NewPostButton />
      </div>

      {posts.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-border bg-card/50 p-12 text-center">
          <p className="text-sm text-muted-foreground">
            Noch keine Beiträge. Lege den ersten an – lade Fotos hoch, wähle die
            besten aus und trage Ort &amp; Holzart ein.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {posts.map((p) => {
            const cover = p.images.find((i) => i.selected) ?? p.images[0];
            const selectedCount = p.images.filter((i) => i.selected).length;
            return (
              <li key={p.id}>
                <Link
                  href={`/studio/${p.id}`}
                  className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-3 transition-colors hover:border-primary"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius)] bg-muted">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover.url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {p.moebeltyp || "Ohne Titel"}
                      {p.ortName ? ` · ${p.ortName}` : ""}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {p.images.length} Bild(er)
                      {selectedCount ? ` · ${selectedCount} ausgewählt` : ""} ·{" "}
                      {new Date(p.createdAt).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
