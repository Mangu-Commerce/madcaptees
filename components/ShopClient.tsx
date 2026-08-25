'use client';

import { StoreShell } from './StoreShell';
import { ShopPage } from '@/sections/ShopPage';

export function ShopClient() {
  return (
    <StoreShell>
      {({ filters, onProductClick, onQuickView, onQuickAdd, onFilterChange }) => (
        <ShopPage
          filters={filters}
          onFilterChange={onFilterChange}
          onProductClick={onProductClick}
          onQuickView={onQuickView}
          onQuickAdd={onQuickAdd}
        />
      )}
    </StoreShell>
  );
}
