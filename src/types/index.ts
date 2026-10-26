// ============================================
// Madcap Tees — TypeScript Type Definitions
// ============================================

/**
 * What an image shows:
 * - `design`: the artwork on its own (square shop-grid block)
 * - `model`:  a person wearing the tee (leads the product page gallery)
 * - `flat`:   the garment mockup on its own (default for existing images)
 */
export type ImageType = 'design' | 'model' | 'flat';

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
  image_type?: ImageType;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  sku: string | null;
  pod_variant_id: string | null;
  price_adjustment: number;
  stock: number | null;
  available: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  base_price: number;
  sale_price: number | null;
  category: 'tees' | 'hoodies' | 'longsleeve' | 'hats' | 'stickers';
  tags: string[];
  themes: string[];
  published: boolean;
  featured: boolean;
  best_seller: boolean;
  made_to_order: boolean;
  created_at: string;
  updated_at: string;
  product_images: ProductImage[];
  product_variants: ProductVariant[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  product_count?: number;
}

export interface CartItem {
  product_variant_id: string;
  product_id: string;
  title: string;
  slug: string;
  image_url: string;
  size: string;
  color: string;
  unit_price: number;
  quantity: number;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_variant_id: string;
  title_at_time: string;
  size_at_time: string;
  color_at_time: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  user_id: string | null;
  stripe_session_id: string | null;
  total_amount: number;
  subtotal: number;
  shipping_cost: number;
  status: OrderStatus;
  email: string;
  shipping_address: ShippingAddress;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  profile: Profile | null;
}

export type SortOption = 'featured' | 'best-selling' | 'price-low' | 'price-high' | 'newest' | 'oldest';

export type CategoryFilter = 'all' | 'tees' | 'hoodies' | 'longsleeve' | 'hats' | 'stickers';

export type ThemeFilter = 'all' | 'nj-flavor' | 'satirical' | 'retro' | 'band-merch' | 'best-sellers';

export type AppView = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'admin-dashboard' | 'admin-products' | 'admin-orders' | 'admin-product-form';

export interface FilterState {
  category: CategoryFilter;
  theme: ThemeFilter;
  search: string;
  sort: SortOption;
  priceMin: number | null;
  priceMax: number | null;
  size: string | null;
  color: string | null;
}

export const PRODUCT_COLORS = [
  { name: 'Black', hex: '#0A0A0A' },
  { name: 'White', hex: '#F8F8F8' },
  { name: 'Heather Grey', hex: '#9CA3AF' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Red', hex: '#C41E3A' },
  { name: 'Teal', hex: '#1B7A7A' },
] as const;

export const IMAGE_TYPES: { value: ImageType; label: string }[] = [
  { value: 'design', label: 'Design art (shop grid block)' },
  { value: 'model', label: 'Model wearing it (product page)' },
  { value: 'flat', label: 'Flat mockup' },
];

export const PRODUCT_SIZES =['S', 'M', 'L', 'XL', '2XL', '3XL', 'OS'] as const;

export const PRODUCT_CATEGORIES = [
  { value: 'tees', label: 'T-Shirts', icon: 'shirt' },
  { value: 'hoodies', label: 'Hoodies', icon: 'hoodie' },
  { value: 'longsleeve', label: 'Long Sleeve', icon: 'sleeve' },
  { value: 'hats', label: 'Hats', icon: 'hat' },
  { value: 'stickers', label: 'Stickers', icon: 'sticker' },
] as const;

export const THEMES = [
  { value: 'nj-flavor', label: 'NJ Flavor' },
  { value: 'satirical', label: 'Satirical' },
  { value: 'retro', label: 'Retro' },
  { value: 'band-merch', label: 'Band Merch' },
  { value: 'best-sellers', label: 'Best Sellers' },
] as const;

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'price-low', label: 'Price, Low to High' },
  { value: 'price-high', label: 'Price, High to Low' },
  { value: 'newest', label: 'Date, New to Old' },
  { value: 'oldest', label: 'Date, Old to New' },
];

export const FREE_SHIPPING_THRESHOLD = 125;

export const FLAT_SHIPPING_RATE = 6.99;
