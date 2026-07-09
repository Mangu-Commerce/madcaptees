// ============================================
// Madcap Tees — Data API Layer (Supabase)
// ============================================
//
// This module mirrors the local-data API from `data.ts` but fetches
// from Supabase. When Supabase env vars are missing it transparently
// falls back to the local seeded data so the app still works in dev.

import { supabase, hasSupabaseConfig } from './supabase';
import {
  getProducts,
  getProductBySlug as getLocalProductBySlug,
  getBestSellers as getLocalBestSellers,
  getNewArrivals as getLocalNewArrivals,
  getFeaturedProducts as getLocalFeaturedProducts,
  getOrders as getLocalOrders,
  SEEDED_PRODUCTS,
  SEEDED_ORDERS,
} from './data';
import type {
  Product,
  ProductImage,
  ProductVariant,
  Collection,
  Order,
  OrderStatus,
} from '@/types';
import type { Database } from '@/types/database';

type DbProductRow = Database['public']['Tables']['products']['Row'];
type DbProductImageRow = Database['public']['Tables']['product_images']['Row'];
type DbProductVariantRow = Database['public']['Tables']['product_variants']['Row'];
type DbOrderRow = Database['public']['Tables']['orders']['Row'];
type DbOrderItemRow = Database['public']['Tables']['order_items']['Row'];

// ------------------------------------------------------------------
// Transform helpers – Supabase returns flat joined rows that must be
// re-assembled into the nested Product shape the UI expects.
// ------------------------------------------------------------------

interface ProductJoinedRow extends DbProductRow {
  product_images?: DbProductImageRow[] | null;
  product_variants?: DbProductVariantRow[] | null;
}

function transformProduct(row: ProductJoinedRow): Product {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    base_price: row.base_price,
    sale_price: row.sale_price,
    category: row.category as Product['category'],
    tags: row.tags ?? [],
    themes: row.themes ?? [],
    published: row.published,
    featured: row.featured,
    best_seller: row.best_seller,
    made_to_order: row.made_to_order,
    created_at: row.created_at,
    updated_at: row.updated_at,
    product_images: (row.product_images ?? []).map(
      (img): ProductImage => ({
        id: img.id,
        product_id: img.product_id,
        url: img.url,
        alt_text: img.alt_text,
        is_primary: img.is_primary,
        sort_order: img.sort_order,
      })
    ),
    product_variants: (row.product_variants ?? []).map(
      (v): ProductVariant => ({
        id: v.id,
        product_id: v.product_id,
        size: v.size,
        color: v.color,
        sku: v.sku,
        pod_variant_id: v.pod_variant_id,
        price_adjustment: v.price_adjustment,
        stock: v.stock,
        available: v.available,
      })
    ),
  };
}

function transformOrder(row: DbOrderRow & { order_items?: DbOrderItemRow[] | null }): Order {
  return {
    id: row.id,
    user_id: row.user_id,
    stripe_session_id: row.stripe_session_id,
    total_amount: row.total_amount,
    subtotal: row.subtotal,
    shipping_cost: row.shipping_cost,
    status: row.status as OrderStatus,
    email: row.email,
    shipping_address: row.shipping_address as unknown as Order['shipping_address'],
    created_at: row.created_at,
    updated_at: row.updated_at,
    order_items: (row.order_items ?? []).map((item) => ({
      id: item.id,
      order_id: item.order_id,
      product_variant_id: item.product_variant_id,
      title_at_time: item.title_at_time,
      size_at_time: item.size_at_time,
      color_at_time: item.color_at_time,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    })),
  };
}

// ------------------------------------------------------------------
// Public read helpers
// ------------------------------------------------------------------

export async function fetchProducts(): Promise<Product[]> {
  if (!hasSupabaseConfig) {
    return Promise.resolve(getProducts());
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchProducts error:', error);
    throw new Error(error.message);
  }

  return (data ?? []).map(transformProduct);
}

/** Storefront catalog — published only (RLS also enforces for anon). */
export async function fetchPublishedProducts(): Promise<Product[]> {
  if (!hasSupabaseConfig) {
    return Promise.resolve(getProducts().filter((p) => p.published));
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchPublishedProducts error:', error);
    throw new Error(error.message);
  }

  return (data ?? []).map(transformProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!hasSupabaseConfig) {
    return Promise.resolve(getLocalProductBySlug(slug) ?? null);
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    console.error('fetchProductBySlug error:', error);
    throw new Error(error.message);
  }

  return data ? transformProduct(data) : null;
}

