'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { FilterState, CartItem, Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { AnnouncementBar } from '@/sections/AnnouncementBar';
import { Navbar } from '@/sections/Navbar';
import { CartDrawer } from '@/sections/CartDrawer';
import { QuickViewModal } from '@/sections/QuickViewModal';
import { ToastContainer } from '@/sections/ToastContainer';
import { Footer } from '@/sections/Footer';

const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  theme: 'all',
  search: '',
  sort: 'featured',
  priceMin: null,
  priceMax: null,
  size: null,
  color: null,
};

interface StoreShellProps {
  children: (props: {
    filters: FilterState;
    cart: ReturnType<typeof useCart>;
    onProductClick: (slug: string) => void;
    onQuickView: (product: Product) => void;
    onQuickAdd: (product: Product) => void;
    onAddToCart: (item: CartItem) => void;
    onNavigate: (view: string, slug?: string) => void;
    onFilterChange: (f: Partial<FilterState>) => void;
  }) => React.ReactNode;
}

export function StoreShell({ children }: StoreShellProps) {
  const router = useRouter();
  const cart = useCart();
  const toast = useToast();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleNavigate = useCallback(
    (view: string, slug?: string) => {
      const paths: Record<string, string> = {
        home: '/',
        shop: '/shop',
        cart: '/cart',
        checkout: '/checkout',
        admin: '/admin',
      };
      if (view === 'product' && slug) {
        router.push(`/products/${slug}`);
      } else {
        router.push(paths[view] ?? '/');
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    [router]
  );

  const handleFilterChange = useCallback((filter: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...filter }));
  }, []);

  const handleProductClick = useCallback(
    (slug: string) => {
      router.push(`/products/${slug}`);
      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    [router]
  );

  const handleQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

  const handleQuickAdd = useCallback(
    (product: Product) => {
      const availableVariants = product.product_variants.filter((v) => v.available);
      if (availableVariants.length === 0) {
        toast.addToast('Sorry, this item is out of stock', 'error');
        return;
      }
      const variant = availableVariants[0];
      const primaryImage =
        product.product_images.find((i) => i.is_primary) || product.product_images[0];
      const price = product.sale_price || product.base_price;
      const finalPrice = price + variant.price_adjustment;

      cart.addItem({
        product_variant_id: variant.id,
        product_id: product.id,
        title: product.title,
        slug: product.slug,
        image_url: primaryImage?.url || '',
        size: variant.size,
        color: variant.color,
        unit_price: finalPrice,
        quantity: 1,
      });
      toast.addToast(`${product.title} added to cart!`, 'success');
    },
    [cart, toast]
  );

  const handleAddToCart = useCallback(
    (item: CartItem) => {
      cart.addItem(item);
      toast.addToast(`${item.title} added to cart!`, 'success');
    },
    [cart, toast]
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F0E8' }}>
      <AnnouncementBar />
      <Navbar
        cartCount={cart.totalItems}
        onNavigate={handleNavigate}
        onOpenCart={() => cart.setIsOpen(true)}
        onFilterChange={handleFilterChange}
      />

      <main className="flex-1">
        {children({
          filters,
          cart,
          onProductClick: handleProductClick,
          onQuickView: handleQuickView,
          onQuickAdd: handleQuickAdd,
          onAddToCart: handleAddToCart,
          onNavigate: handleNavigate,
          onFilterChange: handleFilterChange,
        })}
      </main>

      <Footer onNavigate={handleNavigate} onFilterChange={handleFilterChange} />

      <CartDrawer
        isOpen={cart.isOpen}
        onClose={() => cart.setIsOpen(false)}
        items={cart.items}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeItem}
        subtotal={cart.subtotal}
        shipping={cart.shipping}
        total={cart.total}
        freeShippingProgress={cart.freeShippingProgress}
        freeShippingRemaining={cart.freeShippingRemaining}
        onNavigate={handleNavigate}
      />

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onProductClick={handleProductClick}
        />
      )}

      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
}
