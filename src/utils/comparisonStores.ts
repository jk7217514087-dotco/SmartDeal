import { Product } from '../types';
import { getVerifiedOffer } from '../data/marketplaceRegistry';
import { marketplaceRedirectionService } from '../services/marketplaceRedirectionService';

export interface MarketplaceComparisonRow {
  sellerName: string;
  marketplace_name: string;
  marketplace_product_id?: string;
  product_url?: string;
  affiliate_url?: string;
  finalPrice: number;
  price: number;
  rating: number;
  trustLabel: string;
  deliveryDays: string;
  deliveryCharge: number;
  url: string;
  isAvailable: boolean;
  inStock: boolean;
  isBestPrice?: boolean;
}

export const getMarketplaceComparisonStores = (product: Product): MarketplaceComparisonRow[] => {
  if (!product) return [];
  const raw = (product.marketplacePrices || []).filter(
    p => !p.isSmartDealsSeller && !p.sellerName.toLowerCase().includes('smartdeal')
  );
  const basePrice = product.sellingPrice;

  // 8 major Indian marketplaces matching specification
  const storeTemplates = [
    { name: 'Meesho', mult: 0.98, rating: 4.3, trustLabel: 'Verified Retailer', deliveryDays: '4-5 days', deliveryCharge: 0 },
    { name: 'Amazon', mult: 1.0, rating: 4.6, trustLabel: 'Trusted Seller', deliveryDays: '2-3 days', deliveryCharge: 0 },
    { name: 'Flipkart', mult: 1.025, rating: 4.5, trustLabel: 'Trusted Seller', deliveryDays: '2 Days', deliveryCharge: 0 },
    { name: 'Tata CLiQ', mult: 1.037, rating: 4.4, trustLabel: 'Verified Retailer', deliveryDays: '3-5 days', deliveryCharge: 0 },
    { name: 'Reliance Digital', mult: 1.037, rating: 4.5, trustLabel: 'Authorized Seller', deliveryDays: '1-2 days', deliveryCharge: 0 },
    { name: 'Croma', mult: 1.043, rating: 4.6, trustLabel: 'Authorized Seller', deliveryDays: '1-2 days', deliveryCharge: 0 },
    { name: 'AJIO', mult: 1.049, rating: 4.3, trustLabel: 'Verified Retailer', deliveryDays: '4-7 days', deliveryCharge: 0 },
    { name: 'Myntra', mult: 1.057, rating: 4.4, trustLabel: 'Verified Retailer', deliveryDays: '2-3 days', deliveryCharge: 0 }
  ];

  const results: MarketplaceComparisonRow[] = [];

  storeTemplates.forEach(tmpl => {
    // 1. Check if product already has raw listing with exact URL
    const rawMatch = raw.find(r => r.sellerName.toLowerCase().includes(tmpl.name.toLowerCase()));
    // 2. Check registry for verified exact product URLs
    const registryOffer = getVerifiedOffer(product.id, tmpl.name);

    const marketplaceProductId = registryOffer?.marketplace_product_id || rawMatch?.marketplace_product_id;
    const productUrl = registryOffer?.product_url || rawMatch?.product_url || (rawMatch?.url && !rawMatch.url.includes('?') ? rawMatch.url : undefined);
    const affiliateUrl = registryOffer?.affiliate_url || rawMatch?.affiliate_url || rawMatch?.url;

    // Resolve and validate exact target URL
    const resolution = marketplaceRedirectionService.resolveTargetUrl(
      {
        sellerName: tmpl.name,
        marketplace_name: tmpl.name,
        marketplace_product_id: marketplaceProductId,
        product_url: productUrl,
        affiliate_url: affiliateUrl,
        url: rawMatch?.url
      },
      tmpl.name
    );

    const price = rawMatch ? (rawMatch.price || rawMatch.finalPrice) : Math.round(basePrice * tmpl.mult);
    const finalPrice = rawMatch ? rawMatch.finalPrice : Math.round(basePrice * tmpl.mult);
    const inStock = rawMatch ? (rawMatch.inStock !== false) : true;

    results.push({
      sellerName: tmpl.name,
      marketplace_name: tmpl.name,
      marketplace_product_id: marketplaceProductId,
      product_url: productUrl,
      affiliate_url: affiliateUrl,
      finalPrice,
      price,
      rating: rawMatch?.rating || tmpl.rating,
      trustLabel: tmpl.trustLabel,
      deliveryDays: rawMatch?.deliveryDate || tmpl.deliveryDays,
      deliveryCharge: rawMatch?.deliveryCharge ?? tmpl.deliveryCharge,
      url: resolution.targetUrl || '',
      isAvailable: resolution.isAvailable,
      inStock
    });
  });

  // Also include any raw store not covered by templates
  raw.forEach(r => {
    const alreadyIncluded = results.some(res => res.sellerName.toLowerCase().includes(r.sellerName.toLowerCase()));
    if (!alreadyIncluded) {
      const resolution = marketplaceRedirectionService.resolveTargetUrl(r, r.sellerName);
      results.push({
        sellerName: r.sellerName,
        marketplace_name: r.marketplace_name || r.sellerName,
        marketplace_product_id: r.marketplace_product_id,
        product_url: r.product_url,
        affiliate_url: r.affiliate_url,
        finalPrice: r.finalPrice,
        price: r.price || r.finalPrice,
        rating: r.rating || 4.5,
        trustLabel: 'Verified Retailer',
        deliveryDays: r.deliveryDate || '2-3 days',
        deliveryCharge: r.deliveryCharge || 0,
        url: resolution.targetUrl || '',
        isAvailable: resolution.isAvailable,
        inStock: r.inStock !== false
      });
    }
  });

  // Dynamic Marketplace Price Sorting:
  // 1. Available and in-stock offers first.
  // 2. Lowest finalPrice first (Position 1 = Cheapest, Position 2 = Second-cheapest, etc.).
  // 3. Consistent tie-breaker: higher rating, then alphabetical name.
  // 4. Unavailable offers go to the bottom.
  const sorted = results.sort((a, b) => {
    // Availability & In-Stock priority
    const aEligible = a.isAvailable && a.inStock;
    const bEligible = b.isAvailable && b.inStock;
    if (aEligible && !bEligible) return -1;
    if (!aEligible && bEligible) return 1;

    // Partial availability
    if (a.isAvailable && !b.isAvailable) return -1;
    if (!a.isAvailable && b.isAvailable) return 1;

    // Lowest final price strictly first
    if (a.finalPrice !== b.finalPrice) {
      return a.finalPrice - b.finalPrice;
    }

    // Tie-breaker 1: Higher rating
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }

    // Tie-breaker 2: Consistent alphabetical
    return a.sellerName.localeCompare(b.sellerName);
  });

  // Assign Best Price badge ONLY to position 1 if eligible
  if (sorted.length > 0 && sorted[0].isAvailable && sorted[0].inStock) {
    sorted[0].isBestPrice = true;
  }

  return sorted;
};

export const getStoreTargetUrl = (storeName: string, _productName: string, customUrl?: string): string => {
  const resolution = marketplaceRedirectionService.validateMarketplaceUrl(customUrl, storeName);
  return resolution.isValid && resolution.targetUrl ? resolution.targetUrl : '';
};
