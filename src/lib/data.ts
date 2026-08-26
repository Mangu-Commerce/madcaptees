// ============================================
// Madcap Tees — Seeded Product Data
// ============================================

import type { Product, Collection, OrderStatus } from '@/types';

import hero1 from '@/assets/hero-1.jpg';
import hero2 from '@/assets/hero-2.jpg';
import collectionBestSellers from '@/assets/collection-best-sellers.jpg';
import collectionNewArrivals from '@/assets/collection-new-arrivals.jpg';
import collectionNJ from '@/assets/collection-nj.jpg';
import collectionSatirical from '@/assets/collection-satirical.jpg';
import collectionRetro from '@/assets/collection-retro.jpg';
import productMadAsHell from '@/assets/product-mad-as-hell.jpg';
import productBennies from '@/assets/product-bennies.jpg';
import productDoomScroll from '@/assets/product-doom-scroll.jpg';
import productExit82 from '@/assets/product-exit-82.jpg';

export const HERO_SLIDES = [
  {
    id: '1',
    image: hero1.src,
    title: 'MAD AS HELL',
    subtitle: '& TWICE AS FUNNY',
    cta: 'SHOP NOW',
    link: '#shop',
  },
  {
    id: '2',
    image: hero2.src,
    title: 'NEW ARRIVALS',
    subtitle: 'FRESH DROPS WEEKLY',
    cta: 'SHOP NEW',
    link: '#shop',
  },
  {
    id: '3',
    image: collectionBestSellers.src,
    title: 'BEST SELLERS',
    subtitle: 'THE ONES EVERYONE LOVES',
    cta: 'SHOP BEST',
    link: '#shop',
  },
];

export const COLLECTIONS: Collection[] = [
  {
    id: '1',
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'Fresh drops, trending designs, and brand-new takes on pop culture.',
    image_url: collectionNewArrivals.src,
  },
  {
    id: '2',
    name: 'Best Sellers',
    slug: 'best-sellers',
    description: 'The most-loved graphic tees, hoodies, and hats that fans keep coming back to.',
    image_url: collectionBestSellers.src,
  },
  {
    id: '3',
    name: 'NJ Flavor',
    slug: 'nj-flavor',
    description: 'Garden State pride, pork roll supremacy, and shore-town humor.',
    image_url: collectionNJ.src,
  },
  {
    id: '4',
    name: 'Satirical',
    slug: 'satirical',
    description: 'Mad Magazine-style humor, conspiracy theories, and social commentary.',
    image_url: collectionSatirical.src,
  },
  {
    id: '5',
    name: 'Retro',
    slug: 'retro',
    description: '80s/90s nostalgia, chrome typography, and vintage gaming vibes.',
    image_url: collectionRetro.src,
  },
];

