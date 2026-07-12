/**
 * Client-Helfer: hängt das CSRF-Token (aus dem lesbaren Cookie) als Header an
 * jede mutierende Anfrage. Nur im Browser verwenden.
 */
export function readCsrfToken(): string {
  const m = document.cookie.match(
    /(?:^|;\s*)(?:__Host-)?studio_csrf=([^;]+)/,
  );
  return m ? decodeURIComponent(m[1]) : "";
}

/** Erzwingt Trailing-Slash vor dem Query — die Seite läuft mit trailingSlash:true,
 *  sonst 308-Redirect auf jede API-Mutation. */
function withTrailingSlash(input: string): string {
  const [path, query] = input.split("?");
  const p = path.endsWith("/") ? path : `${path}/`;
  return query ? `${p}?${query}` : p;
}

export async function studioFetch(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("x-studio-csrf", readCsrfToken());
  return fetch(withTrailingSlash(input), { ...init, headers });
}
