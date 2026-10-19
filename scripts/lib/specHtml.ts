/**
 * Parse the Star Tech specification table while keeping each value's own lines.
 * Star Tech separates lines inside a cell with <br>. Collapsing them turns
 * "Display type: AMOLED<br>Display size: 1.43" into one run-on paragraph.
 */

export type SpecRow = { name: string; value: string };
export type SpecGroup = { title: string; rows: SpecRow[] };

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCharCode(parseInt(n, 16)));
}

/** One line of plain text (headings and row labels). */
export function plainText(value: string): string {
  return decodeEntities(value.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

/** Multi-line plain text: <br>, </p>, </li>, </div> become line breaks. */
export function linesText(value: string): string {
  const withBreaks = value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|div|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, '');
  return decodeEntities(withBreaks)
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

export function parseSpecGroups(html: string): SpecGroup[] {
  const start = html.indexOf('id="specification"');
  if (start < 0) return [];
  const end = html.indexOf('</section>', start);
  const block = html.slice(start, end > start ? end : start + 30000);
  const groups: SpecGroup[] = [];
  for (const part of block.split(/<thead>/i).slice(1)) {
    const title = plainText(/heading-row[^>]*>([\s\S]*?)<\/td>/i.exec(part)?.[1] || '');
    const rows: SpecRow[] = [];
    for (const row of part.matchAll(/<td\s+class="name">([\s\S]*?)<\/td>\s*<td\s+class="value">([\s\S]*?)<\/td>/gi)) {
      const name = plainText(row[1] || '');
      const value = linesText(row[2] || '');
      if (name && value) rows.push({ name, value });
    }
    if (title && rows.length > 0) groups.push({ title, rows });
  }
  return groups;
}
