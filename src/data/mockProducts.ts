import { Product, CommissionSlab } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'prod-noise-endeavour-pro',
    name: 'Noise Endeavour Pro Rugged Smart Watch (1.46" AMOLED Display, Carbon Black, BT Calling, SOS, Fast Charge)',
    brand: 'Noise',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 19999,
    sellingPrice: 9999,
    discountPercent: 50,
    rating: 4.8,
    reviewsCount: 12701,
    seller: 'Clicktech Retail Private Ltd (Amazon Authorized)',
    sellerRating: 4.9,
    deliveryDate: 'Today, by 5 PM (FREE Delivery)',
    deliveryCharge: 0,
    smartCoinsEarned: 100,
    dealScore: 98,
    isSmartDealsChoice: true,
    stock: 58,
    returnDays: 7,
    warranty: '1 Year Manufacturer Warranty for Watch',
    description: "Noise Endeavour Pro Rugged Smart Watch (Amazon's Choice) brings a crisp 1.46-inch AMOLED display with 600 nits brightness, stainless steel bezel, single-chip Bluetooth calling with Tru Sync, 100+ sports modes, and up to 7-day battery life.",
    features: [
      '1.46" AMOLED High-Res Display with 600 Nits Brightness & Always-On',
      'Military Grade Rugged Case with Stainless Steel Protective Bezel',
      'Single-chip BT Calling with Dial Pad, Contacts & Voice Assistant',
      '100+ Sports Modes with Auto Workout Detection & IP68 Waterproof',
      'Comprehensive 24/7 Health Suite (SpO2, Heart Rate, Sleep Quality)'
    ],
    specs: {
      'Display': '1.46" Always-On AMOLED (466x466 px)',
      'Battery': '410 mAh (Up to 7 Days)',
      'Water Resistance': 'IP68 Rugged Waterproof',
      'Color': 'Carbon Black',
      'Sensors': 'Optical HR, SpO2, Accelerometer',
      'Connectivity': 'Bluetooth v5.3 + BLE'
    },
    dealScoreBreakdown: {
      priceAdvantage: 99,
      historicalPrice: 96,
      offerQuality: 98,
      sellerReliability: 99,
      delivery: 96,
      transparency: 99,
      overallScore: 98,
      verdict: 'Superb Genuine Deal'
    },
    priceHistory: [
      { date: '60d ago', price: 19999 },
      { date: '30d ago', price: 14999 },
      { date: '15d ago', price: 11999 },
      { date: 'Today', price: 9999, event: 'Amazon Best Price Match' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 97,
      reason: 'At ₹9,999 (50% OFF ₹19,999), this matches the all-time historic low on Amazon with verified free same-day delivery.',
      expectedLow: 9999
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'The MRP ₹19,999 is certified. Current price of ₹9,999 is 100% genuine and verified on Amazon with 5% affiliate commission.',
      lowestPriceEver: 9999,
      highestPriceEver: 19999
    },
    marketplacePrices: [
      {
        sellerName: 'Amazon',
        isSmartDealsSeller: false,
        price: 9999,
        deliveryCharge: 0,
        deliveryDate: 'Today, by 5 PM',
        couponText: '₹299 Cashback on Amazon Pay',
        couponDiscount: 299,
        finalPrice: 9999,
        smartCoins: 100,
        dealScore: 98,
        inStock: true,
        rating: 4.8,
        url: 'https://www.amazon.in/dp/B0F7XWCCY3',
        tag: 'Lowest Price',
        cashbackAmount: 100,
        discountPercent: 50
      },
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 10499,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow, by 2 PM',
        finalPrice: 10499,
        smartCoins: 80,
        dealScore: 86,
        inStock: true,
        rating: 4.6,
        url: 'https://www.flipkart.com/search?q=Noise+Endeavour+Pro',
        cashbackAmount: 80,
        discountPercent: 47
      },
      {
        sellerName: 'Croma',
        isSmartDealsSeller: false,
        price: 10999,
        deliveryCharge: 0,
        deliveryDate: '2 Days',
        finalPrice: 10999,
        smartCoins: 70,
        dealScore: 82,
        inStock: true,
        rating: 4.4,
        url: 'https://www.croma.com/search/?text=Noise+Endeavour+Pro',
        cashbackAmount: 70,
        discountPercent: 45
      }
    ]
  },
  {
    id: 'prod-samsung-m14',
    name: 'Samsung Galaxy M14 5G (Smoky Teal, 6GB RAM, 128GB Storage)',
    brand: 'Samsung',
    category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 17999,
    sellingPrice: 12490,
    discountPercent: 31,
    rating: 4.4,
    reviewsCount: 14820,
    seller: 'Samsung India Official (Amazon)',
    sellerRating: 4.8,
    deliveryDate: 'Tomorrow, by 2 PM',
    deliveryCharge: 0,
    smartCoinsEarned: 120,
    dealScore: 92,
    isSmartDealsChoice: true,
    stock: 45,
    returnDays: 7,
    warranty: '1 Year Manufacturer Warranty for Device and 6 Months for In-Box Accessories',
    description: 'Samsung Galaxy M14 5G brings flagship 50MP triple camera, massive 6000mAh segment-leading battery, and power-efficient 5nm Exynos 1330 processor. Experience blazing fast 5G speeds with 13 bands support.',
    features: [
      '6000mAh Monster Battery with 25W Fast Charging Support',
      '50MP Triple Rear Camera with F1.8 Aperture',
      'Exynos 1330 Octa Core 2.4GHz 5nm Processor',
      '6.6-inch FHD+ 90Hz Smooth Display',
      '13 5G Bands Support with Voice Focus'
    ],
    specs: {
      'RAM': '6 GB',
      'Storage': '128 GB (Expandable up to 1TB)',
      'Battery': '6000 mAh Li-ion',
      'Display': '6.6 inch FHD+ 90Hz PLS LCD',
      'Camera': '50MP + 2MP + 2MP | 13MP Front',
      'OS': 'Android 13, One UI Core 5.1'
    },
    dealScoreBreakdown: {
      priceAdvantage: 95,
      historicalPrice: 90,
      offerQuality: 88,
      sellerReliability: 96,
      delivery: 94,
      transparency: 95,
      overallScore: 92,
      verdict: 'Excellent Deal'
    },
    priceHistory: [
      { date: '60d ago', price: 14999 },
      { date: '45d ago', price: 13999 },
      { date: '30d ago', price: 13490, event: 'Freedom Sale' },
      { date: '15d ago', price: 13990 },
      { date: '7d ago', price: 12999 },
      { date: 'Today', price: 12490, event: 'SmartDeals Lowest' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 89,
      reason: 'Current price of ₹12,490 is within 2% of the all-time lowest price recorded in 90 days. Stock is fast moving.',
      expectedLow: 12290
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'The MRP is legitimate (₹17,999 verified against official Samsung invoice data). Average selling price in the past 60 days was ₹13,850. Actual saving is ₹1,360 lower than usual market average.',
      lowestPriceEver: 12290,
      highestPriceEver: 14999
    },
    marketplacePrices: [
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 12799,
        deliveryCharge: 0,
        deliveryDate: '2 Days',
        couponText: '₹150 Bank Off',
        couponDiscount: 150,
        finalPrice: 12799,
        smartCoins: 100,
        dealScore: 82,
        inStock: true,
        rating: 4.3,
        tag: 'Best Deal',
        url: 'https://www.flipkart.com/samsung-galaxy-m14-5g-smoky-teal-128-gb/p/itm6d148767e7c99?pid=MOBGZ8912490'
      },
      {
        sellerName: 'Amazon',
        isSmartDealsSeller: false,
        price: 12999,
        deliveryCharge: 40,
        deliveryDate: '2 Days',
        couponText: 'No Coupon',
        couponDiscount: 0,
        finalPrice: 12999,
        smartCoins: 80,
        dealScore: 84,
        inStock: true,
        rating: 4.5,
        url: 'https://www.amazon.in/dp/B0BY8MCQ9S?tag=smartdeal-21'
      },
      {
        sellerName: 'Croma',
        isSmartDealsSeller: false,
        price: 13499,
        deliveryCharge: 0,
        deliveryDate: '3-4 Days',
        couponText: '₹250 Card Discount',
        couponDiscount: 250,
        finalPrice: 13499,
        smartCoins: 50,
        dealScore: 78,
        inStock: true,
        rating: 4.6,
        url: 'https://www.croma.com/samsung-galaxy-m14-5g-128-gb-6-gb-ram-smoky-teal-/p/271290'
      },
      {
        sellerName: 'Reliance Digital',
        isSmartDealsSeller: false,
        price: 13999,
        deliveryCharge: 49,
        deliveryDate: '2-3 Days',
        couponText: 'None',
        couponDiscount: 0,
        finalPrice: 13999,
        smartCoins: 70,
        dealScore: 75,
        inStock: false,
        rating: 4.2,
        url: 'https://www.reliancedigital.in/samsung-galaxy-m14-5g-128-gb-6-gb-ram-smoky-teal-/p/493829102'
      }
    ],
    alternatives: [
      {
        id: 'prod-redmi-13c',
        name: 'Redmi 13C 5G (Starshine Green, 6GB RAM)',
        reason: 'Slightly lower price with sleek glass back, ideal for budget-conscious buyers.',
        price: 10499,
        tag: 'Best Budget'
      },
      {
        id: 'prod-realme-narzo',
        name: 'realme Narzo 60x 5G (Stellar Green, 6GB RAM)',
        reason: 'Faster 33W SUPERVOOC charging and lighter build.',
        price: 11999,
        tag: 'Best Performance'
      }
    ]
  },
  {
    id: 'prod-apple-iphone15',
    name: 'Apple iPhone 15 (Blue, 128 GB)',
    brand: 'Apple',
    category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 89999,
    sellingPrice: 79999,
    discountPercent: 11,
    rating: 4.6,
    reviewsCount: 12500,
    seller: 'Apple Authorised Store (Amazon)',
    sellerRating: 4.9,
    deliveryDate: 'Tomorrow, by 11 AM',
    deliveryCharge: 0,
    smartCoinsEarned: 500,
    dealScore: 92,
    isSmartDealsChoice: true,
    stock: 22,
    returnDays: 7,
    warranty: '1 Year Apple International Hardware Warranty',
    description: 'iPhone 15 features the Dynamic Island, 48MP Main camera, and durable color-infused glass and aluminum design with USB-C convenience.',
    features: [
      '6.1" Super Retina XDR OLED display',
      'A16 Bionic high efficiency chip',
      '48MP main camera with 2x Telephoto',
      'All-day battery life with USB-C charging'
    ],
    specs: {
      'Storage': '128 GB',
      'Display': '6.1 inch Super Retina XDR OLED',
      'Chipset': 'A16 Bionic 6-core GPU',
      'Camera': '48MP + 12MP Ultra Wide | 12MP TrueDepth',
      'Water Resistance': 'IP68 rated (up to 6m for 30 mins)'
    },
    dealScoreBreakdown: {
      priceAdvantage: 96,
      historicalPrice: 94,
      offerQuality: 92,
      sellerReliability: 98,
      delivery: 95,
      transparency: 96,
      overallScore: 92,
      verdict: 'Excellent Deal'
    },
    priceHistory: [
      { date: '90d ago', price: 89999 },
      { date: '60d ago', price: 84999 },
      { date: '30d ago', price: 81999 },
      { date: '15d ago', price: 80999 },
      { date: 'Today', price: 79999, event: 'Best Price' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 93,
      reason: 'At ₹79,999 with additional ₹1,200 commission cashback and ₹3,000 HDFC bank discount, this is the optimal purchase window.',
      expectedLow: 78999
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'Standard Apple MRP of ₹89,999 is verified. Current selling price is genuinely 11% below retail.',
      lowestPriceEver: 78499,
      highestPriceEver: 89999
    },
    marketplacePrices: [
      {
        sellerName: 'Meesho',
        isSmartDealsSeller: false,
        price: 79999,
        deliveryCharge: 0,
        deliveryDate: '4-5 days',
        couponText: '₹780 Cashback',
        couponDiscount: 0,
        finalPrice: 79999,
        smartCoins: 350,
        dealScore: 94,
        inStock: true,
        rating: 4.3,
        tag: 'Best Deal',
        cashbackAmount: 780,
        discountPercent: 11,
        url: 'https://www.meesho.com/iphone-15-128gb/p/571928?ref=smartdeal'
      },
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 81990,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow, by 11 AM',
        couponText: '₹1,500 Bank Discount',
        couponDiscount: 0,
        finalPrice: 81990,
        smartCoins: 500,
        dealScore: 91,
        inStock: true,
        rating: 4.6,
        tag: 'Lowest Price',
        cashbackAmount: 1000,
        discountPercent: 9,
        url: 'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4?pid=MOBGTAGPTB3VS24W'
      },
      {
        sellerName: 'Amazon',
        isSmartDealsSeller: false,
        price: 82499,
        deliveryCharge: 0,
        deliveryDate: '2-3 days',
        couponText: '₹1,200 Cashback',
        couponDiscount: 0,
        finalPrice: 82499,
        smartCoins: 500,
        dealScore: 89,
        inStock: true,
        rating: 4.6,
        cashbackAmount: 1200,
        discountPercent: 8,
        url: 'https://www.amazon.in/dp/B0CHX1W1XY?tag=smartdeal-21'
      },
      {
        sellerName: 'Myntra',
        isSmartDealsSeller: false,
        price: 84590,
        deliveryCharge: 0,
        deliveryDate: '2-3 days',
        couponText: '₹840 Cashback',
        couponDiscount: 0,
        finalPrice: 84590,
        smartCoins: 300,
        dealScore: 84,
        inStock: true,
        rating: 4.4,
        cashbackAmount: 840,
        discountPercent: 6,
        url: 'https://www.myntra.com/mobiles/apple/iphone-15-128gb/25191024/buy'
      },
      {
        sellerName: 'AJIO',
        isSmartDealsSeller: false,
        price: 83999,
        deliveryCharge: 0,
        deliveryDate: '4-7 days',
        couponText: '₹830 Cashback',
        couponDiscount: 0,
        finalPrice: 83999,
        smartCoins: 300,
        dealScore: 83,
        inStock: true,
        rating: 4.3,
        cashbackAmount: 830,
        discountPercent: 7,
        url: 'https://www.ajio.com/apple-iphone-15-128-gb-black/p/461112891_black'
      },
      {
        sellerName: 'Tata CLiQ',
        isSmartDealsSeller: false,
        price: 82999,
        deliveryCharge: 0,
        deliveryDate: '3-5 days',
        couponText: '₹820 Cashback',
        couponDiscount: 0,
        finalPrice: 82999,
        smartCoins: 320,
        dealScore: 86,
        inStock: true,
        rating: 4.4,
        cashbackAmount: 820,
        discountPercent: 8,
        url: 'https://www.tatacliq.com/apple-iphone-15-128gb-black/p-mp000000019629144'
      },
      {
        sellerName: 'Croma',
        isSmartDealsSeller: false,
        price: 83499,
        deliveryCharge: 0,
        deliveryDate: '1-2 days',
        couponText: '₹830 Cashback',
        couponDiscount: 0,
        finalPrice: 83499,
        smartCoins: 350,
        dealScore: 87,
        inStock: true,
        rating: 4.6,
        cashbackAmount: 830,
        discountPercent: 7,
        url: 'https://www.croma.com/apple-iphone-15-128gb-black-/p/300652'
      },
      {
        sellerName: 'Reliance Digital',
        isSmartDealsSeller: false,
        price: 82999,
        deliveryCharge: 0,
        deliveryDate: '1-2 days',
        couponText: '₹820 Cashback',
        couponDiscount: 0,
        finalPrice: 82999,
        smartCoins: 320,
        dealScore: 86,
        inStock: true,
        rating: 4.5,
        cashbackAmount: 820,
        discountPercent: 8,
        url: 'https://www.reliancedigital.in/apple-iphone-15-128-gb-black/p/493839352'
      }
    ]
  },
  {
    id: 'prod-apple-iphone15-256',
    name: 'Apple iPhone 15 (Blue, 256 GB)',
    brand: 'Apple',
    category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 99990,
    sellingPrice: 89999,
    discountPercent: 10,
    rating: 4.5,
    reviewsCount: 9840,
    seller: 'Apple Authorised Store (Amazon)',
    sellerRating: 4.9,
    deliveryDate: 'Tomorrow, by 11 AM',
    deliveryCharge: 0,
    smartCoinsEarned: 550,
    dealScore: 91,
    isSmartDealsChoice: true,
    stock: 18,
    returnDays: 7,
    warranty: '1 Year Apple International Hardware Warranty',
    description: 'iPhone 15 with 256GB storage features Dynamic Island, 48MP Main camera, and durable color-infused glass and aluminum design with USB-C.',
    features: [
      '6.1" Super Retina XDR OLED display',
      'A16 Bionic high efficiency chip',
      '48MP main camera with 2x Telephoto',
      '256GB High-speed NVMe storage'
    ],
    specs: {
      'Storage': '256 GB',
      'Display': '6.1 inch Super Retina XDR OLED',
      'Chipset': 'A16 Bionic 6-core GPU',
      'Camera': '48MP + 12MP Ultra Wide | 12MP TrueDepth',
      'Water Resistance': 'IP68 rated (up to 6m for 30 mins)'
    },
    dealScoreBreakdown: {
      priceAdvantage: 93,
      historicalPrice: 91,
      offerQuality: 90,
      sellerReliability: 98,
      delivery: 95,
      transparency: 95,
      overallScore: 91,
      verdict: 'Excellent Deal'
    },
    priceHistory: [
      { date: '90d ago', price: 99990 },
      { date: '60d ago', price: 94990 },
      { date: '30d ago', price: 91999 },
      { date: 'Today', price: 89999, event: 'Best Price' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 91,
      reason: 'At ₹89,999 with additional ₹1,400 commission cashback, this is a strong buy for the 256GB model.',
      expectedLow: 88999
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'Standard 256GB MRP of ₹99,990 verified. Current price is genuinely 10% below retail.',
      lowestPriceEver: 88999,
      highestPriceEver: 99990
    },
    marketplacePrices: [
      {
        sellerName: 'Amazon',
        isSmartDealsSeller: false,
        price: 89999,
        deliveryCharge: 0,
        deliveryDate: '2-3 days',
        couponText: '₹1,400 Cashback',
        couponDiscount: 0,
        finalPrice: 89999,
        smartCoins: 550,
        dealScore: 91,
        inStock: true,
        rating: 4.5,
        tag: 'Best Deal',
        cashbackAmount: 1400,
        discountPercent: 10,
        url: 'https://www.amazon.in/dp/B0CHX2F56G?tag=smartdeal-21'
      },
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 91999,
        deliveryCharge: 0,
        deliveryDate: '3-4 days',
        couponText: '₹1,100 Cashback',
        couponDiscount: 0,
        finalPrice: 91999,
        smartCoins: 480,
        dealScore: 88,
        inStock: true,
        rating: 4.4,
        cashbackAmount: 1100,
        discountPercent: 8,
        url: 'https://www.flipkart.com/apple-iphone-15-blue-256-gb/p/itm256'
      }
    ]
  },
  {
    id: 'prod-apple-iphone15-512',
    name: 'Apple iPhone 15 (Blue, 512 GB)',
    brand: 'Apple',
    category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 119990,
    sellingPrice: 109999,
    discountPercent: 8,
    rating: 4.5,
    reviewsCount: 5410,
    seller: 'Apple Authorised Store (Amazon)',
    sellerRating: 4.9,
    deliveryDate: 'Tomorrow, by 11 AM',
    deliveryCharge: 0,
    smartCoinsEarned: 650,
    dealScore: 89,
    isSmartDealsChoice: true,
    stock: 12,
    returnDays: 7,
    warranty: '1 Year Apple International Hardware Warranty',
    description: 'iPhone 15 with 512GB maximum storage capacity, Dynamic Island, 48MP Main camera, and USB-C.',
    features: [
      '6.1" Super Retina XDR OLED display',
      'A16 Bionic high efficiency chip',
      '48MP main camera with 2x Telephoto',
      '512GB High-speed NVMe storage'
    ],
    specs: {
      'Storage': '512 GB',
      'Display': '6.1 inch Super Retina XDR OLED',
      'Chipset': 'A16 Bionic 6-core GPU',
      'Camera': '48MP + 12MP Ultra Wide | 12MP TrueDepth',
      'Water Resistance': 'IP68 rated (up to 6m for 30 mins)'
    },
    dealScoreBreakdown: {
      priceAdvantage: 90,
      historicalPrice: 89,
      offerQuality: 88,
      sellerReliability: 98,
      delivery: 95,
      transparency: 95,
      overallScore: 89,
      verdict: 'Good Deal'
    },
    priceHistory: [
      { date: '90d ago', price: 119990 },
      { date: '60d ago', price: 114990 },
      { date: '30d ago', price: 111999 },
      { date: 'Today', price: 109999, event: 'Best Price' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 88,
      reason: 'At ₹1,09,999 with additional ₹1,800 commission cashback, lowest price seen for 512GB.',
      expectedLow: 108999
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'Standard 512GB MRP of ₹1,19,990 verified. Current price is genuinely 8% below retail.',
      lowestPriceEver: 108999,
      highestPriceEver: 119990
    },
    marketplacePrices: [
      {
        sellerName: 'Amazon',
        isSmartDealsSeller: false,
        price: 109999,
        deliveryCharge: 0,
        deliveryDate: '2-3 days',
        couponText: '₹1,800 Cashback',
        couponDiscount: 0,
        finalPrice: 109999,
        smartCoins: 650,
        dealScore: 89,
        inStock: true,
        rating: 4.5,
        tag: 'Best Deal',
        cashbackAmount: 1800,
        discountPercent: 8,
        url: 'https://www.amazon.in/dp/B0CHX512GB?tag=smartdeal-21'
      },
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 111999,
        deliveryCharge: 0,
        deliveryDate: '3-4 days',
        couponText: '₹1,300 Cashback',
        couponDiscount: 0,
        finalPrice: 111999,
        smartCoins: 550,
        dealScore: 86,
        inStock: true,
        rating: 4.4,
        cashbackAmount: 1300,
        discountPercent: 6,
        url: 'https://www.flipkart.com/apple-iphone-15-blue-512-gb/p/itm512'
      }
    ]
  },
  {
    id: 'prod-nike-running-shoes',
    name: 'Nike Revolution 6 Running Shoes for Men (Black/White)',
    brand: 'Nike',
    category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 4995,
    sellingPrice: 2499,
    discountPercent: 50,
    rating: 4.4,
    reviewsCount: 8940,
    seller: 'Nike Flagship Store (Amazon)',
    sellerRating: 4.7,
    deliveryDate: 'Tomorrow, by 5 PM',
    deliveryCharge: 0,
    smartCoinsEarned: 60,
    dealScore: 94,
    isSmartDealsChoice: true,
    stock: 50,
    returnDays: 14,
    warranty: '3 Months Manufacturer Defect Warranty',
    description: 'Nike Revolution delivers cushioned comfort with a soft foam ride and breathable lightweight mesh upper for running and everyday casual wear.',
    features: [
      'Plush, soft foam midsole provides a smooth, stable ride',
      'Lightweight breathable knit mesh wraps your foot',
      'Reinforced heel and overlays offer support and durability',
      'Rubber outsole offers durable traction on a variety of surfaces'
    ],
    specs: {
      'Sole Material': 'Rubber',
      'Closure': 'Lace-Up',
      'Fit': 'Regular',
      'Shoe Width': 'Medium',
      'Weight': '290g (Size 9)'
    },
    dealScoreBreakdown: {
      priceAdvantage: 96,
      historicalPrice: 94,
      offerQuality: 95,
      sellerReliability: 96,
      delivery: 92,
      transparency: 95,
      overallScore: 94,
      verdict: 'Superb Genuine Deal'
    },
    priceHistory: [
      { date: '60d ago', price: 4995 },
      { date: '45d ago', price: 3499 },
      { date: '30d ago', price: 2999 },
      { date: 'Today', price: 2499, event: 'Flash Deal 50% Off' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 96,
      reason: 'At ₹2,499 (50% flat discount) with ₹60 cashback, this is the lowest recorded price this season.',
      expectedLow: 2499
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'Standard Nike MRP of ₹4,995 is verified. Actual 50% clearance drop.',
      lowestPriceEver: 2499,
      highestPriceEver: 4995
    },
    marketplacePrices: [
      {
        sellerName: 'Myntra',
        isSmartDealsSeller: false,
        price: 2499,
        deliveryCharge: 0,
        deliveryDate: '2-3 days',
        couponText: '₹60 Cashback',
        couponDiscount: 0,
        finalPrice: 2499,
        smartCoins: 60,
        dealScore: 94,
        inStock: true,
        rating: 4.5,
        tag: 'Best Deal',
        cashbackAmount: 60,
        discountPercent: 50,
        url: 'https://www.myntra.com/sports-shoes/nike/nike-men-revolution-running-shoes/14920402/buy'
      },
      {
        sellerName: 'Amazon',
        isSmartDealsSeller: false,
        price: 2699,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        couponText: '₹50 Cashback',
        couponDiscount: 0,
        finalPrice: 2699,
        smartCoins: 50,
        dealScore: 91,
        inStock: true,
        rating: 4.4,
        cashbackAmount: 50,
        discountPercent: 46,
        url: 'https://www.amazon.in/dp/B09C874K1N?tag=smartdeal-21'
      },
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 2799,
        deliveryCharge: 0,
        deliveryDate: '3-4 days',
        couponText: '₹50 Cashback',
        couponDiscount: 0,
        finalPrice: 2799,
        smartCoins: 40,
        dealScore: 89,
        inStock: true,
        rating: 4.3,
        cashbackAmount: 50,
        discountPercent: 44,
        url: 'https://www.flipkart.com/nike-revolution-running-shoes-men/p/itm54920'
      }
    ]
  },
  {
    id: 'prod-samsung-galaxy-s24',
    name: 'Samsung Galaxy S24 5G (Onyx Black, 8GB RAM, 128GB Storage)',
    brand: 'Samsung',
    category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 79999,
    sellingPrice: 64999,
    discountPercent: 19,
    rating: 4.6,
    reviewsCount: 7820,
    seller: 'Samsung Official Flagship (Amazon)',
    sellerRating: 4.9,
    deliveryDate: 'Tomorrow, by 1 PM',
    deliveryCharge: 0,
    smartCoinsEarned: 450,
    dealScore: 93,
    isSmartDealsChoice: true,
    stock: 25,
    returnDays: 7,
    warranty: '1 Year Manufacturer Warranty for Phone and 6 Months for In-box Accessories',
    description: 'Galaxy S24 with Galaxy AI features: Circle to Search, Live Translate, and Note Assist. Pro-grade 50MP triple camera setup with vibrant 6.2" Dynamic AMOLED 2X 120Hz display.',
    features: [
      'Galaxy AI: Circle to Search with Google, Live Translate, Note Assist',
      '50MP Pro-grade Triple Rear Camera with AI zoom',
      '6.2" FHD+ Dynamic AMOLED 2X with 2600 nits peak brightness',
      'Armor Aluminum frame with IP68 water & dust resistance'
    ],
    specs: {
      'RAM': '8 GB',
      'Storage': '128 GB',
      'Display': '6.2 inch Dynamic AMOLED 2X 120Hz',
      'Battery': '4000 mAh',
      'OS': 'Android 14, One UI 6.1 (7 Years OS Updates)'
    },
    dealScoreBreakdown: {
      priceAdvantage: 95,
      historicalPrice: 93,
      offerQuality: 92,
      sellerReliability: 98,
      delivery: 96,
      transparency: 96,
      overallScore: 93,
      verdict: 'Excellent Deal'
    },
    priceHistory: [
      { date: '90d ago', price: 79999 },
      { date: '60d ago', price: 74999 },
      { date: '30d ago', price: 68999 },
      { date: 'Today', price: 64999, event: 'Flash Deal' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 94,
      reason: 'At ₹64,999 with additional ₹1,000 commission cashback and 450 SmartCoins, optimal upgrade window for Galaxy AI flagship.',
      expectedLow: 63999
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'Standard Samsung MRP of ₹79,999 is verified. Current deal is 19% genuine discount.',
      lowestPriceEver: 64999,
      highestPriceEver: 79999
    },
    marketplacePrices: [
      {
        sellerName: 'Amazon',
        isSmartDealsSeller: false,
        price: 64999,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        couponText: '₹1,000 Cashback',
        couponDiscount: 0,
        finalPrice: 64999,
        smartCoins: 450,
        dealScore: 93,
        inStock: true,
        rating: 4.6,
        tag: 'Best Deal',
        cashbackAmount: 1000,
        discountPercent: 19,
        url: 'https://www.amazon.in/dp/B0CS5X6D8G?tag=smartdeal-21'
      },
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 66999,
        deliveryCharge: 0,
        deliveryDate: '2-3 days',
        couponText: '₹800 Cashback',
        couponDiscount: 0,
        finalPrice: 66999,
        smartCoins: 400,
        dealScore: 89,
        inStock: true,
        rating: 4.5,
        cashbackAmount: 800,
        discountPercent: 16,
        url: 'https://www.flipkart.com/samsung-galaxy-s24-5g-onyx-black-128-gb/p/itms24'
      }
    ]
  },
  {

    id: 'prod-hp-pavilion-15',
    name: 'HP Pavilion 15 (15.6" FHD Laptop, Core i5 12th Gen, 16GB RAM, 512GB SSD)',
    brand: 'HP',
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 69990,
    sellingPrice: 54990,
    discountPercent: 21,
    rating: 4.4,
    reviewsCount: 8200,
    seller: 'OmniTech Solutions (SmartDeals Verified)',
    sellerRating: 4.7,
    deliveryDate: 'Tomorrow, by 2 PM',
    deliveryCharge: 0,
    smartCoinsEarned: 450,
    dealScore: 91,
    isSmartDealsChoice: true,
    stock: 35,
    returnDays: 7,
    warranty: '1 Year Onsite Warranty from HP India',
    description: 'HP Pavilion 15 is powered by Intel Core i5-1235U processor with 16GB DDR4 RAM and 512GB PCIe NVMe SSD. Features stunning 15.6" micro-edge anti-glare display and B&O Audio.',
    features: [
      'Intel Core i5-1235U 12th Gen (up to 4.4 GHz, 10 cores)',
      '16 GB DDR4-3200 SDRAM & 512 GB PCIe NVMe M.2 SSD',
      '15.6-inch diagonal FHD (1920 x 1080) IPS micro-edge display',
      'Audio by B&O, Dual speakers, HP Audio Boost',
      'Fast Charge: 50% in approximately 45 minutes'
    ],
    specs: {
      'Processor': 'Intel Core i5-1235U',
      'RAM': '16 GB DDR4',
      'Storage': '512 GB SSD',
      'Display': '15.6" FHD IPS',
      'Graphics': 'Intel Iris Xe',
      'OS': 'Windows 11 Home'
    },
    dealScoreBreakdown: {
      priceAdvantage: 93,
      historicalPrice: 91,
      offerQuality: 89,
      sellerReliability: 94,
      delivery: 92,
      transparency: 94,
      overallScore: 91,
      verdict: 'Excellent Deal'
    },
    priceHistory: [
      { date: '90d ago', price: 69990 },
      { date: '60d ago', price: 62990 },
      { date: '30d ago', price: 58990 },
      { date: '15d ago', price: 56490 },
      { date: 'Today', price: 54990, event: 'Best Price' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 90,
      reason: 'At ₹54,990 on Flipkart and Amazon with 21% off, this is ₹4,000 lower than official retail.',
      expectedLow: 53990
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'Standard HP MRP ₹69,990 verified. Current price represents genuine 21% discount.',
      lowestPriceEver: 54490,
      highestPriceEver: 69990
    },
    marketplacePrices: [
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 54990,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        couponText: '₹1,500 Bank Off',
        couponDiscount: 1500,
        finalPrice: 54990,
        smartCoins: 450,
        dealScore: 91,
        inStock: true,
        rating: 4.4,
        tag: 'Best Deal',
        cashbackAmount: 550,
        discountPercent: 21,
        url: 'https://www.flipkart.com/hp-pavilion-15-core-i5-12th-gen/p/itm54990'
      },
      {
        sellerName: 'Amazon',
        isSmartDealsSeller: false,
        price: 56499,
        deliveryCharge: 0,
        deliveryDate: '2-3 days',
        couponText: '₹1,000 Coupon',
        couponDiscount: 1000,
        finalPrice: 56499,
        smartCoins: 400,
        dealScore: 87,
        inStock: true,
        rating: 4.4,
        cashbackAmount: 560,
        discountPercent: 19,
        url: 'https://www.amazon.in/dp/B0B5FHP15?tag=smartdeal-21'
      },
      {
        sellerName: 'Croma',
        isSmartDealsSeller: false,
        price: 57990,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        couponText: 'None',
        couponDiscount: 0,
        finalPrice: 57990,
        smartCoins: 350,
        dealScore: 84,
        inStock: true,
        rating: 4.5,
        cashbackAmount: 580,
        discountPercent: 17,
        url: 'https://www.croma.com/hp-pavilion-15-laptop/p/271891'
      },
      {
        sellerName: 'Reliance Digital',
        isSmartDealsSeller: false,
        price: 58490,
        deliveryCharge: 0,
        deliveryDate: '2-3 days',
        couponText: '₹1,000 Off',
        couponDiscount: 1000,
        finalPrice: 58490,
        smartCoins: 320,
        dealScore: 83,
        inStock: true,
        rating: 4.3,
        cashbackAmount: 580,
        discountPercent: 16,
        url: 'https://www.reliancedigital.in/hp-pavilion-15-laptop/p/49382910'
      }
    ]
  },
  {
    id: 'prod-samsung-watch-6',
    name: 'Samsung Galaxy Watch6 Bluetooth (44mm, Graphite, Advanced Sleep Coaching)',
    brand: 'Samsung',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 29999,
    sellingPrice: 21999,
    discountPercent: 26,
    rating: 4.5,
    reviewsCount: 6120,
    seller: 'WearableZone Official (SmartDeals Verified)',
    sellerRating: 4.8,
    deliveryDate: 'Tomorrow, by 5 PM',
    deliveryCharge: 0,
    smartCoinsEarned: 220,
    dealScore: 90,
    isSmartDealsChoice: true,
    stock: 40,
    returnDays: 7,
    warranty: '1 Year Samsung India Warranty',
    description: 'Galaxy Watch6 offers 20% larger display, slimmer bezel, advanced sleep coaching, Personalized HR Zones, and comprehensive Body Composition (BIA) analysis.',
    features: [
      '1.47" Super AMOLED Display with Sapphire Crystal',
      'Advanced Sleep Coaching with Sleep Consistency Score',
      'BioActive Sensor: Optical Heart Rate, Electrical Heart, and BIA',
      'Exynos W930 Dual Core 1.4GHz Processor, 2GB RAM + 16GB Storage',
      '5ATM + IP68 Water & Dust Resistance + MIL-STD-810H'
    ],
    specs: {
      'Size': '44 mm',
      'Display': '1.47" Super AMOLED',
      'Battery': '425 mAh with WPC Fast Wireless Charging',
      'Sensors': 'Optical HR, ECG, BIA, Temperature',
      'Connectivity': 'Bluetooth 5.3, Wi-Fi, NFC, GPS'
    },
    dealScoreBreakdown: {
      priceAdvantage: 91,
      historicalPrice: 90,
      offerQuality: 88,
      sellerReliability: 95,
      delivery: 92,
      transparency: 94,
      overallScore: 90,
      verdict: 'Excellent Deal'
    },
    priceHistory: [
      { date: '90d ago', price: 29999 },
      { date: '60d ago', price: 26999 },
      { date: '30d ago', price: 23999 },
      { date: '15d ago', price: 22499 },
      { date: 'Today', price: 21999, event: 'Best Price' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 88,
      reason: 'At ₹21,999 on Myntra, this is currently the best price in India with genuine 26% discount.',
      expectedLow: 21499
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'Official Samsung MRP ₹29,999 verified.',
      lowestPriceEver: 21499,
      highestPriceEver: 29999
    },
    marketplacePrices: [
      {
        sellerName: 'Myntra',
        isSmartDealsSeller: false,
        price: 21999,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        couponText: '₹1,000 Bank Off',
        couponDiscount: 1000,
        finalPrice: 21999,
        smartCoins: 220,
        dealScore: 90,
        inStock: true,
        rating: 4.5,
        tag: 'Best Deal',
        cashbackAmount: 220,
        discountPercent: 26,
        url: 'https://www.myntra.com/smartwatches/samsung/galaxy-watch-6/24182910/buy'
      },
      {
        sellerName: 'Amazon',
        isSmartDealsSeller: false,
        price: 22490,
        deliveryCharge: 0,
        deliveryDate: '2-3 days',
        couponText: 'No Coupon',
        couponDiscount: 0,
        finalPrice: 22490,
        smartCoins: 200,
        dealScore: 87,
        inStock: true,
        rating: 4.5,
        cashbackAmount: 225,
        discountPercent: 25,
        url: 'https://www.amazon.in/dp/B0CC9H829?tag=smartdeal-21'
      },
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 22999,
        deliveryCharge: 0,
        deliveryDate: '2 days',
        couponText: '₹500 Off',
        couponDiscount: 500,
        finalPrice: 22999,
        smartCoins: 200,
        dealScore: 85,
        inStock: true,
        rating: 4.4,
        cashbackAmount: 230,
        discountPercent: 23,
        url: 'https://www.flipkart.com/samsung-galaxy-watch6-bluetooth-44mm/p/itm22999'
      }
    ]
  },
  {
    id: 'prod-boat-airdopes',
    name: 'boAt Airdopes 141 Bluetooth TWS Earbuds with 42H Playtime, ENx Tech',
    brand: 'boAt',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 4490,
    sellingPrice: 1599,
    discountPercent: 64,
    rating: 4.1,
    reviewsCount: 89320,
    seller: 'SoundWave Hub (SmartDeals Verified)',
    sellerRating: 4.7,
    deliveryDate: 'Tomorrow, by 6 PM',
    deliveryCharge: 0,
    smartCoinsEarned: 35,
    dealScore: 78,
    isSmartDealsChoice: false,
    stock: 120,
    returnDays: 7,
    warranty: '1 Year Replacement Warranty',
    description: 'Lock into rhythm with boAt Airdopes 141. Equipped with 8mm drivers, BEAST mode for low-latency gaming, and ASAP charge providing 75 mins playtime in 5 mins.',
    features: [
      'Up to 42 Hours of total playback time',
      'ENx Environmental Noise Cancellation technology for clear calls',
      'BEAST Mode 80ms Low Latency for real-time mobile gaming',
      'ASAP Fast Charge: 5 mins charge = 75 mins playtime',
      'IPX4 Water and Sweat Resistance'
    ],
    specs: {
      'Driver Size': '8 mm Dynamic',
      'Playtime': 'Up to 42 hours (6h buds + 36h case)',
      'Charging Time': '1 Hour',
      'Bluetooth': 'v5.1 with 10m range',
      'Water Rating': 'IPX4'
    },
    dealScoreBreakdown: {
      priceAdvantage: 82,
      historicalPrice: 75,
      offerQuality: 74,
      sellerReliability: 88,
      delivery: 90,
      transparency: 62,
      overallScore: 78,
      verdict: 'Good Deal'
    },
    priceHistory: [
      { date: '90d ago', price: 1499 },
      { date: '60d ago', price: 1399 },
      { date: '30d ago', price: 1299 },
      { date: '15d ago', price: 1199, event: 'Flash Sale' },
      { date: 'Today', price: 1299 }
    ],
    buyNowRecommendation: {
      action: 'WAIT',
      confidence: 76,
      reason: 'boAt Airdopes frequently drops to ₹1,099 - ₹1,199 during weekend flash sales. Unless urgently required, wait 3-5 days.',
      expectedLow: 1149
    },
    fakeDiscountAudit: {
      isGenuine: false,
      status: 'Possible Inflated MRP',
      reason: 'The listed MRP of ₹4,490 is highly inflated by audio brands. This product has NEVER sold above ₹1,699 in the last 18 months. Realistic discount is ~24%, not 71%.',
      lowestPriceEver: 1099,
      highestPriceEver: 1699
    },
    marketplacePrices: [
      {
        sellerName: 'Amazon India',
        isSmartDealsSeller: false,
        price: 1299,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        couponText: '₹50 off with Bank Offer',
        couponDiscount: 50,
        finalPrice: 1249,
        smartCoins: 35,
        dealScore: 88,
        inStock: true,
        rating: 4.7,
        tag: 'Best Value'
      },
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 1349,
        deliveryCharge: 40,
        deliveryDate: 'In 2 Days',
        couponText: 'None',
        couponDiscount: 0,
        finalPrice: 1389,
        smartCoins: 0,
        dealScore: 68,
        inStock: true,
        rating: 4.0
      }
    ]
  },
  {
    id: 'prod-noise-colorfit',
    name: 'Noise ColorFit Pro 5 Smart Watch (1.85" AMOLED Display, BT Calling)',
    brand: 'Noise',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 8999,
    sellingPrice: 3499,
    discountPercent: 61,
    rating: 4.3,
    reviewsCount: 16500,
    seller: 'GadgetZone Direct',
    sellerRating: 4.6,
    deliveryDate: 'Thursday, 12 Sept',
    deliveryCharge: 49,
    smartCoinsEarned: 45,
    dealScore: 84,
    isSmartDealsChoice: false,
    stock: 60,
    returnDays: 7,
    warranty: '1 Year Warranty',
    description: 'Elevate your lifestyle with Noise ColorFit Pro 5 with ultra crisp 1.85" AMOLED display, rapid Bluetooth calling, animated watch faces and 100+ sports modes.',
    features: [
      '1.85" AMOLED Display with 600 nits peak brightness',
      'Tru Sync Bluetooth Calling with dial pad & contact sync',
      'Functional Crown for effortless UI navigation',
      '24x7 Heart Rate, SpO2, and Sleep Tracker',
      '7-day battery life on normal usage'
    ],
    specs: {
      'Display': '1.85 inch AMOLED (390 x 450 px)',
      'Battery Life': 'Up to 7 Days',
      'Bluetooth': 'v5.3',
      'Water Resistance': 'IP68'
    },
    dealScoreBreakdown: {
      priceAdvantage: 88,
      historicalPrice: 85,
      offerQuality: 82,
      sellerReliability: 86,
      delivery: 80,
      transparency: 79,
      overallScore: 84,
      verdict: 'Good Deal'
    },
    priceHistory: [
      { date: '90d ago', price: 4499 },
      { date: '60d ago', price: 3999 },
      { date: '30d ago', price: 3699 },
      { date: '10d ago', price: 3499 },
      { date: 'Today', price: 3499 }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 82,
      reason: 'Steady price stability at ₹3,499. Good deal if you need AMOLED smart watch with BT calling right now.',
      expectedLow: 3299
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'Though MRP ₹8,999 has standard wearable margin, ₹3,499 represents good value for an AMOLED panel smartwatch.',
      lowestPriceEver: 3299,
      highestPriceEver: 4499
    },
    marketplacePrices: [
      {
        sellerName: 'Amazon India',
        isSmartDealsSeller: false,
        price: 3499,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        couponText: '₹100 Flat OFF',
        couponDiscount: 100,
        finalPrice: 3399,
        smartCoins: 45,
        dealScore: 88,
        inStock: true,
        rating: 4.6,
        tag: 'Best Value'
      }
    ]
  },
  {
    id: 'prod-asus-vivobook',
    name: 'ASUS Vivobook 15 Intel Core i5 12th Gen (16GB RAM / 512GB SSD, FHD)',
    brand: 'ASUS',
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 69990,
    sellingPrice: 48990,
    discountPercent: 30,
    rating: 4.5,
    reviewsCount: 5210,
    seller: 'CompuWorld Solutions (SmartDeals Verified)',
    sellerRating: 4.8,
    deliveryDate: 'Tomorrow, by 4 PM',
    deliveryCharge: 0,
    smartCoinsEarned: 450,
    dealScore: 91,
    isSmartDealsChoice: true,
    stock: 15,
    returnDays: 7,
    warranty: '1 Year Onsite Warranty + 1 Year Accidental Damage Protection',
    description: 'Designed for multitasking and daily productivity, the ASUS Vivobook 15 comes packed with Intel 12th Gen Core i5-1235U, 16GB dual-channel RAM, and anti-glare FHD nanoedge display.',
    features: [
      'Intel Core i5-1235U Processor 1.3 GHz (12M Cache, up to 4.4 GHz, 10 cores)',
      '16GB DDR4 RAM on board + 512GB M.2 NVMe PCIe 3.0 SSD',
      '15.6-inch FHD (1920 x 1080) 16:9 aspect ratio, 250nits',
      'Lightweight 1.7 kg thin chassis with 180° lay-flat hinge',
      'Pre-installed Windows 11 Home & Office Home & Student 2021'
    ],
    specs: {
      'Processor': 'Intel Core i5-1235U (10 Cores, 12 Threads)',
      'RAM': '16 GB DDR4',
      'Storage': '512 GB PCIe 3.0 NVMe SSD',
      'Screen': '15.6" Anti-glare FHD (1920x1080)',
      'Weight': '1.70 kg',
      'OS': 'Windows 11 Home'
    },
    dealScoreBreakdown: {
      priceAdvantage: 93,
      historicalPrice: 91,
      offerQuality: 90,
      sellerReliability: 95,
      delivery: 92,
      transparency: 94,
      overallScore: 91,
      verdict: 'Excellent Deal'
    },
    priceHistory: [
      { date: '90d ago', price: 54990 },
      { date: '60d ago', price: 52990 },
      { date: '30d ago', price: 50990 },
      { date: '15d ago', price: 49490 },
      { date: 'Today', price: 48990, event: 'Historic Low' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 91,
      reason: '16GB RAM laptops with 12th Gen i5 rarely dip below ₹50,000 with MS Office bundled. Highly recommended for students & professionals.',
      expectedLow: 47990
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'Legitimate discount verified. Similar spec models from HP and Dell sell between ₹53,000–₹57,000.',
      lowestPriceEver: 48490,
      highestPriceEver: 56990
    },
    marketplacePrices: [
      {
        sellerName: 'Amazon India',
        isSmartDealsSeller: false,
        price: 48990,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        couponText: '₹1,000 Laptop Coupon',
        couponDiscount: 1000,
        finalPrice: 47990,
        smartCoins: 450,
        dealScore: 92,
        inStock: true,
        rating: 4.8,
        tag: 'Best Overall'
      },
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 51990,
        deliveryCharge: 0,
        deliveryDate: 'In 3 Days',
        couponText: 'None',
        couponDiscount: 0,
        finalPrice: 51990,
        smartCoins: 0,
        dealScore: 79,
        inStock: true,
        rating: 4.3
      },
      {
        sellerName: 'Croma',
        isSmartDealsSeller: false,
        price: 52990,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        couponText: '₹1,500 HDFC Card Off',
        couponDiscount: 1500,
        finalPrice: 51490,
        smartCoins: 0,
        dealScore: 81,
        inStock: true,
        rating: 4.6
      }
    ]
  },
  {
    id: 'prod-pigeon-stove',
    name: 'Pigeon by Stovekraft Cruise 3 Burner Glass Top Gas Stove',
    brand: 'Pigeon',
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 6495,
    sellingPrice: 2199,
    discountPercent: 66,
    rating: 4.0,
    reviewsCount: 34100,
    seller: 'KitchenEase Appliances',
    sellerRating: 4.4,
    deliveryDate: 'Tomorrow, by 7 PM',
    deliveryCharge: 0,
    smartCoinsEarned: 25,
    dealScore: 76,
    isSmartDealsChoice: false,
    stock: 50,
    returnDays: 10,
    warranty: '2 Years Manufacturer Warranty',
    description: 'High quality toughened black glass cooktop with 3 high fuel-efficient brass burners, stainless steel spill trays, and skid-proof rubber legs.',
    features: [
      'Toughened black glass top with heat-resistant properties',
      '3 Tri-Pin brass burners for uniform heat distribution',
      'Strong tubular legs for firm grip and balance',
      'Easy to clean stainless steel spill tray'
    ],
    specs: {
      'Burners': '3 Brass Burners',
      'Material': 'Toughened Glass + Stainless Steel Body',
      'Ignition': 'Manual',
      'Warranty': '2 Years'
    },
    dealScoreBreakdown: {
      priceAdvantage: 85,
      historicalPrice: 72,
      offerQuality: 70,
      sellerReliability: 82,
      delivery: 88,
      transparency: 64,
      overallScore: 76,
      verdict: 'Good Deal'
    },
    priceHistory: [
      { date: '90d ago', price: 2599 },
      { date: '60d ago', price: 2399 },
      { date: '30d ago', price: 2199 },
      { date: 'Today', price: 2199 }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 80,
      reason: 'Consistently priced between ₹2,199 and ₹2,399. Reliable everyday buy with free next-day delivery.',
      expectedLow: 2099
    },
    fakeDiscountAudit: {
      isGenuine: false,
      status: 'Possible Inflated MRP',
      reason: 'MRP ₹6,495 is artificially boosted; actual year-round market price is ₹2,300–₹2,500. True savings is around 15%, not 66%.',
      lowestPriceEver: 1999,
      highestPriceEver: 2799
    },
    marketplacePrices: [
      {
        sellerName: 'Amazon India',
        isSmartDealsSeller: false,
        price: 2199,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        couponText: '₹50 Store Discount',
        couponDiscount: 50,
        finalPrice: 2149,
        smartCoins: 25,
        dealScore: 82,
        inStock: true,
        rating: 4.4,
        tag: 'Best Value'
      },
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 2299,
        deliveryCharge: 60,
        deliveryDate: 'In 3 Days',
        couponText: 'None',
        couponDiscount: 0,
        finalPrice: 2359,
        smartCoins: 0,
        dealScore: 70,
        inStock: true,
        rating: 4.1
      },
      {
        sellerName: 'Amazon India',
        isSmartDealsSeller: false,
        price: 2249,
        deliveryCharge: 0,
        deliveryDate: 'In 2 Days',
        couponText: 'None',
        couponDiscount: 0,
        finalPrice: 2249,
        smartCoins: 0,
        dealScore: 72,
        inStock: true,
        rating: 4.0
      }
    ]
  },
  {
    id: 'prod-nike-airmax',
    name: 'Nike Air Max SC Mens Running Shoes & Sneakers',
    brand: 'Nike',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 6995,
    sellingPrice: 4899,
    discountPercent: 30,
    rating: 4.6,
    reviewsCount: 8400,
    seller: 'SneakerVault Official',
    sellerRating: 4.9,
    deliveryDate: 'Tomorrow, by 1 PM',
    deliveryCharge: 0,
    smartCoinsEarned: 48,
    dealScore: 89,
    isSmartDealsChoice: true,
    stock: 28,
    returnDays: 14,
    warranty: 'Brand Replacement for Manufacturing Defects',
    description: 'With its easy-going lines, heritage track look and visible Air cushioning, the Nike Air Max SC is the perfect finish to any casual outfit.',
    features: [
      'Leather, textile and mesh combine for a durable, breathable construction',
      'Max Air unit originally designed for running provides lightweight cushioning',
      'Foam midsole adds cushioning to last all day',
      'Rubber outsole provides traction and durability'
    ],
    specs: {
      'Upper Material': 'Leather & Mesh',
      'Sole': 'Rubber with Air Max Unit',
      'Closure': 'Lace-Up',
      'Color': 'Gym Red / White'
    },
    dealScoreBreakdown: {
      priceAdvantage: 90,
      historicalPrice: 88,
      offerQuality: 86,
      sellerReliability: 96,
      delivery: 92,
      transparency: 91,
      overallScore: 89,
      verdict: 'Good Deal'
    },
    priceHistory: [
      { date: '90d ago', price: 6295 },
      { date: '60d ago', price: 5499 },
      { date: '30d ago', price: 4999 },
      { date: 'Today', price: 4899 }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 86,
      reason: 'Authentic Nike sneakers rarely receive 30% flat off with 14-day return support. Strong value for sneakerheads.',
      expectedLow: 4699
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'MRP ₹6,995 is authentic Nike India retail price. Price has systematically descended from ₹6,295.',
      lowestPriceEver: 4699,
      highestPriceEver: 6995
    },
    marketplacePrices: [
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 4899,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow, by 11 AM',
        couponText: '₹200 Instant Off',
        couponDiscount: 200,
        finalPrice: 4699,
        smartCoins: 48,
        dealScore: 92,
        inStock: true,
        rating: 4.8,
        tag: 'Best Deal',
        url: 'https://www.flipkart.com/nike-air-max-sc-sneakers-men/p/itm54398721?pid=SHOFZ98721'
      },
      {
        sellerName: 'Amazon India',
        isSmartDealsSeller: false,
        price: 4995,
        deliveryCharge: 0,
        deliveryDate: 'In 2 Days',
        couponText: 'Flat 5% Cashback',
        couponDiscount: 100,
        finalPrice: 4895,
        smartCoins: 45,
        dealScore: 88,
        inStock: true,
        rating: 4.7,
        url: 'https://www.amazon.in/Nike-Air-Max-Running-Shoes/dp/B09V7N8K44'
      },
      {
        sellerName: 'Myntra',
        isSmartDealsSeller: false,
        price: 5249,
        deliveryCharge: 0,
        deliveryDate: 'In 2 Days',
        couponText: '₹300 Off code MYNTRA300',
        couponDiscount: 300,
        finalPrice: 4949,
        smartCoins: 30,
        dealScore: 84,
        inStock: true,
        rating: 4.6,
        url: 'https://www.myntra.com/sports-shoes/nike/nike-men-air-max-sc-running-shoes/19823451/buy'
      },
      {
        sellerName: 'Ajio',
        isSmartDealsSeller: false,
        price: 5499,
        deliveryCharge: 0,
        deliveryDate: 'In 3 Days',
        couponText: 'None',
        couponDiscount: 0,
        finalPrice: 5499,
        smartCoins: 20,
        dealScore: 78,
        inStock: true,
        rating: 4.4,
        url: 'https://www.ajio.com/nike-air-max-sc-lace-up-sneakers/p/469201948_red'
      }
    ]
  },
  {
    id: 'prod-sony-wh1000xm5',
    name: 'Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones (Black)',
    brand: 'Sony',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 34990,
    sellingPrice: 28990,
    discountPercent: 17,
    rating: 4.7,
    reviewsCount: 11200,
    seller: 'Sony Authorized Audio Hub',
    sellerRating: 4.9,
    deliveryDate: 'Tomorrow, by 12 PM',
    deliveryCharge: 0,
    smartCoinsEarned: 350,
    dealScore: 93,
    isSmartDealsChoice: true,
    stock: 25,
    returnDays: 7,
    warranty: '1 Year Sony India Manufacturer Warranty',
    description: 'Industry leading noise cancellation with two processors and 8 microphones. Magnificent sound quality with 30mm carbon fiber driver units and up to 30 hours battery life.',
    features: [
      'Industry-leading Active Noise Cancellation with Auto NC Optimizer',
      'Up to 30-hour battery life with quick charging (3 min charge = 3 hours playback)',
      'Ultra-comfortable lightweight design with soft fit leather',
      'Multipoint connection allows pairing with two Bluetooth devices simultaneously'
    ],
    specs: {
      'Battery Life': 'Up to 30 Hours (NC On)',
      'Driver Unit': '30 mm Carbon Fiber',
      'Bluetooth': 'v5.2 with LDAC, AAC, SBC',
      'Weight': '250 g'
    },
    dealScoreBreakdown: {
      priceAdvantage: 94,
      historicalPrice: 92,
      offerQuality: 90,
      sellerReliability: 98,
      delivery: 95,
      transparency: 96,
      overallScore: 93,
      verdict: 'Excellent Deal'
    },
    priceHistory: [
      { date: '90d ago', price: 32990 },
      { date: '60d ago', price: 30990 },
      { date: '30d ago', price: 29990 },
      { date: 'Today', price: 28990, event: 'SmartDeals Lowest' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 90,
      reason: 'Sony WH-1000XM5 at ₹28,990 is its lowest verified price in 6 months with 350 SmartCoins cashback.',
      expectedLow: 27990
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'Standard Sony India retail price is ₹34,990. Current price is legitimate market low.',
      lowestPriceEver: 27990,
      highestPriceEver: 34990
    },
    marketplacePrices: [
      {
        sellerName: 'Amazon India',
        isSmartDealsSeller: false,
        price: 28990,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        couponText: '₹1,000 Audio Coupon',
        couponDiscount: 1000,
        finalPrice: 27990,
        smartCoins: 350,
        dealScore: 94,
        inStock: true,
        rating: 4.9,
        tag: 'Best Overall'
      },
      {
        sellerName: 'Croma',
        isSmartDealsSeller: false,
        price: 31990,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        couponText: '₹1,500 Card Off',
        couponDiscount: 1500,
        finalPrice: 30490,
        smartCoins: 0,
        dealScore: 82,
        inStock: true,
        rating: 4.5
      }
    ]
  },
  {
    id: 'prod-macbook-air-m2',
    name: 'Apple MacBook Air M2 (13.6-inch, 8GB RAM, 256GB SSD, Midnight)',
    brand: 'Apple',
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 99900,
    sellingPrice: 84990,
    discountPercent: 15,
    rating: 4.8,
    reviewsCount: 19800,
    seller: 'Apple Authorized Reseller (Amazon India)',
    sellerRating: 4.9,
    deliveryDate: 'Tomorrow, by 11 AM',
    deliveryCharge: 0,
    smartCoinsEarned: 500,
    dealScore: 95,
    isSmartDealsChoice: true,
    stock: 18,
    returnDays: 7,
    warranty: '1 Year Apple India Hardware Warranty',
    description: 'Incredibly thin and fast MacBook Air with Apple M2 chip. Features a gorgeous 13.6-inch Liquid Retina display, MagSafe 3 charging, 1080p FaceTime HD camera, and up to 18 hours of battery life.',
    features: [
      'Apple M2 chip with 8-core CPU and up to 10-core GPU',
      '13.6-inch Liquid Retina display with 500 nits brightness and P3 wide color',
      'Silent, fanless design for whisper-quiet operation',
      'Up to 18 hours battery life to power through your whole workday'
    ],
    specs: {
      'Processor': 'Apple M2 (8-core CPU, 8-core GPU)',
      'Unified Memory': '8 GB',
      'Storage': '256 GB Superfast SSD',
      'Display': '13.6" Liquid Retina (2560 x 1664)',
      'Weight': '1.24 kg'
    },
    dealScoreBreakdown: {
      priceAdvantage: 96,
      historicalPrice: 94,
      offerQuality: 93,
      sellerReliability: 98,
      delivery: 96,
      transparency: 97,
      overallScore: 95,
      verdict: 'Excellent Deal'
    },
    priceHistory: [
      { date: '90d ago', price: 94900 },
      { date: '60d ago', price: 89990 },
      { date: '30d ago', price: 86990 },
      { date: 'Today', price: 84990, event: 'Best Price Guaranteed' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 94,
      reason: 'MacBook Air M2 at ₹84,990 with free next-day delivery and 500 SmartCoins is an extraordinary value proposition.',
      expectedLow: 83990
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'MRP ₹99,900 is authentic Apple Store retail price. Real 15% discount across certified retailers.',
      lowestPriceEver: 83990,
      highestPriceEver: 99900
    },
    marketplacePrices: [
      {
        sellerName: 'Amazon India',
        isSmartDealsSeller: false,
        price: 84990,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        couponText: '₹2,000 Instant Card Off',
        couponDiscount: 2000,
        finalPrice: 82990,
        smartCoins: 500,
        dealScore: 95,
        inStock: true,
        rating: 4.9,
        tag: 'Best Overall'
      },
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 86990,
        deliveryCharge: 0,
        deliveryDate: 'In 2 Days',
        couponText: '₹1,500 Bank Off',
        couponDiscount: 1500,
        finalPrice: 85490,
        smartCoins: 0,
        dealScore: 88,
        inStock: true,
        rating: 4.7
      },
      {
        sellerName: 'Amazon India',
        isSmartDealsSeller: false,
        price: 87490,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        couponText: 'None',
        couponDiscount: 0,
        finalPrice: 87490,
        smartCoins: 0,
        dealScore: 85,
        inStock: true,
        rating: 4.7
      }
    ]
  },
  {
    id: 'prod-adidas-ultraboost',
    name: 'Adidas Ultraboost Light Running & Training Shoes for Men (Core Black)',
    brand: 'Adidas',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 18999,
    sellingPrice: 11499,
    discountPercent: 39,
    rating: 4.8,
    reviewsCount: 5210,
    seller: 'Adidas Flagship Store',
    sellerRating: 4.9,
    deliveryDate: 'Tomorrow, by 11 AM',
    deliveryCharge: 0,
    smartCoinsEarned: 175,
    dealScore: 95,
    isSmartDealsChoice: true,
    stock: 19,
    returnDays: 14,
    warranty: '100% Original Authentic Adidas Guarantee with 6-Month Defect Replacement',
    description: 'Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever. The magic lies in the Light BOOST midsole, a new generation of adidas BOOST. Its unique molecule design achieves the lightest BOOST foam to date.',
    features: [
      'Light BOOST 30% Lighter Cushioning Compared to Previous Ultraboost',
      'Continental Better Rubber Outsole for Unrivalled Grip',
      'Linear Energy Push System for Maximum Energy Return',
      'adidas PRIMEKNIT+ Upper with Snug Sock-Like Fit'
    ],
    specs: {
      'Closure': 'Lace-Up',
      'Sole Material': 'Continental Rubber',
      'Midsole': 'Light BOOST Molecular Cushioning',
      'Upper': 'PRIMEKNIT+ Breathable Textile',
      'Ideal For': 'Marathon Running, Sprint & Everyday Luxury'
    },
    dealScoreBreakdown: {
      priceAdvantage: 96,
      historicalPrice: 94,
      offerQuality: 92,
      sellerReliability: 98,
      delivery: 95,
      transparency: 96,
      overallScore: 94,
      verdict: 'Superb Genuine Deal'
    },
    priceHistory: [
      { date: '60d ago', price: 16999 },
      { date: '45d ago', price: 14499 },
      { date: '30d ago', price: 12999 },
      { date: '15d ago', price: 11999 },
      { date: 'Today', price: 11499, event: 'All-Time Low' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 94,
      reason: 'Lowest price recorded for Ultraboost Light across Amazon, Flipkart, Myntra, and Ajio.',
      expectedLow: 11499
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'Verified against Adidas India official invoice catalogue. Authentic 39% price drop on flagship running sneaker.',
      lowestPriceEver: 11499,
      highestPriceEver: 18999
    },
    marketplacePrices: [
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 11999,
        deliveryCharge: 0,
        deliveryDate: '2 Days',
        couponText: '₹500 Bank Off',
        couponDiscount: 500,
        finalPrice: 11499,
        smartCoins: 180,
        dealScore: 95,
        inStock: true,
        rating: 4.8,
        tag: 'Lowest Price',
        url: 'https://www.flipkart.com/adidas-ultraboost-light-running-shoes-men/p/itm6823901?pid=SHOFU6823901'
      },
      {
        sellerName: 'Amazon',
        isSmartDealsSeller: false,
        price: 12499,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        couponText: '₹750 Card Discount',
        couponDiscount: 750,
        finalPrice: 11749,
        smartCoins: 160,
        dealScore: 92,
        inStock: true,
        rating: 4.8,
        url: 'https://www.amazon.in/Adidas-Ultraboost-Running-Shoes/dp/B0BYZ28K11'
      },
      {
        sellerName: 'Myntra',
        isSmartDealsSeller: false,
        price: 13299,
        deliveryCharge: 0,
        deliveryDate: '2 Days',
        couponText: 'MYNTRA10 for 10% Off',
        couponDiscount: 1000,
        finalPrice: 12299,
        smartCoins: 120,
        dealScore: 89,
        inStock: true,
        rating: 4.9,
        url: 'https://www.myntra.com/sports-shoes/adidas/adidas-men-ultraboost-light-running-shoes/21980421/buy'
      },
      {
        sellerName: 'Ajio',
        isSmartDealsSeller: false,
        price: 14249,
        deliveryCharge: 0,
        deliveryDate: '3-4 Days',
        couponText: 'AJIOMANIA',
        couponDiscount: 1200,
        finalPrice: 13049,
        smartCoins: 100,
        dealScore: 83,
        inStock: true,
        rating: 4.5,
        url: 'https://www.ajio.com/adidas-ultraboost-light-lace-up-running-shoes/p/469318290_black'
      }
    ]
  },
  {
    id: 'prod-lenovo-ideapad-slim3',
    name: 'Lenovo IdeaPad Slim 3 (15.6" FHD, Core i3 12th Gen, 8GB RAM, 512GB SSD, Windows 11)',
    brand: 'Lenovo',
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 54990,
    sellingPrice: 32990,
    discountPercent: 40,
    rating: 4.4,
    reviewsCount: 6420,
    seller: 'Appario Retail Private Ltd (Amazon)',
    sellerRating: 4.8,
    deliveryDate: 'Tomorrow, by 2 PM',
    deliveryCharge: 0,
    smartCoinsEarned: 330,
    dealScore: 94,
    isSmartDealsChoice: true,
    stock: 45,
    returnDays: 7,
    warranty: '1 Year Onsite Manufacturer Warranty + 1 Year Premium Care',
    description: 'Lenovo IdeaPad Slim 3 thin and light laptop powered by 12th Gen Intel Core i3-1215U with 8GB RAM, 512GB SSD and rapid charging capability.',
    features: [
      'Intel Core i3-1215U 12th Gen (up to 4.4 GHz, 6 cores, 8 threads)',
      '15.6" FHD (1920x1080) IPS Anti-glare 250 nits display',
      '8GB DDR4 RAM (expandable) & 512GB M.2 PCIe NVMe SSD',
      'Dolby Audio stereo speakers & HD 720p privacy camera'
    ],
    specs: {
      'Processor': '12th Gen Intel Core i3-1215U',
      'RAM': '8GB DDR4-3200',
      'Storage': '512GB SSD M.2 NVMe',
      'Display': '15.6" FHD Anti-Glare',
      'OS': 'Windows 11 Home + MS Office 2021'
    },
    dealScoreBreakdown: {
      priceAdvantage: 96,
      historicalPrice: 94,
      offerQuality: 93,
      sellerReliability: 97,
      delivery: 95,
      transparency: 96,
      overallScore: 94,
      verdict: 'Superb Genuine Deal'
    },
    priceHistory: [
      { date: '60d ago', price: 42990 },
      { date: '30d ago', price: 37990 },
      { date: '15d ago', price: 34990 },
      { date: 'Today', price: 32990, event: 'Amazon Deal of the Day' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 96,
      reason: 'At ₹32,990 (40% OFF ₹54,990), this is the lowest recorded price for a 12th Gen Intel Core i3 laptop with 512GB SSD.',
      expectedLow: 32990
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'MRP of ₹54,990 certified. Sold directly by Amazon verified seller with full brand warranty.',
      lowestPriceEver: 32990,
      highestPriceEver: 54990
    },
    marketplacePrices: [
      {
        sellerName: 'Amazon',
        isSmartDealsSeller: false,
        price: 32990,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow, by 2 PM',
        couponText: '₹500 Instant Bank Discount',
        couponDiscount: 500,
        finalPrice: 32990,
        smartCoins: 330,
        dealScore: 94,
        inStock: true,
        rating: 4.5,
        tag: 'Lowest Price',
        cashbackAmount: 330,
        discountPercent: 40,
        url: 'https://www.amazon.in/dp/B0BY8MCQ9S?tag=smartdeal-21'
      },
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 34490,
        deliveryCharge: 0,
        deliveryDate: '2-3 Days',
        couponText: '₹250 SuperCoins Bonus',
        couponDiscount: 250,
        finalPrice: 34490,
        smartCoins: 280,
        dealScore: 88,
        inStock: true,
        rating: 4.4,
        cashbackAmount: 280,
        discountPercent: 37,
        url: 'https://www.flipkart.com/search?q=Lenovo+IdeaPad+Slim+3+i3+12th+Gen'
      },
      {
        sellerName: 'Meesho',
        isSmartDealsSeller: false,
        price: 35290,
        deliveryCharge: 0,
        deliveryDate: '4-5 Days',
        finalPrice: 35290,
        smartCoins: 200,
        dealScore: 84,
        inStock: true,
        rating: 4.2,
        cashbackAmount: 200,
        discountPercent: 36,
        url: 'https://www.meesho.com/search?q=Lenovo+IdeaPad+Slim+3'
      },
      {
        sellerName: 'Croma',
        isSmartDealsSeller: false,
        price: 35990,
        deliveryCharge: 0,
        deliveryDate: '1-2 Days',
        finalPrice: 35990,
        smartCoins: 250,
        dealScore: 82,
        inStock: true,
        rating: 4.6,
        cashbackAmount: 250,
        discountPercent: 35,
        url: 'https://www.croma.com/search/?text=Lenovo+IdeaPad+Slim+3'
      },
      {
        sellerName: 'Reliance Digital',
        isSmartDealsSeller: false,
        price: 36499,
        deliveryCharge: 0,
        deliveryDate: '2 Days',
        finalPrice: 36499,
        smartCoins: 240,
        dealScore: 80,
        inStock: true,
        rating: 4.3,
        cashbackAmount: 240,
        discountPercent: 34,
        url: 'https://www.reliancedigital.in/search?q=Lenovo%20IdeaPad%20Slim%203'
      }
    ]
  },
  {
    id: 'prod-boat-rockerz-450',
    name: 'boAt Rockerz 450 (Bluetooth On-Ear Headphones, 15H Playtime, 40mm Dynamic Drivers, Luscious Black)',
    brand: 'boAt',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 4999,
    sellingPrice: 1499,
    discountPercent: 70,
    rating: 4.5,
    reviewsCount: 38450,
    seller: 'SuperComNet (Meesho Verified)',
    sellerRating: 4.6,
    deliveryDate: 'Tomorrow, by 5 PM',
    deliveryCharge: 0,
    smartCoinsEarned: 50,
    dealScore: 96,
    isSmartDealsChoice: true,
    stock: 120,
    returnDays: 7,
    warranty: '1 Year Manufacturer Replacement Warranty',
    description: 'boAt Rockerz 450 Bluetooth On-Ear Headphones provide immersive HD sound with 40mm drivers, plush adaptive earcups, up to 15 hours playback, and integrated controls.',
    features: [
      '40mm Dynamic Drivers for punchy boAt Signature Sound',
      'Up to 15 Hours of Nonstop Playback on a Single Charge',
      'Dual Mode: Bluetooth v5.0 Wireless or 3.5mm Aux Wired Cable',
      'Adaptive and Comfortable Memory Foam Ear Cushions'
    ],
    specs: {
      'Driver Size': '40mm',
      'Battery Life': 'Up to 15 Hours',
      'Connectivity': 'Bluetooth v5.0 / 3.5mm AUX',
      'Microphone': 'Built-in In-line Mic',
      'Charging Time': '2 Hours'
    },
    dealScoreBreakdown: {
      priceAdvantage: 99,
      historicalPrice: 96,
      offerQuality: 95,
      sellerReliability: 96,
      delivery: 94,
      transparency: 98,
      overallScore: 96,
      verdict: 'Superb Genuine Deal'
    },
    priceHistory: [
      { date: '60d ago', price: 2999 },
      { date: '30d ago', price: 1999 },
      { date: 'Today', price: 1499, event: 'Mega Flash Sale' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 98,
      reason: 'At ₹1,499 (70% OFF ₹4,999), this matches the lowest recorded price on Meesho & Amazon with verified free delivery.',
      expectedLow: 1499
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'Official boAt retail pricing verified. 100% original product guarantee.',
      lowestPriceEver: 1499,
      highestPriceEver: 4999
    },
    marketplacePrices: [
      {
        sellerName: 'Meesho',
        isSmartDealsSeller: false,
        price: 1499,
        deliveryCharge: 0,
        deliveryDate: '2-3 Days',
        finalPrice: 1499,
        smartCoins: 50,
        dealScore: 96,
        inStock: true,
        rating: 4.5,
        tag: 'Lowest Price',
        cashbackAmount: 50,
        discountPercent: 70,
        url: 'https://www.meesho.com/boat-rockerz-450-bluetooth-headphones/p/291823?ref=smartdeal'
      },
      {
        sellerName: 'Amazon',
        isSmartDealsSeller: false,
        price: 1599,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow, by 5 PM',
        finalPrice: 1599,
        smartCoins: 40,
        dealScore: 90,
        inStock: true,
        rating: 4.4,
        cashbackAmount: 40,
        discountPercent: 68,
        url: 'https://www.amazon.in/dp/B07PR1CL3S?tag=smartdeal-21'
      },
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 1699,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        finalPrice: 1699,
        smartCoins: 35,
        dealScore: 88,
        inStock: true,
        rating: 4.3,
        cashbackAmount: 35,
        discountPercent: 66,
        url: 'https://www.flipkart.com/search?q=boAt+Rockerz+450'
      },
      {
        sellerName: 'Myntra',
        isSmartDealsSeller: false,
        price: 1799,
        deliveryCharge: 0,
        deliveryDate: '3-4 Days',
        finalPrice: 1799,
        smartCoins: 30,
        dealScore: 82,
        inStock: true,
        rating: 4.2,
        cashbackAmount: 30,
        discountPercent: 64,
        url: 'https://www.myntra.com/headphones/boat/boat-rockerz-450/11827490/buy'
      }
    ]
  },
  {
    id: 'prod-fire-boltt-ninja',
    name: 'Fire-Boltt Ninja (Bluetooth Calling Smartwatch, 1.3" Touch Screen, SpO2, IP68)',
    brand: 'Fire-Boltt',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 4999,
    sellingPrice: 1999,
    discountPercent: 60,
    rating: 4.4,
    reviewsCount: 18500,
    seller: 'RetailNet (Flipkart Verified)',
    sellerRating: 4.6,
    deliveryDate: 'Tomorrow, by 11 AM',
    deliveryCharge: 0,
    smartCoinsEarned: 60,
    dealScore: 94,
    isSmartDealsChoice: true,
    stock: 95,
    returnDays: 7,
    warranty: '1 Year Manufacturer Warranty',
    description: 'Fire-Boltt Ninja features a sharp 1.3-inch full-touch display, Bluetooth calling, comprehensive SpO2 and 24/7 heart-rate tracking, and multi-sport tracking modes.',
    features: [
      '1.3" HD Color Full Touch Display with vibrant watch faces',
      'Single-chip Bluetooth calling with dial pad and recent logs',
      'Real-time SpO2, heart rate, and sleep monitoring',
      'IP68 water resistant build for daily workouts'
    ],
    specs: {
      'Display': '1.3" HD Touch Display',
      'Battery Life': 'Up to 5 Days',
      'Water Resistance': 'IP68 Water Resistant',
      'Color': 'Active Black',
      'Bluetooth': 'v5.0'
    },
    dealScoreBreakdown: {
      priceAdvantage: 96,
      historicalPrice: 94,
      offerQuality: 95,
      sellerReliability: 96,
      delivery: 95,
      transparency: 97,
      overallScore: 94,
      verdict: 'Superb Genuine Deal'
    },
    priceHistory: [
      { date: '60d ago', price: 2999 },
      { date: '30d ago', price: 2499 },
      { date: 'Today', price: 1999, event: 'Mega Flash Sale' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 96,
      reason: 'At ₹1,999 (60% OFF ₹4,999), this is ₹1,000 below regular street pricing with verified seller assurance.',
      expectedLow: 1999
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'Official Fire-Boltt retail MRP verified. 100% original product guarantee.',
      lowestPriceEver: 1999,
      highestPriceEver: 4999
    },
    marketplacePrices: [
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 1999,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow, by 11 AM',
        finalPrice: 1999,
        smartCoins: 60,
        dealScore: 94,
        inStock: true,
        rating: 4.4,
        tag: 'Lowest Price',
        cashbackAmount: 60,
        discountPercent: 60,
        url: 'https://www.flipkart.com/search?q=Fire-Boltt+Ninja'
      },
      {
        sellerName: 'Amazon',
        isSmartDealsSeller: false,
        price: 2199,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        finalPrice: 2199,
        smartCoins: 50,
        dealScore: 90,
        inStock: true,
        rating: 4.3,
        cashbackAmount: 50,
        discountPercent: 56,
        url: 'https://www.amazon.in/dp/B09F7XWCCY'
      },
      {
        sellerName: 'Croma',
        isSmartDealsSeller: false,
        price: 2499,
        deliveryCharge: 0,
        deliveryDate: '2 Days',
        finalPrice: 2499,
        smartCoins: 40,
        dealScore: 84,
        inStock: true,
        rating: 4.2,
        cashbackAmount: 40,
        discountPercent: 50,
        url: 'https://www.croma.com/search/?text=Fire-Boltt+Ninja'
      }
    ]
  },
  {
    id: 'prod-campus-shoes',
    name: 'Campus Shoes (Men\'s Running Shoes, Lightweight Breathable Mesh Sneakers, Blue/Grey)',
    brand: 'Campus',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 1999,
    sellingPrice: 999,
    discountPercent: 50,
    rating: 4.3,
    reviewsCount: 9400,
    seller: 'Campus Activewear Official',
    sellerRating: 4.7,
    deliveryDate: 'Tomorrow, by 2 PM',
    deliveryCharge: 0,
    smartCoinsEarned: 30,
    dealScore: 92,
    isSmartDealsChoice: true,
    stock: 80,
    returnDays: 14,
    warranty: 'Brand Warranty for Manufacturing Defects',
    description: 'Campus Men\'s Running Shoes offer responsive lightweight cushioning, breathable flyknit mesh upper, anti-skid rubber phylon outsole for running, gym and daily lifestyle.',
    features: [
      'High-grade breathable knitted mesh upper for superior ventilation',
      'Cushioned memory tech foam insole for all-day arch support',
      'Durable non-slip rubber phylon sole for maximum grip',
      'Ultra lightweight construction designed for sports and fitness'
    ],
    specs: {
      'Sole Material': 'Phylon / Anti-Skid Rubber',
      'Upper Material': 'Breathable Mesh',
      'Closure': 'Lace-Up',
      'Color': 'Grey / Navy Blue'
    },
    dealScoreBreakdown: {
      priceAdvantage: 95,
      historicalPrice: 92,
      offerQuality: 93,
      sellerReliability: 96,
      delivery: 94,
      transparency: 97,
      overallScore: 92,
      verdict: 'Superb Genuine Deal'
    },
    priceHistory: [
      { date: '60d ago', price: 1499 },
      { date: '30d ago', price: 1299 },
      { date: 'Today', price: 999, event: 'Deal of the Day' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 94,
      reason: 'At ₹999 (50% OFF ₹1,999), this is an exceptional value for money running shoe from Campus.',
      expectedLow: 999
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'Certified Campus Activewear MSRP ₹1,999. Current selling price of ₹999 is 100% genuine.',
      lowestPriceEver: 999,
      highestPriceEver: 1999
    },
    marketplacePrices: [
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 999,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow, by 2 PM',
        finalPrice: 999,
        smartCoins: 30,
        dealScore: 92,
        inStock: true,
        rating: 4.3,
        tag: 'Lowest Price',
        cashbackAmount: 30,
        discountPercent: 50,
        url: 'https://www.flipkart.com/search?q=Campus+Shoes'
      },
      {
        sellerName: 'Amazon',
        isSmartDealsSeller: false,
        price: 1199,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        finalPrice: 1199,
        smartCoins: 25,
        dealScore: 88,
        inStock: true,
        rating: 4.2,
        cashbackAmount: 25,
        discountPercent: 40,
        url: 'https://www.amazon.in/dp/B08X9CAMPUS'
      },
      {
        sellerName: 'Myntra',
        isSmartDealsSeller: false,
        price: 1299,
        deliveryCharge: 0,
        deliveryDate: '2-3 Days',
        finalPrice: 1299,
        smartCoins: 20,
        dealScore: 85,
        inStock: true,
        rating: 4.3,
        cashbackAmount: 20,
        discountPercent: 35,
        url: 'https://www.myntra.com/campus-shoes'
      }
    ]
  },
  {
    id: 'prod-nike-court-vision',
    name: 'Nike Court Vision Low (Triple White Retro Sneaker for Men)',
    brand: 'Nike',
    category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 5995,
    sellingPrice: 4499,
    discountPercent: 25,
    rating: 4.6,
    reviewsCount: 14200,
    seller: 'Nike Official Store (Myntra)',
    sellerRating: 4.9,
    deliveryDate: 'Tomorrow, by 1 PM',
    deliveryCharge: 0,
    smartCoinsEarned: 120,
    dealScore: 93,
    isSmartDealsChoice: true,
    stock: 60,
    returnDays: 14,
    warranty: '6 Months Brand Manufacturing Guarantee',
    description: 'In love with the classic look of 80s basketball? Meet the Nike Court Vision Low. Its crisp leather upper and stitched overlays are inspired by the hook shot of old-school basketball.',
    features: [
      'Crisp Real & Synthetic Leather Upper with Perforations for Breathability',
      'Vulcanized Construction Fuses Outsole to Midsole for Streamlined Look',
      'Padded Low-cut Collar Looks Sleek and Feels Comfortable All Day',
      'Solid Rubber Cupsole Provides Traction and Durability'
    ],
    specs: {
      'Sole Material': 'Durable Rubber Cupsole',
      'Upper Material': 'Leather & Synthetic',
      'Closure': 'Lace-Up',
      'Color': 'Triple White',
      'Gender': 'Men'
    },
    dealScoreBreakdown: {
      priceAdvantage: 95,
      historicalPrice: 93,
      offerQuality: 94,
      sellerReliability: 99,
      delivery: 96,
      transparency: 97,
      overallScore: 93,
      verdict: 'Superb Genuine Deal'
    },
    priceHistory: [
      { date: '60d ago', price: 5995 },
      { date: '30d ago', price: 4999 },
      { date: 'Today', price: 4499, event: 'End of Season Sale' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 94,
      reason: 'At ₹4,499 (25% OFF ₹5,995), this is the verified best price on Myntra with 100% authenticity guarantee.',
      expectedLow: 4499
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'Official Nike India MRP of ₹5,995 verified with official brand barcode.',
      lowestPriceEver: 4499,
      highestPriceEver: 5995
    },
    marketplacePrices: [
      {
        sellerName: 'Myntra',
        isSmartDealsSeller: false,
        price: 4499,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow, by 1 PM',
        finalPrice: 4499,
        smartCoins: 120,
        dealScore: 93,
        inStock: true,
        rating: 4.6,
        tag: 'Lowest Price',
        cashbackAmount: 120,
        discountPercent: 25,
        url: 'https://www.myntra.com/sports-shoes/nike/nike-men-court-vision-low-sneakers/11829302/buy'
      },
      {
        sellerName: 'AJIO',
        isSmartDealsSeller: false,
        price: 4699,
        deliveryCharge: 0,
        deliveryDate: '2-3 Days',
        finalPrice: 4699,
        smartCoins: 100,
        dealScore: 89,
        inStock: true,
        rating: 4.5,
        cashbackAmount: 100,
        discountPercent: 22,
        url: 'https://www.ajio.com/nike-court-vision-low-sneakers/p/461298491_white'
      },
      {
        sellerName: 'Amazon',
        isSmartDealsSeller: false,
        price: 4899,
        deliveryCharge: 0,
        deliveryDate: '2 Days',
        finalPrice: 4899,
        smartCoins: 90,
        dealScore: 86,
        inStock: true,
        rating: 4.4,
        cashbackAmount: 90,
        discountPercent: 18,
        url: 'https://www.amazon.in/dp/B07V28SFFG?tag=smartdeal-21'
      },
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 4999,
        deliveryCharge: 0,
        deliveryDate: '3-4 Days',
        finalPrice: 4999,
        smartCoins: 80,
        dealScore: 84,
        inStock: true,
        rating: 4.4,
        cashbackAmount: 80,
        discountPercent: 17,
        url: 'https://www.flipkart.com/search?q=Nike+Court+Vision+Low'
      }
    ]
  },
  {
    id: 'prod-noise-colorfit-pro5',
    name: 'Noise ColorFit Pro 5 (1.85" AMOLED Display, BT Calling, SOS, Rapid Health Suite, Jet Black)',
    brand: 'Noise',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 7999,
    sellingPrice: 2999,
    discountPercent: 63,
    rating: 4.4,
    reviewsCount: 18200,
    seller: 'Noise Direct Retail (Flipkart)',
    sellerRating: 4.8,
    deliveryDate: 'Tomorrow, by 12 PM',
    deliveryCharge: 0,
    smartCoinsEarned: 80,
    dealScore: 95,
    isSmartDealsChoice: true,
    stock: 80,
    returnDays: 7,
    warranty: '1 Year Manufacturer Warranty',
    description: 'Noise ColorFit Pro 5 features a vivid 1.85-inch AMOLED display with 600 nits brightness, functional rotating crown, TruSync Bluetooth calling, and 100+ cloud watch faces.',
    features: [
      '1.85" AMOLED Display with 600 Nits Brightness & Always-On Feature',
      'Single-chip BT Calling powered by TruSync for Crystal Clear Calls',
      'Noise Health Suite: 24/7 Heart Rate, SpO2, Sleep Monitor & Stress Level',
      'Functional Stainless Steel Rotating Digital Crown for Smooth Navigation'
    ],
    specs: {
      'Display': '1.85" AMOLED (390x450 px)',
      'Battery': 'Up to 7 Days (300 mAh)',
      'Water Resistance': 'IP68 Waterproof',
      'Bluetooth': 'v5.3 with TruSync',
      'Strap Material': 'Soft Silicone (22mm quick release)'
    },
    dealScoreBreakdown: {
      priceAdvantage: 98,
      historicalPrice: 95,
      offerQuality: 94,
      sellerReliability: 97,
      delivery: 96,
      transparency: 98,
      overallScore: 95,
      verdict: 'Superb Genuine Deal'
    },
    priceHistory: [
      { date: '60d ago', price: 4499 },
      { date: '30d ago', price: 3499 },
      { date: 'Today', price: 2999, event: 'Super Festive Price' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 97,
      reason: 'At ₹2,999 (63% OFF ₹7,999), this is the lowest price ever recorded for an AMOLED smartwatch with Bluetooth calling.',
      expectedLow: 2999
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'Official retail price of ₹7,999 certified by Noise India.',
      lowestPriceEver: 2999,
      highestPriceEver: 7999
    },
    marketplacePrices: [
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 2999,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow, by 12 PM',
        finalPrice: 2999,
        smartCoins: 80,
        dealScore: 95,
        inStock: true,
        rating: 4.5,
        tag: 'Lowest Price',
        cashbackAmount: 80,
        discountPercent: 63,
        url: 'https://www.flipkart.com/noise-colorfit-pro-5-smartwatch/p/itm782910382910?ref=smartdeal'
      },
      {
        sellerName: 'Amazon',
        isSmartDealsSeller: false,
        price: 3199,
        deliveryCharge: 0,
        deliveryDate: 'Tomorrow',
        finalPrice: 3199,
        smartCoins: 70,
        dealScore: 90,
        inStock: true,
        rating: 4.4,
        cashbackAmount: 70,
        discountPercent: 60,
        url: 'https://www.amazon.in/dp/B0CKW7XN88?tag=smartdeal-21'
      },
      {
        sellerName: 'Meesho',
        isSmartDealsSeller: false,
        price: 3299,
        deliveryCharge: 0,
        deliveryDate: '3-4 Days',
        finalPrice: 3299,
        smartCoins: 60,
        dealScore: 86,
        inStock: true,
        rating: 4.2,
        cashbackAmount: 60,
        discountPercent: 59,
        url: 'https://www.meesho.com/search?q=Noise+ColorFit+Pro+5'
      },
      {
        sellerName: 'Croma',
        isSmartDealsSeller: false,
        price: 3499,
        deliveryCharge: 0,
        deliveryDate: '2 Days',
        finalPrice: 3499,
        smartCoins: 50,
        dealScore: 82,
        inStock: true,
        rating: 4.4,
        cashbackAmount: 50,
        discountPercent: 56,
        url: 'https://www.croma.com/search/?text=Noise+ColorFit+Pro+5'
      }
    ]
  },
  {
    id: 'prod-samsung-refrigerator-253l',
    name: 'Samsung 253L 3-Star Inverter Double Door Refrigerator (Elegant Inox, Digital Display, Convertible)',
    brand: 'Samsung',
    category: 'Appliances',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop&q=80'
    ],
    mrp: 30990,
    sellingPrice: 22490,
    discountPercent: 27,
    rating: 4.5,
    reviewsCount: 7850,
    seller: 'Croma Retail Official (SmartDeals Partner)',
    sellerRating: 4.8,
    deliveryDate: 'Day after tomorrow, by 11 AM',
    deliveryCharge: 0,
    smartCoinsEarned: 450,
    dealScore: 94,
    isSmartDealsChoice: true,
    stock: 25,
    returnDays: 10,
    warranty: '1 Year Comprehensive + 20 Years on Digital Inverter Compressor',
    description: 'Samsung 253 Litre 3-Star Double Door Refrigerator with Digital Inverter Technology automatically adjusts its speed in response to cooling demand, operating quieter and using up to 50% less power.',
    features: [
      'Digital Inverter Compressor with 20-Year Compressor Warranty',
      'All-Around Cooling System cools the fridge evenly from corner to corner',
      'Toughened Glass Shelves safely hold heavy pots up to 175 kg',
      'Deodorizer with Activated Carbon Filter eliminates strong odors'
    ],
    specs: {
      'Capacity': '253 Litres (Fresh Food: 184L, Freezer: 69L)',
      'Energy Rating': '3 Star (Annual Consumption: 193 kWh)',
      'Defrost System': 'Frost Free',
      'Color': 'Elegant Inox Metallic',
      'Compressor': 'Digital Inverter Compressor'
    },
    dealScoreBreakdown: {
      priceAdvantage: 96,
      historicalPrice: 94,
      offerQuality: 93,
      sellerReliability: 98,
      delivery: 95,
      transparency: 97,
      overallScore: 94,
      verdict: 'Superb Genuine Deal'
    },
    priceHistory: [
      { date: '60d ago', price: 28990 },
      { date: '30d ago', price: 25490 },
      { date: 'Today', price: 22490, event: 'Croma Festive Best Match' }
    ],
    buyNowRecommendation: {
      action: 'BUY NOW',
      confidence: 96,
      reason: 'At ₹22,490 (27% OFF ₹30,990), this is the verified best price at Croma Retail with 20-year compressor warranty.',
      expectedLow: 22490
    },
    fakeDiscountAudit: {
      isGenuine: true,
      status: 'Genuine Deal',
      reason: 'Official Samsung India MRP of ₹30,990 verified. Standard brand installation included.',
      lowestPriceEver: 22490,
      highestPriceEver: 30990
    },
    marketplacePrices: [
      {
        sellerName: 'Croma',
        isSmartDealsSeller: false,
        price: 22490,
        deliveryCharge: 0,
        deliveryDate: '2 Days (Free Installation)',
        finalPrice: 22490,
        smartCoins: 450,
        dealScore: 94,
        inStock: true,
        rating: 4.6,
        tag: 'Lowest Price',
        cashbackAmount: 450,
        discountPercent: 27,
        url: 'https://www.croma.com/samsung-253-litres-3-star-double-door-refrigerator/p/247192?ref=smartdeal'
      },
      {
        sellerName: 'Amazon',
        isSmartDealsSeller: false,
        price: 23490,
        deliveryCharge: 0,
        deliveryDate: '3-4 Days',
        finalPrice: 23490,
        smartCoins: 350,
        dealScore: 89,
        inStock: true,
        rating: 4.5,
        cashbackAmount: 350,
        discountPercent: 24,
        url: 'https://www.amazon.in/dp/B08345R1B8?tag=smartdeal-21'
      },
      {
        sellerName: 'Flipkart',
        isSmartDealsSeller: false,
        price: 23990,
        deliveryCharge: 0,
        deliveryDate: '3-5 Days',
        finalPrice: 23990,
        smartCoins: 320,
        dealScore: 87,
        inStock: true,
        rating: 4.4,
        cashbackAmount: 320,
        discountPercent: 23,
        url: 'https://www.flipkart.com/search?q=Samsung+253L+Refrigerator'
      },
      {
        sellerName: 'Reliance Digital',
        isSmartDealsSeller: false,
        price: 24490,
        deliveryCharge: 0,
        deliveryDate: '2-3 Days',
        finalPrice: 24490,
        smartCoins: 300,
        dealScore: 83,
        inStock: true,
        rating: 4.3,
        cashbackAmount: 300,
        discountPercent: 21,
        url: 'https://www.reliancedigital.in/search?q=Samsung%20253L'
      }
    ]
  }
];

