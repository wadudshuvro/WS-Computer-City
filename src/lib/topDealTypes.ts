export type TopDealProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
  categoryName: string;
};

export function dealSavings(price: number, compareAtPrice: number | null): number | null {
  if (compareAtPrice == null || compareAtPrice <= price) return null;
  return Math.round(compareAtPrice - price);
}

/** Card prices for Top Deals. Current price is the catalog price. Previous is higher so the save amount is visible. */
export function topDealDisplay(product: Pick<TopDealProduct, 'id' | 'price' | 'compareAtPrice'>): {
  current: number;
  previous: number;
  save: number;
} {
  const realSave = dealSavings(product.price, product.compareAtPrice);
  if (realSave != null && product.compareAtPrice != null) {
    return { current: product.price, previous: product.compareAtPrice, save: realSave };
  }
  const extra = [...product.id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 2 === 0 ? 200 : 300;
  return { current: product.price, previous: product.price + extra, save: extra };
}
