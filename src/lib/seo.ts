import { useEffect } from 'react';
import type { Product } from '@/types';

const SITE_NAME = 'Madcap Tees';
const DEFAULT_DESCRIPTION =
  'Original satirical graphic apparel. Shop tees, hoodies & more. Free shipping on orders $125+.';

function siteUrl(): string {
  return import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://madcaptees.com');
}

function setMeta(name: string, content: string, property = false) {
  const attr = property ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = url;
}

function setJsonLd(id: string, data: Record<string, unknown> | null) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!data) return;

  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export function productJsonLd(product: Product): Record<string, unknown> {
  const image = product.product_images[0]?.url;
  const price = product.sale_price ?? product.base_price;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description ?? product.title,
    image: image ? [image] : undefined,
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl()}/products/${product.slug}`,
    },
  };
}

export interface PageSeoOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  jsonLd?: Record<string, unknown> | null;
  noIndex?: boolean;
}

export function applyPageSeo(options: PageSeoOptions) {
  const title = options.title ? `${options.title} | ${SITE_NAME}` : `${SITE_NAME} — Mad as Hell & Twice as Funny`;
  const description = options.description ?? DEFAULT_DESCRIPTION;
  const url = `${siteUrl()}${options.path ?? '/'}`;
  const image = options.image ?? `${siteUrl()}/og-image.jpg`;

  document.title = title;
  setMeta('description', description);
  setMeta('og:title', title, true);
  setMeta('og:description', description, true);
  setMeta('og:url', url, true);
  setMeta('og:image', image, true);
  setMeta('og:type', options.path?.startsWith('/products/') ? 'product' : 'website', true);
  setMeta('twitter:card', 'summary_large_image', true);
  setMeta('twitter:title', title, true);
  setMeta('twitter:description', description, true);
  setMeta('twitter:image', image, true);
  setMeta('robots', options.noIndex ? 'noindex, nofollow' : 'index, follow');
  setCanonical(url);
  setJsonLd('page-json-ld', options.jsonLd ?? null);
}

export function usePageSeo(options: PageSeoOptions) {
  useEffect(() => {
    applyPageSeo(options);
  }, [options.title, options.description, options.path, options.image, options.noIndex]);
}
