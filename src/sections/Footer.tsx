'use client';

import { useState } from 'react';
import { Instagram, Twitter, Facebook, Mail, ArrowRight, MapPin } from 'lucide-react';
import type { AppView, FilterState } from '@/types';
import logo from '@/assets/logo.png';

interface FooterProps {
  onNavigate: (view: AppView) => void;
  onFilterChange: (filter: Partial<FilterState>) => void;
}

export function Footer({ onNavigate, onFilterChange }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleShopNav = (params: Record<string, string>) => {
    onFilterChange({ category: 'all', theme: 'all', search: '', sort: 'featured', ...params } as Partial<FilterState>);
    onNavigate('shop');
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#0A0A0A] text-white">
      {/* Newsletter Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg" style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.02em' }}>
                JOIN THE MADCAP CREW
              </h3>
              <p className="text-xs text-white/50 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                New drops, exclusive designs, and NJ humor delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/15 text-white text-sm placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-[#C41E3A] text-white text-xs uppercase tracking-wider hover:bg-[#a31830] transition-colors flex items-center gap-2"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {subscribed ? 'Subscribed!' : <><span className="hidden sm:inline">Subscribe</span><ArrowRight size={14} /></>}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img src={logo} alt="Madcap Tees" className="h-9 w-auto mb-4 brightness-0 invert" />
            <p className="text-[13px] text-white/50 mb-5 max-w-xs leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Mad as hell and twice as funny. Original satirical graphic apparel designed in New Jersey. Made to order, shipped with attitude.
            </p>
            <div className="flex gap-3 mb-5">
              <a href="https://instagram.com/madcaptees" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-[#C41E3A] transition-colors" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-[#C41E3A] transition-colors" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-[#C41E3A] transition-colors" aria-label="Facebook">
                <Facebook size={16} />
              </a>
            </div>
            <div className="space-y-1.5">
              <p className="flex items-center gap-2 text-[11px] text-white/40" style={{ fontFamily: "'Space Mono', monospace" }}>
                <MapPin size={11} /> New Jersey, USA
              </p>
              <p className="flex items-center gap-2 text-[11px] text-white/40" style={{ fontFamily: "'Space Mono', monospace" }}>
                <Mail size={11} /> hello@madcaptees.com
              </p>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.15em] text-white/30 mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
              Shop
            </h4>
            <ul className="space-y-2.5">
              {['All Products', 'Best Sellers', 'New Arrivals', 'NJ Flavor', 'Satirical', 'Retro'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      if (item === 'All Products') handleShopNav({});
                      else if (item === 'Best Sellers') handleShopNav({ theme: 'best-sellers' });
                      else if (item === 'New Arrivals') handleShopNav({ sort: 'newest' });
                      else handleShopNav({ theme: item.toLowerCase().replace(' ', '-') });
                    }}
                    className="text-[13px] text-white/50 hover:text-white transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.15em] text-white/30 mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
              Categories
            </h4>
            <ul className="space-y-2.5">
              {['T-Shirts', 'Hoodies', 'Long Sleeve', 'Hats', 'Stickers'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => handleShopNav({ category: item.toLowerCase().replace(' ', '') })}
                    className="text-[13px] text-white/50 hover:text-white transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.15em] text-white/30 mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
              Support
            </h4>
            <ul className="space-y-2.5">
              {['Shipping Info', 'Returns & Exchanges', 'Size Guide', 'Contact Us', 'FAQ', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <span className="text-[13px] text-white/50 hover:text-white/70 cursor-default transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-white/25 uppercase tracking-wider" style={{ fontFamily: "'Space Mono', monospace" }}>
            &copy; 2026 MADCAP TEES. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-white/25 uppercase tracking-wider" style={{ fontFamily: "'Space Mono', monospace" }}>
              Made with attitude in NJ
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
