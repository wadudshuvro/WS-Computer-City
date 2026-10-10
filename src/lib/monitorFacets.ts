type SpecGroup = { rows: { name: string; value: string }[] };

function pipe(labels: string[]): string {
  const unique = [...new Set(labels)];
  return unique.length > 0 ? `|${unique.join('|')}|` : '';
}

function rowText(groups: SpecGroup[], pattern: RegExp): string {
  return groups
    .flatMap((group) => group.rows)
    .filter((row) => pattern.test(row.name))
    .map((row) => row.value)
    .join(' ');
}

function sizeBand(inches: number): string | null {
  if (inches >= 15 && inches <= 17) return '15-17 inch';
  if (inches >= 18 && inches <= 20) return '18-20 inch';
  if (inches >= 21 && inches <= 22) return '21-22 inch';
  if (inches >= 23 && inches <= 25) return '23-25 inch';
  if (inches >= 26 && inches <= 30) return '26-30 inch';
  if (inches >= 31 && inches <= 40) return '31-40 inch';
  if (inches >= 41 && inches <= 80) return '41 inch & Above';
  return null;
}

const REFRESH_OPTIONS = [
  100, 120, 144, 160, 165, 170, 175, 180, 200, 210, 220, 240, 255, 260, 275, 280, 300, 310, 320, 340, 360, 420, 425,
  480, 500, 520, 540,
];

function refreshBand(hz: number): string | null {
  if (hz > 0 && hz <= 75) return 'Up to 75 Hz';
  if (REFRESH_OPTIONS.includes(hz)) return `${hz} Hz`;
  return null;
}

function responseBand(ms: number): string | null {
  if (ms <= 0.5) return '≤ 0.5 ms';
  if (ms <= 4) return '1-4 ms';
  if (ms <= 7) return '5-7 ms';
  if (ms <= 12) return '8-12 ms';
  if (ms <= 14) return '13-14 ms';
  if (ms >= 15 && ms <= 40) return '15 and Above';
  return null;
}

export function classifyMonitorFacets(input: {
  name: string;
  features: string[];
  groups: SpecGroup[];
}): { key: string; value: string }[] {
  const specs: { key: string; value: string }[] = [];
  const sizeSource = `${rowText(input.groups, /size/i)} ${input.name}`;
  const inches = Number(/(\d{2}(?:\.\d+)?)\s*(?:inch|in\b|"|”)/i.exec(sizeSource)?.[1]);
  const size = Number.isFinite(inches) ? sizeBand(inches) : null;
  if (size) specs.push({ key: 'mon_size', value: pipe([size]) });

  const resolution = rowText(input.groups, /resolution/i);
  let resolutionLabel: string | null = null;
  if (/5120|5k/i.test(resolution)) resolutionLabel = '5K';
  else if (/3840|4k|uhd/i.test(resolution)) resolutionLabel = '4K UHD';
  else if (/2560|3440|2k|qhd|wqhd/i.test(resolution)) resolutionLabel = '2K QHD';
  else if (/1920|1080|fhd|full\s*hd/i.test(resolution)) resolutionLabel = 'FHD';
  else if (resolution) resolutionLabel = 'HD or Below';
  if (resolutionLabel) specs.push({ key: 'mon_resolution', value: pipe([resolutionLabel]) });

  const panel = rowText(input.groups, /panel/i);
  const panelLabel = /mini[-\s]?led/i.test(panel)
    ? 'Mini LED'
    : /oled/i.test(panel)
      ? 'OLED'
      : /\bips\b/i.test(panel)
        ? 'IPS'
        : /\bva\b/i.test(panel)
          ? 'VA'
          : /\btn\b/i.test(panel)
            ? 'TN'
            : null;
  if (panelLabel) specs.push({ key: 'mon_panel', value: pipe([panelLabel]) });

  const refreshText = rowText(input.groups, /refresh/i);
  const hzValues = [...refreshText.matchAll(/(\d{2,3})\s*hz/gi)].map((match) => Number(match[1]));
  const hz = hzValues.length ? Math.max(...hzValues) : 0;
  const refresh = hz ? refreshBand(hz) : null;
  if (refresh) specs.push({ key: 'mon_refresh', value: pipe([refresh]) });

  const responseText = rowText(input.groups, /response/i);
  const msValues = [...responseText.matchAll(/(\d+(?:\.\d+)?)\s*ms/gi)].map((match) => Number(match[1]));
  const ms = msValues.length ? Math.min(...msValues) : NaN;
  const response = Number.isFinite(ms) ? responseBand(ms) : null;
  if (response) specs.push({ key: 'mon_response', value: pipe([response]) });

  const inputText = `${rowText(input.groups, /input|port|interface|connectivity|signal/i)} ${input.features.join(' ')}`;
  const inputs: string[] = [];
  if (/usb\s*-?\s*c|type\s*-?\s*c|thunderbolt/i.test(inputText) && /type\s*-?\s*c|usb\s*-?\s*c/i.test(inputText)) {
    inputs.push('USB Type-C');
  }
  if (/thunderbolt/i.test(inputText)) inputs.push('Thunderbolt');
  if (/display\s*port|\bdp\b/i.test(inputText)) inputs.push('DisplayPort');
  if (/hdmi/i.test(inputText)) inputs.push('HDMI');
  if (/\bdvi\b/i.test(inputText)) inputs.push('DVI');
  if (/\bvga\b/i.test(inputText)) inputs.push('VGA');
  if (/d-sub|dsub/i.test(inputText)) inputs.push('D-SUB');
  if (/audio\s*jack|headphone\s*jack/i.test(inputText)) inputs.push('Audio Jack');
  const withoutTypeC = inputText.replace(/usb\s*-?\s*c|type\s*-?\s*c/gi, '');
  if (/\busb\b/i.test(withoutTypeC)) inputs.push('USB');
  if (inputs.length) specs.push({ key: 'mon_input', value: pipe(inputs) });

  const blob = `${input.name}\n${input.features.join('\n')}\n${input.groups
    .flatMap((group) => group.rows.map((row) => `${row.name} ${row.value}`))
    .join('\n')}`;
  const features: string[] = [];
  if (/height\s*adjust/i.test(blob)) features.push('Height Adjustable Stand');
  if (/touch\s*screen|touchscreen/i.test(blob)) features.push('Touch Screen');
  if (/built-?in speaker/i.test(blob) || /speaker/i.test(rowText(input.groups, /speaker|audio/i))) {
    features.push('Built-in Speaker');
  }
  if (/curved/i.test(blob)) features.push('Curved Screen');
  if (/webcam|web\s*cam/i.test(blob)) features.push('Built-in Webcam');
  if (/freesync/i.test(blob)) features.push('AMD FreeSync');
  if (/g-?sync/i.test(blob)) features.push('NVIDIA G-Sync');
  if (/\bgaming\b/i.test(input.name) || /\bgaming\b/i.test(input.features.join(' '))) features.push('Gaming');
  if (/ultra[-\s]?wide|21:9/i.test(blob)) features.push('Ultra-Wide');
  if (/wall\s*mount|vesa/i.test(blob)) features.push('Wall Mountable');
  if (/portable/i.test(input.name)) features.push('Portable');
  if (features.length) specs.push({ key: 'mon_feature', value: pipe(features) });

  return specs;
}
