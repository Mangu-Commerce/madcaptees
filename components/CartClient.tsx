'use client';

import { StoreShell } from './StoreShell';
import { formatPrice } from '@/lib/data';

export function CartClient() {
  return (
    <StoreShell>
      {({ cart, onNavigate, onProductClick }) => (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <h1
            className="text-3xl text-[#0A0A0A] mb-8"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            YOUR CART
          </h1>
          {cart.items.length === 0 ? (
            <div className="text-center py-16">
              <p
                className="text-lg text-[#64748B] mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Your cart is empty
              </p>
              <p className="text-sm text-[#64748B]/60 mb-6">
                Looks like you have not added any mad gear yet
              </p>
              <button
                onClick={() => onNavigate('shop')}
                className="px-8 py-4 text-white text-sm uppercase tracking-wider hover:-translate-y-0.5 transition-all"
                style={{
                  backgroundColor: '#C41E3A',
                  fontFamily: "'Space Mono', monospace",
                }}
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
                      onClick={() => onProductClick(item.slug)}
                      className="w-24 h-32 flex-shrink-0 overflow-hidden"
                    >
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </button>
                    <div className="flex-1">
                      <button
                        onClick={() => onProductClick(item.slug)}
                        className="text-left"
                      >
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
                      <p className="font-bold text-sm mt-2">
                        {formatPrice(item.unit_price)}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-[#0A0A0A]/20">
                          <button
                            onClick={() =>
                              cart.updateQuantity(
                                item.product_variant_id,
                                item.quantity - 1
                              )
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
                              cart.updateQuantity(
                                item.product_variant_id,
                                item.quantity + 1
                              )
                            }
                            className="w-9 h-9 flex items-center justify-center hover:bg-[#0A0A0A]/5 transition-colors text-sm"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            cart.removeItem(item.product_variant_id)
                          }
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
                  <div
                    className="flex justify-between text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <span className="text-[#64748B]">Subtotal</span>
                    <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
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
                  onClick={() => onNavigate('checkout')}
                  className="w-full py-4 text-white text-sm uppercase tracking-wider hover:-translate-y-0.5 transition-all"
                  style={{
                    backgroundColor: '#C41E3A',
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => onNavigate('shop')}
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
    </StoreShell>
  );
}
