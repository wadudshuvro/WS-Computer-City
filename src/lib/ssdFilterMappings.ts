import { SSD_SPEC_FILTER_KEYS } from '@/lib/ssdSpecDefinitions';

export { SSD_SPEC_FILTER_KEYS };

/** Map Star Tech capacity bucket → possible CMS/DB capacity strings */
export function mapCapacityFilterToDbValues(filterValue: string): string[] {
  switch (filterValue) {
    case '120GB-128GB':
      return ['120 GB', '120GB', '128 GB', '128GB'];
    case '240GB-256GB':
      return ['240 GB', '240GB', '250 GB', '256 GB', '256GB'];
    case '480GB-512GB':
      return ['480 GB', '480GB', '500 GB', '500GB', '512 GB', '512GB'];
    case '1TB-2TB':
      return ['960 GB', '960GB', '1 TB', '1TB', '2 TB', '2TB'];
    case 'Over 2TB':
      return ['4 TB', '4TB', '8 TB', '8TB'];
    default:
      return [filterValue];
  }
}

export function capacityDbValueMatches(filterValue: string, dbValue: string): boolean {
  const candidates = mapCapacityFilterToDbValues(filterValue);
  const normalizedDb = dbValue.replace(/\s+/g, '').toLowerCase();
  return candidates.some((c) => normalizedDb === c.replace(/\s+/g, '').toLowerCase());
}

export function interfaceDbValueMatches(filterValue: string, dbValue: string): boolean {
  const d = dbValue.toLowerCase();
  if (filterValue === 'SATA') {
    return d.includes('sata') && !d.includes('nvme');
  }
  if (filterValue === 'NVMe') {
    return d.includes('nvme') || d.includes('pcie');
  }
  return d.includes(filterValue.toLowerCase());
}

export function formFactorDbValueMatches(filterValue: string, dbValue: string): boolean {
  const d = dbValue.toLowerCase().replace(/\s+/g, '');
  if (filterValue === '2.5 Inch') {
    return d.includes('2.5') || d.includes('2.5inch') || d.includes('sata');
  }
  if (filterValue === 'M.2') {
    return d.includes('m.2') || d.includes('m2') || d.includes('2280');
  }
  return d.includes(filterValue.toLowerCase().replace(/\s+/g, ''));
}

export function pcieGenDbValueMatches(filterValue: string, dbValue: string): boolean {
  const d = dbValue.toLowerCase().replace(/\s+/g, '');
  const gen = filterValue.replace(/Gen/i, '').trim();
  return (
    d.includes(`gen${gen}`) ||
    d.includes(`pcie${gen}`) ||
    d.includes(`pci-e${gen}`) ||
    d.includes(`${gen}.0`) ||
    dbValue.toLowerCase() === filterValue.toLowerCase()
  );
}

export function technologyDbValueMatches(filterValue: string, dbValue: string): boolean {
  return dbValue.toLowerCase().includes(filterValue.toLowerCase());
}

export function dramDbValueMatches(filterValue: string, dbValue: string): boolean {
  const d = dbValue.toLowerCase();
  if (filterValue === 'With DRAM') {
    return (
      (d.includes('dram') || d.includes('with dram')) &&
      !d.includes('dram-less') &&
      !d.includes('dramless') &&
      !d.includes('no dram')
    );
  }
  if (filterValue === 'DRAM-less') {
    return d.includes('dram-less') || d.includes('dramless') || d.includes('no dram') || d.includes('hmb');
  }
  return d.includes(filterValue.toLowerCase());
}

export function speedBucketDbValueMatches(filterValue: string, dbValue: string): boolean {
  // Exact match when CMS stores the bucket label
  if (dbValue.trim().toLowerCase() === filterValue.toLowerCase()) return true;

  // Numeric MB/s fallback
  const numMatch = dbValue.replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*(mb\/?s|mbps)?/i);
  if (!numMatch) return false;
  const speed = Number(numMatch[1]);
  if (Number.isNaN(speed)) return false;

  switch (filterValue) {
    case 'Up to 500MB/s':
      return speed <= 500;
    case '500MB/s to 900MB/s':
      return speed > 500 && speed <= 900;
    case '900MB/s to 4000MB/s':
      return speed > 900 && speed < 4000;
    case '4000MB/s & Above':
      return speed >= 4000;
    case 'Up to 400MB/s':
      return speed <= 400;
    case '400MB/s to 1000MB/s':
      return speed > 400 && speed < 1000;
    case '1000MB/s & Above':
      return speed >= 1000;
    default:
      return false;
  }
}
