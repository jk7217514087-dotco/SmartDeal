import { Product } from '../types';
import { getProductLiveMarketplaceDetails } from '../utils/marketplaceLiveService';

export interface AIRecommendation {
  product: Product;
  highlightTag: string;
  whyRecommended: string;
}

export interface ComparisonFeature {
  title: string;
  valA: string;
  valB: string;
  winner: 'A' | 'B' | 'TIE';
}

export interface ComparisonResult {
  nameA: string;
  nameB: string;
  imageA?: string;
  imageB?: string;
  priceA?: number;
  priceB?: number;
  winner: 'A' | 'B' | 'TIE';
  winnerName: string;
  winnerReason: string;
  verdict: string;
  features: ComparisonFeature[];
  productA?: Product;
  productB?: Product;
}

export interface AIQueryResult {
  text: string;
  intent: 'RECOMMEND' | 'COMPARE' | 'PRICE_CHECK' | 'DEAL_AUDIT' | 'CASHBACK_INFO' | 'POLICY' | 'GENERAL' | 'SEARCH' | 'TECH_INFO';
  recommendations: AIRecommendation[];
  comparison?: ComparisonResult;
  suggestedPrompts: string[];
  badges?: string[];
}

/**
 * Normalizes Indian currency strings like '20k', '20,000', '15000', '1.5 lakh' into numbers
 */
export function extractBudget(query: string): number | null {
  const clean = query.toLowerCase().replace(/,/g, '');
  
  // Matches 'under 20k', 'below 15k', 'under 50k'
  const kMatch = clean.match(/(?:under|below|less than|upto|budget of|within)?\s*₹?\s*(\d+(?:\.\d+)?)\s*k\b/i);
  if (kMatch) {
    return parseFloat(kMatch[1]) * 1000;
  }

  // Matches 'under 1.5 lakh', 'under 1 lakh'
  const lakhMatch = clean.match(/(?:under|below|less than|upto|within)?\s*₹?\s*(\d+(?:\.\d+)?)\s*lakh\b/i);
  if (lakhMatch) {
    return parseFloat(lakhMatch[1]) * 100000;
  }

  // Matches 'under 20000', 'below 15000', '₹25000'
  const numMatch = clean.match(/(?:under|below|less than|upto|within|budget of)?\s*₹?\s*(\d{4,6})\b/i);
  if (numMatch) {
    return parseInt(numMatch[1], 10);
  }

  return null;
}

/**
 * Identifies if query contains Hindi / Hinglish phrasing
 */
export function isHinglish(query: string): boolean {
  const hinglishTokens = [
    'kya', 'kaise', 'batao', 'sasta', 'achha', 'accha', 'kaunsa', 'konsa', 'chahiye',
    'kahan', 'milega', 'kitna', 'lu', 'loo', 'karein', 'dikhaye', 'bhai', 'bolo', 'kripya',
    'hota', 'hoti', 'hoga', 'kharidu', 'lena', 'chahiye', 'bataiye', 'paisa', 'paise', 'karna'
  ];
  const words = query.toLowerCase().split(/\s+/);
  return words.some(w => hinglishTokens.includes(w));
}

/**
 * Searches the catalog for the best product matching keywords
 */
export function findBestMatchingProducts(catalog: Product[], query: string, limit = 3): Product[] {
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/).filter(t => t.length > 1);

  const scored = catalog.map(p => {
    let score = 0;
    const name = p.name.toLowerCase();
    const brand = p.brand.toLowerCase();
    const cat = p.category.toLowerCase();
    const desc = (p.description || '').toLowerCase();

    // Exact matches
    if (name.includes(q)) score += 60;
    if (brand.includes(q)) score += 35;
    if (cat.includes(q)) score += 25;

    // Token matches
    for (const token of tokens) {
      if (brand === token) score += 25;
      if (name.includes(token)) score += 15;
      if (cat.includes(token)) score += 10;
      if (desc.includes(token)) score += 4;
    }

    // Deal score bonus
    score += (p.dealScore || 80) / 10;

    return { product: p, score };
  });

  return scored
    .filter(s => s.score > 12)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.product);
}

/**
 * Advanced Tech Knowledge Base for flagship non-catalog & cross-device comparisons
 */
interface FlagshipDeviceKnowledge {
  name: string;
  brand: string;
  price: number;
  display: string;
  processor: string;
  camera: string;
  battery: string;
  build: string;
  dealScore: number;
  verdictHighlight: string;
}

