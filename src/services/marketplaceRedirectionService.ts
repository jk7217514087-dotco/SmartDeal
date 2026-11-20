import { Product } from '../types';
import { trackingService } from './trackingService';
import { notificationService } from './notificationService';

/**
 * SmartDeal - Direct Marketplace Product Page Redirection & Security Service
 *
 * Strict Rules:
 * 1. Allow ONLY approved marketplace domains.
 * 2. Prevent open redirect vulnerabilities.
 * 3. Never redirect to marketplace homepages.
 * 4. Never redirect to generic search results.
 * 5. Prioritize authorized affiliate_url when available; preserve affiliate params.
 * 6. If product URL is unavailable, disable action and return null.
 * 7. Open exact product page in new browser tab, preserving SmartDeal tab.
 * 8. Log outbound click with user/guest ID, product ID, marketplace ID, timestamp, and affiliate ref (PENDING status).
 */

export const APPROVED_MARKETPLACE_DOMAINS: Record<string, string[]> = {
  amazon: ['amazon.in', 'www.amazon.in', 'amzn.to', 'amzn.in'],
  flipkart: ['flipkart.com', 'www.flipkart.com', 'dl.flipkart.com', 'fkrt.it'],
  meesho: ['meesho.com', 'www.meesho.com'],
  myntra: ['myntra.com', 'www.myntra.com'],
  ajio: ['ajio.com', 'www.ajio.com'],
  tatacliq: ['tatacliq.com', 'www.tatacliq.com'],
  croma: ['croma.com', 'www.croma.com'],
  reliancedigital: ['reliancedigital.in', 'www.reliancedigital.in']
};

export interface MarketplaceOfferRef {
  sellerName: string;
  marketplace_name?: string;
  marketplace_product_id?: string;
  product_url?: string;
  affiliate_url?: string;
  url?: string;
  finalPrice?: number;
  price?: number;
}

export interface ValidationResult {
  isValid: boolean;
  targetUrl: string | null;
  isAffiliate: boolean;
  marketplaceKey: string;
  error?: string;
}

export class MarketplaceRedirectionService {
  /**
   * Normalizes arbitrary store names (e.g. "Tata CLiQ Luxury", "Amazon India Official")
   * to canonical marketplace key ('amazon' | 'flipkart' | etc.)
   */
  public normalizeMarketplaceKey(rawName: string): string {
    const s = (rawName || '').toLowerCase().trim();
    if (s.includes('amazon')) return 'amazon';
    if (s.includes('flipkart')) return 'flipkart';
    if (s.includes('meesho')) return 'meesho';
    if (s.includes('myntra')) return 'myntra';
    if (s.includes('ajio')) return 'ajio';
    if (s.includes('tata') || s.includes('cliq')) return 'tatacliq';
    if (s.includes('croma')) return 'croma';
    if (s.includes('reliance')) return 'reliancedigital';
    return s.replace(/[^a-z0-9]/g, '');
  }

  /**
   * Validates whether a given URL is an authentic, approved direct product page.
   * Blocks homepages, search results, fake domains, and open redirects.
   */
  public validateMarketplaceUrl(url: string | undefined | null, marketplaceName: string): ValidationResult {
    const marketplaceKey = this.normalizeMarketplaceKey(marketplaceName);
    const approvedDomains = APPROVED_MARKETPLACE_DOMAINS[marketplaceKey];

    if (!url || typeof url !== 'string' || url === '#' || url.trim() === '') {
      return {
        isValid: false,
        targetUrl: null,
        isAffiliate: false,
        marketplaceKey,
        error: 'Product link unavailable'
      };
    }

    let parsed: URL;
    try {
      parsed = new URL(url.trim());
    } catch {
      return {
        isValid: false,
        targetUrl: null,
        isAffiliate: false,
        marketplaceKey,
        error: 'Invalid URL format'
      };
    }

    // 1. Must use secure HTTPS
    if (parsed.protocol !== 'https:') {
      return {
        isValid: false,
        targetUrl: null,
        isAffiliate: false,
        marketplaceKey,
        error: 'Non-HTTPS protocols prohibited'
      };
    }

    // 2. Validate Domain against Approved Whitelist
    const hostname = parsed.hostname.toLowerCase();
    const isDomainApproved = approvedDomains?.some(d => hostname === d || hostname.endsWith('.' + d));

    if (!isDomainApproved) {
      return {
        isValid: false,
        targetUrl: null,
        isAffiliate: false,
        marketplaceKey,
        error: `Domain ${hostname} is not an authorized ${marketplaceName} destination`
      };
    }

    // 3. Reject Homepage Redirections
    const pathname = parsed.pathname.toLowerCase();
    if (pathname === '/' || pathname === '') {
      return {
        isValid: false,
        targetUrl: null,
        isAffiliate: false,
        marketplaceKey,
        error: 'Direct homepage redirects are not permitted'
      };
    }

    // 4. Reject Generic Search Results
    const searchPatterns = [
      /^\/s(\/|\?|$)/i,
      /^\/search(\/|\?|$)/i,
      /^\/searchb(\/|\?|$)/i,
      /^\/search-results/i
    ];
    if (searchPatterns.some(regex => regex.test(pathname))) {
      return {
        isValid: false,
        targetUrl: null,
        isAffiliate: false,
        marketplaceKey,
        error: 'Generic search result pages are prohibited'
      };
    }

    // 5. Verify Marketplace-specific Product Page Signature
    let hasProductSignature = false;
    switch (marketplaceKey) {
      case 'amazon':
        hasProductSignature = pathname.includes('/dp/') || pathname.includes('/gp/product/') || pathname.includes('/d/');
        break;
      case 'flipkart':
        hasProductSignature = pathname.includes('/p/');
        break;
      case 'meesho':
        hasProductSignature = pathname.includes('/p/') || pathname.includes('/s/p/');
        break;
      case 'myntra':
        hasProductSignature = pathname.includes('/buy') || /\/\d+(\/|$)/.test(pathname);
        break;
      case 'ajio':
        hasProductSignature = pathname.includes('/p/');
        break;
      case 'tatacliq':
        hasProductSignature = pathname.includes('/p-') || pathname.includes('/p/');
        break;
      case 'croma':
        hasProductSignature = pathname.includes('/p/');
        break;
      case 'reliancedigital':
        hasProductSignature = pathname.includes('/p/');
        break;
      default:
        hasProductSignature = pathname.length > 3;
    }

    if (!hasProductSignature) {
      return {
        isValid: false,
        targetUrl: null,
        isAffiliate: false,
        marketplaceKey,
        error: 'URL does not point to an authentic product detail page'
      };
    }

    // Check if it contains authorized affiliate tracking parameters
    const isAffiliate =
      parsed.searchParams.has('tag') ||
      parsed.searchParams.has('affid') ||
      parsed.searchParams.has('ref') ||
      parsed.searchParams.has('utm_source');

    return {
      isValid: true,
      targetUrl: parsed.toString(),
      isAffiliate,
      marketplaceKey
    };
  }