export const mockCategories = [
  { id: 'Mobiles', name: 'Mobiles', icon: 'Smartphone', count: 1420 },
  { id: 'Laptops', name: 'Laptops', icon: 'Laptop', count: 680 },
  { id: 'Electronics', name: 'Electronics & Audio', icon: 'Headphones', count: 2350 },
  { id: 'Fashion', name: 'Fashion & Footwear', icon: 'Shirt', count: 5400 },
  { id: 'Home & Kitchen', name: 'Home & Kitchen', icon: 'Home', count: 3100 },
  { id: 'Beauty', name: 'Beauty & Grooming', icon: 'Sparkles', count: 1800 },
  { id: 'Appliances', name: 'Large Appliances', icon: 'Tv', count: 920 },
  { id: 'Sports', name: 'Sports & Fitness', icon: 'Dumbbell', count: 760 },
  { id: 'Toys', name: 'Toys & Gaming', icon: 'Gamepad2', count: 640 },
  { id: 'Grocery', name: 'Supermarket & Grocery', icon: 'ShoppingBag', count: 4200 },
  { id: 'Automotive', name: 'Car & Bike Accessories', icon: 'Car', count: 510 },
  { id: 'Books', name: 'Books & Media', icon: 'BookOpen', count: 3200 }
];

export const initialCommissionSlabs: CommissionSlab[] = [
  {
    minAmount: 0,
    maxAmount: 10000,
    tierName: 'Standard Starter Tier',
    commissionRate: 12,
    discountPercent: 0,
    description: 'Fixed commission for products up to ₹10,000. Eligible for the 10-sales 0% commission incentive!'
  },
  {
    minAmount: 10001,
    maxAmount: 50000,
    tierName: 'Growth Volume Tier',
    commissionRate: 9,
    discountPercent: 25,
    description: '25% discount off standard commission for mid-range products.'
  },
  {
    minAmount: 50001,
    maxAmount: 100000,
    tierName: 'Scale Volume Tier',
    commissionRate: 6.5,
    discountPercent: 45,
    description: 'Higher discount for electronics and premium goods.'
  },
  {
    minAmount: 100001,
    maxAmount: 500000,
    tierName: 'High Seller Benefit Tier',
    commissionRate: 4.5,
    discountPercent: 62,
    description: 'Exceptional seller rate for high ticket electronics and appliances.'
  },
  {
    minAmount: 500001,
    maxAmount: Infinity,
    tierName: 'Enterprise VIP Tier',
    commissionRate: 3.0,
    discountPercent: 75,
    description: 'Lowest platform commission tier for high volume sellers.'
  }
];
