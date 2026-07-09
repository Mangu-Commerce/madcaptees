import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCatalog } from '@/contexts/CatalogContext';
import { ProductCard } from './ProductCard';
import type { Product, AppView, FilterState } from '@/types';

interface BestSellersProps {
  onProductClick: (slug: string) => void;
  onQuickView: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
  onNavigate: (view: AppView) => void;
  onFilterChange: (filter: Partial<FilterState>) => void;
}

export function BestSellers({ onProductClick, onQuickView, onQuickAdd, onNavigate, onFilterChange }: BestSellersProps) {
  const { getBestSellers } = useCatalog();
  const products = getBestSellers();
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('best-sellers-scroll');
    if (!container) return;
    const scrollAmount = 300;
    const newPosition = direction === 'left'
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-2xl lg:text-3xl text-[#0A0A0A]"
          style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.05em' }}
        >
          BEST SELLING APPAREL
        </h2>
        <button
          onClick={() => { onFilterChange({ theme: 'best-sellers' }); onNavigate('shop'); }}
          className="hidden sm:block px-4 py-2 border border-[#0A0A0A] text-xs uppercase tracking-wider text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          View All
        </button>
      </div>

      <div className="relative">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white border border-[#0A0A0A]/15 shadow-sm hover:shadow-md transition-shadow"
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white border border-[#0A0A0A]/15 shadow-sm hover:shadow-md transition-shadow"
          aria-label="Scroll right"
        >
          <ChevronRight size={18} />
        </button>

        {/* Products Scroll */}
        <div
          id="best-sellers-scroll"
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[260px] sm:w-[280px]">
              <ProductCard
                product={product}
                onProductClick={onProductClick}
                onQuickView={onQuickView}
                onQuickAdd={onQuickAdd}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
