#!/usr/bin/env tsx
/**
 * Seed Madcap Tees catalog into Supabase.
 * Requires: VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in env/.env.local
 *
 * Usage: npm run seed
 */

import { createClient } from '@supabase/supabase-js';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const p = resolve(process.cwd(), file);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq === -1) continue;
      const k = t.slice(0, eq).trim();
      let v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!(k in process.env)) process.env[k] = v;
    }
  }
}

loadEnv();

const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Need VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const PRODUCTS = [
  {
    title: 'Mad As Hell Tee',
    slug: 'mad-as-hell-tee',
    description:
      'Mad as hell and twice as funny. Our flagship design featuring a vintage jester graphic that screams Mad Magazine energy. Printed on premium soft cotton. Unisex fit.',
    base_price: 25,
    sale_price: null as number | null,
    category: 'tees',
    tags: ['jester', 'mad-magazine', 'funny', 'flagship', 'vintage'],
    themes: ['satirical', 'best-sellers'],
    published: true,
    featured: true,
    best_seller: true,
    asset: 'src/assets/product-mad-as-hell.jpg',
    colors: ['Black', 'White'],
  },
  {
    title: 'Bennies Go Home Tee',
    slug: 'bennies-go-home-tee',
    description:
      'For the locals who know. Jersey Shore pride meets vintage beach badge aesthetic. If you have to ask what a Bennie is, this shirt might not be for you.',
    base_price: 25,
    sale_price: 22,
    category: 'tees',
    tags: ['jersey-shore', 'bennies', 'beach', 'local', 'nj'],
    themes: ['nj-flavor', 'best-sellers'],
    published: true,
    featured: false,
    best_seller: true,
    asset: 'src/assets/product-bennies.jpg',
    colors: ['White', 'Teal'],
  },
  {
    title: 'Doom Scroll Champion Hoodie',
    slug: 'doom-scroll-champion-hoodie',
    description:
      'The official uniform of the chronically online. Pixelated retro gaming font meets skeleton-hand-phone realness.',
    base_price: 48,
    sale_price: 42,
    category: 'hoodies',
    tags: ['gaming', 'retro', 'skeleton', 'phone', 'internet'],
    themes: ['retro', 'satirical'],
    published: true,
    featured: true,
    best_seller: false,
    asset: 'src/assets/product-doom-scroll.jpg',
    colors: ['Black'],
  },
  {
    title: 'Exit 82 No Regrets Tee',
    slug: 'exit-82-no-regrets-tee',
    description:
      'Garden State Parkway vibes. Exit 82 — where the shore begins and the regrets end. Vintage highway sign graphic for the true Jersey heads.',
    base_price: 25,
    sale_price: null,
    category: 'tees',
    tags: ['gsp', 'highway', 'exit-82', 'jersey', 'driving'],
    themes: ['nj-flavor'],
    published: true,
    featured: false,
    best_seller: false,
    asset: 'src/assets/product-exit-82.jpg',
    colors: ['Heather Grey', 'Navy'],
  },
  {
    title: 'Pork Roll Supremacy Tee',
    slug: 'pork-roll-supremacy-tee',
    description:
      'It is pork roll. Fight us. The definitive New Jersey breakfast meat statement piece.',
    base_price: 25,
    sale_price: 20,
    category: 'tees',
    tags: ['pork-roll', 'taylor-ham', 'breakfast', 'nj', 'food'],
    themes: ['nj-flavor', 'best-sellers'],
    published: true,
    featured: false,
    best_seller: true,
    asset: 'src/assets/collection-nj.jpg',
    colors: ['White', 'Red'],
  },
  {
    title: 'Conspiracy Theories & Chill Tee',
    slug: 'conspiracy-theories-chill-tee',
    description:
      'Grab your tinfoil hat and settle in. UFOs, government secrets, and whatever they are hiding in Area 51.',
    base_price: 25,
    sale_price: null,
    category: 'tees',
    tags: ['ufo', 'conspiracy', 'tinfoil-hat', 'alien', 'funny'],
    themes: ['satirical'],
    published: true,
    featured: true,
    best_seller: false,
    asset: 'src/assets/collection-satirical.jpg',
    colors: ['Black', 'White'],
  },
  {
    title: 'Radical Retro Tee',
    slug: 'radical-retro-tee',
    description:
      'Totally rad chrome 3D lettering meets vintage skateboard graphics. Pure 80s/90s nostalgia in wearable form.',
    base_price: 28,
    sale_price: 24,
    category: 'tees',
    tags: ['80s', '90s', 'skateboard', 'chrome', 'nostalgia'],
    themes: ['retro'],
    published: true,
    featured: false,
    best_seller: false,
    asset: 'src/assets/collection-retro.jpg',
    colors: ['Black'],
  },
  {
    title: 'I Woke Up Like This Tee',
    slug: 'woke-up-like-this-tee',
    description:
      'Hilary the cat knows the struggle is real. Crown, sunglasses, and absolutely zero patience.',
    base_price: 25,
    sale_price: null,
    category: 'tees',
    tags: ['cat', 'funny', 'morning', 'attitude', 'meme'],
    themes: ['satirical'],
    published: true,
    featured: false,
    best_seller: false,
    asset: 'src/assets/collection-new-arrivals.jpg',
    colors: ['White', 'Heather Grey'],
  },
];

