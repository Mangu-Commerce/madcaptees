'use client';

import { useState, useMemo } from 'react';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import { useCatalog } from '@/contexts/CatalogContext';
import { ProductCard } from './ProductCard';
import type { Product, FilterState } from '@/types';
import { SORT_OPTIONS, PRODUCT_CATEGORIES, THEMES } from '@/types';

interface ShopPageProps {
  filters: FilterState;
  onFilterChange: (filter: Partial<FilterState>) => void;
  onProductClick: (slug: string) => void;
  onQuickView: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
}

export function ShopPage({ filters, onFilterChange, onProductClick, onQuickView, onQuickAdd }: ShopPageProps) {
  const [showFilters, setShowFilters] = useState(false);
  const { publishedProducts: products, loading } = useCatalog();

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    if (filters.theme !== 'all') {
      result = result.filter(p => p.themes.includes(filters.theme));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    if (filters.priceMin !== null) {
      result = result.filter(p => (p.sale_price || p.base_price) >= filters.priceMin!);
    }
    if (filters.priceMax !== null) {
      result = result.filter(p => (p.sale_price || p.base_price) <= filters.priceMax!);
    }

    switch (filters.sort) {
      case 'price-low':
        result.sort((a, b) => (a.sale_price || a.base_price) - (b.sale_price || b.base_price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.sale_price || b.base_price) - (a.sale_price || a.base_price));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      default:
        break;
    }

    return result;
  }, [products, filters]);

  const activeFiltersCount = [
    filters.category !== 'all',
    filters.theme !== 'all',
    filters.search !== '',
    filters.priceMin !== null || filters.priceMax !== null,
  ].filter(Boolean).length;

  const themeLabel = THEMES.find(t => t.value === filters.theme)?.label;
  const categoryLabel = PRODUCT_CATEGORIES.find(c => c.value === filters.category)?.label;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl lg:text-4xl text-[#0A0A0A] mb-2"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          {filters.theme !== 'all' ? themeLabel || 'SHOP' : filters.category !== 'all' ? categoryLabel || 'SHOP' : filters.search ? `SEARCH: "${filters.search}"` : 'SHOP ALL'}
        </h1>
        <p className="text-sm text-[#64748B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          {filters.search && <span className="ml-2 text-[#C41E3A]">matching &ldquo;{filters.search}&rdquo;</span>}
        </p>
      </div>

      {/* SEO Description */}
      {filters.theme === 'best-sellers' && (
        <div className="mb-8 p-6 bg-white border border-[#0A0A0A]/10">
          <p className="text-sm text-[#64748B] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Discover why thousands of fans keep coming back to these designs. Our Best Sellers collection features the most-loved graphic tees, hoodies, and hats that have earned their place as Madcap Tees favorites. If you are new here, this is where to start. Each piece is made to order in the USA, ensuring fresh prints and careful craftsmanship on every order. Free domestic shipping on orders over $125.
          </p>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border text-[13px] uppercase tracking-wider transition-all ${
              showFilters ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-[#0A0A0A]/30 text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white'
            }`}
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center bg-[#C41E3A] text-white text-[10px] rounded-full ml-1">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Active Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {filters.category !== 'all' && (
              <button
                onClick={() => onFilterChange({ category: 'all' })}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] bg-[#0A0A0A] text-white hover:bg-[#C41E3A] transition-colors"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {categoryLabel} <X size={12} />
              </button>
            )}
            {filters.theme !== 'all' && (
              <button
                onClick={() => onFilterChange({ theme: 'all' })}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] bg-[#0A0A0A] text-white hover:bg-[#C41E3A] transition-colors"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {themeLabel} <X size={12} />
              </button>
            )}
            {filters.search && (
              <button
                onClick={() => onFilterChange({ search: '' })}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] bg-[#0A0A0A] text-white hover:bg-[#C41E3A] transition-colors"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                <Search size={10} /> &ldquo;{filters.search}&rdquo; <X size={12} />
              </button>
            )}
            {filters.priceMin !== null && (
              <button
                onClick={() => onFilterChange({ priceMin: null })}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] bg-[#0A0A0A] text-white hover:bg-[#C41E3A] transition-colors"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Min ${filters.priceMin} <X size={12} />
              </button>
            )}
            {filters.priceMax !== null && (
              <button
                onClick={() => onFilterChange({ priceMax: null })}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] bg-[#0A0A0A] text-white hover:bg-[#C41E3A] transition-colors"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Max ${filters.priceMax} <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) => onFilterChange({ sort: e.target.value as any })}
          className="px-4 py-2.5 border border-[#0A0A0A]/30 text-[13px] bg-white focus:border-[#0A0A0A] focus:outline-none"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        {showFilters && (
          <div className="hidden lg:block w-64 flex-shrink-0">
            {/* Category */}
            <div className="mb-6 pb-6 border-b border-[#0A0A0A]/10">
              <h4 className="text-[11px] uppercase tracking-widest text-[#64748B] mb-3" style={{ fontFamily: "'Space Mono', monospace" }}>
                Category
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => onFilterChange({ category: 'all' })}
                  className={`block text-[13px] w-full text-left py-1 transition-colors ${filters.category === 'all' ? 'text-[#C41E3A] font-medium' : 'text-[#0A0A0A] hover:text-[#C41E3A]'}`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  All Categories
                </button>
                {PRODUCT_CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => onFilterChange({ category: cat.value as any })}
                    className={`block text-[13px] w-full text-left py-1 transition-colors ${filters.category === cat.value ? 'text-[#C41E3A] font-medium' : 'text-[#0A0A0A] hover:text-[#C41E3A]'}`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div className="mb-6 pb-6 border-b border-[#0A0A0A]/10">
              <h4 className="text-[11px] uppercase tracking-widest text-[#64748B] mb-3" style={{ fontFamily: "'Space Mono', monospace" }}>
                Theme
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => onFilterChange({ theme: 'all' })}
                  className={`block text-[13px] w-full text-left py-1 transition-colors ${filters.theme === 'all' ? 'text-[#C41E3A] font-medium' : 'text-[#0A0A0A] hover:text-[#C41E3A]'}`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  All Themes
                </button>
                {THEMES.map(theme => (
                  <button
                    key={theme.value}
                    onClick={() => onFilterChange({ theme: theme.value as any })}
                    className={`block text-[13px] w-full text-left py-1 transition-colors ${filters.theme === theme.value ? 'text-[#C41E3A] font-medium' : 'text-[#0A0A0A] hover:text-[#C41E3A]'}`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="text-[11px] uppercase tracking-widest text-[#64748B] mb-3" style={{ fontFamily: "'Space Mono', monospace" }}>
                Price Range
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin || ''}
                  onChange={(e) => onFilterChange({ priceMin: e.target.value ? Number(e.target.value) : null })}
                  className="w-20 px-2.5 py-2 border border-[#0A0A0A]/30 text-[13px] focus:border-[#0A0A0A] focus:outline-none"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
                <span className="text-[#64748B] text-sm">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax || ''}
                  onChange={(e) => onFilterChange({ priceMax: e.target.value ? Number(e.target.value) : null })}
                  className="w-20 px-2.5 py-2 border border-[#0A0A0A]/30 text-[13px] focus:border-[#0A0A0A] focus:outline-none"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
            </div>

            <button
              onClick={() => onFilterChange({ category: 'all', theme: 'all', search: '', priceMin: null, priceMax: null, sort: 'featured' })}
              className="text-[11px] uppercase tracking-wider text-[#64748B] hover:text-[#C41E3A] transition-colors"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Mobile Filters */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl" style={{ fontFamily: "'Anton', sans-serif" }}>Filters</h3>
              <button onClick={() => setShowFilters(false)}><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-[11px] uppercase tracking-widest text-[#64748B] mb-3">Category</h4>
                <div className="space-y-2">
                  {[{ value: 'all', label: 'All' }, ...PRODUCT_CATEGORIES].map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => onFilterChange({ category: cat.value as any })}
                      className={`block text-sm w-full text-left py-1 ${filters.category === cat.value ? 'text-[#C41E3A] font-medium' : ''}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[11px] uppercase tracking-widest text-[#64748B] mb-3">Theme</h4>
                <div className="space-y-2">
                  {[{ value: 'all', label: 'All' }, ...THEMES].map(theme => (
                    <button
                      key={theme.value}
                      onClick={() => onFilterChange({ theme: theme.value as any })}
                      className={`block text-sm w-full text-left py-1 ${filters.theme === theme.value ? 'text-[#C41E3A] font-medium' : ''}`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-4 text-white text-sm uppercase tracking-wider mt-4"
                style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-20 text-[#64748B]">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Search size={48} className="mx-auto text-[#0A0A0A]/15 mb-4" />
              <p className="text-lg text-[#64748B] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                No products found
              </p>
              <p className="text-sm text-[#64748B]/60 mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={() => onFilterChange({ category: 'all', theme: 'all', search: '', priceMin: null, priceMax: null })}
                className="px-6 py-3 border border-[#0A0A0A] text-sm uppercase tracking-wider hover:bg-[#0A0A0A] hover:text-white transition-all"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                  <ProductCard
                    product={product}
                    onProductClick={onProductClick}
                    onQuickView={onQuickView}
                    onQuickAdd={onQuickAdd}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
