'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Product } from '@/types';
import { useProducts } from '@/hooks/useProducts';

interface CatalogContextValue {
  products: Product[];
  publishedProducts: Product[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;
  getBestSellers: () => Product[];
  getNewArrivals: () => Product[];
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const { products, loading, error, refresh } = useProducts();

  const value = useMemo<CatalogContextValue>(() => {
    const publishedProducts = products.filter((p) => p.published);

    return {
      products,
      publishedProducts,
      loading,
      error,
      refresh,
      getProductBySlug: (slug: string) =>
        publishedProducts.find((p) => p.slug === slug),
      getBestSellers: () =>
        publishedProducts.filter((p) => p.best_seller).slice(0, 8),
      getNewArrivals: () =>
        [...publishedProducts]
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          .slice(0, 6),
    };
  }, [products, loading, error, refresh]);

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error('useCatalog must be used within CatalogProvider');
  }
  return ctx;
}