export async function fetchBestSellers(): Promise<Product[]> {
  if (!hasSupabaseConfig) {
    return Promise.resolve(getLocalBestSellers());
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .eq('published', true)
    .eq('best_seller', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchBestSellers error:', error);
    throw new Error(error.message);
  }

  return (data ?? []).map(transformProduct);
}

export async function fetchNewArrivals(): Promise<Product[]> {
  if (!hasSupabaseConfig) {
    return Promise.resolve(getLocalNewArrivals());
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('fetchNewArrivals error:', error);
    throw new Error(error.message);
  }

  return (data ?? []).map(transformProduct);
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  if (!hasSupabaseConfig) {
    return Promise.resolve(getLocalFeaturedProducts());
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .eq('published', true)
    .or('featured.eq.true,best_seller.eq.true')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchFeaturedProducts error:', error);
    throw new Error(error.message);
  }

  return (data ?? []).map(transformProduct);
}

export async function fetchCollections(): Promise<Collection[]> {
  if (!hasSupabaseConfig) {
    return Promise.resolve([
      {
        id: '1',
        name: 'New Arrivals',
        slug: 'new-arrivals',
        description: 'Fresh drops, trending designs, and brand-new takes on pop culture.',
        image_url: null,
      },
      {
        id: '2',
        name: 'Best Sellers',
        slug: 'best-sellers',
        description: 'The most-loved graphic tees, hoodies, and hats that fans keep coming back to.',
        image_url: null,
      },
      {
        id: '3',
        name: 'NJ Flavor',
        slug: 'nj-flavor',
        description: 'Garden State pride, pork roll supremacy, and shore-town humor.',
        image_url: null,
      },
      {
        id: '4',
        name: 'Satirical',
        slug: 'satirical',
        description: 'Mad Magazine-style humor, conspiracy theories, and social commentary.',
        image_url: null,
      },
      {
        id: '5',
        name: 'Retro',
        slug: 'retro',
        description: '80s/90s nostalgia, chrome typography, and vintage gaming vibes.',
        image_url: null,
      },
    ]);
  }

  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('name');

  if (error) {
    console.error('fetchCollections error:', error);
    throw new Error(error.message);
  }

  return (data ?? []).map((row): Collection => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image_url: row.image_url,
  }));
}

export async function fetchOrders(): Promise<Order[]> {
  if (!hasSupabaseConfig) {
    return Promise.resolve(getLocalOrders());
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchOrders error:', error);
    throw new Error(error.message);
  }

  return (data ?? []).map(transformOrder);
}

// ------------------------------------------------------------------
// Admin mutations
// ------------------------------------------------------------------

export type InsertProduct = Omit<
  Product,
  'id' | 'created_at' | 'updated_at' | 'product_images' | 'product_variants'
> & {
  product_images?: Pick<ProductImage, 'url' | 'alt_text' | 'is_primary' | 'sort_order'>[];
  product_variants?: Pick<ProductVariant, 'size' | 'color' | 'sku' | 'pod_variant_id' | 'price_adjustment' | 'stock' | 'available'>[];
};

export async function createProduct(product: InsertProduct): Promise<Product> {
  if (!hasSupabaseConfig) {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      title: product.title,
      slug: product.slug,
      description: product.description ?? null,
      base_price: product.base_price,
      sale_price: product.sale_price ?? null,
      category: product.category,
      tags: product.tags,
      themes: product.themes,
      published: product.published,
      featured: product.featured,
      best_seller: product.best_seller,
      made_to_order: product.made_to_order,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      product_images: (product.product_images ?? []).map((img, i) => ({
        id: `img-${Date.now()}-${i}`,
        product_id: `prod-${Date.now()}`,
        url: img.url,
        alt_text: img.alt_text ?? null,
        is_primary: img.is_primary ?? i === 0,
        sort_order: img.sort_order ?? i,
      })),
      product_variants: (product.product_variants ?? []).map((v, i) => ({
        id: `var-${Date.now()}-${i}`,
        product_id: `prod-${Date.now()}`,
        size: v.size,
        color: v.color,
        sku: v.sku ?? null,
        pod_variant_id: v.pod_variant_id ?? null,
        price_adjustment: v.price_adjustment ?? 0,
        stock: v.stock ?? null,
        available: v.available ?? true,
      })),
    };
    return Promise.resolve(newProduct);
  }

  const now = new Date().toISOString();

  // 1. Insert product row
  const { data: productRow, error: productError } = await supabase
    .from('products')
    .insert({
      title: product.title,
      slug: product.slug,
      description: product.description ?? null,
      base_price: product.base_price,
      sale_price: product.sale_price ?? null,
      category: product.category,
      tags: product.tags,
      themes: product.themes,
      published: product.published,
      featured: product.featured,
      best_seller: product.best_seller,
      made_to_order: product.made_to_order,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (productError || !productRow) {
    console.error('createProduct error:', productError);
    throw new Error(productError?.message ?? 'Failed to create product');
  }

  const productId = productRow.id;

  // 2. Insert images
  const images = (product.product_images ?? []).map((img, i) => ({
    product_id: productId,
    url: img.url,
    alt_text: img.alt_text ?? null,
    is_primary: img.is_primary ?? i === 0,
    sort_order: img.sort_order ?? i,
  }));

  if (images.length > 0) {
    const { error: imgError } = await supabase.from('product_images').insert(images);
    if (imgError) {
      console.error('createProduct images error:', imgError);
    }
  }

  // 3. Insert variants
  const variants = (product.product_variants ?? []).map((v) => ({
    product_id: productId,
    size: v.size,
    color: v.color,
    sku: v.sku ?? null,
    pod_variant_id: v.pod_variant_id ?? null,
    price_adjustment: v.price_adjustment ?? 0,
    stock: v.stock ?? null,
    available: v.available ?? true,
  }));

  if (variants.length > 0) {
    const { error: varError } = await supabase.from('product_variants').insert(variants);
    if (varError) {
      console.error('createProduct variants error:', varError);
    }
  }

  // 4. Fetch back the fully joined product
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .eq('id', productId)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to fetch created product');
  }

  return transformProduct(data);
}

