# Madcap Tees — API Specification & Data Model

**Version:** 1.0 | **Date:** June 9, 2026

---

## 1. Data Model

### 1.1 Entity Relationship Diagram

```
products ||--o{ product_images : has
products ||--o{ product_variants : has
products }o--o{ product_collections : belongs_to
collections ||--o{ product_collections : contains
orders ||--o{ order_items : contains
product_variants ||--o{ order_items : ordered_as
users ||--o{ orders : places
```

### 1.2 Table Definitions

#### `products`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| title | TEXT | NOT NULL | Product name (e.g., "Mad As Hell Tee") |
| slug | TEXT | UNIQUE, NOT NULL | URL-safe: "mad-as-hell-tee" |
| description | TEXT | | Full description / humor copy |
| base_price | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Base price in USD (e.g., 25.00) |
| sale_price | DECIMAL(10,2) | NULL | Sale price if applicable |
| category | TEXT | | 'tees', 'hoodies', 'longsleeve', 'hats', 'stickers' |
| tags | TEXT[] | DEFAULT '{}' | Search keywords: {ween, mad-magazine, satirical} |
| themes | TEXT[] | DEFAULT '{}' | Navigation themes: {nj-flavor, satirical, retro, band-merch, best-sellers} |
| published | BOOLEAN | DEFAULT false | Live on storefront? |
| featured | BOOLEAN | DEFAULT false | Show in homepage hero? |
| best_seller | BOOLEAN | DEFAULT false | Show in best sellers section? |
| made_to_order | BOOLEAN | DEFAULT true | Show ~7 day production badge |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Auto-updated via trigger |

#### `product_images`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| product_id | UUID | FK → products(id), ON DELETE CASCADE | |
| url | TEXT | NOT NULL | Supabase Storage public URL |
| alt_text | TEXT | | Accessibility description |
| is_primary | BOOLEAN | DEFAULT false | First image = main display |
| sort_order | INTEGER | DEFAULT 0 | Gallery sort position |
| image_type | TEXT | NOT NULL, DEFAULT 'flat', CHECK IN ('design','model','flat') | `design` = art on its own (shop grid block), `model` = person wearing it (leads the product page), `flat` = garment mockup. Added in migration 003 |

#### `product_variants`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| product_id | UUID | FK → products(id), ON DELETE CASCADE | |
| size | TEXT | NOT NULL | 'S', 'M', 'L', 'XL', '2XL', '3XL', 'OS' |
| color | TEXT | NOT NULL | 'Black', 'White', 'Heather Grey', 'Navy', 'Red', 'Teal' |
| sku | TEXT | UNIQUE | Internal SKU |
| pod_variant_id | TEXT | | Printful/Printify variant mapping |
| price_adjustment | DECIMAL(10,2) | DEFAULT 0 | +$ for premium sizes |
| stock | INTEGER | NULL = unlimited (POD) | |
| available | BOOLEAN | DEFAULT true | |

#### `collections`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| name | TEXT | NOT NULL | e.g., "Best Sellers" |
| slug | TEXT | UNIQUE, NOT NULL | URL-safe |
| description | TEXT | | SEO copy |
| image_url | TEXT | | Collection card image |

#### `product_collections`
| Column | Type | Constraints |
|--------|------|-------------|
| product_id | UUID | FK → products(id), ON DELETE CASCADE |
| collection_id | UUID | FK → collections(id), ON DELETE CASCADE |
| | | PK(product_id, collection_id) |

#### `orders`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| user_id | UUID | FK → auth.users(id), NULLABLE | Null = guest checkout |
| stripe_session_id | TEXT | UNIQUE | Stripe Checkout Session ID |
| stripe_payment_intent_id | TEXT | | For refunds/lookup |
| total_amount | DECIMAL(10,2) | NOT NULL | Final charged amount |
| subtotal | DECIMAL(10,2) | NOT NULL | Before shipping |
| shipping_cost | DECIMAL(10,2) | DEFAULT 0 | |
| status | TEXT | DEFAULT 'pending' | pending → paid → shipped → delivered → cancelled |
| email | TEXT | NOT NULL | Customer email |
| shipping_address | JSONB | | {name, line1, line2, city, state, zip, country} |
| billing_address | JSONB | | Same structure |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

#### `order_items`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| order_id | UUID | FK → orders(id), ON DELETE CASCADE | |
| product_variant_id | UUID | FK → product_variants(id) | |
| title_at_time | TEXT | NOT NULL | Snapshot of product title |
| size_at_time | TEXT | NOT NULL | Snapshot of size |
| color_at_time | TEXT | NOT NULL | Snapshot of color |
| quantity | INTEGER | NOT NULL, CHECK > 0 | |
| unit_price | DECIMAL(10,2) | NOT NULL | Price at time of order |
| total_price | DECIMAL(10,2) | NOT NULL | unit_price * quantity |