export const SEEDED_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Mad As Hell Tee',
    slug: 'mad-as-hell-tee',
    description: 'Mad as hell and twice as funny. Our flagship design featuring a vintage jester graphic that screams Mad Magazine energy. Printed on premium soft cotton. Unisex fit.',
    base_price: 25.00,
    sale_price: null,
    category: 'tees',
    tags: ['jester', 'mad-magazine', 'funny', 'angry', 'vintage'],
    themes: ['satirical', 'best-sellers'],
    published: true,
    featured: true,
    best_seller: true,
    made_to_order: true,
    created_at: '2026-05-01T00:00:00Z',
    updated_at: '2026-05-01T00:00:00Z',
    product_images: [
      { id: 'img-1-1', product_id: 'prod-1', url: productMadAsHell.src, alt_text: 'Mad As Hell Tee - Black with jester graphic', is_primary: true, sort_order: 0 },
    ],
    product_variants: [
      { id: 'var-1-1', product_id: 'prod-1', size: 'S', color: 'Black', sku: 'MAH-BLK-S', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-1-2', product_id: 'prod-1', size: 'M', color: 'Black', sku: 'MAH-BLK-M', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-1-3', product_id: 'prod-1', size: 'L', color: 'Black', sku: 'MAH-BLK-L', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-1-4', product_id: 'prod-1', size: 'XL', color: 'Black', sku: 'MAH-BLK-XL', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-1-5', product_id: 'prod-1', size: '2XL', color: 'Black', sku: 'MAH-BLK-2X', pod_variant_id: null, price_adjustment: 2, stock: null, available: true },
      { id: 'var-1-6', product_id: 'prod-1', size: 'S', color: 'White', sku: 'MAH-WHT-S', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-1-7', product_id: 'prod-1', size: 'M', color: 'White', sku: 'MAH-WHT-M', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-1-8', product_id: 'prod-1', size: 'L', color: 'White', sku: 'MAH-WHT-L', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
    ],
  },
  {
    id: 'prod-2',
    title: 'Bennies Go Home Tee',
    slug: 'bennies-go-home-tee',
    description: 'For the locals who know. Jersey Shore pride meets vintage beach badge aesthetic. If you have to ask what a Bennie is, this shirt might not be for you.',
    base_price: 25.00,
    sale_price: 22.00,
    category: 'tees',
    tags: ['jersey-shore', 'bennies', 'beach', 'local', 'nj'],
    themes: ['nj-flavor', 'best-sellers'],
    published: true,
    featured: false,
    best_seller: true,
    made_to_order: true,
    created_at: '2026-05-05T00:00:00Z',
    updated_at: '2026-05-05T00:00:00Z',
    product_images: [
      { id: 'img-2-1', product_id: 'prod-2', url: productBennies.src, alt_text: 'Bennies Go Home Tee - White with surf graphic', is_primary: true, sort_order: 0 },
    ],
    product_variants: [
      { id: 'var-2-1', product_id: 'prod-2', size: 'S', color: 'White', sku: 'BGH-WHT-S', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-2-2', product_id: 'prod-2', size: 'M', color: 'White', sku: 'BGH-WHT-M', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-2-3', product_id: 'prod-2', size: 'L', color: 'White', sku: 'BGH-WHT-L', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-2-4', product_id: 'prod-2', size: 'XL', color: 'White', sku: 'BGH-WHT-XL', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-2-5', product_id: 'prod-2', size: 'M', color: 'Teal', sku: 'BGH-TL-M', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-2-6', product_id: 'prod-2', size: 'L', color: 'Teal', sku: 'BGH-TL-L', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
    ],
  },
  {
    id: 'prod-3',
    title: 'Doom Scroll Champion Hoodie',
    slug: 'doom-scroll-champion-hoodie',
    description: 'The official uniform of the chronically online. Pixelated retro gaming font meets skeleton-hand-phone realness. For when you have just one more scroll left in you.',
    base_price: 48.00,
    sale_price: 42.00,
    category: 'hoodies',
    tags: ['gaming', 'retro', 'skeleton', 'phone', 'internet'],
    themes: ['retro', 'satirical'],
    published: true,
    featured: true,
    best_seller: false,
    made_to_order: true,
    created_at: '2026-05-10T00:00:00Z',
    updated_at: '2026-05-10T00:00:00Z',
    product_images: [
      { id: 'img-3-1', product_id: 'prod-3', url: productDoomScroll.src, alt_text: 'Doom Scroll Champion Hoodie - Black with pixel art graphic', is_primary: true, sort_order: 0 },
    ],
    product_variants: [
      { id: 'var-3-1', product_id: 'prod-3', size: 'S', color: 'Black', sku: 'DSC-BLK-S', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-3-2', product_id: 'prod-3', size: 'M', color: 'Black', sku: 'DSC-BLK-M', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-3-3', product_id: 'prod-3', size: 'L', color: 'Black', sku: 'DSC-BLK-L', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-3-4', product_id: 'prod-3', size: 'XL', color: 'Black', sku: 'DSC-BLK-XL', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-3-5', product_id: 'prod-3', size: '2XL', color: 'Black', sku: 'DSC-BLK-2X', pod_variant_id: null, price_adjustment: 3, stock: null, available: true },
    ],
  },
  {
    id: 'prod-4',
    title: 'Exit 82 No Regrets Tee',
    slug: 'exit-82-no-regrets-tee',
    description: 'Garden State Parkway vibes. Exit 82 — where the shore begins and the regrets end. Vintage highway sign graphic for the true Jersey heads.',
    base_price: 25.00,
    sale_price: null,
    category: 'tees',
    tags: ['gsp', 'highway', 'exit-82', 'jersey', 'driving'],
    themes: ['nj-flavor'],
    published: true,
    featured: false,
    best_seller: false,
    made_to_order: true,
    created_at: '2026-05-12T00:00:00Z',
    updated_at: '2026-05-12T00:00:00Z',
    product_images: [
      { id: 'img-4-1', product_id: 'prod-4', url: productExit82.src, alt_text: 'Exit 82 No Regrets Tee - Heather grey with highway sign', is_primary: true, sort_order: 0 },
    ],
    product_variants: [
      { id: 'var-4-1', product_id: 'prod-4', size: 'S', color: 'Heather Grey', sku: 'E82-HG-S', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-4-2', product_id: 'prod-4', size: 'M', color: 'Heather Grey', sku: 'E82-HG-M', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-4-3', product_id: 'prod-4', size: 'L', color: 'Heather Grey', sku: 'E82-HG-L', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-4-4', product_id: 'prod-4', size: 'XL', color: 'Heather Grey', sku: 'E82-HG-XL', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-4-5', product_id: 'prod-4', size: 'M', color: 'Navy', sku: 'E82-NV-M', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
    ],
  },
  {
    id: 'prod-5',
    title: 'Pork Roll Supremacy Tee',
    slug: 'pork-roll-supremacy-tee',
    description: 'It is pork roll. Fight us. The definitive New Jersey breakfast meat statement piece. For those who know that Taylor Ham is just a brand name.',
    base_price: 25.00,
    sale_price: 20.00,
    category: 'tees',
    tags: ['pork-roll', 'taylor-ham', 'breakfast', 'nj', 'food'],
    themes: ['nj-flavor', 'best-sellers'],
    published: true,
    featured: false,
    best_seller: true,
    made_to_order: true,
    created_at: '2026-05-15T00:00:00Z',
    updated_at: '2026-05-15T00:00:00Z',
    product_images: [
      { id: 'img-5-1', product_id: 'prod-5', url: collectionNJ.src, alt_text: 'Pork Roll Supremacy Tee - NJ diner themed', is_primary: true, sort_order: 0 },
    ],
    product_variants: [
      { id: 'var-5-1', product_id: 'prod-5', size: 'S', color: 'White', sku: 'PRS-WHT-S', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-5-2', product_id: 'prod-5', size: 'M', color: 'White', sku: 'PRS-WHT-M', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-5-3', product_id: 'prod-5', size: 'L', color: 'White', sku: 'PRS-WHT-L', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-5-4', product_id: 'prod-5', size: 'XL', color: 'White', sku: 'PRS-WHT-XL', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-5-5', product_id: 'prod-5', size: 'S', color: 'Red', sku: 'PRS-RED-S', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
    ],
  },
  {
    id: 'prod-6',
    title: 'Conspiracy Theories & Chill Tee',
    slug: 'conspiracy-theories-chill-tee',
    description: 'Grab your tinfoil hat and settle in. UFOs, government secrets, and whatever they are hiding in Area 51 — we have a shirt for that. Satirical and suspicious.',
    base_price: 25.00,
    sale_price: null,
    category: 'tees',
    tags: ['ufo', 'conspiracy', 'tinfoil-hat', 'alien', 'funny'],
    themes: ['satirical'],
    published: true,
    featured: true,
    best_seller: false,
    made_to_order: true,
    created_at: '2026-05-18T00:00:00Z',
    updated_at: '2026-05-18T00:00:00Z',
    product_images: [
      { id: 'img-6-1', product_id: 'prod-6', url: collectionSatirical.src, alt_text: 'Conspiracy Theories and Chill Tee - UFO graphic', is_primary: true, sort_order: 0 },
    ],
    product_variants: [
      { id: 'var-6-1', product_id: 'prod-6', size: 'M', color: 'Black', sku: 'CTC-BLK-M', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-6-2', product_id: 'prod-6', size: 'L', color: 'Black', sku: 'CTC-BLK-L', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-6-3', product_id: 'prod-6', size: 'XL', color: 'Black', sku: 'CTC-BLK-XL', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-6-4', product_id: 'prod-6', size: 'M', color: 'White', sku: 'CTC-WHT-M', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
    ],
  },
  {
    id: 'prod-7',
    title: 'Radical Retro Tee',
    slug: 'radical-retro-tee',
    description: 'Totally rad chrome 3D lettering meets vintage skateboard graphics. Like, gag me with a spoon — this shirt is the most! Pure 80s/90s nostalgia in wearable form.',
    base_price: 28.00,
    sale_price: 24.00,
    category: 'tees',
    tags: ['80s', '90s', 'skateboard', 'chrome', 'nostalgia'],
    themes: ['retro'],
    published: true,
    featured: false,
    best_seller: false,
    made_to_order: true,
    created_at: '2026-05-20T00:00:00Z',
    updated_at: '2026-05-20T00:00:00Z',
    product_images: [
      { id: 'img-7-1', product_id: 'prod-7', url: collectionRetro.src, alt_text: 'Radical Retro Tee - Chrome 3D lettering with skateboard', is_primary: true, sort_order: 0 },
    ],
    product_variants: [
      { id: 'var-7-1', product_id: 'prod-7', size: 'S', color: 'Black', sku: 'RAD-BLK-S', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-7-2', product_id: 'prod-7', size: 'M', color: 'Black', sku: 'RAD-BLK-M', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-7-3', product_id: 'prod-7', size: 'L', color: 'Black', sku: 'RAD-BLK-L', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-7-4', product_id: 'prod-7', size: 'XL', color: 'Black', sku: 'RAD-BLK-XL', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
    ],
  },
  {
    id: 'prod-8',
    title: 'I Woke Up Like This Tee',
    slug: 'woke-up-like-this-tee',
    description: 'Hilary the cat knows the struggle is real. Crown, sunglasses, and absolutely zero patience. For everyone who woke up on the wrong side of everything.',
    base_price: 25.00,
    sale_price: null,
    category: 'tees',
    tags: ['cat', 'funny', 'morning', 'attitude', 'meme'],
    themes: ['satirical'],
    published: true,
    featured: false,
    best_seller: false,
    made_to_order: true,
    created_at: '2026-05-22T00:00:00Z',
    updated_at: '2026-05-22T00:00:00Z',
    product_images: [
      { id: 'img-8-1', product_id: 'prod-8', url: collectionNewArrivals.src, alt_text: 'I Woke Up Like This Tee - Cat with crown and sunglasses', is_primary: true, sort_order: 0 },
    ],
    product_variants: [
      { id: 'var-8-1', product_id: 'prod-8', size: 'S', color: 'White', sku: 'WUL-WHT-S', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-8-2', product_id: 'prod-8', size: 'M', color: 'White', sku: 'WUL-WHT-M', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-8-3', product_id: 'prod-8', size: 'L', color: 'White', sku: 'WUL-WHT-L', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
      { id: 'var-8-4', product_id: 'prod-8', size: 'M', color: 'Heather Grey', sku: 'WUL-HG-M', pod_variant_id: null, price_adjustment: 0, stock: null, available: true },
    ],
  },
];

export const SEEDED_ORDERS = [
  {
    id: 'ord-1',
    user_id: null,
    stripe_session_id: 'cs_test_123',
    total_amount: 50.99,
    subtotal: 44.00,
    shipping_cost: 6.99,
    status: 'paid' as const,
    email: 'customer@example.com',
    shipping_address: { name: 'John Doe', line1: '123 Main St', city: 'Asbury Park', state: 'NJ', zip: '07712', country: 'US' },
    created_at: '2026-06-01T10:30:00Z',
    updated_at: '2026-06-01T10:30:00Z',
    order_items: [
      { id: 'oi-1', order_id: 'ord-1', product_variant_id: 'var-1-2', title_at_time: 'Mad As Hell Tee', size_at_time: 'M', color_at_time: 'Black', quantity: 1, unit_price: 25.00, total_price: 25.00 },
      { id: 'oi-2', order_id: 'ord-1', product_variant_id: 'var-2-2', title_at_time: 'Bennies Go Home Tee', size_at_time: 'M', color_at_time: 'White', quantity: 1, unit_price: 22.00, total_price: 22.00 },
    ],
  },
  {
    id: 'ord-2',
    user_id: null,
    stripe_session_id: 'cs_test_456',
    total_amount: 48.99,
    subtotal: 42.00,
    shipping_cost: 6.99,
    status: 'shipped' as const,
    email: 'jane@example.com',
    shipping_address: { name: 'Jane Smith', line1: '456 Ocean Ave', city: 'Belmar', state: 'NJ', zip: '07719', country: 'US' },
    created_at: '2026-06-02T14:15:00Z',
    updated_at: '2026-06-03T09:00:00Z',
    order_items: [
      { id: 'oi-3', order_id: 'ord-2', product_variant_id: 'var-3-2', title_at_time: 'Doom Scroll Champion Hoodie', size_at_time: 'M', color_at_time: 'Black', quantity: 1, unit_price: 42.00, total_price: 42.00 },
    ],
  },
];

let productsStore: Product[] = [...SEEDED_PRODUCTS];
let ordersStore: any[] = [...SEEDED_ORDERS];

export function getProducts(): Product[] {
  return [...productsStore];
}

export function getProductBySlug(slug: string): Product | undefined {
  return productsStore.find(p => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return productsStore.find(p => p.id === id);
}

export function addProduct(product: Product): void {
  productsStore = [product, ...productsStore];
}

export function updateProduct(updated: Product): void {
  productsStore = productsStore.map(p => p.id === updated.id ? updated : p);
}

export function deleteProduct(id: string): void {
  productsStore = productsStore.filter(p => p.id !== id);
}

export function togglePublish(id: string): Product | undefined {
  const product = productsStore.find(p => p.id === id);
  if (product) {
    product.published = !product.published;
    updateProduct(product);
  }
  return product;
}

export function getPublishedProducts(): Product[] {
  return productsStore.filter(p => p.published);
}

export function getFeaturedProducts(): Product[] {
  return productsStore.filter(p => p.published && (p.featured || p.best_seller));
}

export function getBestSellers(): Product[] {
  return productsStore.filter(p => p.published && p.best_seller);
}

export function getNewArrivals(): Product[] {
  return productsStore
    .filter(p => p.published)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);
}

export function getOrders() {
  return [...ordersStore];
}

export function addOrder(order: typeof SEEDED_ORDERS[0]) {
  ordersStore = [order, ...ordersStore];
}

export function updateOrderStatus(id: string, status: string) {
  ordersStore = ordersStore.map(o => o.id === id ? { ...o, status: status as OrderStatus } : o);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function calculateCartSubtotal(items: import('@/types').CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
}

export function calculateShipping(subtotal: number): number {
  return subtotal >= 125 ? 0 : 6.99;
}
