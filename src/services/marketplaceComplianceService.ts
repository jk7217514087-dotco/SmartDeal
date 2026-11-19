import type { MarketplaceComplianceConfig } from '../types';

const COMPLIANCE_STORAGE_KEY = 'smartdeals_marketplace_compliance_v1';

export const DEFAULT_MARKETPLACE_COMPLIANCE: Record<string, MarketplaceComplianceConfig> = {
  amazon: {
    marketplaceId: 'amazon',
    marketplaceName: 'Amazon India',
    domain: 'amazon.in',
    priceTrackingAllowed: false, // PAUSED by default per Amazon Associates Operating Agreement
    priceAlertsAllowed: false,   // PAUSED by default per Amazon Associates Operating Agreement
    priceDisplayAllowed: true,   // Permitted with real-time sync / disclaimers
    apiAccessAllowed: true,      // PA-API permitted
    affiliateApprovalStatus: 'WRITTEN_APPROVAL_REQUIRED',
    writtenApprovalObtained: false,
    complianceDisclaimer:
      'In compliance with the Amazon Associates Operating Agreement & PA-API license terms, price tracking and price drop alerts are paused by default for Amazon India until advance written approval is obtained.',
    policyNotes:
      'Amazon Associates Operating Agreement Section 4 & PA-API license policy strictly prohibit offline price tracking, caching historical prices without disclaimers, or running automated price drop alert bots without explicit written permission from Amazon.',
    restrictedFeatures: ['price_tracking', 'price_drop_alerts'],
    lastAuditedDate: '2026-11-18',
  },
  flipkart: {
    marketplaceId: 'flipkart',
    marketplaceName: 'Flipkart',
    domain: 'flipkart.com',
    priceTrackingAllowed: true,
    priceAlertsAllowed: true,
    priceDisplayAllowed: true,
    apiAccessAllowed: true,
    affiliateApprovalStatus: 'APPROVED',
    writtenApprovalObtained: true,
    writtenApprovalDate: '2026-01-15T00:00:00.000Z',
    writtenApprovalRef: 'FK-AFF-STD-APPROVED-2026',
    complianceDisclaimer:
      'Flipkart publisher affiliate agreement permits real-time price comparison and user-requested price drop notifications.',
    policyNotes:
      'Flipkart Affiliate API and deep-link product redirect guidelines fully compliant.',
    restrictedFeatures: [],
    lastAuditedDate: '2026-11-18',
  },
  croma: {
    marketplaceId: 'croma',
    marketplaceName: 'Croma Retail',
    domain: 'croma.com',
    priceTrackingAllowed: true,
    priceAlertsAllowed: true,
    priceDisplayAllowed: true,
    apiAccessAllowed: true,
    affiliateApprovalStatus: 'APPROVED',
    writtenApprovalObtained: true,
    writtenApprovalDate: '2026-02-01T00:00:00.000Z',
    writtenApprovalRef: 'CRM-AFF-NETWORK-2026',
    complianceDisclaimer:
      'Croma Retail verified merchant feed permits live price comparison and price alerts.',
    policyNotes:
      'Tata Enterprise partner affiliate policy compliant.',
    restrictedFeatures: [],
    lastAuditedDate: '2026-11-18',
  },
  reliancedigital: {
    marketplaceId: 'reliancedigital',
    marketplaceName: 'Reliance Digital',
    domain: 'reliancedigital.in',
    priceTrackingAllowed: true,
    priceAlertsAllowed: true,
    priceDisplayAllowed: true,
    apiAccessAllowed: true,
    affiliateApprovalStatus: 'APPROVED',
    writtenApprovalObtained: true,
    writtenApprovalDate: '2026-02-15T00:00:00.000Z',
    writtenApprovalRef: 'RD-AFF-COMM-2026',
    complianceDisclaimer:
      'Reliance Digital catalog price monitoring and comparison alerts permitted.',
    policyNotes:
      'Consumer electronics merchant feed compliant.',
    restrictedFeatures: [],
    lastAuditedDate: '2026-11-18',
  },
  tatacliq: {
    marketplaceId: 'tatacliq',
    marketplaceName: 'Tata CLiQ',
    domain: 'tatacliq.com',
    priceTrackingAllowed: true,
    priceAlertsAllowed: true,
    priceDisplayAllowed: true,
    apiAccessAllowed: true,
    affiliateApprovalStatus: 'APPROVED',
    writtenApprovalObtained: true,
    complianceDisclaimer:
      'Tata CLiQ verified affiliate price radar permitted.',
    policyNotes:
      'Approved partner network.',
    restrictedFeatures: [],
    lastAuditedDate: '2026-11-18',
  },
  meesho: {
    marketplaceId: 'meesho',
    marketplaceName: 'Meesho',
    domain: 'meesho.com',
    priceTrackingAllowed: true,
    priceAlertsAllowed: true,
    priceDisplayAllowed: true,
    apiAccessAllowed: true,
    affiliateApprovalStatus: 'APPROVED',
    writtenApprovalObtained: true,
    complianceDisclaimer:
      'Meesho open catalog price radar permitted.',
    policyNotes:
      'Reseller and publisher network compliant.',
    restrictedFeatures: [],
    lastAuditedDate: '2026-11-18',
  },
  myntra: {
    marketplaceId: 'myntra',
    marketplaceName: 'Myntra',
    domain: 'myntra.com',
    priceTrackingAllowed: true,
    priceAlertsAllowed: true,
    priceDisplayAllowed: true,
    apiAccessAllowed: true,
    affiliateApprovalStatus: 'APPROVED',
    writtenApprovalObtained: true,
    complianceDisclaimer:
      'Myntra fashion affiliate network tracking permitted.',
    policyNotes:
      'Fashion catalog pricing compliant.',
    restrictedFeatures: [],
    lastAuditedDate: '2026-11-18',
  },
  ajio: {
    marketplaceId: 'ajio',
    marketplaceName: 'AJIO',
    domain: 'ajio.com',
    priceTrackingAllowed: false, // PAUSED per affiliate configuration policy
    priceAlertsAllowed: false,   // PAUSED per affiliate configuration policy
    priceDisplayAllowed: true,
    apiAccessAllowed: false,
    affiliateApprovalStatus: 'RESTRICTED',
    writtenApprovalObtained: false,
    complianceDisclaimer:
      'Price tracking and price alerts are currently disabled for AJIO in our configuration per affiliate terms.',
    policyNotes:
      'AJIO price tracking and price drop alerts are paused until advance written approval is granted.',
    restrictedFeatures: ['price_tracking', 'price_drop_alerts'],
    lastAuditedDate: '2026-11-20',
  },
};