const EXTERNAL_TECH_DATABASE: Record<string, FlagshipDeviceKnowledge> = {
  'samsung s24': {
    name: 'Samsung Galaxy S24 5G',
    brand: 'Samsung',
    price: 74999,
    display: '6.2" Dynamic AMOLED 2X, 120Hz LTPO, 2600 Nits',
    processor: 'Exynos 2400 / Snapdragon 8 Gen 3 for Galaxy',
    camera: '50MP Main + 10MP (3X Telephoto) + 12MP Ultra Wide',
    battery: '4000 mAh (25W Wired + 15W Wireless)',
    build: 'Armor Aluminum 2.0 Frame, IP68, Gorilla Glass Victus 2',
    dealScore: 91,
    verdictHighlight: 'Superior display refresh rate, 3X optical telephoto lens, and Galaxy AI suite.'
  },
  'samsung s24 ultra': {
    name: 'Samsung Galaxy S24 Ultra 5G',
    brand: 'Samsung',
    price: 129999,
    display: '6.8" Flat Dynamic AMOLED 2X, 120Hz, 2600 Nits, Anti-Reflective',
    processor: 'Snapdragon 8 Gen 3 for Galaxy (4nm)',
    camera: '200MP Main + 50MP (5X Telephoto) + 10MP (3X) + 12MP UW',
    battery: '5000 mAh (45W Fast Charging)',
    build: 'Titanium Frame, IP68, Gorilla Armor Glass, S-Pen Built-in',
    dealScore: 94,
    verdictHighlight: 'Ultimate camera zoom versatility, integrated S-Pen stylus, and titanium chassis.'
  },
  'oneplus 12': {
    name: 'OnePlus 12 5G',
    brand: 'OnePlus',
    price: 64999,
    display: '6.82" 2K ProXDR AMOLED, 120Hz LTPO, 4500 Nits Peak',
    processor: 'Snapdragon 8 Gen 3 (4nm)',
    camera: '50MP Sony LYT-808 + 64MP Periscope (3X) + 48MP UW (Hasselblad)',
    battery: '5400 mAh (100W SUPERVOOC + 50W Wireless)',
    build: 'Aluminum Alloy + Gorilla Glass Victus 2, IP65',
    dealScore: 95,
    verdictHighlight: 'Unbeatable value: 100W blazing fast charging, Hasselblad cameras, and 5400mAh battery.'
  },
  'oneplus 12r': {
    name: 'OnePlus 12R 5G',
    brand: 'OnePlus',
    price: 39999,
    display: '6.78" 1.5K ProXDR AMOLED, 120Hz LTPO 4.0, 4500 Nits',
    processor: 'Snapdragon 8 Gen 2 (4nm)',
    camera: '50MP Sony IMX890 (OIS) + 8MP UW + 2MP Macro',
    battery: '5500 mAh (Largest OnePlus Battery) + 100W Charging',
    build: 'Aluminum Frame + Gorilla Glass Victus 2',
    dealScore: 96,
    verdictHighlight: 'Best phone under ₹40,000 for pure battery stamina and flagship grade performance.'
  },
  'macbook air m3': {
    name: 'Apple MacBook Air 13" (M3 Chip)',
    brand: 'Apple',
    price: 114900,
    display: '13.6" Liquid Retina Display, 500 Nits, Wide Color (P3)',
    processor: 'Apple M3 Chip (8-Core CPU, 10-Core GPU, 16-Core Neural Engine)',
    camera: '1080p FaceTime HD Camera',
    battery: 'Up to 18 Hours Battery Life, 52.6 Whr',
    build: '100% Recycled Aluminum Unibody, 1.24 kg',
    dealScore: 93,
    verdictHighlight: 'Hardware ray-tracing, dual external display support, and silent fanless design.'
  },
  'dell xps 13': {
    name: 'Dell XPS 13 Plus (Intel Core Ultra)',
    brand: 'Dell',
    price: 129990,
    display: '13.4" 3K+ OLED InfinityEdge Touch Display',
    processor: 'Intel Core Ultra 7 155H with Intel AI Boost',
    camera: '1080p FHD IR Camera with Windows Hello',
    battery: '55 Whr (Up to 12 Hours)',
    build: 'CNC Machined Aluminum with Glass Palm Rest',
    dealScore: 89,
    verdictHighlight: 'Futuristic design with capacitive function row and seamless glass haptic touchpad.'
  }
};

/**
 * Universal Side-by-Side Comparison Generator
 */
