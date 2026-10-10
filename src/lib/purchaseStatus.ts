/** Storefront purchase rule driven by the CMS Stock Status field. */
export function canPurchase(stockStatus: string | null | undefined): boolean {
  return stockStatus === 'IN_STOCK';
}
