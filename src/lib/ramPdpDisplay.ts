/**
 * Desktop RAM PDP display — Star Tech–style grouped specification table.
 */

export type RamPdpRow = {
  name: string;
  items: string[];
};

export type RamPdpGroup = {
  title: string;
  specs: RamPdpRow[];
};

const PDP_LABELS: Record<string, string> = {
  capacity: 'Memory Size',
  memory_type: 'Memory Type',
  speed: 'Bus Speed',
  latency: 'Latency',
  voltage: 'Voltage',
  power_consumption: 'Power Consumption',
  pin_count: 'Number-of-Pin',
  ram_features: 'Lighting Effect',
  other_features: 'Other Features',
  color: 'Color',
  warranty: 'Warranty',
};

const GROUP_ORDER: { title: string; keys: string[] }[] = [
  { title: 'Memory', keys: ['capacity', 'memory_type', 'speed', 'latency'] },
  { title: 'Battery And Power', keys: ['voltage', 'power_consumption'] },
  { title: 'Ports', keys: ['pin_count'] },
  { title: 'Special Features', keys: ['ram_features'] },
  { title: 'Others', keys: ['other_features'] },
  { title: 'Physical Specification', keys: ['color'] },
  { title: 'Warranty Information', keys: ['warranty'] },
];

function tidy(value: string): string {
  return value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function splitItems(raw: string): string[] {
  return raw
    .replace(/\r\n/g, '\n')
    .split(/\n|•|;/)
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
}

export function buildRamPdpGroups(
  getSpecValue: (key: string) => string | null
): RamPdpGroup[] {
  const groups: RamPdpGroup[] = [];

  for (const group of GROUP_ORDER) {
    const specs: RamPdpRow[] = [];
    for (const key of group.keys) {
      const raw = getSpecValue(key);
      if (key === 'warranty') {
        specs.push({
          name: PDP_LABELS[key] || 'Warranty',
          items: [tidy(raw || '') || 'No Warranty'],
        });
        continue;
      }
      if (!raw?.trim()) continue;
      const items = splitItems(raw);
      if (!items.length) continue;
      specs.push({
        name: PDP_LABELS[key] || key,
        items: items.length > 1 ? items : [tidy(items[0]!)],
      });
    }
    if (specs.length) groups.push({ title: group.title, specs });
  }

  // Always end with warranty
  if (!groups.some((g) => /warranty/i.test(g.title))) {
    groups.push({
      title: 'Warranty Information',
      specs: [{ name: 'Warranty', items: ['No Warranty'] }],
    });
  }

  return groups;
}

export function getRamListingCardLines(
  getSpecValue: (key: string) => string | null,
  shortDescription?: string | null
): string[] {
  const fromShort = (shortDescription || '')
    .split(/\r?\n|•/)
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
  if (fromShort.length >= 2) return fromShort.slice(0, 4);

  const lines: string[] = [];
  const capacity = getSpecValue('capacity');
  const type = getSpecValue('memory_type');
  const speed = getSpecValue('speed');
  const latency = getSpecValue('latency');
  const voltage = getSpecValue('voltage');

  if (capacity) lines.push(`Capacity: ${capacity}`);
  if (type && speed) lines.push(`Speed: ${type} ${speed}`);
  else if (speed) lines.push(`Speed: ${speed}`);
  else if (type) lines.push(`Memory Type: ${type}`);
  if (latency) lines.push(`Latency: ${latency}`);
  if (voltage) lines.push(`Voltage: ${voltage}`);
  return lines.slice(0, 4);
}

export function getRamHighlightLines(
  shortDescription: string | null | undefined,
  getSpecValue: (key: string) => string | null
): { label: string; value: string }[] {
  const fromShort = (shortDescription || '')
    .split(/\r?\n|•/)
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 5)
    .map((line) => {
      const idx = line.indexOf(':');
      if (idx > 0 && idx < 28) {
        return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
      }
      return { label: '', value: line };
    })
    .filter((row) => row.value);
  if (fromShort.length) return fromShort;

  const fallback: { label: string; value: string }[] = [];
  const capacity = getSpecValue('capacity');
  const type = getSpecValue('memory_type');
  const speed = getSpecValue('speed');
  const latency = getSpecValue('latency');
  if (capacity) fallback.push({ label: 'Capacity', value: capacity });
  if (type) fallback.push({ label: 'Type', value: type });
  if (speed) fallback.push({ label: 'Speed', value: speed });
  if (latency) fallback.push({ label: 'Latency', value: latency });
  return fallback.slice(0, 4);
}

export function getRamModelName(productName: string): string {
  return productName.replace(/\s+desktop\s+ram$/i, '').replace(/\s+/g, ' ').trim();
}
