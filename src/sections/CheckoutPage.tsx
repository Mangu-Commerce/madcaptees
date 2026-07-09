import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, CreditCard, Check, Loader2, Tag } from 'lucide-react';
import type { CartItem, AppView } from '@/types';
import { formatPrice, addOrder } from '@/lib/data';
import {
  applyLocalDemoDiscount,
  isStripeCheckoutEnabled,
  startStripeCheckout,
  validateDiscount,
} from '@/lib/checkout';

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
  total: _cartTotal,
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

  const [discountInput, setDiscountInput] = useState('');
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number | null>(null);
  const [discountFixed, setDiscountFixed] = useState<number | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);

  const stripeEnabled = isStripeCheckoutEnabled();

  const discountAmount = useMemo(() => {
    if (!discountCode) return 0;
    if (discountPercent != null && discountPercent > 0) {
      return Math.round(subtotal * (discountPercent / 100) * 100) / 100;
    }
    if (discountFixed != null && discountFixed > 0) {
      return Math.min(subtotal, discountFixed);
    }
    return 0;
  }, [discountCode, discountPercent, discountFixed, subtotal]);

  const discountedSubtotal = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);
  const payableTotal = Math.round((discountedSubtotal + shipping) * 100) / 100;

  useEffect(() => {
    if (initialSuccess) {
      onClearCart();
    }
  }, [initialSuccess, onClearCart]);

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleApplyDiscount = async () => {
    setDiscountError(null);
    setDiscountLoading(true);
    try {
      const result = await validateDiscount(discountInput);
      if (!result.valid) {
        setDiscountCode(null);
        setDiscountPercent(null);
        setDiscountFixed(null);
        setDiscountError(result.error || 'Invalid discount code');
        return;
      }
      setDiscountCode(result.code || discountInput.trim().toUpperCase());
      setDiscountPercent(result.percent_off ?? null);
      setDiscountFixed(result.amount_off ?? null);
      setDiscountError(null);
    } catch {
      // Local demo fallback when API is unreachable
      const local = applyLocalDemoDiscount(discountInput, subtotal);
      if (local.valid) {
        setDiscountCode(local.code || 'DEMO10');
        setDiscountPercent(local.percent_off ?? 10);
        setDiscountFixed(null);
        setDiscountError(null);
      } else {
        setDiscountCode(null);
        setDiscountPercent(null);
        setDiscountFixed(null);
        setDiscountError(local.error || 'Invalid discount code');
      }
    } finally {
      setDiscountLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode(null);
    setDiscountPercent(null);
    setDiscountFixed(null);
    setDiscountInput('');
    setDiscountError(null);
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
          total: payableTotal,
          discountCode: discountCode || undefined,
        });
      } catch (err: unknown) {
        setPayError(err instanceof Error ? err.message : 'Checkout failed');
        setPaying(false);
      }
      return;
    }

    // Local demo checkout — apply DEMO10 / validated discount
    let demoSubtotal = subtotal;
    let demoDiscountAmount = 0;
    let appliedCode = discountCode;

    if (discountCode) {
      demoDiscountAmount = discountAmount;
      demoSubtotal = discountedSubtotal;
    } else if (discountInput.trim()) {
      const local = applyLocalDemoDiscount(discountInput, subtotal);
      if (local.valid) {
        appliedCode = local.code || 'DEMO10';
        demoDiscountAmount = local.discountAmount;
        demoSubtotal = local.discountedSubtotal;
      }
    }

    const demoTotal = Math.round((demoSubtotal + shipping) * 100) / 100;
    const orderId = `ord-${Date.now()}`;

    const newOrder: any = {
      id: orderId,
      user_id: null,
      stripe_session_id: `cs_demo_${Date.now()}`,
      total_amount: demoTotal,
      subtotal: demoSubtotal,
      shipping_cost: shipping,
      status: 'paid',
      email,
      discount_code: appliedCode,
      discount_amount: demoDiscountAmount,
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
        order_id: orderId,
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
                    <Tag size={18} className="text-[#0A0A0A]" />
                    <h3 className="text-sm font-medium">Discount code</h3>
                  </div>
                  {discountCode ? (
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-[#00C853]" style={{ fontFamily: "'Space Mono', monospace" }}>
                        {discountCode} applied
                        {discountPercent != null ? ` (−${discountPercent}%)` : ''}
                      </p>
                      <button
                        type="button"
                        onClick={handleRemoveDiscount}
                        className="text-xs text-[#64748B] hover:text-[#C41E3A] transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={discountInput}
                        onChange={(e) => setDiscountInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            void handleApplyDiscount();
                          }
                        }}
                        className="flex-1 px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none text-sm uppercase"
                        placeholder="DEMO10"
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        onClick={() => void handleApplyDiscount()}
                        disabled={discountLoading || !discountInput.trim()}
                        className="px-4 py-3 border border-[#0A0A0A] text-xs uppercase tracking-wider text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all disabled:opacity-50"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                      >
                        {discountLoading ? '…' : 'Apply'}
                      </button>
                    </div>
                  )}
                  {discountError && <p className="text-sm text-[#C41E3A] mt-2">{discountError}</p>}
                </div>

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
                  {stripeEnabled
                    ? `Pay with Stripe — ${formatPrice(payableTotal)}`
                    : `Place Order — ${formatPrice(payableTotal)}`}
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
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#64748B]">
                      Discount{discountCode ? ` (${discountCode})` : ''}
                    </span>
                    <span className="text-[#00C853]">−{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#0A0A0A]/10">
                  <span>Total</span>
                  <span>{formatPrice(payableTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
