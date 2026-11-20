import { Product } from '../types';

export interface MarketplaceComparisonRow {
  sellerName: string;
  finalPrice: number;
  price: number;
  rating: number;
  trustLabel: string;
  deliveryDays: string;
  deliveryCharge: number;
  url?: string;
}

export const getMarketplaceComparisonStores = (product: Product): MarketplaceComparisonRow[] => {
  if (!product) return [];
  const raw = (product.marketplacePrices || []).filter(
    p => !p.isSmartDealsSeller && !p.sellerName.toLowerCase().includes('smartdeal')
  );
  const basePrice = product.sellingPrice;

  // 8 major Indian marketplaces matching Image 1
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
    const match = raw.find(r => r.sellerName.toLowerCase().includes(tmpl.name.toLowerCase()));
    if (match) {
      results.push({
        sellerName: tmpl.name,
        finalPrice: match.finalPrice,
        price: match.price || match.finalPrice,
        rating: match.rating || tmpl.rating,
        trustLabel: tmpl.trustLabel,
        deliveryDays: match.deliveryDate || tmpl.deliveryDays,
        deliveryCharge: match.deliveryCharge || 0,
        url: match.url
      });
    } else {
      const computedPrice = Math.round(basePrice * tmpl.mult);
      results.push({
        sellerName: tmpl.name,
        finalPrice: computedPrice,
        price: computedPrice,
        rating: tmpl.rating,
        trustLabel: tmpl.trustLabel,
        deliveryDays: tmpl.deliveryDays,
        deliveryCharge: tmpl.deliveryCharge,
        url: '#'
      });
    }
  });

  raw.forEach(r => {
    const alreadyIncluded = results.some(res => res.sellerName.toLowerCase().includes(r.sellerName.toLowerCase()));
    if (!alreadyIncluded) {
      results.push({
        sellerName: r.sellerName,
        finalPrice: r.finalPrice,
        price: r.price || r.finalPrice,
        rating: r.rating || 4.5,
        trustLabel: 'Verified Retailer',
        deliveryDays: r.deliveryDate || '2-3 days',
        deliveryCharge: r.deliveryCharge || 0,
        url: r.url
      });
    }
  });

  // STRICTLY ASCENDING ORDER: 1st lowest price, 2nd increased price, 3rd, 4th...
  return results.sort((a, b) => a.finalPrice - b.finalPrice);
};

export const getStoreTargetUrl = (storeName: string, productName: string, customUrl?: string): string => {
  if (customUrl && customUrl !== '#') return customUrl;
  const name = (storeName || '').toLowerCase();
  const query = encodeURIComponent(productName);
  if (name.includes('flipkart')) return `https://www.flipkart.com/search?q=${query}`;
  if (name.includes('croma')) return `https://www.croma.com/searchB?q=${query}`;
  if (name.includes('meesho')) return `https://www.meesho.com/search?q=${query}`;
  if (name.includes('tata') || name.includes('cliq')) return `https://www.tatacliq.com/search/?searchCategory=all&text=${query}`;
  if (name.includes('reliance')) return `https://www.reliancedigital.in/search?q=${query}`;
  if (name.includes('ajio')) return `https://www.ajio.com/search/?text=${query}`;
  if (name.includes('myntra')) return `https://www.myntra.com/${query}`;
  return `https://www.amazon.in/s?k=${query}`;
};
