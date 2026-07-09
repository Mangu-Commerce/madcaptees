import { useCatalog } from '@/contexts/CatalogContext';
import { ProductCard } from './ProductCard';
import type { Product, AppView, FilterState } from '@/types';

interface NewArrivalsProps {
  onProductClick: (slug: string) => void;
  onQuickView: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
  onNavigate: (view: AppView) => void;
  onFilterChange: (filter: Partial<FilterState>) => void;
}

export function NewArrivals({ onProductClick, onQuickView, onQuickAdd, onNavigate, onFilterChange }: NewArrivalsProps) {
  const { getNewArrivals } = useCatalog();
  const products = getNewArrivals();

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-2xl lg:text-3xl text-[#0A0A0A]"
          style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.05em' }}
        >
          NEW ARRIVALS
        </h2>
        <button
          onClick={() => { onFilterChange({ sort: 'newest' }); onNavigate('shop'); }}
          className="hidden sm:block px-4 py-2 border border-[#0A0A0A] text-xs uppercase tracking-wider text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
            onQuickView={onQuickView}
            onQuickAdd={onQuickAdd}
          />
        ))}
      </div>
    </section>
  );
}