class MarketplaceComplianceService {
  private memoryStore: Record<string, MarketplaceComplianceConfig> = { ...DEFAULT_MARKETPLACE_COMPLIANCE };

  private normalizeKey(key: string): string {
    const clean = (key || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    if (clean.includes('amazon')) return 'amazon';
    if (clean.includes('flipkart')) return 'flipkart';
    if (clean.includes('croma')) return 'croma';
    if (clean.includes('reliance')) return 'reliancedigital';
    if (clean.includes('tatacliq') || clean.includes('cliq')) return 'tatacliq';
    if (clean.includes('meesho')) return 'meesho';
    if (clean.includes('myntra')) return 'myntra';
    if (clean.includes('ajio')) return 'ajio';
    return clean;
  }

  private loadStore(): Record<string, MarketplaceComplianceConfig> {
    if (typeof window === 'undefined') {
      return this.memoryStore;
    }
    try {
      const raw = localStorage.getItem(COMPLIANCE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_MARKETPLACE_COMPLIANCE, ...parsed };
      }
    } catch {
      // Fallback
    }
    return { ...DEFAULT_MARKETPLACE_COMPLIANCE };
  }

  private saveStore(data: Record<string, MarketplaceComplianceConfig>): void {
    this.memoryStore = data;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(COMPLIANCE_STORAGE_KEY, JSON.stringify(data));
      } catch {}
    }
  }

  /**
   * Returns all marketplace compliance configs.
   */
  public getAllComplianceConfigs(): MarketplaceComplianceConfig[] {
    const store = this.loadStore();
    return Object.values(store);
  }

  /**
   * Returns compliance configuration for a specific marketplace.
   * Does NOT assume one marketplace's permission applies to another.
   */
  public getComplianceConfig(marketplaceIdOrName: string): MarketplaceComplianceConfig {
    const key = this.normalizeKey(marketplaceIdOrName);
    const store = this.loadStore();

    if (store[key]) {
      return store[key];
    }

    // Conservative default for unknown stores: require written approval, disable tracking
    return {
      marketplaceId: key || 'unknown',
      marketplaceName: marketplaceIdOrName || 'Unknown Store',
      domain: '',
      priceTrackingAllowed: false,
      priceAlertsAllowed: false,
      priceDisplayAllowed: true,
      apiAccessAllowed: false,
      affiliateApprovalStatus: 'WRITTEN_APPROVAL_REQUIRED',
      writtenApprovalObtained: false,
      complianceDisclaimer: 'Policy compliance audit required before enabling price tracking or alerts.',
      policyNotes: 'Each marketplace must be independently verified.',
      restrictedFeatures: ['price_tracking', 'price_drop_alerts'],
      lastAuditedDate: new Date().toISOString().split('T')[0],
    };
  }

  /**
   * Checks whether price tracking is permitted for this specific marketplace.
   * For Amazon India: strictly false by default until written approval is obtained.
   */
  public isPriceTrackingAllowed(marketplaceIdOrName: string): boolean {
    const config = this.getComplianceConfig(marketplaceIdOrName);
    const key = this.normalizeKey(marketplaceIdOrName);

    // Amazon India policy compliance gate
    if (key === 'amazon') {
      return Boolean(config.writtenApprovalObtained && config.priceTrackingAllowed);
    }

    return Boolean(config.priceTrackingAllowed && (config.affiliateApprovalStatus === 'APPROVED' || config.writtenApprovalObtained));
  }

  /**
   * Checks whether price alerts are permitted for this specific marketplace.
   * For Amazon India: strictly false by default until written approval is obtained.
   */
  public isPriceAlertsAllowed(marketplaceIdOrName: string): boolean {
    const config = this.getComplianceConfig(marketplaceIdOrName);
    const key = this.normalizeKey(marketplaceIdOrName);

    // Amazon India policy compliance gate
    if (key === 'amazon') {
      return Boolean(config.writtenApprovalObtained && config.priceAlertsAllowed);
    }

    return Boolean(config.priceAlertsAllowed && (config.affiliateApprovalStatus === 'APPROVED' || config.writtenApprovalObtained));
  }

  /**
   * Checks whether price display is permitted for this marketplace.
   */
  public isPriceDisplayAllowed(marketplaceIdOrName: string): boolean {
    const config = this.getComplianceConfig(marketplaceIdOrName);
    return Boolean(config.priceDisplayAllowed);
  }

  /**
   * Checks whether API access is permitted for this marketplace.
   */
  public isApiAccessAllowed(marketplaceIdOrName: string): boolean {
    const config = this.getComplianceConfig(marketplaceIdOrName);
    return Boolean(config.apiAccessAllowed);
  }

  /**
   * Returns list of marketplaces where a specific feature is permitted.
   */
  public getPermittedMarketplaces(feature: 'price_tracking' | 'price_alerts' | 'price_display' | 'api_access'): string[] {
    const configs = this.getAllComplianceConfigs();
    return configs
      .filter(c => {
        if (feature === 'price_tracking') return this.isPriceTrackingAllowed(c.marketplaceId);
        if (feature === 'price_alerts') return this.isPriceAlertsAllowed(c.marketplaceId);
        if (feature === 'price_display') return this.isPriceDisplayAllowed(c.marketplaceId);
        if (feature === 'api_access') return this.isApiAccessAllowed(c.marketplaceId);
        return false;
      })
      .map(c => c.marketplaceName);
  }

  /**
   * Update written approval status for a marketplace (e.g. Amazon India).
   */
  public setWrittenApproval(
    marketplaceIdOrName: string,
    obtained: boolean,
    refId?: string
  ): MarketplaceComplianceConfig {
    const key = this.normalizeKey(marketplaceIdOrName);
    const store = this.loadStore();
    const existing = store[key] || this.getComplianceConfig(marketplaceIdOrName);

    const updated: MarketplaceComplianceConfig = {
      ...existing,
      writtenApprovalObtained: obtained,
      writtenApprovalDate: obtained ? new Date().toISOString() : undefined,
      writtenApprovalRef: obtained ? (refId || `WRITTEN-APP-${Date.now()}`) : undefined,
      affiliateApprovalStatus: obtained ? 'APPROVED' : (key === 'amazon' ? 'WRITTEN_APPROVAL_REQUIRED' : existing.affiliateApprovalStatus),
      priceTrackingAllowed: obtained ? true : (key === 'amazon' ? false : existing.priceTrackingAllowed),
      priceAlertsAllowed: obtained ? true : (key === 'amazon' ? false : existing.priceAlertsAllowed),
      restrictedFeatures: obtained ? [] : (key === 'amazon' ? ['price_tracking', 'price_drop_alerts'] : existing.restrictedFeatures),
      lastAuditedDate: new Date().toISOString().split('T')[0],
    };

    store[key] = updated;
    this.saveStore(store);
    return updated;
  }

  /**
   * Granular marketplace-level compliance update.
   */
  public updateMarketplaceCompliance(
    marketplaceIdOrName: string,
    updates: Partial<MarketplaceComplianceConfig>
  ): MarketplaceComplianceConfig {
    const key = this.normalizeKey(marketplaceIdOrName);
    const store = this.loadStore();
    const existing = store[key] || this.getComplianceConfig(marketplaceIdOrName);

    const updated: MarketplaceComplianceConfig = {
      ...existing,
      ...updates,
      marketplaceId: key,
      lastAuditedDate: new Date().toISOString().split('T')[0],
    };

    store[key] = updated;
    this.saveStore(store);
    return updated;
  }

  /**
   * Reset all marketplace compliance to default factory policies.
   */
  public resetToDefaults(): void {
    this.memoryStore = { ...DEFAULT_MARKETPLACE_COMPLIANCE };
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(COMPLIANCE_STORAGE_KEY);
      } catch {}
    }
  }
}

export const marketplaceComplianceService = new MarketplaceComplianceService();
