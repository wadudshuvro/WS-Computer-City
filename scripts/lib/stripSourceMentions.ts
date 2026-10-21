/**
 * Removes another retailer's name and its store-specific marketing lines from imported text,
 * so product descriptions never advertise (or claim to be) that shop.
 *
 * Used by the one-time cleanup (scripts/remove-source-mentions.ts) and by the import scripts.
 */

const NAME = /star\s*tech/i;

function plain(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Template lines that only make sense on the other shop's own pages. */
function isShopTemplateLine(text: string): boolean {
  return (
    /^we have a large collection of\b/i.test(text) ||
    /^order (online|now)\b.*\b(lowest|best) price\b/i.test(text) ||
    /^order\b.*\bat (the )?(lowest|best) price\b/i.test(text) ||
    /^order online or visit\b/i.test(text)
  );
}

function cleanInline(inner: string, dropTemplate: boolean): string {
  const sentences = inner.split(/(?<=[.!?])\s+(?=[A-Z(<&])/);
  const kept = sentences.filter((sentence) => {
    const text = plain(sentence);
    if (!text) return false;
    if (NAME.test(text)) return false;
    if (dropTemplate && isShopTemplateLine(text)) return false;
    return true;
  });
  return kept.join(' ').trim();
}

/** HTML description: drops the sentences/paragraphs that name the other shop. */
export function stripSourceFromHtml(html: string | null | undefined): string | null {
  if (!html) return html ?? null;
  const mentions = NAME.test(html);
  if (!mentions) return html;

  if (/<p[\s>]/i.test(html)) {
    const cleaned = html.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (_match, attrs: string, inner: string) => {
      const text = cleanInline(inner, true);
      return plain(text) ? `<p${attrs}>${text}</p>` : '';
    });
    // Anything outside <p> (rare) that still names the shop.
    const leftover = cleanInline(cleaned, true);
    const result = NAME.test(plain(leftover)) ? leftover.replace(/\s{2,}/g, ' ') : cleaned;
    return plain(result) ? result : null;
  }

  const result = cleanInline(html, true);
  return plain(result) ? result : null;
}

/** Plain text such as a warranty line: removes "(Star Tech will not ...)" style notes. */
export function stripSourceFromText(value: string): string {
  if (!NAME.test(value)) return value;
  const withoutBrackets = value.replace(/\s*\([^()]*star\s*tech[^()]*\)\.?/gi, '');
  const cleaned = cleanInline(withoutBrackets, false);
  return cleaned || withoutBrackets.replace(/star\s*tech/gi, '').trim();
}

/** Specification JSON ([{title, rows:[{name,value}]}]) or plain text. */
export function stripSourceFromSpec(value: string): string {
  if (!NAME.test(value)) return value;
  const trimmed = value.trim();
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      const walk = (node: unknown): unknown => {
        if (typeof node === 'string') return stripSourceFromText(node);
        if (Array.isArray(node)) return node.map(walk);
        if (node && typeof node === 'object') {
          return Object.fromEntries(Object.entries(node as Record<string, unknown>).map(([k, v]) => [k, walk(v)]));
        }
        return node;
      };
      return JSON.stringify(walk(parsed));
    } catch {
      /* fall through to plain text handling */
    }
  }
  return stripSourceFromText(value);
}
