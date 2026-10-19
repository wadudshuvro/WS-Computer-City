import { prisma } from '@/lib/prisma';
import { tokenize } from '@/lib/search/text';

const CACHE_MS = 5 * 60_000;
let vocab: { at: number; words: Map<string, number> } | null = null;

async function loadVocabulary(): Promise<Map<string, number>> {
  if (vocab && Date.now() - vocab.at < CACHE_MS) return vocab.words;
  const rows = await prisma.$queryRaw<{ text: string }[]>`
    SELECT concat_ws(' ', p.name, b.name, c.name) AS text
    FROM products p
    JOIN categories c ON c.id = p."categoryId"
    LEFT JOIN brands b ON b.id = p."brandId"
    WHERE p."isActive" = true
  `;
  const words = new Map<string, number>();
  for (const row of rows) {
    for (const w of row.text.toLowerCase().split(/[^a-z]+/)) {
      if (w.length >= 3) words.set(w, (words.get(w) ?? 0) + 1);
    }
  }
  vocab = { at: Date.now(), words };
  return words;
}

/** Optimal string alignment distance (counts a swapped pair as one edit), with an early cut-off. */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2: number[] = [];
  let prev: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur: number[] = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min((prev[j] ?? 0) + 1, (cur[j - 1] ?? 0) + 1, (prev[j - 1] ?? 0) + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, (prev2[j - 2] ?? Infinity) + 1);
      }
      cur[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[b.length] ?? max + 1;
}

/**
 * Fixes small typos using words that really exist in the catalog ("keybord" -> "keyboard").
 * Returns null when nothing needed fixing or nothing close was found.
 */
export async function correctQuery(query: string): Promise<string | null> {
  const tokens = tokenize(query);
  if (tokens.length === 0) return null;
  const words = await loadVocabulary();
  const known = (t: string) => {
    for (const w of words.keys()) if (w.includes(t)) return true;
    return false;
  };

  let changed = false;
  const fixed = tokens.map((token) => {
    // Model numbers and short tokens are matched literally.
    if (token.length < 4 || !/^[a-z]+$/.test(token) || known(token)) return token;
    const max = token.length >= 7 ? 2 : 1;
    let best: { word: string; d: number; n: number } | null = null;
    for (const [word, n] of words) {
      const d = distance(token, word, max);
      if (d > max) continue;
      if (!best || d < best.d || (d === best.d && n > best.n)) best = { word, d, n };
    }
    if (!best) return token;
    changed = true;
    return best.word;
  });

  return changed ? fixed.join(' ') : null;
}
