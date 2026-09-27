/**
 * Turn stored motherboard CMS specs into Techland-style PDP rows:
 * section headers + label / readable multi-line values.
 */

export type MotherboardPdpRow = {
  name: string;
  items: string[];
};

export type MotherboardPdpGroup = {
  title: string;
  specs: MotherboardPdpRow[];
};

function cleanItem(value: string): string {
  return value
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*[-–—]\s*$/g, '')
    .trim();
}

function uniqueItems(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const clean = cleanItem(item);
    if (!clean || clean.length < 2) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
  }
  return out;
}

/** Re-introduce Techland-style line breaks in flattened manufacturer text. */
export function formatMotherboardSpecText(value: string): string {
  if (!value) return '';

  let text = value.replace(/\r\n/g, '\n').replace(/\u00a0/g, ' ');

  text = text.replace(
    /(?<!\n)\s+(?=(?:HDMI|DisplayPort|Display Port|D-Sub|VGA|USB(?:\s*\(s\))?|LAN(?:\s*Port(?:\s*\(s\))?)?|Internal I\/O(?:\s*Ports)?|Wireless|Wi-?Fi|TPM|Connector|PCI)\s*:)/gi,
    '\n'
  );
  text = text.replace(/(?<![Tt]he)\s+(?=(?:CPU|Chipset)\s*:)/g, '\n');
  text = text.replace(/:\s+[-–—]\s+/g, ':\n- ');
  text = text.replace(/\s+[-–—]\s+(?=(?:AMD|Intel|\d+\s*[xX]\s))/g, '\n- ');
  text = text.replace(/\s+(\*{1,2})\s+/g, '\n$1 ');
  text = text.replace(/(?<!\n|- )(?<=\S)\s+(?=\d+\s*[xX]\s+[A-Za-z0-9])/g, '\n');
  text = text.replace(/(?<!\n)\s+(?=Back Panel Connectors)/gi, '\n');
  text = text.replace(/connectors\s+RAID/gi, 'connectors\nRAID');
  text = text.replace(
    /(RAID 0, RAID 1, and RAID 10 support for NVMe SSD storage devices)\s+(RAID 0, RAID 1, and RAID 10 support for SATA)/gi,
    '$1\n$2'
  );
  text = text.replace(/(?<!\*)\s+(?=Support for )/g, '\n');

  return text
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

export function splitMotherboardSpecItems(raw: string): string[] {
  if (!raw) return [];
  const formatted = formatMotherboardSpecText(raw);
  const lines = formatted
    .split('\n')
    .map((line) => line.replace(/^[-–—•]\s*/, '').trim())
    .filter((line) => line && !/^\*{1,2}$/.test(line) && !/^PCI:\s*$/i.test(line));
  return uniqueItems(lines);
}

const PORT_TOP_LABELS = new Set([
  'hdmi',
  'displayport',
  'display port',
  'd sub',
  'd-sub',
  'vga',
  'usb',
  'usb s',
  'lan',
  'lan port',
  'lan port s',
  'internal i o',
  'internal i o ports',
  'wireless',
  'wifi',
  'wi fi',
  'tpm',
  'connector',
  'ports',
]);

function normalizePortLabel(label: string): string {
  const n = label.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  if (n.startsWith('usb')) return 'USB';
  if (n.includes('internal')) return 'Internal I/O Ports';
  if (n.includes('lan')) return 'LAN';
  if (n.includes('hdmi')) return 'HDMI';
  if (n.includes('display')) return 'DisplayPort';
  if (n.includes('wireless') || n.includes('wifi') || n.includes('wi fi')) return 'Wireless';
  if (n.includes('tpm')) return 'TPM';
  if (n.includes('vga') || n.includes('d sub')) return 'Video';
  return label.replace(/\s*\(s\)\s*$/i, '').trim();
}

function isPortTopLabel(label: string): boolean {
  const n = label.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  return PORT_TOP_LABELS.has(n);
}

function parsePortRows(raw: string): MotherboardPdpRow[] {
  const formatted = formatMotherboardSpecText(raw);
  const rows: MotherboardPdpRow[] = [];
  let currentName = 'Connector';
  let currentLines: string[] = [];

  const flush = () => {
    const items = uniqueItems(currentLines.map((line) => line.replace(/^[-–—•]\s*/, '')));
    if (items.length) rows.push({ name: currentName, items });
    currentLines = [];
  };

  for (const line of formatted.split('\n')) {
    if (/^Back Panel Connectors$/i.test(line)) {
      flush();
      currentName = 'Connector';
      continue;
    }
    if (/^Internal I\/O Connectors$/i.test(line)) {
      continue;
    }
    const match = /^([A-Za-z][A-Za-z0-9 .\/()]{0,40}):\s*(.*)$/.exec(line);
    if (match && isPortTopLabel(match[1]!)) {
      flush();
      currentName = normalizePortLabel(match[1]!);
      if (match[2]?.trim()) currentLines.push(match[2].trim());
    } else {
      currentLines.push(line);
    }
  }
  flush();
  return rows.length ? rows : [{ name: 'Connector', items: splitMotherboardSpecItems(raw) }];
}

function parseFormFactor(raw: string): { form: string; dimension?: string } {
  const clean = cleanItem(raw);
  const formMatch = clean.match(
    /mini[-\s]?itx|micro[-\s]?atx|extended[-\s]?atx|e-?atx|\bmatx\b|\batx\b/i
  );
  const dimMatch = clean.match(
    /(\d+(?:\.\d+)?\s*(?:cm|mm|in)\s*[x×]\s*\d+(?:\.\d+)?\s*(?:cm|mm|in))/i
  );
  const form = formMatch
    ? formMatch[0]
        .replace(/micro[-\s]?atx/i, 'Micro ATX')
        .replace(/mini[-\s]?itx/i, 'Mini ITX')
        .replace(/extended[-\s]?atx|e-?atx/i, 'Extended ATX')
        .replace(/\bmatx\b/i, 'Micro ATX')
        .replace(/\batx\b/i, 'ATX')
    : clean.split(/[.;]/)[0]!.replace(/form factor/i, '').trim();
  return { form, dimension: dimMatch?.[1]?.replace(/\s+/g, ' ') };
}

function shortenCpu(raw: string): string {
  const first = raw.split(/,|\s+support for\s*:?/i)[0]?.trim() || raw;
  return cleanItem(first);
}

function extractGraphicsOutputs(raw: string): string {
  const ports = [
    ...raw.matchAll(/(\d+)\s*[xX]\s*(Display\s*Ports?|HDMI|VGA|D-Sub|DVI)/gi),
  ].map((match) => `${match[1]}x ${match[2]!.replace(/\s+/g, ' ')}`);
  if (ports.length) return uniqueItems(ports).join(', ');
  return splitMotherboardSpecItems(raw)[0] || cleanItem(raw).slice(0, 80);
}

function extractFeatureLine(special: string | null, ports: string | null): string {
  if (special) {
    const first = special.split(/\*|Support for /i).map((s) => cleanItem(s)).find((s) => s.length > 3);
    if (first) return first.slice(0, 90);
  }
  const lan = ports?.match(/Realtek[^:\n]+(?:LAN|Wi-?Fi)[^:\n]*/i)?.[0];
  return lan ? cleanItem(lan).slice(0, 90) : '';
}

export function buildMotherboardPdpGroups(
  getSpecValue: (key: string) => string | null
): MotherboardPdpGroup[] {
  const groups: MotherboardPdpGroup[] = [];
  const add = (title: string, specs: MotherboardPdpRow[]) => {
    const cleaned = specs.filter((spec) => spec.items.length > 0);
    if (cleaned.length) groups.push({ title, specs: cleaned });
  };

  const cpu = getSpecValue('supported_cpu');
  const chipset = getSpecValue('chipset');
  const formRaw = getSpecValue('form_factor') || '';
  const form = formRaw ? parseFormFactor(formRaw) : null;

  add('Processor', cpu ? [{ name: 'CPU', items: splitMotherboardSpecItems(cpu) }] : []);
  add('Mainboard', chipset ? [{ name: 'Chipset', items: [cleanItem(chipset)] }] : []);

  const memType = getSpecValue('memory_type');
  const memSize = getSpecValue('memory_size');
  add('Memory', [
    ...(memType ? [{ name: 'Type', items: [cleanItem(memType)] }] : []),
    ...(memSize ? [{ name: 'Maximum Memory', items: [cleanItem(memSize)] }] : []),
  ]);

  const storage = getSpecValue('storage_slots');
  if (storage) add('Storage', [{ name: 'Storage Interface', items: splitMotherboardSpecItems(storage) }]);

  const graphics = getSpecValue('graphics');
  if (graphics) add('Graphics', [{ name: 'Graphics', items: splitMotherboardSpecItems(graphics) }]);

  const ports = getSpecValue('ports_connectors');
  const portRows = ports ? parsePortRows(ports) : [];
  const lanRow = portRows.find((row) => row.name === 'LAN');
  const otherPortRows = portRows.filter((row) => row.name !== 'LAN');

  if (lanRow) add('Networking & Connectivity', [{ name: 'LAN', items: lanRow.items }]);

  const audio = getSpecValue('audio');
  if (audio) add('Audio & Microphone', [{ name: 'Audio', items: splitMotherboardSpecItems(audio) }]);

  if (otherPortRows.length) add('Ports', otherPortRows);

  const special = getSpecValue('special_features');
  if (special) {
    add('Special Features', [{ name: 'Features', items: splitMotherboardSpecItems(special) }]);
  }

  const expansion = getSpecValue('expansion_slots');
  add('Physical Specification', [
    ...(expansion
      ? [{ name: 'Expansion Slots', items: splitMotherboardSpecItems(expansion) }]
      : []),
    ...(form?.form ? [{ name: 'Form Factor', items: [form.form] }] : []),
    ...(form?.dimension ? [{ name: 'Dimension', items: [form.dimension] }] : []),
  ]);

  add('Warranty Information', [
    { name: 'Warranty', items: [cleanItem(getSpecValue('warranty') || '') || 'No Warranty'] },
  ]);

  return groups;
}

export function getMotherboardHighlightLines(
  getSpecValue: (key: string) => string | null
): { label: string; value: string }[] {
  const lines: { label: string; value: string }[] = [];
  const cpu = getSpecValue('supported_cpu');
  const chipset = getSpecValue('chipset');
  const memory = getSpecValue('memory_type');
  const form = getSpecValue('form_factor');

  if (cpu) lines.push({ label: 'CPU', value: shortenCpu(cpu) });
  if (chipset) lines.push({ label: 'Chipset', value: cleanItem(chipset).replace(/\s*chipset$/i, '') });
  if (memory) lines.push({ label: 'Memory Type', value: cleanItem(memory) });
  if (form) lines.push({ label: 'Form Factor', value: parseFormFactor(form).form });
  return lines.slice(0, 4);
}

export function getMotherboardListingCardLines(
  getSpecValue: (key: string) => string | null,
  shortDescription?: string | null
): string[] {
  const fromShort = (shortDescription || '')
    .split(/\r?\n|•/)
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);

  const labeled = fromShort.filter((line) =>
    /^(supported cpu|supported ram|graphics output|features)\s*:/i.test(line)
  );
  if (labeled.length >= 3) return labeled.slice(0, 4);
  if (fromShort.length >= 3 && fromShort.every((line) => line.length < 120)) {
    return fromShort.slice(0, 4);
  }

  const lines: string[] = [];
  const cpu = getSpecValue('supported_cpu');
  const memType = getSpecValue('memory_type');
  const memSize = getSpecValue('memory_size');
  const graphics = getSpecValue('graphics');
  const special = getSpecValue('special_features');
  const ports = getSpecValue('ports_connectors');

  if (cpu) lines.push(`Supported CPU: ${shortenCpu(cpu)}`);
  if (memType || memSize) {
    lines.push(`Supported RAM: ${[memType, memSize ? `up to ${memSize}` : ''].filter(Boolean).join(', ')}`);
  }
  if (graphics) lines.push(`Graphics Output: ${extractGraphicsOutputs(graphics)}`);
  const feature = extractFeatureLine(special, ports);
  if (feature) lines.push(`Features: ${feature}`);
  return lines.slice(0, 4);
}

export function getMotherboardModelName(productName: string): string {
  return productName
    .replace(
      /^\s*(GIGABYTE|Gigabyte|ASUS|Asus|MSI|ASRock|ASROCK|Colorful|COLORFUL|XENTHRA|Biostar|NZXT|MAXSUN)\s+/i,
      ''
    )
    .replace(/\s+motherboard$/i, '')
    .replace(
      /\b(DDR[345]|AM[45]|TR5|sTRX4|LGA\s?\d+|Micro[-\s]?ATX|mATX|Mini[-\s]?ITX|Extended[-\s]?ATX|ATX|Wi-?Fi\s*\d*E?)\b/gi,
      ''
    )
    .replace(/\s+/g, ' ')
    .trim();
}
