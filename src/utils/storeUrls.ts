import type { Product } from '../types/index';
import { marketplaceRedirectionService } from '../services/marketplaceRedirectionService';

/**
 * Returns the exact, verified direct product page URL for Amazon, Flipkart, Meesho, Croma, etc.
 * Never redirects to homepages or search results pages.
 * Returns empty string if no valid direct product page exists.
 */
export function getStoreBuyUrl(
  item: {
    sellerName: string;
    url?: string;
    product_url?: string;
    affiliate_url?: string;
    marketplace_name?: string;
    marketplace_product_id?: string;
  },
  _product?: Product
): string {
  const resolution = marketplaceRedirectionService.resolveTargetUrl(item, item.marketplace_name || item.sellerName);
  return resolution.targetUrl || '';
}
