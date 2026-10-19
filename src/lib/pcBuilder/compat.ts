/**
 * PC Builder compatibility and power helpers. Pure functions, safe on server and client.
 * Compatibility is read from saved product specs; nothing is assumed when a spec is missing.
 */
import type { SlotId } from '@/lib/pcBuilder/slots';

export type CpuMaker = 'intel' | 'amd';

/** What the builder remembers about a chosen part. */
export type BuilderProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
  href: string;
  brand: string | null;
  bullets: string[];
  /** Estimated draw in watts, or null when unknown. */
  watts: number | null;
  /** Normalised CPU socket, e.g. LGA1700 or AM5. */
  socket: string | null;
  /** DDR generations a board or module uses, e.g. ["DDR4"]. */
  memoryTypes: string[];
  /** CPU brand: for a CPU its own, for a cooler the brands it supports. */
  makers: CpuMaker[];
  slot: SlotId;
};

const SOCKET_RE = /(LGA\s?\d{3,4}|AM[345]|sTRX4|sTR5|TRX?4|FM2\+?|SP\d)/i;

/** "LGA 1700" -> "LGA1700". Returns null when no socket is found. */
export function normalizeSocket(text: string | null | undefined): string | null {
  if (!text) return null;
  const match = SOCKET_RE.exec(text);
  return match ? match[1]!.replace(/\s+/g, '').toUpperCase() : null;
}

/** Spellings to search for in text: LGA1700 and "LGA 1700". */
export function socketVariants(socket: string): string[] {
  const upper = socket.toUpperCase();
  const spaced = upper.replace(/^(LGA)(\d+)$/, '$1 $2');
  return Array.from(new Set([upper, spaced]));
}

export function parseMemoryTypes(...texts: Array<string | null | undefined>): string[] {
  const found = new Set<string>();
  for (const text of texts) {
    for (const m of (text ?? '').toUpperCase().matchAll(/DDR\s?([2-5])/g)) found.add(`DDR${m[1]}`);
  }
  return Array.from(found);
}

export function parseCpuMakers(text: string | null | undefined): CpuMaker[] {
  const lower = (text ?? '').toLowerCase();
  const makers: CpuMaker[] = [];
  if (lower.includes('intel')) makers.push('intel');
  if (lower.includes('amd')) makers.push('amd');
  return makers;
}

function leadingNumber(text: string | null | undefined): number | null {
  const m = /(\d+(?:\.\d+)?)/.exec(text ?? '');
  return m ? Math.round(Number(m[1])) : null;
}

type PowerInput = { slot: SlotId; tdp?: string | null; recommendedPsu?: string | null; storageIsHdd?: boolean };

/**
 * Typical draw in watts. CPU uses its listed TDP. Graphics cards use roughly 45% of the
 * manufacturer's recommended PSU. Other parts use common typical values. This is an estimate
 * for choosing a power supply, not a measurement.
 */
export function estimateWatts({ slot, tdp, recommendedPsu, storageIsHdd }: PowerInput): number | null {
  switch (slot) {
    case 'cpu':
      return leadingNumber(tdp);
    case 'gpu': {
      const psu = leadingNumber(recommendedPsu);
      return psu ? Math.round((psu * 0.45) / 5) * 5 : null;
    }
    case 'motherboard':
      return 40;
    case 'ram':
      return 5;
    case 'storage':
      return storageIsHdd ? 9 : 5;
    case 'cpu-cooler':
      return 6;
    case 'casing-cooler':
      return 4;
    default:
      return null;
  }
}

export function totalWatts(items: Array<{ watts: number | null }>): number {
  return items.reduce((sum, item) => sum + (item.watts ?? 0), 0);
}

/** Suggested PSU rating: 40% headroom, rounded up to the next 50 W. */
export function suggestedPsu(total: number): number {
  return total > 0 ? Math.ceil((total * 1.4) / 50) * 50 : 0;
}

export type Compatibility = {
  /** Socket the next CPU or motherboard must use. */
  socket: string | null;
  /** DDR generations the next RAM or motherboard must use. */
  memoryTypes: string[];
  /** CPU brand the next cooler must support. */
  maker: CpuMaker | null;
  reason: { socket?: string; memory?: string; maker?: string };
};

type Selected = Partial<Record<SlotId, BuilderProduct[]>>;

/** What the parts chosen so far require from the next part. */
export function compatibilityFor(slot: SlotId, selected: Selected): Compatibility {
  const cpu = selected.cpu?.[0];
  const board = selected.motherboard?.[0];
  const ram = selected.ram?.[0];
  const out: Compatibility = { socket: null, memoryTypes: [], maker: null, reason: {} };

  if (slot === 'motherboard') {
    if (cpu?.socket) {
      out.socket = cpu.socket;
      out.reason.socket = `your CPU (${cpu.socket})`;
    }
    if (ram?.memoryTypes.length) {
      out.memoryTypes = ram.memoryTypes;
      out.reason.memory = `your RAM (${ram.memoryTypes.join('/')})`;
    }
  }
  if (slot === 'cpu' && board?.socket) {
    out.socket = board.socket;
    out.reason.socket = `your motherboard (${board.socket})`;
  }
  if (slot === 'ram' && board?.memoryTypes.length) {
    out.memoryTypes = board.memoryTypes;
    out.reason.memory = `your motherboard (${board.memoryTypes.join('/')})`;
  }
  if (slot === 'cpu-cooler' && cpu?.makers[0]) {
    out.maker = cpu.makers[0];
    out.reason.maker = `your ${cpu.makers[0] === 'intel' ? 'Intel' : 'AMD'} CPU`;
  }
  return out;
}

/** Plain-language problems between chosen parts. */
export function compatibilityWarnings(selected: Selected): string[] {
  const warnings: string[] = [];
  const cpu = selected.cpu?.[0];
  const board = selected.motherboard?.[0];
  const cooler = selected['cpu-cooler']?.[0];

  if (cpu?.socket && board?.socket && cpu.socket !== board.socket) {
    warnings.push(`The CPU uses socket ${cpu.socket} but the motherboard uses ${board.socket}. Change one of them.`);
  }
  if (board?.memoryTypes.length) {
    for (const ram of selected.ram ?? []) {
      if (ram.memoryTypes.length && !ram.memoryTypes.some((t) => board.memoryTypes.includes(t))) {
        warnings.push(
          `${ram.name} is ${ram.memoryTypes.join('/')} but the motherboard takes ${board.memoryTypes.join('/')}.`
        );
        break;
      }
    }
  }
  if (cpu?.makers[0] && cooler?.makers.length && !cooler.makers.includes(cpu.makers[0])) {
    warnings.push(`The CPU cooler does not list ${cpu.makers[0] === 'intel' ? 'Intel' : 'AMD'} support.`);
  }
  return warnings;
}
