/** Shared text helpers for storefront search. Safe to import on server and client. */

export const MAX_QUERY_LENGTH = 80;
export const MAX_TOKENS = 6;

export function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** "i5-12400F" -> ["i5", "12400f"]. Letters and digits only, so tokens are safe inside LIKE patterns. */
export function tokenize(query: string): string[] {
  const tokens = query
    .slice(0, MAX_QUERY_LENGTH)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  const unique = Array.from(new Set(tokens)).slice(0, MAX_TOKENS);
  // One-letter tokens ("g" in "g502") add noise; keep them only when nothing else is left.
  const useful = unique.filter((t) => t.length > 1 || /^\d$/.test(t));
  const picked = useful.length > 0 ? useful : unique;
  // Plain plural words: "keyboards" -> "keyboard". Model numbers like "b550s" are left alone.
  return picked.map((t) => (/^[a-z]{5,}$/.test(t) && t.endsWith('s') && !t.endsWith('ss') ? t.slice(0, -1) : t));
}

/** Drops the last character of longer words so a typo near the end still reaches the real word. */
export function stem(token: string): string {
  return token.length >= 6 ? token.slice(0, -1) : token;
}

export function isSearchable(query: string): boolean {
  return normalizeText(query.slice(0, MAX_QUERY_LENGTH)).length >= 2;
}
