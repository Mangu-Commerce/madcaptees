'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Check, Loader2 } from 'lucide-react';
import type { CartItem, AppView } from '@/types';
import { formatPrice, addOrder } from '@/lib/data';
import { isStripeCheckoutEnabled, startStripeCheckout } from '@/lib/checkout';

interface CheckoutPageProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  onNavigate: (view: AppView) => void;
  onClearCart: () => void;
  initialSuccess?: boolean;
}

export function CheckoutPage({
  items,
  subtotal,
  shipping,
  total,
  onNavigate,
  onClearCart,
  initialSuccess = false,
}: CheckoutPageProps) {
  const [step, setStep] = useState<'info' | 'payment' | 'success'>(
    initialSuccess ? 'success' : 'info'
  );
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState({ line1: '', line2: '', city: '', state: '', zip: '' });
  const [orderNumber, setOrderNumber] = useState(initialSuccess ? 'stripe' : '');
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const stripeEnabled = isStripeCheckoutEnabled();

  useEffect(() => {
    if (initialSuccess) {
      onClearCart();
    }
  }, [initialSuccess, onClearCart]);

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    if (stripeEnabled) {
      setPaying(true);
      setPayError(null);
      try {
        await startStripeCheckout({
          items,
          email,
          name,
          address,
          subtotal,
          shipping,
          total,
        });
      } catch (err: unknown) {
        setPayError(err instanceof Error ? err.message : 'Checkout failed');
        setPaying(false);
      }
      return;
    }

    const newOrder: any = {
      id: `ord-${Date.now()}`,
      user_id: null,
      stripe_session_id: `cs_demo_${Date.now()}`,
      total_amount: total,
      subtotal,
      shipping_cost: shipping,
      status: 'paid',
      email,
      shipping_address: {
        name,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: 'US',
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_items: items.map((item) => ({
        id: `oi-${Date.now()}-${item.product_variant_id}`,
        order_id: `ord-${Date.now()}`,
        product_variant_id: item.product_variant_id,
        title_at_time: item.title,
        size_at_time: item.size,
        color_at_time: item.color,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
      })),
    };
    addOrder(newOrder);
    setOrderNumber(newOrder.id);
    onClearCart();
    setStep('success');
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl text-[#0A0A0A] mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
          CHECKOUT
        </h1>
        <p className="text-[#64748B] mb-6">Your cart is empty</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-3 text-white text-sm uppercase tracking-wider"
          style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <button
        onClick={() => onNavigate('shop')}
        className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0A0A0A] transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to Shopping
      </button>

      {step === 'success' && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#00C853] flex items-center justify-center">
            <Check size={32} className="text-white" />
          </div>
          <h1
            className="text-3xl lg:text-4xl text-[#0A0A0A] mb-2"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            ORDER CONFIRMED
          </h1>
          <p className="text-[#64748B] mb-2">Thank you for your order!</p>
          {orderNumber && orderNumber !== 'stripe' && (
            <p className="text-sm text-[#64748B] mb-8" style={{ fontFamily: "'Space Mono', monospace" }}>
              Order #{orderNumber}
            </p>
          )}
          <p className="text-sm text-[#64748B] mb-8 max-w-md mx-auto">
            {email
              ? `A confirmation will be sent to ${email}.`
              : 'Your payment was received. Your order will be produced and shipped within 7 business days.'}
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 py-4 text-white text-sm uppercase tracking-wider"
            style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
          >
            Continue Shopping
          </button>
        </div>
      )}

      {step !== 'success' && (
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-4 mb-8">
              <div
                className={`flex items-center gap-2 ${step === 'info' ? 'text-[#0A0A0A]' : 'text-[#00C853]'}`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center border ${
                    step === 'info'
                      ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white'
                      : 'border-[#00C853] bg-[#00C853] text-white'
                  }`}
                >
                  {step === 'info' ? '1' : <Check size={14} />}
                </div>
                <span className="text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Info
                </span>
              </div>
              <div className="flex-1 h-px bg-[#0A0A0A]/20" />
              <div
                className={`flex items-center gap-2 ${step === 'payment' ? 'text-[#0A0A0A]' : 'text-[#64748B]'}`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center border ${
                    step === 'payment'
                      ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white'
                      : 'border-[#0A0A0A]/30 text-[#64748B]'
                  }`}
                >
                  2
                </div>
                <span className="text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Payment
                </span>
              </div>
            </div>

            {step === 'info' && (
              <form onSubmit={handleSubmitInfo} className="space-y-6">
                <div>
                  <label
                    className="block text-xs uppercase tracking-wider text-[#64748B] mb-2"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none text-sm"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label
                    className="block text-xs uppercase tracking-wider text-[#64748B] mb-2"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label
                    className="block text-xs uppercase tracking-wider text-[#64748B] mb-2"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none text-sm mb-3"
                    placeholder="123 Main St"
                  />
                  <input
                    type="text"
                    value={address.line2}
                    onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                    className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none text-sm"
                    placeholder="Apt 4B (optional)"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2">State</label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2">ZIP</label>
                    <input
                      type="text"
                      required
                      value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none text-sm"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 text-white text-sm uppercase tracking-wider"
                  style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
                >
                  Continue to Payment
                </button>
              </form>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                <div className="p-6 bg-[#F5F0E8] border border-[#0A0A0A]/10">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard size={20} className="text-[#0A0A0A]" />
                    <h3 className="text-sm font-medium">
                      {stripeEnabled ? 'Stripe Checkout' : 'Demo Payment'}
                    </h3>
                  </div>
                  <p className="text-sm text-[#64748B] mb-4">
                    {stripeEnabled
                      ? 'You will be redirected to Stripe to complete payment securely.'
                      : 'Demo mode — no real charge. Add Stripe keys to enable live checkout.'}
                  </p>
                  {!stripeEnabled && (
                    <div className="space-y-2 text-xs text-[#64748B]" style={{ fontFamily: "'Space Mono', monospace" }}>
                      <p>Test Card: 4242 4242 4242 4242</p>
                    </div>
                  )}
                </div>

                {payError && <p className="text-sm text-[#C41E3A]">{payError}</p>}

                <button
                  onClick={handlePlaceOrder}
                  disabled={paying}
                  className="w-full py-4 text-white text-sm uppercase tracking-wider disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
                >
                  {paying && <Loader2 size={16} className="animate-spin" />}
                  {stripeEnabled ? `Pay with Stripe — ${formatPrice(total)}` : `Place Order — ${formatPrice(total)}`}
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[#F5F0E8] p-6 border border-[#0A0A0A]/10">
              <h3
                className="text-sm uppercase tracking-wider text-[#64748B] mb-4"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Order Summary
              </h3>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product_variant_id} className="flex gap-3">
                    <div className="w-16 h-16 bg-white border border-[#0A0A0A]/10 flex-shrink-0">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-[#64748B]">
                        {item.size} / {item.color} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.unit_price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t border-[#0A0A0A]/10">
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#0A0A0A]/10">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
