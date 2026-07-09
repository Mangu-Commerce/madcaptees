import type { AppView } from '@/types';

export function viewToPath(view: AppView, slug?: string): string {
  switch (view) {
    case 'home':
      return '/';
    case 'shop':
      return '/shop';
    case 'product':
      return `/products/${slug ?? ''}`;
    case 'cart':
      return '/cart';
    case 'checkout':
      return '/checkout';
    case 'admin-dashboard':
    case 'admin-products':
    case 'admin-orders':
    case 'admin-product-form':
      return '/admin';
    default:
      return '/';
  }
}

export function getViewFromPath(pathname: string): { view: AppView; slug: string } {
  if (pathname.startsWith('/admin')) {
    return { view: 'admin-dashboard', slug: '' };
  }
  if (pathname.startsWith('/products/')) {
    return {
      view: 'product',
      slug: decodeURIComponent(pathname.replace('/products/', '')),
    };
  }
  if (pathname === '/shop') return { view: 'shop', slug: '' };
  if (pathname === '/cart') return { view: 'cart', slug: '' };
  if (pathname === '/checkout') return { view: 'checkout', slug: '' };
  return { view: 'home', slug: '' };
}