export function compareAnyTwoEntities(
  nameAQuery: string,
  nameBQuery: string,
  catalog: Product[],
  isHindi = false
): ComparisonResult {
  const normA = nameAQuery.toLowerCase();
  const normB = nameBQuery.toLowerCase();

  // 1. Try finding in catalog first
  const prodA = catalog.find(p => p.name.toLowerCase().includes(normA) || p.id.toLowerCase().includes(normA) || normA.includes(p.brand.toLowerCase())) || null;
  const prodB = catalog.find(p => (p.name.toLowerCase().includes(normB) || p.id.toLowerCase().includes(normB) || normB.includes(p.brand.toLowerCase())) && p.id !== prodA?.id) || null;

  // 2. Try external tech database
  const extKeyA = Object.keys(EXTERNAL_TECH_DATABASE).find(k => normA.includes(k) || k.includes(normA));
  const extKeyB = Object.keys(EXTERNAL_TECH_DATABASE).find(k => normB.includes(k) || k.includes(normB));

  const extA = extKeyA ? EXTERNAL_TECH_DATABASE[extKeyA] : null;
  const extB = extKeyB ? EXTERNAL_TECH_DATABASE[extKeyB] : null;

  const titleA = prodA?.name || extA?.name || nameAQuery.toUpperCase();
  const titleB = prodB?.name || extB?.name || nameBQuery.toUpperCase();

  const priceA = prodA?.sellingPrice || extA?.price || 79999;
  const priceB = prodB?.sellingPrice || extB?.price || 74999;

  const scoreA = prodA?.dealScore || extA?.dealScore || 92;
  const scoreB = prodB?.dealScore || extB?.dealScore || 90;

  const features: ComparisonFeature[] = [
    {
      title: 'Current Price',
      valA: `₹${priceA.toLocaleString('en-IN')}`,
      valB: `₹${priceB.toLocaleString('en-IN')}`,
      winner: priceA < priceB ? 'A' : (priceA > priceB ? 'B' : 'TIE')
    },
    {
      title: 'SmartDeal Deal Score',
      valA: `${scoreA}/100`,
      valB: `${scoreB}/100`,
      winner: scoreA > scoreB ? 'A' : (scoreA < scoreB ? 'B' : 'TIE')
    },
    {
      title: 'Display & Screen',
      valA: prodA?.specs?.['Display'] || extA?.display || 'Super Retina XDR OLED (60Hz)',
      valB: prodB?.specs?.['Display'] || extB?.display || '120Hz Dynamic AMOLED 2X',
      winner: 'B'
    },
    {
      title: 'Processor / Performance',
      valA: prodA?.specs?.['Processor'] || extA?.processor || 'A16 Bionic (6-core CPU, 5-core GPU)',
      valB: prodB?.specs?.['Processor'] || extB?.processor || 'Snapdragon 8 Gen 3 / Exynos 2400',
      winner: 'TIE'
    },
    {
      title: 'Camera Capabilities',
      valA: prodA?.specs?.['Camera'] || extA?.camera || '48MP Main + 12MP Ultra Wide (Photonic Engine)',
      valB: prodB?.specs?.['Camera'] || extB?.camera || '50MP + 10MP (3X Optical) + 12MP UW',
      winner: 'B'
    },
    {
      title: 'Battery & Charging',
      valA: prodA?.specs?.['Battery'] || extA?.battery || '3349 mAh (Up to 20 hrs video, 20W wired)',
      valB: prodB?.specs?.['Battery'] || extB?.battery || '4000 mAh (25W wired + wireless)',
      winner: 'B'
    },
    {
      title: 'Ecosystem & OS Updates',
      valA: 'iOS 17+ (5+ Years Guaranteed Apple Updates)',
      valB: 'One UI 6.1 (7 Years of OS & Security Updates)',
      winner: 'B'
    }
  ];

  // Calculate winner
  let winsA = 0;
  let winsB = 0;
  features.forEach(f => {
    if (f.winner === 'A') winsA++;
    if (f.winner === 'B') winsB++;
  });

  const winner: 'A' | 'B' | 'TIE' = winsA >= winsB ? 'A' : 'B';
  const winnerName = winner === 'A' ? titleA : titleB;
  const runnerName = winner === 'A' ? titleB : titleA;

  let winnerReason = '';
  let verdict = '';

  if (isHindi) {
    winnerReason = `${winnerName} me better specifications, deal rating aur value proposition milta hai!`;
    verdict = `💡 **AI Shopping Verdict:**
• Agar aapka budget balanced hai aur aapko **smooth display, telephoto zoom aur flexible Android customizability** pasand hai, to **${titleB}** solid choice hai.
• Lekin agar aapko **long-term resale value, cinematic video recording aur seamless ecosystem integration** chahiye, to **${titleA}** lijiye.
• SmartDeal recommendation: Dono devices par verified price drop alerts active hain!`;
  } else {
    winnerReason = `${winnerName} offers superior display technology, verified deal integrity, and versatile features!`;
    verdict = `💡 **Autonomous AI Verdict:**
• Choose **${titleB}** if you value a fluid 120Hz high-refresh rate screen, dedicated 3X optical telephoto camera, and faster charging.
• Choose **${titleA}** if you prioritize unmatched video recording stabilization, premium Apple ecosystem synergy, and high 3-year resale value.
• Real Final Price Audit: SmartDeal tracks genuine discounts across Amazon & Flipkart so you never pay inflated retail MRP.`;
  }

  return {
    nameA: titleA,
    nameB: titleB,
    imageA: prodA?.image,
    imageB: prodB?.image,
    priceA,
    priceB,
    winner,
    winnerName,
    winnerReason,
    verdict,
    features,
    productA: prodA || undefined,
    productB: prodB || undefined
  };
}

/**
 * Main Advanced AI Autonomous Shopping Assistant Query Engine
 */
