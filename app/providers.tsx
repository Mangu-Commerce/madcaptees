'use client';

import { CatalogProvider } from '@/contexts/CatalogContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <CatalogProvider>{children}</CatalogProvider>;
}
