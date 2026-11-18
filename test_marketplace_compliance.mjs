// SMARTDEAL COMPREHENSIVE MARKETPLACE AFFILIATE POLICY COMPLIANCE TEST SUITE
// Verifies all requirements for isolated marketplace-level compliance and Amazon India PA-API & Operating Agreement rules

import assert from 'node:assert';
import { marketplaceComplianceService, DEFAULT_MARKETPLACE_COMPLIANCE } from './src/services/marketplaceComplianceService.ts';

let passedTests = 0;
const totalTests = 10;

function logTestSuccess(index, name, details) {
  passedTests++;
  console.log(`✅ [TEST ${index}/${totalTests} PASSED]: ${name}`);
  if (details) console.log(`   ↳ ${details}`);
}

async function runComplianceTests() {
  console.log('\n================================================================');
  console.log('⚖️ RUNNING SMARTDEAL MARKETPLACE AFFILIATE POLICY COMPLIANCE TESTS');
  console.log('================================================================\n');

  // Reset service to defaults before testing
  marketplaceComplianceService.resetToDefaults();

  // --------------------------------------------------------------------------
  // TEST 1: Amazon India Default Gate (Strictly Paused Until Written Approval)
  // --------------------------------------------------------------------------
  {
    const amazonConfig = marketplaceComplianceService.getComplianceConfig('amazon');
    assert.strictEqual(amazonConfig.marketplaceId, 'amazon');
    assert.strictEqual(amazonConfig.writtenApprovalObtained, false, 'Amazon India must NOT have written approval by default');
    assert.strictEqual(amazonConfig.priceTrackingAllowed, false, 'Amazon India price tracking must be false by default');
    assert.strictEqual(amazonConfig.priceAlertsAllowed, false, 'Amazon India price alerts must be false by default');
    assert.strictEqual(amazonConfig.affiliateApprovalStatus, 'WRITTEN_APPROVAL_REQUIRED');
    assert.ok(amazonConfig.restrictedFeatures.includes('price_tracking'));
    assert.ok(amazonConfig.restrictedFeatures.includes('price_drop_alerts'));
    
    // Test helper methods
    assert.strictEqual(marketplaceComplianceService.isPriceTrackingAllowed('amazon'), false);
    assert.strictEqual(marketplaceComplianceService.isPriceAlertsAllowed('amazon'), false);

    logTestSuccess(
      1,
      'Amazon India Default Compliance Gate',
      'Price tracking & drop alerts are strictly disabled by default pending written approval.'
    );
  }

  // --------------------------------------------------------------------------
  // TEST 2: Permitted Marketplaces (Flipkart, Croma, Reliance Digital) Active
  // --------------------------------------------------------------------------
  {
    const flipkartConfig = marketplaceComplianceService.getComplianceConfig('flipkart');
    const cromaConfig = marketplaceComplianceService.getComplianceConfig('croma');
    const relianceConfig = marketplaceComplianceService.getComplianceConfig('reliancedigital');

    assert.strictEqual(flipkartConfig.priceTrackingAllowed, true);
    assert.strictEqual(flipkartConfig.priceAlertsAllowed, true);
    assert.strictEqual(marketplaceComplianceService.isPriceTrackingAllowed('flipkart'), true);
    assert.strictEqual(marketplaceComplianceService.isPriceAlertsAllowed('flipkart'), true);

    assert.strictEqual(cromaConfig.priceTrackingAllowed, true);
    assert.strictEqual(cromaConfig.priceAlertsAllowed, true);
    assert.strictEqual(marketplaceComplianceService.isPriceTrackingAllowed('croma'), true);
    assert.strictEqual(marketplaceComplianceService.isPriceAlertsAllowed('croma'), true);

    assert.strictEqual(relianceConfig.priceTrackingAllowed, true);
    assert.strictEqual(relianceConfig.priceAlertsAllowed, true);
    assert.strictEqual(marketplaceComplianceService.isPriceTrackingAllowed('reliancedigital'), true);
    assert.strictEqual(marketplaceComplianceService.isPriceAlertsAllowed('reliancedigital'), true);

    logTestSuccess(
      2,
      'Permitted Marketplaces Functionality',
      'Flipkart, Croma, and Reliance Digital have price tracking & alerts enabled under standard publisher agreements.'
    );
  }

  // --------------------------------------------------------------------------
  // TEST 3: Global Price Tracking & Alerts Features Preserved
  // --------------------------------------------------------------------------
  {
    const permittedTracking = marketplaceComplianceService.getPermittedMarketplaces('price_tracking');
    const permittedAlerts = marketplaceComplianceService.getPermittedMarketplaces('price_alerts');

    // Must NOT contain Amazon by default
    assert.ok(!permittedTracking.includes('Amazon India'), 'Amazon India must NOT be in permitted tracking list by default');
    assert.ok(!permittedAlerts.includes('Amazon India'), 'Amazon India must NOT be in permitted alerts list by default');

    // MUST contain authorized stores
    assert.ok(permittedTracking.includes('Flipkart'));
    assert.ok(permittedTracking.includes('Croma Retail'));
    assert.ok(permittedTracking.includes('Reliance Digital'));
    assert.ok(permittedAlerts.includes('Flipkart'));
    assert.ok(permittedAlerts.includes('Croma Retail'));
    assert.ok(permittedAlerts.includes('Reliance Digital'));

    logTestSuccess(
      3,
      'Global Price Tracking & Alert Features Preserved',
      `Active on ${permittedTracking.length} permitted partner stores while Amazon is safely gated.`
    );
  }

  // --------------------------------------------------------------------------
  // TEST 4: Zero Cross-Store Leakage (No Assumption Between Marketplaces)
  // --------------------------------------------------------------------------
  {
    // Modify Flipkart compliance config
    marketplaceComplianceService.updateMarketplaceCompliance('flipkart', {
      priceTrackingAllowed: false
    });

    assert.strictEqual(marketplaceComplianceService.isPriceTrackingAllowed('flipkart'), false);
    // Amazon and Croma must remain completely unaffected
    assert.strictEqual(marketplaceComplianceService.isPriceTrackingAllowed('amazon'), false);
    assert.strictEqual(marketplaceComplianceService.isPriceTrackingAllowed('croma'), true);

    // Revert Flipkart
    marketplaceComplianceService.updateMarketplaceCompliance('flipkart', {
      priceTrackingAllowed: true
    });
    assert.strictEqual(marketplaceComplianceService.isPriceTrackingAllowed('flipkart'), true);
    assert.strictEqual(marketplaceComplianceService.isPriceTrackingAllowed('amazon'), false);

    logTestSuccess(
      4,
      'Zero Cross-Store Permission Leakage',
      'Changing permissions on one marketplace never affects or bleeds into another marketplace.'
    );
  }

  // --------------------------------------------------------------------------
  // TEST 5: Recording Written Approval for Amazon India
  // --------------------------------------------------------------------------
  {
    const testRef = 'AMZ-IN-TEST-APPROVAL-2026-X99';
    const updated = marketplaceComplianceService.setWrittenApproval('amazon', true, testRef);

    assert.strictEqual(updated.writtenApprovalObtained, true);
    assert.strictEqual(updated.writtenApprovalRef, testRef);
    assert.strictEqual(updated.affiliateApprovalStatus, 'APPROVED');
    assert.strictEqual(updated.priceTrackingAllowed, true);
    assert.strictEqual(updated.priceAlertsAllowed, true);
    assert.strictEqual(updated.restrictedFeatures.length, 0);

    // Helpers now report true for Amazon India
    assert.strictEqual(marketplaceComplianceService.isPriceTrackingAllowed('amazon'), true);
    assert.strictEqual(marketplaceComplianceService.isPriceAlertsAllowed('amazon'), true);

    // Verify permitted list now includes Amazon India
    const permittedNow = marketplaceComplianceService.getPermittedMarketplaces('price_tracking');
    assert.ok(permittedNow.includes('Amazon India'));

    logTestSuccess(
      5,
      'Amazon India Written Approval Grant',
      `Written approval ref ${testRef} successfully unlocks tracking strictly for Amazon India.`
    );
  }

  // --------------------------------------------------------------------------
  // TEST 6: Other Stores Remain Unaffected After Amazon Approval
  // --------------------------------------------------------------------------
  {
    // Verify Croma, Flipkart, Reliance are still intact
    assert.strictEqual(marketplaceComplianceService.isPriceTrackingAllowed('flipkart'), true);
    assert.strictEqual(marketplaceComplianceService.isPriceTrackingAllowed('croma'), true);
    assert.strictEqual(marketplaceComplianceService.isPriceTrackingAllowed('reliancedigital'), true);

    logTestSuccess(
      6,
      'Store Isolation After Approval Grant',
      'Enabling Amazon India does not alter or disrupt other marketplaces.'
    );
  }

  // --------------------------------------------------------------------------
  // TEST 7: Revoking Written Approval for Amazon India
  // --------------------------------------------------------------------------
  {
    const revoked = marketplaceComplianceService.setWrittenApproval('amazon', false);

    assert.strictEqual(revoked.writtenApprovalObtained, false);
    assert.strictEqual(revoked.affiliateApprovalStatus, 'WRITTEN_APPROVAL_REQUIRED');
    assert.strictEqual(revoked.priceTrackingAllowed, false);
    assert.strictEqual(revoked.priceAlertsAllowed, false);
    assert.ok(revoked.restrictedFeatures.includes('price_tracking'));

    assert.strictEqual(marketplaceComplianceService.isPriceTrackingAllowed('amazon'), false);
    assert.strictEqual(marketplaceComplianceService.isPriceAlertsAllowed('amazon'), false);

    // Other stores still active
    assert.strictEqual(marketplaceComplianceService.isPriceTrackingAllowed('flipkart'), true);

    logTestSuccess(
      7,
      'Amazon India Approval Revocation / Reset',
      'Revoking approval immediately pauses Amazon tracking and restores compliance gate.'
    );
  }

  // --------------------------------------------------------------------------
  // TEST 8: Price Display & API Access Independence
  // --------------------------------------------------------------------------
  {
    // Amazon India allows real-time price display and PA-API even when tracking is paused
    assert.strictEqual(marketplaceComplianceService.isPriceDisplayAllowed('amazon'), true);
    assert.strictEqual(marketplaceComplianceService.isApiAccessAllowed('amazon'), true);

    // Granular toggle
    marketplaceComplianceService.updateMarketplaceCompliance('amazon', {
      apiAccessAllowed: false
    });
    assert.strictEqual(marketplaceComplianceService.isApiAccessAllowed('amazon'), false);
    assert.strictEqual(marketplaceComplianceService.isPriceDisplayAllowed('amazon'), true);

    // Restore
    marketplaceComplianceService.updateMarketplaceCompliance('amazon', {
      apiAccessAllowed: true
    });
    assert.strictEqual(marketplaceComplianceService.isApiAccessAllowed('amazon'), true);

    logTestSuccess(
      8,
      'Price Display & API Access Independence',
      'Display, API, tracking, and alerts permissions operate independently per store.'
    );
  }

  // --------------------------------------------------------------------------
  // TEST 9: Key Normalization Handles Variations & Formats
  // --------------------------------------------------------------------------
  {
    assert.strictEqual(marketplaceComplianceService.getComplianceConfig('Amazon India').marketplaceId, 'amazon');
    assert.strictEqual(marketplaceComplianceService.getComplianceConfig('amazon.in').marketplaceId, 'amazon');
    assert.strictEqual(marketplaceComplianceService.getComplianceConfig('FLIPKART').marketplaceId, 'flipkart');
    assert.strictEqual(marketplaceComplianceService.getComplianceConfig('croma.com').marketplaceId, 'croma');
    assert.strictEqual(marketplaceComplianceService.getComplianceConfig('Reliance Digital').marketplaceId, 'reliancedigital');

    logTestSuccess(
      9,
      'Marketplace Key Normalization Robustness',
      'Normalizes display names, URLs, and case variations reliably.'
    );
  }

  // --------------------------------------------------------------------------
  // TEST 10: Unknown Marketplace Conservative Fallback
  // --------------------------------------------------------------------------
  {
    const unknownConfig = marketplaceComplianceService.getComplianceConfig('UnregisteredStoreXYZ');
    assert.strictEqual(unknownConfig.writtenApprovalObtained, false);
    assert.strictEqual(unknownConfig.priceTrackingAllowed, false);
    assert.strictEqual(unknownConfig.priceAlertsAllowed, false);
    assert.strictEqual(unknownConfig.affiliateApprovalStatus, 'WRITTEN_APPROVAL_REQUIRED');
    assert.strictEqual(marketplaceComplianceService.isPriceTrackingAllowed('UnregisteredStoreXYZ'), false);

    logTestSuccess(
      10,
      'Unknown Marketplace Conservative Fallback',
      'Unknown platforms require explicit audit and approval before any tracking is permitted.'
    );
  }

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} MARKETPLACE COMPLIANCE TESTS PASSED!`);
  console.log('================================================================\n');
}

runComplianceTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
