'use client';

import { StoreShell } from './StoreShell';
import { ProductDetail } from '@/sections/ProductDetail';
import { useCatalog } from '@/contexts/CatalogContext';

interface Props {
  slug: string;
}

function ProductDetailInner({ slug, onAddToCart, onNavigate }: {
  slug: string;
  onAddToCart: (item: any) => void;
  onNavigate: (view: string, slug?: string) => void;
}) {
  const catalog = useCatalog();
  const product = catalog.getProductBySlug(slug);

  if (catalog.loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
        <p className="text-[#64748B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Loading...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
        <p className="text-lg text-[#64748B] mb-6">Product not found</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-3 text-white text-sm uppercase tracking-wider"
          style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <ProductDetail product={product} onAddToCart={onAddToCart} onNavigate={onNavigate} />
  );
}

export function ProductDetailClient({ slug }: Props) {
  return (
    <StoreShell>
      {({ onAddToCart, onNavigate }) => (
        <ProductDetailInner slug={slug} onAddToCart={onAddToCart} onNavigate={onNavigate} />
      )}
    </StoreShell>
  );
}
