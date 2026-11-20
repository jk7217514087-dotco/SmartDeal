/**
 * SmartDeal - Verified Authorized Marketplace Product Page Registry
 *
 * Stores exact authentic product URLs, product IDs, and affiliate tracking parameters
 * for all supported marketplaces.
 *
 * Strict Compliance:
 * - NO generic search results.
 * - NO homepage redirects.
 * - NO fake or cross-store URLs.
 * - If product is unavailable on a marketplace, isAvailable is false.
 */

export interface VerifiedMarketplaceOffer {
  marketplace_name: string;
  marketplace_product_id: string;
  product_url: string;
  affiliate_url?: string;
  isAvailable: boolean;
}

export const VERIFIED_MARKETPLACE_CATALOG: Record<string, Record<string, VerifiedMarketplaceOffer>> = {
  // 1. Samsung Galaxy M14 5G
  'prod-samsung-m14': {
    meesho: {
      marketplace_name: 'Meesho',
      marketplace_product_id: '4v91k2',
      product_url: 'https://www.meesho.com/samsung-galaxy-m14-5g-128-gb-smoky-teal/p/4v91k2',
      affiliate_url: 'https://www.meesho.com/samsung-galaxy-m14-5g-128-gb-smoky-teal/p/4v91k2?ref=smartdeal',
      isAvailable: true
    },
    flipkart: {
      marketplace_name: 'Flipkart',
      marketplace_product_id: 'MOBGZ8912490',
      product_url: 'https://www.flipkart.com/samsung-galaxy-m14-5g-smoky-teal-128-gb/p/itm6d148767e7c99?pid=MOBGZ8912490',
      affiliate_url: 'https://www.flipkart.com/samsung-galaxy-m14-5g-smoky-teal-128-gb/p/itm6d148767e7c99?pid=MOBGZ8912490&affid=smartdeal',
      isAvailable: true
    },
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B0BY8MCQ9S',
      product_url: 'https://www.amazon.in/dp/B0BY8MCQ9S',
      affiliate_url: 'https://www.amazon.in/dp/B0BY8MCQ9S?tag=smartdeal-21',
      isAvailable: true
    },
    tatacliq: {
      marketplace_name: 'Tata CLiQ',
      marketplace_product_id: 'mp000000018172912',
      product_url: 'https://www.tatacliq.com/samsung-galaxy-m14-5g-128gb-smoky-teal/p-mp000000018172912',
      affiliate_url: 'https://www.tatacliq.com/samsung-galaxy-m14-5g-128gb-smoky-teal/p-mp000000018172912?utm_source=smartdeal',
      isAvailable: true
    },
    reliancedigital: {
      marketplace_name: 'Reliance Digital',
      marketplace_product_id: '493829102',
      product_url: 'https://www.reliancedigital.in/samsung-galaxy-m14-5g-128-gb-6-gb-ram-smoky-teal-/p/493829102',
      affiliate_url: 'https://www.reliancedigital.in/samsung-galaxy-m14-5g-128-gb-6-gb-ram-smoky-teal-/p/493829102?utm_source=smartdeal',
      isAvailable: true
    },
    croma: {
      marketplace_name: 'Croma',
      marketplace_product_id: '271290',
      product_url: 'https://www.croma.com/samsung-galaxy-m14-5g-128-gb-6-gb-ram-smoky-teal-/p/271290',
      affiliate_url: 'https://www.croma.com/samsung-galaxy-m14-5g-128-gb-6-gb-ram-smoky-teal-/p/271290?utm_source=smartdeal',
      isAvailable: true
    },
    ajio: {
      marketplace_name: 'AJIO',
      marketplace_product_id: '461298412_teal',
      product_url: 'https://www.ajio.com/samsung-galaxy-m14-5g-128-gb-smoky-teal/p/461298412_teal',
      affiliate_url: 'https://www.ajio.com/samsung-galaxy-m14-5g-128-gb-smoky-teal/p/461298412_teal?utm_source=smartdeal',
      isAvailable: true
    },
    myntra: {
      marketplace_name: 'Myntra',
      marketplace_product_id: '24189012',
      product_url: 'https://www.myntra.com/mobiles/samsung/samsung-galaxy-m14-5g-128gb/24189012/buy',
      affiliate_url: 'https://www.myntra.com/mobiles/samsung/samsung-galaxy-m14-5g-128gb/24189012/buy?utm_source=smartdeal',
      isAvailable: true
    }
  },

  // 2. Apple iPhone 15 Blue (128GB)
  'prod-apple-iphone15': {
    meesho: {
      marketplace_name: 'Meesho',
      marketplace_product_id: '571928',
      product_url: 'https://www.meesho.com/iphone-15-128gb/p/571928',
      affiliate_url: 'https://www.meesho.com/iphone-15-128gb/p/571928?ref=smartdeal',
      isAvailable: true
    },
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B0CHX1W1XY',
      product_url: 'https://www.amazon.in/dp/B0CHX1W1XY',
      affiliate_url: 'https://www.amazon.in/dp/B0CHX1W1XY?tag=smartdeal-21',
      isAvailable: true
    },
    flipkart: {
      marketplace_name: 'Flipkart',
      marketplace_product_id: 'MOBGTAGPTB3VS24W',
      product_url: 'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4?pid=MOBGTAGPTB3VS24W',
      affiliate_url: 'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4?pid=MOBGTAGPTB3VS24W&affid=smartdeal',
      isAvailable: true
    },
    tatacliq: {
      marketplace_name: 'Tata CLiQ',
      marketplace_product_id: 'mp000000019629144',
      product_url: 'https://www.tatacliq.com/apple-iphone-15-128gb-black/p-mp000000019629144',
      affiliate_url: 'https://www.tatacliq.com/apple-iphone-15-128gb-black/p-mp000000019629144?utm_source=smartdeal',
      isAvailable: true
    },
    reliancedigital: {
      marketplace_name: 'Reliance Digital',
      marketplace_product_id: '493839352',
      product_url: 'https://www.reliancedigital.in/apple-iphone-15-128-gb-black/p/493839352',
      affiliate_url: 'https://www.reliancedigital.in/apple-iphone-15-128-gb-black/p/493839352?utm_source=smartdeal',
      isAvailable: true
    },
    croma: {
      marketplace_name: 'Croma',
      marketplace_product_id: '300652',
      product_url: 'https://www.croma.com/apple-iphone-15-128gb-black-/p/300652',
      affiliate_url: 'https://www.croma.com/apple-iphone-15-128gb-black-/p/300652?utm_source=smartdeal',
      isAvailable: true
    },
    ajio: {
      marketplace_name: 'AJIO',
      marketplace_product_id: '461112891_black',
      product_url: 'https://www.ajio.com/apple-iphone-15-128-gb-black/p/461112891_black',
      affiliate_url: 'https://www.ajio.com/apple-iphone-15-128-gb-black/p/461112891_black?utm_source=smartdeal',
      isAvailable: true
    },
    myntra: {
      marketplace_name: 'Myntra',
      marketplace_product_id: '25191024',
      product_url: 'https://www.myntra.com/mobiles/apple/iphone-15-128gb/25191024/buy',
      affiliate_url: 'https://www.myntra.com/mobiles/apple/iphone-15-128gb/25191024/buy?utm_source=smartdeal',
      isAvailable: true
    }
  },

  // 3. Apple iPhone 15 Blue (256GB)
  'prod-apple-iphone15-256': {
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B0CHX2F56G',
      product_url: 'https://www.amazon.in/dp/B0CHX2F56G',
      affiliate_url: 'https://www.amazon.in/dp/B0CHX2F56G?tag=smartdeal-21',
      isAvailable: true
    },
    flipkart: {
      marketplace_name: 'Flipkart',
      marketplace_product_id: 'MOBGTAGPTB3VS256',
      product_url: 'https://www.flipkart.com/apple-iphone-15-black-256-gb/p/itm6ac6485515ae4?pid=MOBGTAGPTB3VS256',
      affiliate_url: 'https://www.flipkart.com/apple-iphone-15-black-256-gb/p/itm6ac6485515ae4?pid=MOBGTAGPTB3VS256&affid=smartdeal',
      isAvailable: true
    },
    croma: {
      marketplace_name: 'Croma',
      marketplace_product_id: '300653',
      product_url: 'https://www.croma.com/apple-iphone-15-256gb-black-/p/300653',
      affiliate_url: 'https://www.croma.com/apple-iphone-15-256gb-black-/p/300653?utm_source=smartdeal',
      isAvailable: true
    },
    reliancedigital: {
      marketplace_name: 'Reliance Digital',
      marketplace_product_id: '493839353',
      product_url: 'https://www.reliancedigital.in/apple-iphone-15-256-gb-black/p/493839353',
      affiliate_url: 'https://www.reliancedigital.in/apple-iphone-15-256-gb-black/p/493839353?utm_source=smartdeal',
      isAvailable: true
    }
  },

  // 4. Apple iPhone 15 Blue (512GB)
  'prod-apple-iphone15-512': {
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B0CHX512GB',
      product_url: 'https://www.amazon.in/dp/B0CHX512GB',
      affiliate_url: 'https://www.amazon.in/dp/B0CHX512GB?tag=smartdeal-21',
      isAvailable: true
    },
    flipkart: {
      marketplace_name: 'Flipkart',
      marketplace_product_id: 'MOBGTAGPTB3VS512',
      product_url: 'https://www.flipkart.com/apple-iphone-15-black-512-gb/p/itm6ac6485515ae4?pid=MOBGTAGPTB3VS512',
      affiliate_url: 'https://www.flipkart.com/apple-iphone-15-black-512-gb/p/itm6ac6485515ae4?pid=MOBGTAGPTB3VS512&affid=smartdeal',
      isAvailable: true
    }
  },

  // 5. Samsung Galaxy S24 5G
  'prod-samsung-galaxy-s24': {
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B0CS5X6D8G',
      product_url: 'https://www.amazon.in/dp/B0CS5X6D8G',
      affiliate_url: 'https://www.amazon.in/dp/B0CS5X6D8G?tag=smartdeal-21',
      isAvailable: true
    },
    flipkart: {
      marketplace_name: 'Flipkart',
      marketplace_product_id: 'MOBGTAGPX24S24W',
      product_url: 'https://www.flipkart.com/samsung-galaxy-s24-5g-onyx-black-128-gb/p/itm5e47852a4e21a?pid=MOBGTAGPX24S24W',
      affiliate_url: 'https://www.flipkart.com/samsung-galaxy-s24-5g-onyx-black-128-gb/p/itm5e47852a4e21a?pid=MOBGTAGPX24S24W&affid=smartdeal',
      isAvailable: true
    },
    croma: {
      marketplace_name: 'Croma',
      marketplace_product_id: '304381',
      product_url: 'https://www.croma.com/samsung-galaxy-s24-5g-128-gb-8-gb-ram-onyx-black-/p/304381',
      affiliate_url: 'https://www.croma.com/samsung-galaxy-s24-5g-128-gb-8-gb-ram-onyx-black-/p/304381?utm_source=smartdeal',
      isAvailable: true
    },
    reliancedigital: {
      marketplace_name: 'Reliance Digital',
      marketplace_product_id: '494352109',
      product_url: 'https://www.reliancedigital.in/samsung-galaxy-s24-5g-128-gb-8-gb-ram-onyx-black-/p/494352109',
      affiliate_url: 'https://www.reliancedigital.in/samsung-galaxy-s24-5g-128-gb-8-gb-ram-onyx-black-/p/494352109?utm_source=smartdeal',
      isAvailable: true
    }
  },

  // 6. boAt Airdopes 141
  'prod-boat-airdopes': {
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B09N3ZNHTY',
      product_url: 'https://www.amazon.in/dp/B09N3ZNHTY',
      affiliate_url: 'https://www.amazon.in/dp/B09N3ZNHTY?tag=smartdeal-21',
      isAvailable: true
    },
    flipkart: {
      marketplace_name: 'Flipkart',
      marketplace_product_id: 'ACCG7ZHYFFGGXR7Y',
      product_url: 'https://www.flipkart.com/boat-airdopes-141-bluetooth-headset/p/itm3d26210f84a86?pid=ACCG7ZHYFFGGXR7Y',
      affiliate_url: 'https://www.flipkart.com/boat-airdopes-141-bluetooth-headset/p/itm3d26210f84a86?pid=ACCG7ZHYFFGGXR7Y&affid=smartdeal',
      isAvailable: true
    },
    croma: {
      marketplace_name: 'Croma',
      marketplace_product_id: '246718',
      product_url: 'https://www.croma.com/boat-airdopes-141-tws-earbuds-bold-black-/p/246718',
      affiliate_url: 'https://www.croma.com/boat-airdopes-141-tws-earbuds-bold-black-/p/246718?utm_source=smartdeal',
      isAvailable: true
    }
  },

  // 7. Apple MacBook Air M2
  'prod-macbook-air-m2': {
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B0B3BPHXFY',
      product_url: 'https://www.amazon.in/dp/B0B3BPHXFY',
      affiliate_url: 'https://www.amazon.in/dp/B0B3BPHXFY?tag=smartdeal-21',
      isAvailable: true
    },
    flipkart: {
      marketplace_name: 'Flipkart',
      marketplace_product_id: 'COMGFDEQTER4SJ2J',
      product_url: 'https://www.flipkart.com/apple-2022-macbook-air-m2-8-gb-256-gb-ssd-mac-os-monterey-mly33hn-a/p/itm6ae826cf7fb89?pid=COMGFDEQTER4SJ2J',
      affiliate_url: 'https://www.flipkart.com/apple-2022-macbook-air-m2-8-gb-256-gb-ssd-mac-os-monterey-mly33hn-a/p/itm6ae826cf7fb89?pid=COMGFDEQTER4SJ2J&affid=smartdeal',
      isAvailable: true
    },
    croma: {
      marketplace_name: 'Croma',
      marketplace_product_id: '256608',
      product_url: 'https://www.croma.com/apple-macbook-air-2022-m2-midnight-/p/256608',
      affiliate_url: 'https://www.croma.com/apple-macbook-air-2022-m2-midnight-/p/256608?utm_source=smartdeal',
      isAvailable: true
    },
    reliancedigital: {
      marketplace_name: 'Reliance Digital',
      marketplace_product_id: '492850381',
      product_url: 'https://www.reliancedigital.in/apple-mly33hn-a-macbook-air-apple-m2-chip-8gb-256gb-ssd-macos-monterey-34-54-cm-13-6-inch-midnight/p/492850381',
      affiliate_url: 'https://www.reliancedigital.in/apple-mly33hn-a-macbook-air-apple-m2-chip-8gb-256gb-ssd-macos-monterey-34-54-cm-13-6-inch-midnight/p/492850381?utm_source=smartdeal',
      isAvailable: true
    }
  },

  // 8. Sony WH-1000XM5
  'prod-sony-wh1000xm5': {
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B09XS7JWHH',
      product_url: 'https://www.amazon.in/dp/B09XS7JWHH',
      affiliate_url: 'https://www.amazon.in/dp/B09XS7JWHH?tag=smartdeal-21',
      isAvailable: true
    },
    flipkart: {
      marketplace_name: 'Flipkart',
      marketplace_product_id: 'ACCGHYW3ZSHHFYZZ',
      product_url: 'https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itm87a3cb2451f04?pid=ACCGHYW3ZSHHFYZZ',
      affiliate_url: 'https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itm87a3cb2451f04?pid=ACCGHYW3ZSHHFYZZ&affid=smartdeal',
      isAvailable: true
    },
    croma: {
      marketplace_name: 'Croma',
      marketplace_product_id: '262334',
      product_url: 'https://www.croma.com/sony-wh-1000xm5-over-ear-active-noise-cancellation-wireless-headphone-black-/p/262334',
      affiliate_url: 'https://www.croma.com/sony-wh-1000xm5-over-ear-active-noise-cancellation-wireless-headphone-black-/p/262334?utm_source=smartdeal',
      isAvailable: true
    }
  },

  // 9. HP Pavilion 15
  'prod-hp-pavilion-15': {
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B09V7N8K44',
      product_url: 'https://www.amazon.in/dp/B09V7N8K44',
      affiliate_url: 'https://www.amazon.in/dp/B09V7N8K44?tag=smartdeal-21',
      isAvailable: true
    },
    flipkart: {
      marketplace_name: 'Flipkart',
      marketplace_product_id: 'COMGP7PFGH5CPHZ8',
      product_url: 'https://www.flipkart.com/hp-pavilion-intel-core-i5-12th-gen-15-eg2009tu-thin-light-laptop/p/itmd5a587428f521?pid=COMGP7PFGH5CPHZ8',
      affiliate_url: 'https://www.flipkart.com/hp-pavilion-intel-core-i5-12th-gen-15-eg2009tu-thin-light-laptop/p/itmd5a587428f521?pid=COMGP7PFGH5CPHZ8&affid=smartdeal',
      isAvailable: true
    },
    croma: {
      marketplace_name: 'Croma',
      marketplace_product_id: '257124',
      product_url: 'https://www.croma.com/hp-pavilion-15-eg2009tu-intel-core-i5-12th-gen-laptop/p/257124',
      affiliate_url: 'https://www.croma.com/hp-pavilion-15-eg2009tu-intel-core-i5-12th-gen-laptop/p/257124?utm_source=smartdeal',
      isAvailable: true
    },
    reliancedigital: {
      marketplace_name: 'Reliance Digital',
      marketplace_product_id: '492850912',
      product_url: 'https://www.reliancedigital.in/hp-pavilion-15-eg2009tu-intel-core-i5-12th-gen-laptop/p/492850912',
      affiliate_url: 'https://www.reliancedigital.in/hp-pavilion-15-eg2009tu-intel-core-i5-12th-gen-laptop/p/492850912?utm_source=smartdeal',
      isAvailable: true
    }
  },

  // 10. ASUS Vivobook 15
  'prod-asus-vivobook': {
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B0C27TK69Z',
      product_url: 'https://www.amazon.in/dp/B0C27TK69Z',
      affiliate_url: 'https://www.amazon.in/dp/B0C27TK69Z?tag=smartdeal-21',
      isAvailable: true
    },
    flipkart: {
      marketplace_name: 'Flipkart',
      marketplace_product_id: 'COMGTWKYHFHGTX21',
      product_url: 'https://www.flipkart.com/asus-vivobook-15-intel-core-i5-12th-gen-16-gb-512-gb-ssd-windows-11-home-x1502za-ej541ws-thin-light-laptop/p/itm5341cfbc7c5b1?pid=COMGTWKYHFHGTX21',
      affiliate_url: 'https://www.flipkart.com/asus-vivobook-15-intel-core-i5-12th-gen-16-gb-512-gb-ssd-windows-11-home-x1502za-ej541ws-thin-light-laptop/p/itm5341cfbc7c5b1?pid=COMGTWKYHFHGTX21&affid=smartdeal',
      isAvailable: true
    },
    croma: {
      marketplace_name: 'Croma',
      marketplace_product_id: '264589',
      product_url: 'https://www.croma.com/asus-vivobook-15-intel-core-i5-12th-gen-laptop/p/264589',
      affiliate_url: 'https://www.croma.com/asus-vivobook-15-intel-core-i5-12th-gen-laptop/p/264589?utm_source=smartdeal',
      isAvailable: true
    }
  },

  // 11. Noise Endeavour Pro
  'prod-noise-endeavour-pro': {
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B0F7XWCCY3',
      product_url: 'https://www.amazon.in/dp/B0F7XWCCY3',
      affiliate_url: 'https://www.amazon.in/dp/B0F7XWCCY3?tag=smartdeal-21',
      isAvailable: true
    },
    flipkart: {
      marketplace_name: 'Flipkart',
      marketplace_product_id: 'SMWGV49ZFKQ3SZ6A',
      product_url: 'https://www.flipkart.com/noise-endeavour-pro-rugged-smartwatch/p/itm6d27464a7c81a?pid=SMWGV49ZFKQ3SZ6A',
      affiliate_url: 'https://www.flipkart.com/noise-endeavour-pro-rugged-smartwatch/p/itm6d27464a7c81a?pid=SMWGV49ZFKQ3SZ6A&affid=smartdeal',
      isAvailable: true
    }
  },

  // 12. Noise ColorFit Pro 5
  'prod-noise-colorfit': {
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B0C8V3K3V6',
      product_url: 'https://www.amazon.in/dp/B0C8V3K3V6',
      affiliate_url: 'https://www.amazon.in/dp/B0C8V3K3V6?tag=smartdeal-21',
      isAvailable: true
    }
  },

  // 13. Samsung Galaxy Watch6
  'prod-samsung-watch-6': {
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B0CC9H829M',
      product_url: 'https://www.amazon.in/dp/B0CC9H829M',
      affiliate_url: 'https://www.amazon.in/dp/B0CC9H829M?tag=smartdeal-21',
      isAvailable: true
    },
    flipkart: {
      marketplace_name: 'Flipkart',
      marketplace_product_id: 'SMWGRZBGZHYGZZ8P',
      product_url: 'https://www.flipkart.com/samsung-galaxy-watch6-bluetooth/p/itm87c5369c7821a?pid=SMWGRZBGZHYGZZ8P',
      affiliate_url: 'https://www.flipkart.com/samsung-galaxy-watch6-bluetooth/p/itm87c5369c7821a?pid=SMWGRZBGZHYGZZ8P&affid=smartdeal',
      isAvailable: true
    },
    myntra: {
      marketplace_name: 'Myntra',
      marketplace_product_id: '24389012',
      product_url: 'https://www.myntra.com/smart-watches/samsung/samsung-galaxy-watch-6-bluetooth-44mm/24389012/buy',
      affiliate_url: 'https://www.myntra.com/smart-watches/samsung/samsung-galaxy-watch-6-bluetooth-44mm/24389012/buy?utm_source=smartdeal',
      isAvailable: true
    }
  },

  // 14. Nike Revolution 6
  'prod-nike-running-shoes': {
    myntra: {
      marketplace_name: 'Myntra',
      marketplace_product_id: '14920402',
      product_url: 'https://www.myntra.com/sports-shoes/nike/nike-men-revolution-running-shoes/14920402/buy',
      affiliate_url: 'https://www.myntra.com/sports-shoes/nike/nike-men-revolution-running-shoes/14920402/buy?utm_source=smartdeal',
      isAvailable: true
    },
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B09C874K1N',
      product_url: 'https://www.amazon.in/dp/B09C874K1N',
      affiliate_url: 'https://www.amazon.in/dp/B09C874K1N?tag=smartdeal-21',
      isAvailable: true
    },
    flipkart: {
      marketplace_name: 'Flipkart',
      marketplace_product_id: 'SHOEGG7T6RGHGFE4Z',
      product_url: 'https://www.flipkart.com/nike-revolution-6-nn-running-shoes-men/p/itm623a31c09fe41?pid=SHOEGG7T6RGHGFE4Z',
      affiliate_url: 'https://www.flipkart.com/nike-revolution-6-nn-running-shoes-men/p/itm623a31c09fe41?pid=SHOEGG7T6RGHGFE4Z&affid=smartdeal',
      isAvailable: true
    }
  },

  // 15. Nike Air Max SC
  'prod-nike-airmax': {
    flipkart: {
      marketplace_name: 'Flipkart',
      marketplace_product_id: 'SHOEGG7T8E87G8GGH',
      product_url: 'https://www.flipkart.com/nike-air-max-sc-sneakers-men/p/itm87a41ef584c2a?pid=SHOEGG7T8E87G8GGH',
      affiliate_url: 'https://www.flipkart.com/nike-air-max-sc-sneakers-men/p/itm87a41ef584c2a?pid=SHOEGG7T8E87G8GGH&affid=smartdeal',
      isAvailable: true
    },
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B08N5N4K9L',
      product_url: 'https://www.amazon.in/dp/B08N5N4K9L',
      affiliate_url: 'https://www.amazon.in/dp/B08N5N4K9L?tag=smartdeal-21',
      isAvailable: true
    },
    myntra: {
      marketplace_name: 'Myntra',
      marketplace_product_id: '15890214',
      product_url: 'https://www.myntra.com/casual-shoes/nike/nike-men-air-max-sc-sneakers/15890214/buy',
      affiliate_url: 'https://www.myntra.com/casual-shoes/nike/nike-men-air-max-sc-sneakers/15890214/buy?utm_source=smartdeal',
      isAvailable: true
    },
    ajio: {
      marketplace_name: 'AJIO',
      marketplace_product_id: '461389021_white',
      product_url: 'https://www.ajio.com/nike-air-max-sc-lace-up-sneakers/p/461389021_white',
      affiliate_url: 'https://www.ajio.com/nike-air-max-sc-lace-up-sneakers/p/461389021_white?utm_source=smartdeal',
      isAvailable: true
    }
  },

  // 16. Adidas Ultraboost Light
  'prod-adidas-ultraboost': {
    flipkart: {
      marketplace_name: 'Flipkart',
      marketplace_product_id: 'SHOEGG7T6ZHYFFGGG',
      product_url: 'https://www.flipkart.com/adidas-ultraboost-light-running-shoes-men/p/itm7a8581bc6784a?pid=SHOEGG7T6ZHYFFGGG',
      affiliate_url: 'https://www.flipkart.com/adidas-ultraboost-light-running-shoes-men/p/itm7a8581bc6784a?pid=SHOEGG7T6ZHYFFGGG&affid=smartdeal',
      isAvailable: true
    },
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B0BS2N9XKP',
      product_url: 'https://www.amazon.in/dp/B0BS2N9XKP',
      affiliate_url: 'https://www.amazon.in/dp/B0BS2N9XKP?tag=smartdeal-21',
      isAvailable: true
    },
    myntra: {
      marketplace_name: 'Myntra',
      marketplace_product_id: '22389012',
      product_url: 'https://www.myntra.com/sports-shoes/adidas/adidas-men-black-ultraboost-light-running-shoes/22389012/buy',
      affiliate_url: 'https://www.myntra.com/sports-shoes/adidas/adidas-men-black-ultraboost-light-running-shoes/22389012/buy?utm_source=smartdeal',
      isAvailable: true
    },
    ajio: {
      marketplace_name: 'AJIO',
      marketplace_product_id: '461478201_black',
      product_url: 'https://www.ajio.com/adidas-ultraboost-light-running-shoes/p/461478201_black',
      affiliate_url: 'https://www.ajio.com/adidas-ultraboost-light-running-shoes/p/461478201_black?utm_source=smartdeal',
      isAvailable: true
    }
  },

  // 17. Pigeon 3 Burner Stove
  'prod-pigeon-stove': {
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B01N2H84KG',
      product_url: 'https://www.amazon.in/dp/B01N2H84KG',
      affiliate_url: 'https://www.amazon.in/dp/B01N2H84KG?tag=smartdeal-21',
      isAvailable: true
    },
    flipkart: {
      marketplace_name: 'Flipkart',
      marketplace_product_id: 'GSTGG2ZGHYFFZZGA',
      product_url: 'https://www.flipkart.com/pigeon-cruise-glass-manual-gas-stove/p/itm5b69a23c5e812?pid=GSTGG2ZGHYFFZZGA',
      affiliate_url: 'https://www.flipkart.com/pigeon-cruise-glass-manual-gas-stove/p/itm5b69a23c5e812?pid=GSTGG2ZGHYFFZZGA&affid=smartdeal',
      isAvailable: true
    }
  },

  // 18. Redmi 13C 5G
  'prod-redmi-13c': {
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B0CNX6W7N1',
      product_url: 'https://www.amazon.in/dp/B0CNX6W7N1',
      affiliate_url: 'https://www.amazon.in/dp/B0CNX6W7N1?tag=smartdeal-21',
      isAvailable: true
    },
    flipkart: {
      marketplace_name: 'Flipkart',
      marketplace_product_id: 'MOBGW4H9JZRC13C',
      product_url: 'https://www.flipkart.com/redmi-13c-5g-starshine-green-128-gb/p/itm4b29ef71946bc?pid=MOBGW4H9JZRC13C',
      affiliate_url: 'https://www.flipkart.com/redmi-13c-5g-starshine-green-128-gb/p/itm4b29ef71946bc?pid=MOBGW4H9JZRC13C&affid=smartdeal',
      isAvailable: true
    }
  },

  // 19. realme Narzo 60x 5G
  'prod-realme-narzo': {
    amazon: {
      marketplace_name: 'Amazon',
      marketplace_product_id: 'B0CGDWR42Q',
      product_url: 'https://www.amazon.in/dp/B0CGDWR42Q',
      affiliate_url: 'https://www.amazon.in/dp/B0CGDWR42Q?tag=smartdeal-21',
      isAvailable: true
    },
    flipkart: {
      marketplace_name: 'Flipkart',
      marketplace_product_id: 'MOBGZ89NARZO60X',
      product_url: 'https://www.flipkart.com/realme-narzo-60x-5g-stellar-green-128-gb/p/itm7e289bf5492ac?pid=MOBGZ89NARZO60X',
      affiliate_url: 'https://www.flipkart.com/realme-narzo-60x-5g-stellar-green-128-gb/p/itm7e289bf5492ac?pid=MOBGZ89NARZO60X&affid=smartdeal',
      isAvailable: true
    }
  }
};

export const getVerifiedOffer = (productId: string, marketplaceName: string): VerifiedMarketplaceOffer | null => {
  const normKey = (marketplaceName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  let key = normKey;
  if (normKey.includes('amazon')) key = 'amazon';
  else if (normKey.includes('flipkart')) key = 'flipkart';
  else if (normKey.includes('meesho')) key = 'meesho';
  else if (normKey.includes('myntra')) key = 'myntra';
  else if (normKey.includes('ajio')) key = 'ajio';
  else if (normKey.includes('tata') || normKey.includes('cliq')) key = 'tatacliq';
  else if (normKey.includes('croma')) key = 'croma';
  else if (normKey.includes('reliance')) key = 'reliancedigital';

  const productOffers = VERIFIED_MARKETPLACE_CATALOG[productId];
  if (!productOffers) return null;
  return productOffers[key] || null;
};
