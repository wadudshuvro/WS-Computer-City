'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BuilderProduct } from '@/lib/pcBuilder/compat';
import { PC_BUILDER_SLOTS, SLOT_BY_ID, type SlotId } from '@/lib/pcBuilder/slots';

export type BuilderLine = BuilderProduct & { lineId: string };

interface PcBuilderState {
  lines: BuilderLine[];
  /** Add a part. Single-part slots are replaced; `replaceLineId` swaps one specific line. */
  addPart: (product: BuilderProduct, replaceLineId?: string | null) => void;
  removeLine: (lineId: string) => void;
  /** Replace the whole build (used when opening a shared link). */
  setParts: (products: BuilderProduct[]) => void;
  clear: () => void;
}

let counter = 0;
const newLineId = () => `${Date.now().toString(36)}-${(counter++).toString(36)}`;

function normalise(products: BuilderProduct[]): BuilderLine[] {
  const perSlot = new Map<SlotId, number>();
  const lines: BuilderLine[] = [];
  for (const product of products) {
    const slot = SLOT_BY_ID[product.slot];
    if (!slot) continue;
    const count = perSlot.get(product.slot) ?? 0;
    if (count >= slot.max) continue;
    perSlot.set(product.slot, count + 1);
    lines.push({ ...product, lineId: newLineId() });
  }
  return lines;
}

export const usePcBuilderStore = create<PcBuilderState>()(
  persist(
    (set) => ({
      lines: [],

      addPart: (product, replaceLineId) =>
        set((state) => {
          const slot = SLOT_BY_ID[product.slot];
          const line: BuilderLine = { ...product, lineId: newLineId() };

          if (replaceLineId && state.lines.some((l) => l.lineId === replaceLineId)) {
            return { lines: state.lines.map((l) => (l.lineId === replaceLineId ? { ...line, lineId: l.lineId } : l)) };
          }
          if (slot.max === 1) {
            return { lines: [...state.lines.filter((l) => l.slot !== product.slot), line] };
          }
          const inSlot = state.lines.filter((l) => l.slot === product.slot);
          if (inSlot.length >= slot.max) return state;
          return { lines: [...state.lines, line] };
        }),

      removeLine: (lineId) => set((state) => ({ lines: state.lines.filter((l) => l.lineId !== lineId) })),

      setParts: (products) => set({ lines: normalise(products) }),

      clear: () => set({ lines: [] }),
    }),
    { name: 'logicbay-pc-builder' }
  )
);

/** Lines grouped in the builder's slot order. */
export function groupBySlot(lines: BuilderLine[]): Partial<Record<SlotId, BuilderLine[]>> {
  const out: Partial<Record<SlotId, BuilderLine[]>> = {};
  for (const slot of PC_BUILDER_SLOTS) {
    const inSlot = lines.filter((l) => l.slot === slot.id);
    if (inSlot.length > 0) out[slot.id] = inSlot;
  }
  return out;
}