#### `profiles` (extends auth.users)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, FK → auth.users(id) | |
| email | TEXT | | Denormalized for quick access |
| full_name | TEXT | | Display name |
| avatar_url | TEXT | | |
| is_admin | BOOLEAN | DEFAULT false | Admin flag |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

## 2. API Endpoints

### 2.1 Server Actions (Next.js App Router)

| Action | Auth | Description |
|--------|------|-------------|
| `getProducts(filters)` | Public | Returns published products with images/variants. Supports filter by category, theme, price range, search query. |
| `getProductBySlug(slug)` | Public | Returns single product with all images, variants, related products. |
| `getCollections()` | Public | Returns all collections with product counts. |
| `getFeaturedProducts()` | Public | Returns products where featured=true or best_seller=true. |
| `createProduct(data)` | Admin | Creates product, images, variants. Auto-generates slug. |
| `updateProduct(id, data)` | Admin | Updates product, upserts images/variants. |
| `deleteProduct(id)` | Admin | Soft delete (sets published=false) or hard delete. |
| `togglePublish(id)` | Admin | Flips published boolean. |
| `createOrder(sessionId)` | Service | Called by Stripe webhook. Creates order + order_items. |
| `getOrders()` | Admin | Returns all orders with items. |
| `getMyOrders()` | Authenticated | Returns orders for current user. |
| `updateOrderStatus(id, status)` | Admin | Updates order status. |
| `exportOrdersCSV()` | Admin | Returns CSV string of all orders. |

### 2.2 REST API Routes

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/api/stripe/webhook` | POST | Stripe sig | Handles checkout.session.completed |
| `/api/printful/webhook` | POST | API key | Receives fulfillment status updates |
| `/api/auth/callback` | GET | OAuth | Supabase OAuth callback handler |

### 2.3 Supabase Client Methods

```typescript
// Public reads (anon key)
supabase.from('products').select('*, product_images(*), product_variants(*)').eq('published', true)
supabase.from('collections').select('*')
supabase.storage.from('product-images').getPublicUrl(filename)

// Admin writes (service_role key)
supabase.from('products').insert({...})
supabase.from('product_images').insert([{...}, {...}])
supabase.from('product_variants').insert([{...}, {...}])
supabase.storage.from('product-images').upload(filename, file)

// Auth
supabase.auth.signInWithOAuth({ provider: 'google' })
supabase.auth.signUp({ email, password })
supabase.auth.signInWithPassword({ email, password })
supabase.auth.signOut()
```

---

## 3. TypeScript Interfaces

```typescript
interface Product {
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

interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

interface ProductVariant {
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

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  product_count?: number;
}

interface CartItem {
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

interface Order {
  id: string;
  user_id: string | null;
  stripe_session_id: string | null;
  total_amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  email: string;
  shipping_address: ShippingAddress;
  created_at: string;
  order_items: OrderItem[];
}

interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
```

---

## 4. RLS Policies (Row Level Security)

### products
```sql
-- Public can only read published products
CREATE POLICY "public_read_published"
  ON products FOR SELECT
  USING (published = true);

-- Admins can do everything
CREATE POLICY "admin_all"
  ON products FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

### product_images
```sql
-- Public can read images of published products
CREATE POLICY "public_read_published_images"
  ON product_images FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM products p 
    WHERE p.id = product_images.product_id AND p.published = true
  ));

-- Admin full access
CREATE POLICY "admin_all_images"
  ON product_images FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

### product_variants
```sql
-- Public can read variants of published products
CREATE POLICY "public_read_published_variants"
  ON product_variants FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM products p 
    WHERE p.id = product_variants.product_id AND p.published = true
  ));

-- Admin full access
CREATE POLICY "admin_all_variants"
  ON product_variants FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

### orders
```sql
-- Users can read their own orders
CREATE POLICY "owner_read_orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can read all orders
CREATE POLICY "admin_read_orders"
  ON orders FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Service role can create orders (Stripe webhook)
CREATE POLICY "service_create_orders"
  ON orders FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Admins can update order status
CREATE POLICY "admin_update_orders"
  ON orders FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');
```

### profiles
```sql
-- Users can read/update their own profile
CREATE POLICY "owner_profile"
  ON profiles FOR ALL
  USING (auth.uid() = id);

-- Public can read minimal profile data (for reviews, etc.)
CREATE POLICY "public_read_profiles"
  ON profiles FOR SELECT
  USING (true);
```
