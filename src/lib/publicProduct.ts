export const INTERNAL_PRODUCT_FIELDS = [
  'sourceUrl',
  'sourcePrice',
  'priceRule',
  'priceRuleValue',
  'priceSyncStatus',
  'priceFlagReason',
] as const;

/** Back-office price-sync fields never belong in a public storefront response. */
export function toPublicProduct<T extends object>(product: T): Omit<T, (typeof INTERNAL_PRODUCT_FIELDS)[number]> {
  const copy: Record<string, unknown> = { ...(product as Record<string, unknown>) };
  for (const key of INTERNAL_PRODUCT_FIELDS) delete copy[key];
  return copy as Omit<T, (typeof INTERNAL_PRODUCT_FIELDS)[number]>;
}
