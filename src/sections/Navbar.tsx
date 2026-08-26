'use client';

import { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import type { AppView, FilterState } from '@/types';
import logo from '@/assets/logo.png';

interface NavbarProps {
  cartCount: number;
  onNavigate: (view: AppView) => void;
  onOpenCart: () => void;
  onFilterChange: (filter: Partial<FilterState>) => void;
}

const NAV_LINKS_LEFT = [
  { label: 'Collections', hasDropdown: true, items: [
    { label: 'NJ Flavor', theme: 'nj-flavor' },
    { label: 'Satirical', theme: 'satirical' },
    { label: 'Retro', theme: 'retro' },
    { label: 'Band Merch', theme: 'band-merch' },
    { label: 'Best Sellers', theme: 'best-sellers' },
  ]},
  { label: 'Apparel', hasDropdown: true, items: [
    { label: 'T-Shirts', category: 'tees' },
    { label: 'Hoodies', category: 'hoodies' },
    { label: 'Long Sleeve', category: 'longsleeve' },
    { label: 'Hats', category: 'hats' },
  ]},
];

const NAV_LINKS_RIGHT = [
  { label: 'Stickers', category: 'stickers' },
  { label: 'Best Sellers', theme: 'best-sellers' },
  { label: 'New Arrivals', sort: 'newest' },
];

export function Navbar({ cartCount, onNavigate, onOpenCart, onFilterChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    setSearchOpen(false);
  };

  const handleShopNav = (params: Record<string, string>) => {
    onFilterChange({ category: 'all', theme: 'all', search: '', sort: 'featured', ...params } as Partial<FilterState>);
    onNavigate('shop');
    handleNavClick();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onFilterChange({ category: 'all', theme: 'all', search: searchQuery.trim(), sort: 'featured' });
    onNavigate('shop');
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(245, 240, 232, 0.95)' : '#F5F0E8',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(10,10,10,0.15)' : '1px solid rgba(10,10,10,0.1)',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-[68px]">
          {/* Left Nav - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS_LEFT.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 text-[13px] font-medium text-[#0A0A0A] hover:text-[#C41E3A] transition-colors" style={{ fontFamily: "'Space Mono', monospace" }}>
                  {link.label}
                  <ChevronDown size={12} />
                </button>
                {openDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-[#0A0A0A]/15 shadow-[4px_4px_0px_rgba(10,10,10,0.12)] z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    {link.items.map((item: any) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          if (item.theme) handleShopNav({ theme: item.theme });
                          else if (item.category) handleShopNav({ category: item.category });
                        }}
                        className="block w-full text-left px-4 py-3 text-[13px] hover:bg-[#F5F0E8] transition-colors"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Logo */}
          <button
            onClick={() => { onNavigate('home'); handleNavClick(); }}
            className="flex-shrink-0 transition-transform hover:scale-105 duration-200"
          >
            <img src={logo.src} alt="Madcap Tees" className="h-9 lg:h-11 w-auto object-contain" />
          </button>

          {/* Right Nav - Desktop */}
          <div className="hidden lg:flex items-center gap-5">
            {NAV_LINKS_RIGHT.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  if (link.category) handleShopNav({ category: link.category });
                  else if (link.theme) handleShopNav({ theme: link.theme });
                  else if (link.sort) handleShopNav({ sort: link.sort });
                }}
                className="text-[13px] font-medium text-[#0A0A0A] hover:text-[#C41E3A] transition-colors"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {link.label}
              </button>
            ))}
            <div className="flex items-center gap-3 ml-3 pl-3 border-l border-[#0A0A0A]/15">
              {/* Search */}
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-40 px-3 py-1.5 text-[13px] border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none bg-white"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  <button type="button" onClick={() => setSearchOpen(false)} className="ml-2">
                    <X size={16} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-[#0A0A0A] hover:text-[#C41E3A] transition-colors"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              )}
              <button
                type="button"
                className="text-[#0A0A0A] hover:text-[#C41E3A] transition-colors opacity-40 cursor-not-allowed"
                aria-label="Account (coming soon)"
                title="Customer accounts coming soon"
              >
                <User size={18} />
              </button>
              <button
                onClick={() => { onOpenCart(); handleNavClick(); }}
                className="relative text-[#0A0A0A] hover:text-[#C41E3A] transition-colors"
                aria-label={`Shopping cart with ${cartCount} items`}
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#0A0A0A] p-2"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-14 z-40 bg-[#F5F0E8] overflow-y-auto">
          <div className="px-6 py-6 space-y-5">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 pb-4 border-b border-[#0A0A0A]/10">
              <Search size={16} className="text-[#64748B]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-3 py-2 text-sm border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none bg-white"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </form>

            <button
              onClick={() => handleShopNav({})}
              className="block text-2xl text-[#0A0A0A] hover:text-[#C41E3A] transition-colors"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              SHOP ALL
            </button>

            {NAV_LINKS_LEFT.map((link) => (
              <div key={link.label}>
                <p className="text-[11px] text-[#64748B] mb-2 uppercase tracking-widest" style={{ fontFamily: "'Space Mono', monospace" }}>
                  {link.label}
                </p>
                <div className="space-y-2 pl-3">
                  {link.items.map((item: any) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        if (item.theme) handleShopNav({ theme: item.theme });
                        else if (item.category) handleShopNav({ category: item.category });
                      }}
                      className="block text-[15px] text-[#0A0A0A] hover:text-[#C41E3A] transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-[#0A0A0A]/10 space-y-3">
              {NAV_LINKS_RIGHT.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    if (link.category) handleShopNav({ category: link.category });
                    else if (link.theme) handleShopNav({ theme: link.theme });
                    else if (link.sort) handleShopNav({ sort: link.sort });
                  }}
                  className="block text-[15px] text-[#0A0A0A] hover:text-[#C41E3A] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-[#0A0A0A]/10 flex items-center gap-6">
              <button onClick={() => { onOpenCart(); handleNavClick(); }} className="flex items-center gap-2 text-[#0A0A0A]">
                <ShoppingBag size={18} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>Cart ({cartCount})</span>
              </button>
              <button onClick={() => { onNavigate('admin-dashboard'); handleNavClick(); }} className="flex items-center gap-2 text-[#0A0A0A]">
                <User size={18} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
