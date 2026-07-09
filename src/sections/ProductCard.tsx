import { useState } from 'react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/data';
import { productImageUrl } from '@/lib/placeholders';
import { Eye, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onProductClick: (slug: string) => void;
  onQuickView: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
}

export function ProductCard({ product, onProductClick, onQuickView, onQuickAdd }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const primaryImage = product.product_images.find(i => i.is_primary) || product.product_images[0];
  const hasSale = product.sale_price !== null && product.sale_price < product.base_price;
  const saveAmount = hasSale ? product.base_price - (product.sale_price || 0) : 0;

  return (
    <div
      className="group relative bg-white border border-[#0A0A0A]/10 overflow-hidden transition-all duration-300 hover:translate-y-[-6px] hover:shadow-[4px_4px_0px_rgba(10,10,10,0.18)]"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F0E8]">
        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#F5F0E8] animate-pulse" />
        )}
        <button
          onClick={() => onProductClick(product.slug)}
          className="w-full h-full"
        >
          <img
            src={productImageUrl(primaryImage?.url, product.title)}
            alt={primaryImage?.alt_text || product.title}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </button>

        {/* Sale Badge */}
        {hasSale && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 text-white text-[11px] uppercase tracking-wider font-bold"
            style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace", transform: 'rotate(-3deg)' }}
          >
            Sale
          </span>
        )}

        {/* Best Seller Badge */}
        {product.best_seller && !hasSale && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 text-[#0A0A0A] text-[11px] uppercase tracking-wider font-bold"
            style={{ backgroundColor: '#D4A843', fontFamily: "'Space Mono', monospace" }}
          >
            Best Seller
          </span>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            className="flex-1 py-2.5 bg-[#0A0A0A]/85 backdrop-blur-sm text-white text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#0A0A0A] transition-colors"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            <Eye size={13} />
            Quick View
          </button>
          {onQuickAdd && (
            <button
              onClick={(e) => { e.stopPropagation(); onQuickAdd(product); }}
              className="px-3 py-2.5 bg-[#C41E3A] text-white hover:bg-[#a31830] transition-colors"
              aria-label="Quick add to cart"
            >
              <ShoppingBag size={14} />
            </button>
          )}
        </div>

        {/* Made to Order mini badge */}
        {product.made_to_order && (
          <span
            className="absolute top-3 right-3 px-2 py-0.5 bg-white/90 text-[9px] uppercase tracking-wider text-[#1B7A7A] border border-[#1B7A7A]/30"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Made to Order
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5 lg:p-4">
        <button
          onClick={() => onProductClick(product.slug)}
          className="text-left w-full group/title"
        >
          <h3
            className="text-[13px] lg:text-sm font-medium text-[#0A0A0A] line-clamp-2 mb-1.5 group-hover/title:text-[#C41E3A] transition-colors leading-snug"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {product.title}
          </h3>
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          {hasSale ? (
            <>
              <span className="text-[13px] text-[#64748B] line-through" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {formatPrice(product.base_price)}
              </span>
              <span className="text-sm font-bold" style={{ color: '#C41E3A', fontFamily: "'DM Sans', sans-serif" }}>
                {formatPrice(product.sale_price!)}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 bg-[#C41E3A]/10" style={{ color: '#C41E3A', fontFamily: "'Space Mono', monospace" }}>
                Save {formatPrice(saveAmount)}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-[#0A0A0A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {formatPrice(product.base_price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
