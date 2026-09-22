'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProcessorPurchaseVariant = 'bundle' | 'single';

export interface CartItem {
  /** Unique line id: productId + variant */
  id: string;
  productId: string;
  slug: string;
  name: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  variant?: ProcessorPurchaseVariant;
  variantLabel?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

function lineId(productId: string, variant?: ProcessorPurchaseVariant): string {
  return variant ? `${productId}:${variant}` : productId;
}

export function formatVariantLabel(variant?: ProcessorPurchaseVariant): string | undefined {
  if (variant === 'bundle') return 'Bundle with PC';
  if (variant === 'single') return 'Single';
  return undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const id = lineId(item.productId, item.variant);
        const qty = Math.max(1, item.quantity ?? 1);
        set((state) => {
          const existing = state.items.find((i) => i.id === id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, quantity: i.quantity + qty, unitPrice: item.unitPrice } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                ...item,
                id,
                quantity: qty,
                variantLabel: item.variantLabel ?? formatVariantLabel(item.variant),
              },
            ],
          };
        });
      },

      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        const q = Math.max(1, quantity);
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity: q } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    }),
    { name: 'logicbay-cart' }
  )
);
