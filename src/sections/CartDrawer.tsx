'use client';

import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import type { CartItem, AppView } from '@/types';
import { formatPrice } from '@/lib/data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (variantId: string, quantity: number) => void;
  onRemove: (variantId: string) => void;
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingProgress: number;
  freeShippingRemaining: number;
  onNavigate: (view: AppView) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  subtotal,
  shipping,
  total,
  freeShippingProgress,
  freeShippingRemaining,
  onNavigate,
}: CartDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0A0A0A]/60 backdrop-blur-sm z-[90]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[100] shadow-[-8px_0_32px_rgba(0,0,0,0.15)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#0A0A0A]/10">
          <div className="flex items-center gap-3">
            <h2
              className="text-xl text-[#0A0A0A]"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              YOUR CART
            </h2>
            <span
              className="px-2 py-0.5 bg-[#0A0A0A] text-white text-xs"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-[#0A0A0A] hover:bg-[#0A0A0A]/10 transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-[#0A0A0A]/20 mb-4" />
              <p className="text-lg text-[#0A0A0A] mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
                YOUR CART IS EMPTY
              </p>
              <p className="text-sm text-[#64748B] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Add some mad gear and come back
              </p>
              <button
                onClick={() => { onClose(); onNavigate('shop'); }}
                className="px-6 py-3 border border-[#0A0A0A] text-sm uppercase tracking-wider hover:bg-[#0A0A0A] hover:text-white transition-all"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Shop New Arrivals
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.product_variant_id} className="flex gap-4">
                  <div className="w-20 h-24 flex-shrink-0 bg-[#F5F0E8] overflow-hidden border border-[#0A0A0A]/10">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4
                          className="text-sm font-medium text-[#0A0A0A] truncate"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: "'Space Mono', monospace" }}>
                          {item.size} / {item.color}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemove(item.product_variant_id)}
                        className="text-[#64748B] hover:text-[#D32F2F] transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#0A0A0A]/20">
                        <button
                          onClick={() => onUpdateQuantity(item.product_variant_id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-[#0A0A0A]/5"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-xs font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product_variant_id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-[#0A0A0A]/5"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[#0A0A0A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {formatPrice(item.unit_price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#0A0A0A]/10">
            {/* Free Shipping Progress */}
            {freeShippingRemaining > 0 ? (
              <div className="mb-4">
                <p className="text-xs text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                  {formatPrice(freeShippingRemaining)} away from free shipping
                </p>
                <div className="h-2 bg-[#F5F0E8] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%`, backgroundColor: '#00C853' }}
                  />
                </div>
              </div>
            ) : (
              <div className="mb-4 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#00C853] flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="text-xs text-[#00C853]" style={{ fontFamily: "'Space Mono', monospace" }}>
                  You qualify for free shipping!
                </p>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <span className="text-[#64748B]">Subtotal</span>
                <span className="text-[#0A0A0A] font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <span className="text-[#64748B]">Shipping</span>
                <span className="text-[#0A0A0A] font-medium">
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-lg pt-2 border-t border-[#0A0A0A]/10">
                <span className="font-bold text-[#0A0A0A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Total</span>
                <span className="font-bold text-[#0A0A0A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => { onClose(); onNavigate('checkout'); }}
              className="w-full py-4 text-white text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all"
              style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
            >
              Checkout
              <ArrowRight size={16} />
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-sm text-[#64748B] hover:text-[#0A0A0A] transition-colors mt-2"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
