type SpecGroup = { rows: { name: string; value: string }[] };

function pipe(labels: string[]): string {
  const unique = [...new Set(labels)];
  return unique.length > 0 ? `|${unique.join('|')}|` : '';
}

function blob(input: { name: string; features: string[]; groups: SpecGroup[] }): string {
  const rows = input.groups.flatMap((group) => group.rows.map((row) => `${row.name} ${row.value}`));
  return [input.name, ...input.features, ...rows].join(' ');
}

function maxMbps(text: string): number {
  let max = 0;
  for (const match of text.matchAll(/(\d+(?:\.\d+)?)\s*gbps/gi)) {
    max = Math.max(max, Number(match[1]) * 1000);
  }
  for (const match of text.matchAll(/(\d+(?:\.\d+)?)\s*mbps/gi)) {
    max = Math.max(max, Number(match[1]));
  }
  for (const match of text.matchAll(/\b(?:ac|ax|be|n)(\d{3,5})\b/gi)) {
    const value = Number(match[1]);
    if (value >= 150 && value <= 30000) max = Math.max(max, value);
  }
  return max;
}

function speedBand(mbps: number): string | null {
  if (mbps <= 0) return null;
  if (mbps <= 300) return 'Up to 300 Mbps';
  if (mbps <= 750) return '301 Mbps to 750 Mbps';
  if (mbps <= 1200) return '751 Mbps to 1200 Mbps';
  if (mbps <= 1800) return '1201 Mbps to 1800 Mbps';
  return '1801 Mbps and Above';
}

function lanCount(text: string): string | null {
  const patterns = [
    /(\d+)\s*[x×]\s*(?:10\/100(?:\/1000)?(?:\s*mbps)?\s*)?lan/i,
    /(\d+)\s*lan\s*ports?/i,
    /lan\s*ports?\s*[:\-]?\s*(\d+)/i,
  ];
  let count = 0;
  for (const pattern of patterns) {
    const value = Number(pattern.exec(text)?.[1]);
    if (value > count && value <= 16) count = value;
  }
  if (count <= 0) return null;
  if (count >= 5) return '5 and Above';
  return String(count);
}

export function classifyRouterFacets(input: {
  name: string;
  features: string[];
  groups: SpecGroup[];
}): { key: string; value: string }[] {
  const text = blob(input);
  const specs: { key: string; value: string }[] = [];

  const types = [
    /gaming/i.test(text) ? 'Gaming Router' : null,
    /mesh/i.test(text) ? 'Mesh Router' : null,
    /\b(?:sim|4g|5g|lte)\b/i.test(text) ? 'SIM Router' : null,
    /\b(?:onu|gpon|epon|xpon|ont)\b/i.test(text) ? 'ONU Router' : null,
    /\bvpn\b/i.test(text) ? 'VPN Router' : null,
    /enterprise/i.test(text) ? 'Enterprise Router' : null,
    /gigabit/i.test(text) ? 'Gigabit Router' : null,
  ].filter((label): label is string => Boolean(label));
  if (types.length === 0) types.push('Standard Router');
  specs.push({ key: 'rt_type', value: pipe(types) });

  const wifi = [
    /wi-?fi\s*7|802\.11\s*be|\bbe\d{4,5}\b/i.test(text) ? 'Wi-Fi 7' : null,
    /wi-?fi\s*6e|6e/i.test(text) ? 'Wi-Fi 6E' : null,
    /wi-?fi\s*6|802\.11\s*ax|\bax\d{3,5}\b/i.test(text) ? 'Wi-Fi 6' : null,
    /wi-?fi\s*5|802\.11\s*ac|\bac\d{3,5}\b/i.test(text) ? 'Wi-Fi 5' : null,
    /wi-?fi\s*4|802\.11\s*n|\bn\d{3}\b/i.test(text) ? 'Wi-Fi 4' : null,
  ].filter((label): label is string => Boolean(label));
  if (wifi.length > 0) specs.push({ key: 'rt_wifi', value: pipe(wifi) });

  const speed = speedBand(maxMbps(text));
  if (speed) specs.push({ key: 'rt_speed', value: pipe([speed]) });

  const band = /quad[-\s]?band/i.test(text)
    ? 'Quad-Band'
    : /tri[-\s]?band/i.test(text)
      ? 'Tri-Band'
      : /dual[-\s]?band|2\.4\s*ghz[\s\S]{0,40}5\s*ghz|5\s*ghz[\s\S]{0,40}2\.4\s*ghz/i.test(text)
        ? 'Dual Band'
        : /single[-\s]?band|2\.4\s*ghz/i.test(text)
          ? 'Single Band'
          : null;
  if (band) specs.push({ key: 'rt_band', value: pipe([band]) });

  const lan = lanCount(text);
  if (lan) specs.push({ key: 'rt_lan', value: pipe([lan]) });

  const featureMap: Array<[RegExp, string]> = [
    [/\busb\b/i, 'USB Port'],
    [/repeater|wisp/i, 'Repeater Mode'],
    [/access point|\bap mode\b/i, 'Access Point Mode'],
    [/parental/i, 'Parental Controls'],
    [/mesh/i, 'Mesh Support / Compatibile'],
    [/backhaul/i, 'Dedicated Backhaul'],
    [/\bapp\b/i, 'App Control'],
    [/guest network/i, 'Guest Network'],
    [/\bvpn\b/i, 'Built-in VPN'],
    [/\bqos\b|bandwidth control/i, 'QoS / Bandwidth Control'],
    [/antivirus/i, 'Built-in Antivirus'],
    [/mu-?mimo/i, 'MU-MIMO'],
    [/beamforming/i, 'Beamforming'],
    [/smart home/i, 'Smart Home Compatibility'],
    [/\biptv\b/i, 'IPTV Support'],
  ];
  const features = featureMap.filter(([pattern]) => pattern.test(text)).map(([, label]) => label);
  if (features.length > 0) specs.push({ key: 'rt_feature', value: pipe(features) });

  return specs;
}