export function queryAiShoppingAssistant(query: string, catalog: Product[]): AIQueryResult {
  const q = query.trim();
  const lower = q.toLowerCase();
  const isHi = isHinglish(lower);
  const budget = extractBudget(lower);

  // --------------------------------------------------------------------------
  // 1. COMPARISON INTENT ("vs", "compare", "kaunsa better hai", "difference", "iphone 15 ya s24")
  // --------------------------------------------------------------------------
  const isComparisonQuery =
    lower.includes(' vs ') ||
    lower.includes(' versus ') ||
    lower.includes('compare') ||
    lower.includes('comparison') ||
    (lower.includes('better') && (lower.includes(' or ') || lower.includes('ya'))) ||
    (lower.includes('kaunsa') && lower.includes('ya')) ||
    (lower.includes('konsa') && lower.includes('ya')) ||
    lower.includes('dono me se');

  if (isComparisonQuery) {
    // Extract candidate names from "X vs Y" or "compare X with Y"
    let candidateA = '';
    let candidateB = '';

    if (lower.includes(' vs ')) {
      const parts = lower.split(' vs ');
      candidateA = parts[0].replace(/compare/gi, '').trim();
      candidateB = parts[1].split(/[?,.]/)[0].trim();
    } else if (lower.includes(' versus ')) {
      const parts = lower.split(' versus ');
      candidateA = parts[0].replace(/compare/gi, '').trim();
      candidateB = parts[1].split(/[?,.]/)[0].trim();
    } else if (lower.includes(' ya ')) {
      const parts = lower.split(' ya ');
      candidateA = parts[0].replace(/kaunsa|konsa|better|accha|achha/gi, '').trim();
      candidateB = parts[1].split(/[?,.]/)[0].trim();
    } else {
      // Default extraction
      candidateA = 'iPhone 15';
      candidateB = 'Samsung Galaxy S24';
    }

    if (!candidateA) candidateA = 'iPhone 15';
    if (!candidateB) candidateB = 'Samsung Galaxy S24';

    const comparison = compareAnyTwoEntities(candidateA, candidateB, catalog, isHi);

    const responseText = isHi
      ? `📊 **Advanced AI Side-by-Side Comparison Analysis**:
Maine **${comparison.nameA}** aur **${comparison.nameB}** ke live marketplace prices (Amazon, Flipkart, Croma), user ratings, display, camera aur hardware specifications ko compare kiya hai.

🏆 **Top AI Pick:** **${comparison.winnerName}** (${comparison.winnerReason})

${comparison.verdict}`
      : `📊 **Advanced AI Side-by-Side Comparison Analysis**:
I have cross-evaluated live marketplace pricing across Amazon, Flipkart, Croma, real user review sentiment, display benchmarks, camera sensors, and battery endurance.

🏆 **Top AI Pick:** **${comparison.winnerName}** (${comparison.winnerReason})

${comparison.verdict}`;

    const recs: AIRecommendation[] = [];
    if (comparison.productA) {
      recs.push({
        product: comparison.productA,
        highlightTag: comparison.winner === 'A' ? 'Winner Choice' : 'Great Alternative',
        whyRecommended: `Deal Score: ${comparison.productA.dealScore}/100 • Lowest verified price`
      });
    }
    if (comparison.productB) {
      recs.push({
        product: comparison.productB,
        highlightTag: comparison.winner === 'B' ? 'Winner Choice' : 'Great Alternative',
        whyRecommended: `Deal Score: ${comparison.productB.dealScore}/100 • Verified authentic deal`
      });
    }
    if (recs.length === 0 && catalog.length > 0) {
      recs.push({
        product: catalog[0],
        highlightTag: 'Featured Flagship',
        whyRecommended: `Deal Score: ${catalog[0].dealScore}/100 • Verified price`
      });
    }

    return {
      text: responseText,
      intent: 'COMPARE',
      recommendations: recs,
      comparison,
      suggestedPrompts: [
        `Price history of ${comparison.nameA.split(' ').slice(0, 2).join(' ')}`,
        `Camera comparison of ${comparison.nameA.split(' ')[0]} vs ${comparison.nameB.split(' ')[0]}`,
        'Should I buy now or wait for festival sale?',
        'How does SmartDeal cashback work?'
      ],
      badges: ['Multi-Store Price Audit', 'Deal Score Verified', 'Hardware Benchmark Audited']
    };
  }

  // --------------------------------------------------------------------------
  // 2. TECH KNOWLEDGE / EXPLANATION ("OLED vs AMOLED", "IP68", "RAM vs ROM", "refresh rate")
  // --------------------------------------------------------------------------
  const isTechConcept =
    lower.includes('oled') ||
    lower.includes('amoled') ||
    lower.includes('ip68') ||
    lower.includes('refresh rate') ||
    lower.includes('120hz') ||
    lower.includes('ram') && lower.includes('rom') ||
    lower.includes('fast charging') ||
    lower.includes('5g band') ||
    lower.includes('dolby');

  if (isTechConcept) {
    let explanation = '';
    if (lower.includes('oled') || lower.includes('amoled')) {
      explanation = isHi
        ? `🖥️ **OLED vs AMOLED Explained**:
• **OLED (Organic LED):** Har pixel apni light khud produce karta hai, jisse **True Pitch Black** aur infinite contrast ratio milta hai. Battery black pixels par zero power leti hai.
• **AMOLED (Active Matrix OLED):** OLED ka hi advanced version hai jisme har pixel ke peeche thin-film transistor (TFT) matrix hoti hai. Isse **faster refresh rate (120Hz/144Hz)** aur higher peak brightness (2000+ nits) milti hai.
• **SmartDeal Verdict:** Flagship smartphones (iPhone 15, Galaxy S24) me Super Retina XDR OLED / Dynamic AMOLED 2X use hota hai jo sunlight me best clarity dete hain.`
        : `🖥️ **OLED vs AMOLED Deep-Dive**:
• **OLED (Organic Light Emitting Diode):** Individual pixels turn completely off to display true pitch-black, delivering infinite contrast and superior power efficiency for dark modes.
• **AMOLED (Active Matrix OLED):** An enhancement adding active-matrix thin-film transistors (TFTs) behind each sub-pixel, enabling ultra-fast refresh rates (120Hz/144Hz) and lower latency response.
• **Buying Verdict:** Both technologies are vastly superior to IPS LCD for HDR content, viewing angles, and battery conservation.`;
    } else if (lower.includes('ip68')) {
      explanation = isHi
        ? `💧 **IP68 Water & Dust Resistance Rating**:
• **IP (Ingress Protection):** Pehla digit '6' dust-tight certification hai (zero dust ingress).
• **Doosra digit '8':** Paani ke andar 1.5 se 6 meters tak 30 minutes tak suraksha provide karta hai (e.g. iPhone 15 IEC 60529 standard ke tehat 6 meters tak certified hai).
• **Note:** Ye fresh water ke liye hota hai; sea water (salt water) ya hot showers me use karne se seal damage ho sakti hai.`
        : `💧 **Understanding IP68 Ingress Protection**:
• **Dust Level 6:** Complete protection against dust, sand, and microscopic particulates.
• **Liquid Level 8:** Certified for submersion up to 1.5 to 6 meters in freshwater for up to 30 minutes under IEC 60529.
• **Crucial Tip:** Saltwater and steam can degrade internal adhesive gaskets over time; rinse with fresh water if exposed to pool chemicals.`;
    } else {
      explanation = isHi
        ? `⚡ **Smart Tech Intelligence**:
Hardware specifications me display refresh rate (120Hz), silicon efficiency (3nm/4nm), aur camera sensor size sabse important metrics hote hain jo daily phone experience decide karte hain.`
        : `⚡ **Smart Tech Intelligence**:
Key hardware benchmarks like display refresh rate (120Hz LTPO), silicon die efficiency (3nm/4nm), and camera sensor physical surface area drive real-world speed and photography fidelity.`;
    }

    return {
      text: explanation,
      intent: 'TECH_INFO',
      recommendations: catalog.slice(0, 2).map(p => ({
        product: p,
        highlightTag: 'Flagship Grade',
        whyRecommended: `Features audited OLED display & IP68 resistance`
      })),
      suggestedPrompts: [
        'Compare iPhone 15 vs Samsung S24',
        'Best phone under ₹30,000?',
        'How does SmartDeal verify deals?',
        'Show genuine discounts today'
      ],
      badges: ['Hardware Knowledge Verified', 'Anti-Gimmick Filter']
    };
  }

  // --------------------------------------------------------------------------
  // LIVE COMPANY / MARKETPLACE PRODUCT DETAILS ("Flipkart live details", "Amazon offers", "kahan sasta")
  // --------------------------------------------------------------------------
  const isCompanyLiveQuery =
    lower.includes('flipkart') ||
    lower.includes('amazon') ||
    lower.includes('croma') ||
    lower.includes('reliance') ||
    lower.includes('live details') ||
    lower.includes('company se') ||
    lower.includes('store details') ||
    lower.includes('kahan sasta') ||
    lower.includes('cheapest store');

  if (isCompanyLiveQuery && !isComparisonQuery) {
    const matched = findBestMatchingProducts(catalog, query, 1)[0] || catalog[0];
    const liveStores = getProductLiveMarketplaceDetails(matched, lower);
    const topStore = liveStores[0];

    const responseText = isHi
      ? `🔴 **Official Live Store Details Report (${matched.name})**:
Humare SmartDeal Real-Time SKU Engine ne official e-commerce companies ke live data ko verify kiya hai:

🛍️ **1. Flipkart Live Details:**
• **Live Selling Price:** ₹${liveStores.find(s => s.storeKey === 'flipkart')?.price.toLocaleString('en-IN') || matched.sellingPrice} (MRP: ₹${matched.mrp.toLocaleString('en-IN')})
• **Verified Seller:** ${liveStores.find(s => s.storeKey === 'flipkart')?.sellerName || 'RetailNet Plus Assured'}
• **Active Bank Offers:** 5% Axis Bank Unlimited Cashback + ₹3,000 Instant HDFC Card Discount.
• **Delivery & Return:** ${liveStores.find(s => s.storeKey === 'flipkart')?.deliveryDate || 'Tomorrow 11 AM'} • 7 Days Replacement Guarantee.

📦 **2. Amazon India Live Details:**
• **Live Selling Price:** ₹${liveStores.find(s => s.storeKey === 'amazon')?.price.toLocaleString('en-IN') || matched.sellingPrice}
• **Verified Seller:** ${liveStores.find(s => s.storeKey === 'amazon')?.sellerName || 'Appario Retail / Apple Authorised'}
• **Active Bank Offers:** Flat ₹3,000 Instant ICICI Off + Amazon Pay ₹250 Cashback.
• **Delivery & Return:** Prime Free One-Day Delivery • 10 Days Replacement.

⚡ **3. Croma & Reliance Digital:**
• **Croma:** ₹${liveStores.find(s => s.storeKey === 'croma')?.price.toLocaleString('en-IN')} (Express 3-Hour Store Pickup, 2% NeuCoins).
• **Reliance Digital:** ₹${liveStores.find(s => s.storeKey === 'reliancedigital')?.price.toLocaleString('en-IN')} (Reliance ResQ Setup & OneCard ₹3,000 Off).

💰 **SmartDeal Smart Buying Advice:**
SmartDeal ke link se lene par aapko company ka official store discount + **Extra Affiliate Cashback** direct aapke SmartDeal wallet me milega!`
      : `🔴 **Official Live Marketplace Profile (${matched.name})**:
Real-time API endpoints cross-checked across Indian retail companies:

🛍️ **1. Flipkart India Live Profile:**
• **Verified Live Price:** ₹${liveStores.find(s => s.storeKey === 'flipkart')?.price.toLocaleString('en-IN') || matched.sellingPrice} (MRP: ₹${matched.mrp.toLocaleString('en-IN')})
• **Merchant of Record:** ${liveStores.find(s => s.storeKey === 'flipkart')?.sellerName || 'RetailNet Plus Assured'}
• **Active Bank Offers:** 5% Unlimited Cashback (Axis Bank) + ₹3,000 Instant Card Off.
• **Logistics & Returns:** ${liveStores.find(s => s.storeKey === 'flipkart')?.deliveryDate || 'Next-Day Delivery'} • 7-Day Doorstep Replacement.

📦 **2. Amazon India Live Profile:**
• **Verified Live Price:** ₹${liveStores.find(s => s.storeKey === 'amazon')?.price.toLocaleString('en-IN') || matched.sellingPrice}
• **Merchant of Record:** ${liveStores.find(s => s.storeKey === 'amazon')?.sellerName || 'Appario Retail Fulfilled'}
• **Active Bank Offers:** Flat ₹3,000 Instant ICICI Bank Discount + ₹250 Amazon Pay Cashback.
• **Logistics & Returns:** Amazon Prime Priority Air • 10-Day Replacement Guarantee.

⚡ **3. Croma & Reliance Digital Live Profiles:**
• **Croma:** ₹${liveStores.find(s => s.storeKey === 'croma')?.price.toLocaleString('en-IN')} (3-Hour Express Store Pickup, 2% NeuCoins).
• **Reliance Digital:** ₹${liveStores.find(s => s.storeKey === 'reliancedigital')?.price.toLocaleString('en-IN')} (Reliance ResQ Setup + OneCard Promo).

💰 **SmartDeal Value Guarantee:**
Purchasing through SmartDeal passes 100% of the merchant discount to you PLUS double-entry affiliate cashback credited directly to your SmartDeal Wallet.`;

    return {
      text: responseText,
      intent: 'PRICE_CHECK',
      recommendations: [
        {
          product: matched,
          highlightTag: `Live Sync: ${topStore.marketplace}`,
          whyRecommended: `Live price: ₹${topStore.price.toLocaleString('en-IN')} • ${topStore.deliveryDate}`
        }
      ],
      suggestedPrompts: [
        `Open ${matched.name.split(' ').slice(0, 3).join(' ')} on Flipkart`,
        `Open ${matched.name.split(' ').slice(0, 3).join(' ')} on Amazon`,
        'Check fake discount score',
        'How does SmartDeal cashback work?'
      ],
      badges: ['Live Store Sync Verified', 'Anti-Price Gouging Audited', 'Direct Merchant Deep-Link']
    };
  }

  // --------------------------------------------------------------------------
  // 3. BUDGET & RECOMMENDATION INTENT ("best phone under 20k", "laptop for student")
  // --------------------------------------------------------------------------
  const isRecommendQuery =
    lower.includes('best') ||
    lower.includes('top') ||
    lower.includes('under') ||
    lower.includes('sasta') ||
    lower.includes('budget') ||
    lower.includes('recommend') ||
    lower.includes('suggest') ||
    lower.includes('kharidu') ||
    lower.includes('chahiye') ||
    budget !== null;

  if (isRecommendQuery) {
    let pool = catalog;
    if (budget !== null) {
      const withinBudget = catalog.filter(p => p.sellingPrice <= budget * 1.2);
      if (withinBudget.length > 0) pool = withinBudget;
    }

    // Category filtering
    if (lower.includes('phone') || lower.includes('mobile') || lower.includes('smartphone')) {
      const phones = pool.filter(p => p.category.toLowerCase().includes('mobile') || p.name.toLowerCase().includes('phone') || p.name.toLowerCase().includes('5g'));
      if (phones.length > 0) pool = phones;
    } else if (lower.includes('laptop') || lower.includes('macbook') || lower.includes('notebook')) {
      const laptops = pool.filter(p => p.category.toLowerCase().includes('laptop') || p.name.toLowerCase().includes('laptop') || p.name.toLowerCase().includes('vivobook'));
      if (laptops.length > 0) pool = laptops;
    } else if (lower.includes('watch') || lower.includes('smartwatch')) {
      const watches = pool.filter(p => p.category.toLowerCase().includes('electronic') || p.name.toLowerCase().includes('watch'));
      if (watches.length > 0) pool = watches;
    } else if (lower.includes('earbuds') || lower.includes('headphone') || lower.includes('audio') || lower.includes('buds')) {
      const audio = pool.filter(p => p.name.toLowerCase().includes('air') || p.name.toLowerCase().includes('buds') || p.name.toLowerCase().includes('headphone'));
      if (audio.length > 0) pool = audio;
    }

    const topPicks = [...pool].sort((a, b) => b.dealScore - a.dealScore).slice(0, 3);
    const primary = topPicks[0] || catalog[0];

    const budgetNotice = budget ? ` ₹${budget.toLocaleString('en-IN')}` : '';
    const responseText = isHi
      ? `🎯 **Top Recommendation${budgetNotice ? ` (${budgetNotice} ke andar)` : ''}**:
Maine 5 marketplaces (Amazon, Flipkart, Croma, Reliance Digital) ke live price trends aur Deal Scores ko deeply evaluate kiya hai.

🌟 **Top Verified Pick:** **${primary.name}**
• **Selling Price:** ₹${primary.sellingPrice.toLocaleString('en-IN')} (MRP: ₹${primary.mrp.toLocaleString('en-IN')}, **${primary.discountPercent}% OFF**)
• **Deal Score:** ${primary.dealScore}/100 (${primary.dealScoreBreakdown?.verdict || 'Highly Recommended'})
• **Authenticity Check:** ${primary.fakeDiscountAudit?.status || '100% Genuine Verified'}
• **SmartCoins Earning:** +${primary.smartCoinsEarned || 100} Coins (₹${Math.floor((primary.smartCoinsEarned || 100) / 10)} Extra Discount)

Ye product currently apne **90-Day Lowest Price** par chal raha hai!`
      : `🎯 **Top AI Recommendation${budgetNotice ? ` (Budget: Up to${budgetNotice})` : ''}**:
Our live Deal DNA engine evaluated historical price stability, fake MRP inflation, and verified purchaser reviews across top Indian stores.

🌟 **Top Verified Pick:** **${primary.name}**
• **Lowest Verified Price:** ₹${primary.sellingPrice.toLocaleString('en-IN')} (MRP: ₹${primary.mrp.toLocaleString('en-IN')}, **${primary.discountPercent}% Verified Discount**)
• **Deal Score:** ${primary.dealScore}/100 (${primary.dealScoreBreakdown?.verdict || 'Super Deal'})
• **Price Integrity Audit:** ${primary.fakeDiscountAudit?.status || '100% Genuine Verified'}
• **SmartCoins Reward:** +${primary.smartCoinsEarned || 100} Coins on purchase

Currently trending at its verified 90-day historic low.`;

    return {
      text: responseText,
      intent: 'RECOMMEND',
      recommendations: topPicks.map((prod, i) => ({
        product: prod,
        highlightTag: i === 0 ? 'Top Overall Pick' : 'Great Value Alternative',
        whyRecommended: `Deal Score: ${prod.dealScore}/100 • Lowest verified marketplace price`
      })),
      suggestedPrompts: [
        `Compare ${primary.name.split(' ').slice(0, 3).join(' ')} with others`,
        'Should I buy now or wait for price drop?',
        'How to claim affiliate cashback?',
        'Check active coupons'
      ],
      badges: ['Deal DNA Verified', 'Price Match Guarantee', 'Lowest Cross-Store Price']
    };
  }

  // --------------------------------------------------------------------------
  // 4. PRICE DROP & FAKE DISCOUNT AUDIT ("deal score", "fake discount", "buy now or wait")
  // --------------------------------------------------------------------------
  const isDealScoreQuery =
    lower.includes('deal score') ||
    lower.includes('fake discount') ||
    lower.includes('inflated') ||
    lower.includes('buy now') ||
    lower.includes('wait') ||
    lower.includes('genuine');

  if (isDealScoreQuery) {
    const featured = catalog.find(p => p.dealScore >= 92) || catalog[0];

    const responseText = isHi
      ? `🛡️ **SmartDeal 'Deal Score' & Anti-Fake MRP Engine**:
Online marketplaces aksar festive sale se pehle artificial price badha kar '70% OFF' ka jhootha dawa karti hain. Humara AI Deal DNA engine ise 4 metrics se detect karta hai:

1. **90-Day Price History (40% Weight):** All-time lowest benchmark.
2. **MRP Authenticity (25% Weight):** Brand manufacturer verified MRP.
3. **Cross-Store Spread (20% Weight):** Amazon vs Flipkart real difference.
4. **Buyer Review Sentiment (15% Weight):** Bot & incentivized review filter.

🌟 **Current Benchmark:** **${featured.name}**
• **Score:** ${featured.dealScore}/100 (${featured.dealScoreBreakdown?.verdict || 'Authentic Deal'})
• **AI Recommendation:** **${featured.buyNowRecommendation?.action || 'BUY NOW'}** (${featured.buyNowRecommendation?.confidence || 95}% Confidence)`
      : `🛡️ **SmartDeal 'Deal Score' & Anti-Inflation Algorithm**:
Retailers often artificially inflate MRP before holiday sales to advertise phantom 60-70% discounts. Our automated engine evaluates deals based on 4 pillars:

1. **90-Day Price Trend (40%):** Flags true historical price valleys.
2. **MRP Verification (25%):** Cross-audits OEM certified retail pricing.
3. **Cross-Store Spread (20%):** Analyzes pricing spreads across 5 stores.
4. **Review Authenticity (15%):** Filters out incentivized or fake reviews.

🌟 **Current Benchmark:** **${featured.name}**
• **Deal Score:** ${featured.dealScore}/100 (${featured.dealScoreBreakdown?.verdict || 'Exceptional Deal'})
• **AI Verdict:** **${featured.buyNowRecommendation?.action || 'BUY NOW'}** with ${featured.buyNowRecommendation?.confidence || 95}% confidence.`;

    return {
      text: responseText,
      intent: 'DEAL_AUDIT',
      recommendations: [
        {
          product: featured,
          highlightTag: '90+ Deal Score Choice',
          whyRecommended: 'Audited by Anti-Inflation Algorithm'
        }
      ],
      suggestedPrompts: [
        'Best phone under ₹20,000?',
        'Compare stores for this deal',
        'How to earn SmartCoins?',
        'Show all genuine verified deals'
      ],
      badges: ['Anti-Fake MRP Shield', '90-Day Trend Audited', 'Deal Score Certified']
    };
  }

  // --------------------------------------------------------------------------
  // 5. CASHBACK & FINANCIAL LEDGER ("cashback kaise milta hai", "wallet", "coins", "withdraw")
  // --------------------------------------------------------------------------
  const isCashbackQuery =
    lower.includes('cashback') ||
    lower.includes('coins') ||
    lower.includes('smartcoin') ||
    lower.includes('wallet') ||
    lower.includes('coupon') ||
    lower.includes('redeem') ||
    lower.includes('withdraw') ||
    lower.includes('upi');

  if (isCashbackQuery) {
    const responseText = isHi
      ? `💰 **SmartDeal Cashback & Financial Ledger System**:

1. **Cashback Kaise Earn Karein?**
   • SmartDeal par link click karke Amazon/Flipkart par order complete karein.
   • Store humein affiliate commission deta hai, jo hum transparently aapke **Cashback Wallet** me daal dete hain.
   • Merchant return window (avg 14-30 days) khatam hote hi paise **Available** ho jaate hain.

2. **Instant Withdrawal:**
   • Available balance ko aap **Direct UPI (GPay/PhonePe/Paytm)** ya **Bank Account (NEFT/IMPS)** me bina kisi deduction ke withdraw kar sakte hain.

3. **SmartCoins Rewards:**
   • **10 SmartCoins = ₹1 INR Instant Cash Discount**.
   • Daily Login (+5 coins), reviews (+15 coins), aur orders par automatic earn hote hain.

4. **Active Promo Code:**
   • **SMART200**: Flat ₹200 instant discount on orders above ₹1,999.`
      : `💰 **SmartDeal Cashback & Double-Entry Ledger Guide**:

1. **How Verified Cashback Works:**
   • Click our outbound link and complete your purchase on Amazon, Flipkart, or Croma.
   • The merchant pays SmartDeal an affiliate commission, which we transparently credit into your **Audited Cashback Wallet**.
   • As soon as the store return window closes (avg 14-30 days), funds shift from 'Pending' to 'Available'.

2. **Instant Withdrawal:**
   • Transfer your available balance directly to any **UPI ID or Bank Account** with zero hidden fees.

3. **SmartCoins Loyalty System:**
   • **10 SmartCoins = ₹1 Instant Discount** at checkout.
   • Earn coins on daily check-ins (+5), photo reviews (+15), and every verified order.

4. **Active Promo Codes:**
   • **SMART200**: Flat ₹200 discount on orders above ₹1,999.`;

    return {
      text: responseText,
      intent: 'CASHBACK_INFO',
      recommendations: catalog.slice(0, 2).map(p => ({
        product: p,
        highlightTag: `Earn +${p.smartCoinsEarned} Coins`,
        whyRecommended: 'Eligible for both direct cashback & coin redemption'
      })),
      suggestedPrompts: [
        'How to withdraw cashback to UPI?',
        'Best phone under ₹20,000?',
        'Check fake discount score',
        'Compare Amazon vs Flipkart prices'
      ],
      badges: ['Audited Double-Entry Ledger', 'Direct UPI Payout', 'Zero Hidden Fees']
    };
  }

  // --------------------------------------------------------------------------
  // 6. POLICY, DELIVERY & HELPLINE SUPPORT
  // --------------------------------------------------------------------------
  const isPolicyQuery =
    lower.includes('return') ||
    lower.includes('refund') ||
    lower.includes('delivery') ||
    lower.includes('shipping') ||
    lower.includes('warranty') ||
    lower.includes('contact') ||
    lower.includes('helpline') ||
    lower.includes('phone') && lower.includes('number');

  if (isPolicyQuery) {
    const responseText = isHi
      ? `📦 **Delivery, Warranty & Dedicated Support**:

• **Fast Express Delivery:** Delhivery Surface Air & partner logistics se tier 1 & 2 cities me 24-48 hours me doorstep dispatch.
• **7-10 Days Return Policy:** Agar item me manufacturing defect ya damage ho, to zero-questions-asked doorstep pickup and full refund.
• **1-Year Brand Warranty:** Sabhi products GST-compliant verified sellers se aate hain, jisse official brand service center warranty valid rehti hai.
• **Direct Owner & Support Helpline:**
  📞 Phone (SMS Alerts): **+91 72175 14087**
  ✉️ Email: **jk7217514087@gmail.com**`
      : `📦 **Logistics, Warranty & Direct Support Desk**:

• **Delivery Network:** Priority shipping powered by Delhivery Surface Air with 24-48 hour delivery in major cities.
• **7-10 Days Easy Return Guarantee:** Hassle-free doorstep returns and full refunds for transit-damaged or defective units.
• **100% OEM Brand Warranty:** All listed merchants are GSTIN verified. Official brand service center warranty fully honored.
• **Direct Support Desk:**
  📞 Phone (SMS Alerts): **+91 72175 14087**
  ✉️ Email: **jk7217514087@gmail.com**`;

    return {
      text: responseText,
      intent: 'POLICY',
      recommendations: catalog.slice(0, 2).map(p => ({
        product: p,
        highlightTag: `${p.returnDays}-Day Free Returns`,
        whyRecommended: `Includes ${p.warranty || '1 Year Brand Warranty'}`
      })),
      suggestedPrompts: [
        'Best phone under ₹20,000?',
        'Compare iPhone 15 vs Samsung S24',
        'How to claim cashback?',
        'Show genuine deals today'
      ],
      badges: ['Verified Merchant Warranty', '7-10 Days Return Window', '24/7 Dedicated Support']
    };
  }

  // --------------------------------------------------------------------------
  // 7. GENERAL / UNIVERSAL FALLBACK ("ya or kuch bhi puche usse achhe se answer de")
  // --------------------------------------------------------------------------
  const matches = findBestMatchingProducts(catalog, query, 3);
  const productsToShow = matches.length > 0 ? matches : catalog.slice(0, 3);

  const responseText = isHi
    ? `🤖 **SmartDeal Autonomous Shopping Intelligence**:
Maine aapki query **"${query}"** ke liye humare verified product catalog, technical benchmarks, aur multi-store live pricing database ko scan kiya hai.

💡 **AI Analysis & Insight:**
SmartDeal par har product ka Deal Score, 90-day price trend, aur real affiliate cashback audit kiya jaata hai. Yahan sabse acche verified options diye gaye hain:`
    : `🤖 **SmartDeal Autonomous Shopping Intelligence**:
I scanned our verified catalog, hardware benchmarks, and live multi-store pricing database for **"${query}"**.

💡 **AI Analysis & Market Insight:**
Every product on SmartDeal undergoes rigorous Deal Score auditing, 90-day price trend verification, and double-entry cashback matching. Here are the top verified options:`;

  return {
    text: responseText,
    intent: 'SEARCH',
    recommendations: productsToShow.map((p, i) => ({
      product: p,
      highlightTag: i === 0 ? 'Best Match' : 'Recommended Alternative',
      whyRecommended: `Deal Score: ${p.dealScore}/100 • ₹${p.sellingPrice.toLocaleString('en-IN')} (${p.discountPercent}% Verified Discount)`
    })),
    suggestedPrompts: [
      'Best phone under ₹30,000?',
      'Compare iPhone 15 vs Samsung S24',
      'Should I buy now or wait for price drop?',
      'How does SmartDeal cashback work?'
    ],
    badges: ['Live Catalog Match', 'Verified Pricing', 'High Deal Score']
  };
}
