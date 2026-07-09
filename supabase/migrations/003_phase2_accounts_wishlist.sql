-- ============================================
-- Madcap Tees — Phase 2: Accounts & Wishlist
-- Run after 001_initial_schema.sql / 002_storage_bucket.sql
-- ============================================

-- ============================================
-- WISHLISTS TABLE
-- ============================================
create table wishlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

create index idx_wishlists_user on wishlists(user_id);
create index idx_wishlists_product on wishlists(product_id);

-- ============================================
-- DISCOUNT CODES TABLE
-- ============================================
create table discount_codes (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  percent_off integer,
  amount_off decimal(10,2),
  active boolean default true,
  max_uses integer,
  used_count integer default 0,
  expires_at timestamptz
);

create index idx_discount_codes_code on discount_codes(code);
create index idx_discount_codes_active on discount_codes(active);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table wishlists enable row level security;
alter table discount_codes enable row level security;

-- Wishlists: users can CRUD their own rows
CREATE POLICY "owner_wishlist_select"
  ON wishlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "owner_wishlist_insert"
  ON wishlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "owner_wishlist_update"
  ON wishlists FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "owner_wishlist_delete"
  ON wishlists FOR DELETE
  USING (auth.uid() = user_id);

-- Discount codes: public can SELECT active codes; admin can ALL
CREATE POLICY "public_read_active_discount_codes"
  ON discount_codes FOR SELECT
  USING (active = true);

CREATE POLICY "admin_all_discount_codes"
  ON discount_codes FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true
  ));

-- Orders: allow customers to read guest orders that match their email
CREATE POLICY "owner_read_orders_by_email"
  ON orders FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

CREATE POLICY "owner_read_order_items_by_email"
  ON order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders o
    WHERE o.id = order_items.order_id
      AND auth.uid() IS NOT NULL
      AND lower(o.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  ));
