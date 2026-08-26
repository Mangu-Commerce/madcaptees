'use client';

import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { Product, CartItem } from '@/types';
import { PRODUCT_COLORS, PRODUCT_SIZES } from '@/types';
import { formatPrice } from '@/lib/data';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onProductClick: (slug: string) => void;
}

export function QuickViewModal({ product, onClose, onAddToCart, onProductClick }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const primaryImage = product.product_images.find(i => i.is_primary) || product.product_images[0];
  const hasSale = product.sale_price !== null && product.sale_price < product.base_price;
  const currentPrice = hasSale ? product.sale_price! : product.base_price;

  const availableSizes = [...new Set(product.product_variants.filter(v => v.available).map(v => v.size))];
  const availableColors = [...new Set(product.product_variants.filter(v => v.available).map(v => v.color))];

  const selectedVariant = product.product_variants.find(
    v => v.size === selectedSize && v.color === selectedColor && v.available
  );

  const canAddToCart = selectedSize && selectedColor && selectedVariant;

  const handleAddToCart = () => {
    if (!canAddToCart || !selectedVariant) return;
    const finalPrice = currentPrice + selectedVariant.price_adjustment;
    onAddToCart({
      product_variant_id: selectedVariant.id,
      product_id: product.id,
      title: product.title,
      slug: product.slug,
      image_url: primaryImage?.url || '',
      size: selectedSize,
      color: selectedColor,
      unit_price: finalPrice,
      quantity,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0A0A0A]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_rgba(10,10,10,0.2)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-[#0A0A0A] hover:bg-[#0A0A0A]/10 transition-colors"
          aria-label="Close quick view"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="aspect-[3/4] bg-[#F5F0E8]">
            <img
              src={primaryImage?.url}
              alt={primaryImage?.alt_text || product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="p-6 lg:p-8 flex flex-col">
            <button
              onClick={() => { onProductClick(product.slug); onClose(); }}
              className="text-left"
            >
              <h2
                className="text-2xl lg:text-3xl text-[#0A0A0A] mb-2 hover:opacity-70 transition-opacity"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                {product.title}
              </h2>
            </button>

            <div className="flex items-center gap-3 mb-4">
              {hasSale && (
                <>
                  <span className="text-lg text-[#64748B] line-through">{formatPrice(product.base_price)}</span>
                  <span className="text-2xl font-bold" style={{ color: '#C41E3A', fontFamily: "'DM Sans', sans-serif" }}>
                    {formatPrice(product.sale_price!)}
                  </span>
                </>
              )}
              {!hasSale && (
                <span className="text-2xl font-bold text-[#0A0A0A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {formatPrice(product.base_price)}
                </span>
              )}
            </div>

            {product.made_to_order && (
              <span
                className="inline-block w-fit px-3 py-1 text-xs uppercase tracking-wider border mb-4"
                style={{ borderColor: '#1B7A7A', color: '#1B7A7A', fontFamily: "'Space Mono', monospace" }}
              >
                Made to Order — Ships in ~7 days
              </span>
            )}

            <p className="text-sm text-[#64748B] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {PRODUCT_SIZES.map((size) => {
                  const isAvailable = availableSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`w-12 h-12 border text-sm transition-all ${
                        selectedSize === size
                          ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                          : isAvailable
                          ? 'border-[#0A0A0A]/30 text-[#0A0A0A] hover:bg-[#0A0A0A]/10'
                          : 'border-[#0A0A0A]/10 text-[#0A0A0A]/30 cursor-not-allowed line-through'
                      }`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Selector */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                Color
              </p>
              <div className="flex flex-wrap gap-2">
                {PRODUCT_COLORS.map((color) => {
                  const isAvailable = availableColors.includes(color.name);
                  return (
                    <button
                      key={color.name}
                      onClick={() => isAvailable && setSelectedColor(color.name)}
                      disabled={!isAvailable}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? 'border-[#0A0A0A] scale-110'
                          : isAvailable
                          ? 'border-transparent hover:scale-105'
                          : 'border-gray-200 opacity-30 cursor-not-allowed'
                      }`}
                      title={color.name}
                      aria-label={`Color: ${color.name}${selectedColor === color.name ? ', selected' : ''}`}
                    >
                      <span
                        className="block w-full h-full rounded-full border border-[#0A0A0A]/10"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mt-auto">
              <div className="flex items-center border border-[#0A0A0A]/30">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#0A0A0A]/5 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 h-10 flex items-center justify-center text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#0A0A0A]/5 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className={`flex-1 py-3.5 text-white text-sm uppercase tracking-wider transition-all duration-200 ${
                  canAddToCart
                    ? 'hover:translate-y-[-2px]'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
              >
                {canAddToCart ? 'Add to Cart' : 'Select Size & Color'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