export async function updateProduct(
  id: string,
  patch: Partial<Product>
): Promise<Product> {
  if (!hasSupabaseConfig) {
    // Fallback: find in seeded data and update
    const idx = SEEDED_PRODUCTS.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Product not found');
    const updated = { ...SEEDED_PRODUCTS[idx], ...patch, updated_at: new Date().toISOString() };
    SEEDED_PRODUCTS[idx] = updated;
    return Promise.resolve(updated);
  }

  const { product_images, product_variants, ...productFields } = patch;

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (productFields.title !== undefined) updateData.title = productFields.title;
  if (productFields.slug !== undefined) updateData.slug = productFields.slug;
  if (productFields.description !== undefined) updateData.description = productFields.description;
  if (productFields.base_price !== undefined) updateData.base_price = productFields.base_price;
  if (productFields.sale_price !== undefined) updateData.sale_price = productFields.sale_price;
  if (productFields.category !== undefined) updateData.category = productFields.category;
  if (productFields.tags !== undefined) updateData.tags = productFields.tags;
  if (productFields.themes !== undefined) updateData.themes = productFields.themes;
  if (productFields.published !== undefined) updateData.published = productFields.published;
  if (productFields.featured !== undefined) updateData.featured = productFields.featured;
  if (productFields.best_seller !== undefined) updateData.best_seller = productFields.best_seller;
  if (productFields.made_to_order !== undefined) updateData.made_to_order = productFields.made_to_order;

  const { error } = await supabase.from('products').update(updateData).eq('id', id);

  if (error) {
    console.error('updateProduct error:', error);
    throw new Error(error.message);
  }

  // Fetch back the fully joined product
  const { data, error: fetchError } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .eq('id', id)
    .single();

  if (fetchError || !data) {
    throw new Error(fetchError?.message ?? 'Failed to fetch updated product');
  }

  return transformProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  if (!hasSupabaseConfig) {
    const idx = SEEDED_PRODUCTS.findIndex((p) => p.id === id);
    if (idx !== -1) SEEDED_PRODUCTS.splice(idx, 1);
    return Promise.resolve();
  }

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    console.error('deleteProduct error:', error);
    throw new Error(error.message);
  }
}

export async function toggleProductPublished(
  id: string,
  published: boolean
): Promise<void> {
  if (!hasSupabaseConfig) {
    const p = SEEDED_PRODUCTS.find((pr) => pr.id === id);
    if (p) p.published = published;
    return Promise.resolve();
  }

  const { error } = await supabase
    .from('products')
    .update({ published, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('toggleProductPublished error:', error);
    throw new Error(error.message);
  }
}

const PRODUCT_IMAGES_BUCKET = 'product-images';

export async function uploadProductImage(
  file: File,
  productSlug: string
): Promise<string> {
  if (!hasSupabaseConfig) {
    return Promise.resolve(URL.createObjectURL(file));
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${productSlug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    console.error('uploadProductImage error:', uploadError);
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function replaceProductImages(
  productId: string,
  images: Pick<ProductImage, 'url' | 'alt_text' | 'is_primary' | 'sort_order'>[]
): Promise<void> {
  if (!hasSupabaseConfig) return;

  await supabase.from('product_images').delete().eq('product_id', productId);

  if (images.length === 0) return;

  const rows = images.map((img, i) => ({
    product_id: productId,
    url: img.url,
    alt_text: img.alt_text ?? null,
    is_primary: img.is_primary ?? i === 0,
    sort_order: img.sort_order ?? i,
  }));

  const { error } = await supabase.from('product_images').insert(rows);
  if (error) {
    console.error('replaceProductImages error:', error);
    throw new Error(error.message);
  }
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<void> {
  if (!hasSupabaseConfig) {
    const o = SEEDED_ORDERS.find((ord) => ord.id === id);
    if (o) (o as any).status = status;
    return Promise.resolve();
  }

  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('updateOrderStatus error:', error);
    throw new Error(error.message);
  }
}