const SIZES = ['S', 'M', 'L', 'XL'];

async function uploadImage(slug: string, assetPath: string): Promise<string | null> {
  const full = resolve(process.cwd(), assetPath);
  if (!existsSync(full)) {
    console.warn(`  missing asset ${assetPath}`);
    return null;
  }
  const buf = readFileSync(full);
  const ext = assetPath.split('.').pop() || 'jpg';
  const path = `${slug}/primary.${ext}`;
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, buf, { contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`, upsert: true });
  if (error) {
    console.warn(`  upload failed: ${error.message}`);
    return null;
  }
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}

async function main() {
  console.log('Seeding Madcap Tees catalog…\n');

  // Ensure DEMO10 discount
  await supabase.from('discount_codes').upsert(
    {
      code: 'DEMO10',
      percent_off: 10,
      amount_off: null,
      active: true,
      max_uses: null,
      used_count: 0,
      expires_at: null,
    },
    { onConflict: 'code' }
  );

  for (const p of PRODUCTS) {
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', p.slug)
      .maybeSingle();

    let productId = existing?.id as string | undefined;

    if (!productId) {
      const { data, error } = await supabase
        .from('products')
        .insert({
          title: p.title,
          slug: p.slug,
          description: p.description,
          base_price: p.base_price,
          sale_price: p.sale_price,
          category: p.category,
          tags: p.tags,
          themes: p.themes,
          published: p.published,
          featured: p.featured,
          best_seller: p.best_seller,
          made_to_order: true,
        })
        .select('id')
        .single();
      if (error || !data) {
        console.error(`FAIL ${p.slug}:`, error?.message);
        continue;
      }
      productId = data.id;
    } else {
      await supabase
        .from('products')
        .update({
          title: p.title,
          description: p.description,
          base_price: p.base_price,
          sale_price: p.sale_price,
          published: true,
          featured: p.featured,
          best_seller: p.best_seller,
        })
        .eq('id', productId);
    }

    const imageUrl = await uploadImage(p.slug, p.asset);
    if (imageUrl) {
      await supabase.from('product_images').delete().eq('product_id', productId);
      await supabase.from('product_images').insert({
        product_id: productId,
        url: imageUrl,
        alt_text: p.title,
        is_primary: true,
        sort_order: 0,
      });
    }

    await supabase.from('product_variants').delete().eq('product_id', productId);
    const variants = [];
    for (const color of p.colors) {
      for (const size of SIZES) {
        variants.push({
          product_id: productId,
          size,
          color,
          sku: `${p.slug.slice(0, 8)}-${color.slice(0, 3)}-${size}`.toUpperCase(),
          price_adjustment: size === 'XL' ? 0 : 0,
          stock: null,
          available: true,
        });
      }
    }
    await supabase.from('product_variants').insert(variants);
    console.log(`✓ ${p.slug}`);
  }

  console.log('\nSeed complete.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
