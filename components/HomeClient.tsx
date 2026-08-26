'use client';

import { StoreShell } from './StoreShell';
import { Hero } from '@/sections/Hero';
import { CollectionCards } from '@/sections/CollectionCards';
import { BestSellers } from '@/sections/BestSellers';
import { NewArrivals } from '@/sections/NewArrivals';

export function HomeClient() {
  return (
    <StoreShell>
      {({ onProductClick, onQuickView, onQuickAdd, onNavigate, onFilterChange }) => (
        <>
          <Hero onNavigate={onNavigate} onFilterChange={onFilterChange} />
          <div id="shop-section">
            <CollectionCards onNavigate={onNavigate} onFilterChange={onFilterChange} />
          </div>
          <BestSellers
            onProductClick={onProductClick}
            onQuickView={onQuickView}
            onQuickAdd={onQuickAdd}
            onNavigate={onNavigate}
            onFilterChange={onFilterChange}
          />
          <NewArrivals
            onProductClick={onProductClick}
            onQuickView={onQuickView}
            onQuickAdd={onQuickAdd}
            onNavigate={onNavigate}
            onFilterChange={onFilterChange}
          />
        </>
      )}
    </StoreShell>
  );
}
