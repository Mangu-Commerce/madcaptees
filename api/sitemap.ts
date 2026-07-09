import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const SEED_SLUGS = [
  'mad-as-hell-tee',
  'bennies-go-home-tee',
  'doom-scroll-champion-hoodie',
  'exit-82-no-regrets-tee',
  'pork-roll-supremacy-tee',
  'conspiracy-theories-chill-tee',
  'radical-retro-tee',
  'i-woke-up-like-this-tee',
];

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const siteUrl =
    process.env.VITE_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://madcaptees.com';

  let slugs = SEED_SLUGS;

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey) {
    try {
      const supabase = createClient(supabaseUrl, serviceKey);
      const { data } = await supabase
        .from('products')
        .select('slug')
        .eq('published', true);
      if (data && data.length > 0) {
        slugs = data.map((r) => r.slug);
      }
    } catch {
      // fall back to seed slugs
    }
  }

  const urls = [
    { loc: siteUrl, priority: '1.0', changefreq: 'daily' },
    { loc: `${siteUrl}/shop`, priority: '0.9', changefreq: 'daily' },
    ...slugs.map((slug) => ({
      loc: `${siteUrl}/products/${slug}`,
      priority: '0.8',
      changefreq: 'weekly',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  return res.status(200).send(xml);
}
