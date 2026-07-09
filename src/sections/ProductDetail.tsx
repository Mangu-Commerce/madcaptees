import { useState, useMemo } from 'react';
import { Plus, Minus, Truck, Clock, Share2, Heart, ChevronLeft } from 'lucide-react';
import type { Product, CartItem, AppView } from '@/types';
import { PRODUCT_COLORS, PRODUCT_SIZES, FREE_SHIPPING_THRESHOLD } from '@/types';
import { formatPrice } from '@/lib/data';
import { useCatalog } from '@/contexts/CatalogContext';
import { useWishlist } from '@/hooks/useWishlist';
import { productImageUrl } from '@/lib/placeholders';
import { ProductGallery } from '@/sections/ProductGallery';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (item: CartItem) => void;
  onNavigate: (view: AppView, slug?: string) => void;
}

export function ProductDetail({ product, onAddToCart, onNavigate }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const wishlist = useWishlist();
  const isWishlisted = wishlist.isWishlisted(product.id);

  const primaryImage = product.product_images.find(i => i.is_primary) || product.product_images[0];
  const hasSale = product.sale_price !== null && product.sale_price < product.base_price;
  const galleryImages = useMemo(
    () =>
      [...product.product_images]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((img) => ({
          id: img.id,
          url: productImageUrl(img.url, product.title),
          alt: img.alt_text || product.title,
        })),
    [product]
  );

  const handleShare = async () => {
    const url = `${window.location.origin}/products/${product.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // user cancelled share
    }
  };
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
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  // Related products (same theme, excluding current)
  const { publishedProducts } = useCatalog();
  const relatedProducts = publishedProducts
    .filter(p => p.id !== product.id && p.themes.some(t => product.themes.includes(t)))
    .slice(0, 4);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb */}
      <button
        onClick={() => onNavigate('shop')}
        className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0A0A0A] transition-colors mb-6"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <ChevronLeft size={16} />
        Back to Shop
      </button>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery images={galleryImages} title={product.title} />

        {/* Info */}
        <div className="flex flex-col">
          <h1
            className="text-3xl lg:text-4xl text-[#0A0A0A] mb-3"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            {product.title}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            {hasSale && (
              <>
                <span className="text-lg text-[#64748B] line-through">{formatPrice(product.base_price)}</span>
                <span className="text-2xl font-bold" style={{ color: '#C41E3A' }}>
                  {formatPrice(product.sale_price!)}
                </span>
              </>
            )}
            {!hasSale && (
              <span className="text-2xl font-bold text-[#0A0A0A]">{formatPrice(product.base_price)}</span>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.made_to_order && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs border" style={{ borderColor: '#1B7A7A', color: '#1B7A7A', fontFamily: "'Space Mono', monospace" }}>
                <Clock size={12} />
                Made to Order — 7 Days
              </span>
            )}
            <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#00C853] text-[#00C853]" style={{ fontFamily: "'Space Mono', monospace" }}>
              <Truck size={12} />
              Free Shipping over ${FREE_SHIPPING_THRESHOLD}
            </span>
          </div>

          <p className="text-sm text-[#64748B] leading-relaxed mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {product.description}
          </p>

          {/* Size */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest text-[#64748B] mb-3" style={{ fontFamily: "'Space Mono', monospace" }}>
              Size
            </p>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_SIZES.map(size => {
                const isAvailable = availableSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => isAvailable && setSelectedSize(size)}
                    disabled={!isAvailable}
                    className={`w-14 h-14 border text-sm font-medium transition-all ${
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

          {/* Color */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-[#64748B] mb-3" style={{ fontFamily: "'Space Mono', monospace" }}>
              Color
            </p>
            <div className="flex flex-wrap gap-3">
              {PRODUCT_COLORS.map(color => {
                const isAvailable = availableColors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    onClick={() => isAvailable && setSelectedColor(color.name)}
                    disabled={!isAvailable}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color.name
                        ? 'border-[#0A0A0A] scale-110'
                        : isAvailable
                        ? 'border-transparent hover:scale-105'
                        : 'border-gray-200 opacity-30 cursor-not-allowed'
                    }`}
                    title={color.name}
                  >
                    <span className="block w-full h-full rounded-full border border-[#0A0A0A]/10" style={{ backgroundColor: color.hex }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-[#0A0A0A]/30">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-[#0A0A0A]/5">
                <Minus size={14} />
              </button>
              <span className="w-12 h-12 flex items-center justify-center text-sm font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-[#0A0A0A]/5">
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className={`flex-1 py-4 text-white text-sm uppercase tracking-wider transition-all ${
                canAddToCart ? 'hover:translate-y-[-2px]' : 'opacity-50 cursor-not-allowed'
              } ${addedToCart ? 'bg-[#00C853]' : ''}`}
              style={{ backgroundColor: addedToCart ? '#00C853' : '#C41E3A', fontFamily: "'Space Mono', monospace" }}
            >
              {addedToCart ? 'Added to Cart!' : canAddToCart ? 'Add to Cart' : 'Select Size & Color'}
            </button>
          </div>

          {/* Share/Wishlist */}
          <div className="flex items-center gap-4 pt-6 border-t border-[#0A0A0A]/10">
            <button
              type="button"
              onClick={() => wishlist.toggle(product.id)}
              className={`flex items-center gap-2 text-sm transition-colors ${
                isWishlisted ? 'text-[#C41E3A]' : 'text-[#64748B] hover:text-[#0A0A0A]'
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              aria-pressed={isWishlisted}
            >
              <Heart size={16} fill={isWishlisted ? '#C41E3A' : 'none'} color={isWishlisted ? '#C41E3A' : 'currentColor'} />
              {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0A0A0A] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 lg:mt-24">
          <h2
            className="text-2xl lg:text-3xl text-[#0A0A0A] mb-8"
            style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.05em' }}
          >
            YOU MAY ALSO LIKE
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {relatedProducts.map(p => (
              <button
                key={p.id}
                onClick={() => onNavigate('product', p.slug)}
                className="group text-left"
              >
                <div className="aspect-[3/4] overflow-hidden border border-[#0A0A0A]/15 mb-3">
                  <img
                    src={productImageUrl(p.product_images[0]?.url, p.title)}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h4 className="text-sm font-medium text-[#0A0A0A] group-hover:opacity-70 transition-opacity" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {p.title}
                </h4>
                <p className="text-sm font-bold text-[#0A0A0A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {formatPrice(p.sale_price || p.base_price)}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
