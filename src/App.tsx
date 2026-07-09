// ============================================
// Madcap Tees — Main Application
// ============================================

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import type { AppView, FilterState, CartItem, Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { useCatalog } from '@/contexts/CatalogContext';
import { formatPrice } from '@/lib/data';
import { getViewFromPath, viewToPath } from '@/lib/routes';
import { applyPageSeo, productJsonLd } from '@/lib/seo';
import { AnnouncementBar } from '@/sections/AnnouncementBar';
import { Navbar } from '@/sections/Navbar';
import { Hero } from '@/sections/Hero';
import { CollectionCards } from '@/sections/CollectionCards';
import { BestSellers } from '@/sections/BestSellers';
import { NewArrivals } from '@/sections/NewArrivals';
import { ShopPage } from '@/sections/ShopPage';
import { ProductDetail } from '@/sections/ProductDetail';
import { CartDrawer } from '@/sections/CartDrawer';
import { CheckoutPage } from '@/sections/CheckoutPage';
import { AdminDashboard } from '@/sections/AdminDashboard';
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

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const catalog = useCatalog();

  const { view: currentView, slug: selectedProductSlug } = useMemo(
    () => getViewFromPath(location.pathname),
    [location.pathname]
  );

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [pageTransition, setPageTransition] = useState(false);

  const cart = useCart();
  const toast = useToast();

  const handleNavigate = useCallback(
    (view: AppView, slug?: string) => {
      setPageTransition(true);
      setTimeout(() => {
        navigate(viewToPath(view, slug));
        setPageTransition(false);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 150);
    },
    [navigate]
  );

  const handleFilterChange = useCallback((filter: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...filter }));
  }, []);

  const handleProductClick = useCallback(
    (slug: string) => {
      handleNavigate('product', slug);
    },
    [handleNavigate]
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

  const selectedProduct = catalog.getProductBySlug(selectedProductSlug);
  const checkoutSuccess = searchParams.get('success') === '1';

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      applyPageSeo({ title: 'Admin', path: '/admin', noIndex: true });
      return;
    }
    if (currentView === 'product' && selectedProduct) {
      applyPageSeo({
        title: selectedProduct.title,
        description: selectedProduct.description ?? `${selectedProduct.title} — made to order. Ships in ~7 days.`,
        path: `/products/${selectedProduct.slug}`,
        image: selectedProduct.product_images[0]?.url,
        jsonLd: productJsonLd(selectedProduct),
      });
      return;
    }
    if (currentView === 'shop') {
      applyPageSeo({
        title: 'Shop All Graphic Tees & Apparel',
        description: 'Browse funny graphic t-shirts, hoodies, hats, and more. Filter by theme or search your favorite designs.',
        path: '/shop',
      });
      return;
    }
    if (currentView === 'cart') {
      applyPageSeo({ title: 'Your Cart', path: '/cart', noIndex: true });
      return;
    }
    if (currentView === 'checkout') {
      applyPageSeo({ title: 'Checkout', path: '/checkout', noIndex: true });
      return;
    }
    applyPageSeo({ path: '/' });
  }, [currentView, selectedProduct, location.pathname]);

  if (location.pathname.startsWith('/admin')) {
    return <AdminDashboard onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F0E8' }}>
      <AnnouncementBar />
      <Navbar
        cartCount={cart.totalItems}
        onNavigate={handleNavigate}
        onOpenCart={() => cart.setIsOpen(true)}
        onFilterChange={handleFilterChange}
      />

      <main
        className={`flex-1 transition-opacity duration-150 ${
          pageTransition ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {currentView === 'home' && (
          <>
            <Hero onNavigate={handleNavigate} onFilterChange={handleFilterChange} />
            <div id="shop-section">
              <CollectionCards onNavigate={handleNavigate} onFilterChange={handleFilterChange} />
            </div>
            <BestSellers
              onProductClick={handleProductClick}
              onQuickView={handleQuickView}
              onQuickAdd={handleQuickAdd}
              onNavigate={handleNavigate}
              onFilterChange={handleFilterChange}
            />
            <NewArrivals
              onProductClick={handleProductClick}
              onQuickView={handleQuickView}
              onQuickAdd={handleQuickAdd}
              onNavigate={handleNavigate}
              onFilterChange={handleFilterChange}
            />
          </>
        )}

        {currentView === 'shop' && (
          <ShopPage
            filters={filters}
            onFilterChange={handleFilterChange}
            onProductClick={handleProductClick}
            onQuickView={handleQuickView}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {currentView === 'product' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'product' && !selectedProduct && !catalog.loading && (
          <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
            <p className="text-lg text-[#64748B] mb-6">Product not found</p>
            <button
              onClick={() => handleNavigate('shop')}
              className="px-6 py-3 text-white text-sm uppercase tracking-wider"
              style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
            >
              Back to Shop
            </button>
          </div>
        )}

        {currentView === 'cart' && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <h1 className="text-3xl text-[#0A0A0A] mb-8" style={{ fontFamily: "'Anton', sans-serif" }}>
              YOUR CART
            </h1>
            {cart.items.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-[#64748B] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Your cart is empty
                </p>
                <p className="text-sm text-[#64748B]/60 mb-6">
                  Looks like you have not added any mad gear yet
                </p>
                <button
                  onClick={() => handleNavigate('shop')}
                  className="px-8 py-4 text-white text-sm uppercase tracking-wider hover:translate-y-[-2px] transition-all"
                  style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
                >
                  Shop New Arrivals
                </button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {cart.items.map((item) => (
                    <div
                      key={item.product_variant_id}
                      className="flex gap-4 bg-white p-4 border border-[#0A0A0A]/10"
                    >
                      <button
                        onClick={() => handleProductClick(item.slug)}
                        className="w-24 h-32 flex-shrink-0 overflow-hidden"
                      >
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </button>
                      <div className="flex-1">
                        <button onClick={() => handleProductClick(item.slug)} className="text-left">
                          <h3 className="font-medium text-sm hover:text-[#C41E3A] transition-colors">
                            {item.title}
                          </h3>
                        </button>
                        <p
                          className="text-xs text-[#64748B] mt-0.5"
                          style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                          {item.size} / {item.color}
                        </p>
                        <p className="font-bold text-sm mt-2">{formatPrice(item.unit_price)}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-[#0A0A0A]/20">
                            <button
                              onClick={() =>
                                cart.updateQuantity(item.product_variant_id, item.quantity - 1)
                              }
                              className="w-9 h-9 flex items-center justify-center hover:bg-[#0A0A0A]/5 transition-colors text-sm"
                            >
                              -
                            </button>
                            <span className="w-9 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                cart.updateQuantity(item.product_variant_id, item.quantity + 1)
                              }
                              className="w-9 h-9 flex items-center justify-center hover:bg-[#0A0A0A]/5 transition-colors text-sm"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              cart.removeItem(item.product_variant_id);
                              toast.addToast('Item removed', 'info');
                            }}
                            className="text-xs text-[#64748B] hover:text-[#D32F2F] transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-bold">
                        {formatPrice(item.unit_price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-6 border border-[#0A0A0A]/10 h-fit">
                  <h3
                    className="text-xs uppercase tracking-widest text-[#64748B] mb-4"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    Order Summary
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <span className="text-[#64748B]">Subtotal</span>
                      <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <span className="text-[#64748B]">Shipping</span>
                      <span className="font-medium">
                        {cart.shipping === 0 ? 'FREE' : formatPrice(cart.shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-[#0A0A0A]/10">
                      <span>Total</span>
                      <span>{formatPrice(cart.total)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavigate('checkout')}
                    className="w-full py-4 text-white text-sm uppercase tracking-wider hover:translate-y-[-2px] transition-all"
                    style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => handleNavigate('shop')}
                    className="w-full py-3 text-xs text-[#64748B] hover:text-[#0A0A0A] transition-colors mt-2"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            items={cart.items}
            subtotal={cart.subtotal}
            shipping={cart.shipping}
            total={cart.total}
            onNavigate={handleNavigate}
            onClearCart={cart.clearCart}
            initialSuccess={checkoutSuccess}
          />
        )}
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

export default App;
