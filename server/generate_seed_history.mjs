// Script to seed server/price_history.json with realistic historical price points
import fs from 'fs';
import path from 'path';

const PRICE_HISTORY_FILE = path.resolve('server', 'price_history.json');

const productsConfig = [
  {
    id: 'prod-hp-pavilion-15',
    name: 'HP Pavilion 15 (Intel Core i5 12th Gen, 16GB/512GB SSD)',
    mrp: 69990,
    marketplaces: {
      flipkart: { basePrice: 56990, minPrice: 52990, maxPrice: 61990, currentPrice: 54990 },
      amazon: { basePrice: 57490, minPrice: 53490, maxPrice: 62490, currentPrice: 56499 },
      croma: { basePrice: 58990, minPrice: 55990, maxPrice: 63990, currentPrice: 57990 },
      reliancedigital: { basePrice: 59490, minPrice: 56490, maxPrice: 64490, currentPrice: 58490 },
      tatacliq: { basePrice: 59990, minPrice: 56990, maxPrice: 64990, currentPrice: 58990 }
    }
  },
  {
    id: 'prod-samsung-m14',
    name: 'Samsung Galaxy M14 5G (Smoky Teal, 6GB RAM, 128GB Storage)',
    mrp: 17999,
    marketplaces: {
      amazon: { basePrice: 13490, minPrice: 11999, maxPrice: 15490, currentPrice: 12490 },
      flipkart: { basePrice: 13999, minPrice: 12499, maxPrice: 15999, currentPrice: 12999 },
      croma: { basePrice: 14490, minPrice: 12990, maxPrice: 16490, currentPrice: 13490 }
    }
  },
  {
    id: 'prod-apple-iphone15',
    name: 'Apple iPhone 15 (Black, 128 GB)',
    mrp: 79900,
    marketplaces: {
      amazon: { basePrice: 72900, minPrice: 66999, maxPrice: 79900, currentPrice: 69900 },
      flipkart: { basePrice: 73499, minPrice: 67499, maxPrice: 79900, currentPrice: 70499 },
      reliancedigital: { basePrice: 74200, minPrice: 68900, maxPrice: 79900, currentPrice: 71200 }
    }
  },
  {
    id: 'prod-asus-vivobook',
    name: 'ASUS Vivobook 15 (Intel Core i5 12th Gen, 16GB/512GB SSD)',
    mrp: 68990,
    marketplaces: {
      amazon: { basePrice: 51990, minPrice: 47990, maxPrice: 55990, currentPrice: 48990 },
      flipkart: { basePrice: 52490, minPrice: 48490, maxPrice: 56490, currentPrice: 49490 }
    }
  },
  {
    id: 'prod-noise-endeavour-pro',
    name: 'Noise Endeavour Pro Rugged Smart Watch (1.46" AMOLED)',
    mrp: 19999,
    marketplaces: {
      amazon: { basePrice: 12999, minPrice: 8999, maxPrice: 15999, currentPrice: 9999 },
      flipkart: { basePrice: 13499, minPrice: 9499, maxPrice: 16499, currentPrice: 10499 }
    }
  },
  {
    id: 'prod-sony-wh1000xm5',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    mrp: 34990,
    marketplaces: {
      amazon: { basePrice: 28990, minPrice: 24990, maxPrice: 32990, currentPrice: 26990 },
      flipkart: { basePrice: 29490, minPrice: 25490, maxPrice: 33490, currentPrice: 27490 },
      croma: { basePrice: 29990, minPrice: 26990, maxPrice: 34990, currentPrice: 28990 }
    }
  },
  {
    id: 'prod-macbook-air-m2',
    name: 'Apple MacBook Air M2 (8GB RAM, 256GB SSD, 13.6-inch)',
    mrp: 99900,
    marketplaces: {
      amazon: { basePrice: 86900, minPrice: 79990, maxPrice: 94900, currentPrice: 82990 },
      flipkart: { basePrice: 87490, minPrice: 80990, maxPrice: 95490, currentPrice: 83990 },
      reliancedigital: { basePrice: 88900, minPrice: 82490, maxPrice: 96900, currentPrice: 84990 }
    }
  }
];

const saleEvents = [
  { daysAgo: 330, name: 'Republic Day Super Sale' },
  { daysAgo: 260, name: 'Holi Colors Deal Fest' },
  { daysAgo: 200, name: 'Summer Electronics Blowout' },
  { daysAgo: 140, name: 'Monsoon Prime Week' },
  { daysAgo: 95, name: 'Independence Day Mega Festival' },
  { daysAgo: 40, name: 'Big Diwali Billion Dhamaka' },
  { daysAgo: 18, name: 'Black Friday Flash Deal' },
  { daysAgo: 3, name: 'Weekend Price Drop' }
];

const allRecords = [];
const now = Date.now();
const ONE_DAY = 86400000;

for (const prod of productsConfig) {
  for (const [storeId, cfg] of Object.entries(prod.marketplaces)) {
    // Generate ~40 timeline points over the last 365 days
    const totalPoints = 42;
    const step = 365 / totalPoints;

    for (let i = totalPoints - 1; i >= 0; i--) {
      const daysAgo = Math.round(i * step);
      const recordDate = new Date(now - daysAgo * ONE_DAY);
      const isToday = i === 0;

      let offerPrice = cfg.basePrice;
      let event = undefined;

      // Check if near a sale event
      const matchingEvent = saleEvents.find(e => Math.abs(e.daysAgo - daysAgo) <= 2);
      if (matchingEvent) {
        offerPrice = cfg.minPrice + Math.round((Math.random() * 0.15) * (cfg.maxPrice - cfg.minPrice));
        event = matchingEvent.name;
      } else {
        // Natural market fluctuations
        const wave = Math.sin((daysAgo / 30) * Math.PI) * 0.4;
        const noise = (Math.sin(daysAgo * 1.7) * 0.3);
        const factor = 0.5 + wave * 0.25 + noise * 0.15;
        offerPrice = Math.round(cfg.minPrice + factor * (cfg.maxPrice - cfg.minPrice));
      }

      // Ensure rounded to friendly hundreds or 99s
      offerPrice = Math.round(offerPrice / 50) * 50 - 10;
      if (isToday) {
        offerPrice = cfg.currentPrice;
      }

      // Ensure bounded
      offerPrice = Math.max(cfg.minPrice, Math.min(cfg.maxPrice, offerPrice));
      const regularPrice = Math.max(offerPrice + 2000, prod.mrp);

      const status = isToday
        ? 'IN_STOCK'
        : (offerPrice <= cfg.minPrice * 1.05 ? 'PRICE_DROP' : (Math.random() < 0.05 ? 'OUT_OF_STOCK' : 'IN_STOCK'));

      allRecords.push({
        id: `HPR-${prod.id.slice(5, 12).toUpperCase()}-${storeId.slice(0, 3).toUpperCase()}-${daysAgo}`,
        product_id: prod.id,
        marketplace_id: storeId,
        price: regularPrice,
        offer_price: offerPrice,
        recorded_at: recordDate.toISOString(),
        currency: 'INR',
        availability_status: status,
        ...(event ? { event } : {})
      });
    }
  }
}

// Sort all records chronologically
allRecords.sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());

fs.writeFileSync(PRICE_HISTORY_FILE, JSON.stringify(allRecords, null, 2), 'utf8');
console.log(`Successfully generated ${allRecords.length} historical price records in ${PRICE_HISTORY_FILE}`);