  /**
   * Resolves the best available URL for an offer.
   * Prioritizes valid affiliate_url, then product_url, then url.
   * If none are valid, returns null and isAvailable: false.
   */
  public resolveTargetUrl(offer: MarketplaceOfferRef, fallbackStoreName?: string): { targetUrl: string | null; isAvailable: boolean; isAffiliate: boolean } {
    const storeName = offer.marketplace_name || offer.sellerName || fallbackStoreName || '';

    // Check 1: Authorized affiliate_url
    if (offer.affiliate_url) {
      const val = this.validateMarketplaceUrl(offer.affiliate_url, storeName);
      if (val.isValid && val.targetUrl) {
        return { targetUrl: val.targetUrl, isAvailable: true, isAffiliate: true };
      }
    }

    // Check 2: Direct product_url
    if (offer.product_url) {
      const val = this.validateMarketplaceUrl(offer.product_url, storeName);
      if (val.isValid && val.targetUrl) {
        return { targetUrl: val.targetUrl, isAvailable: true, isAffiliate: val.isAffiliate };
      }
    }

    // Check 3: Standard url
    if (offer.url) {
      const val = this.validateMarketplaceUrl(offer.url, storeName);
      if (val.isValid && val.targetUrl) {
        return { targetUrl: val.targetUrl, isAvailable: true, isAffiliate: val.isAffiliate };
      }
    }

    return { targetUrl: null, isAvailable: false, isAffiliate: false };
  }

  /**
   * Executes the full secure redirection workflow:
   * 1. Validates exact product URL.
   * 2. Logs outbound click tracking record (PENDING status, actor ID, product ID, timestamp, affiliate ref).
   * 3. Dispatches notification toast.
   * 4. Opens exact product page in new browser tab (`_blank`, `noopener,noreferrer`).
   * 5. Preserves SmartDeal page in the original tab.
   */
  public async executeRedirect(params: {
    product: Product;
    offer: MarketplaceOfferRef;
    onStart?: () => void;
    onComplete?: () => void;
    onError?: (errMessage: string) => void;
  }): Promise<{ success: boolean; targetUrl?: string; error?: string }> {
    const { product, offer, onStart, onComplete, onError } = params;
    const storeName = offer.marketplace_name || offer.sellerName || 'Marketplace';

    if (onStart) onStart();

    const resolution = this.resolveTargetUrl(offer, storeName);
    if (!resolution.isAvailable || !resolution.targetUrl) {
      const err = 'Product link unavailable for ' + storeName;
      if (onError) onError(err);
      if (onComplete) onComplete();
      return { success: false, error: err };
    }

    const targetUrl = resolution.targetUrl;
    const storePrice = offer.finalPrice || offer.price || product.sellingPrice;
    const trackingRef = `sd-aff-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // 1. Record Outbound Click in Tracking Service
    try {
      trackingService.recordOutboundClick({
        productId: product.id,
        productName: product.name,
        category: product.category,
        marketplace: storeName,
        priceAtClick: storePrice,
        exactProductUrl: targetUrl,
        affiliate_tag: trackingRef,
        notes: `Direct product page redirection to ${storeName}`
      });
    } catch (e) {
      console.warn('Tracking click logging warning:', e);
    }

    // 2. Notify User with Toast Feedback
    try {
      notificationService.notifyBuyClick({
        clickId: trackingRef,
        productId: product.id,
        productName: product.name,
        marketplace: storeName,
        price: storePrice,
        targetUrl,
        userName: 'Website Visitor',
        userContact: `Direct Redirect: ${storeName}`
      });
    } catch (e) {
      console.warn('Notification warning:', e);
    }

    // 3. Open in a New Browser Tab (Preserves SmartDeal page in original tab)
    try {
      const newTab = window.open(targetUrl, '_blank', 'noopener,noreferrer');
      if (newTab) {
        newTab.opener = null;
      } else {
        // If popup was blocked by browser, trigger fallback anchor navigation
        const fallbackLink = document.createElement('a');
        fallbackLink.href = targetUrl;
        fallbackLink.target = '_blank';
        fallbackLink.rel = 'noopener noreferrer';
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        document.body.removeChild(fallbackLink);
      }
    } catch (e) {
      console.error('Window open error:', e);
    }

    if (onComplete) onComplete();
    return { success: true, targetUrl };
  }
}

export const marketplaceRedirectionService = new MarketplaceRedirectionService();
