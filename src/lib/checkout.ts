import type { CartItem } from '@/types';

const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;

export function isStripeCheckoutEnabled(): boolean {
  return !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
}

export interface DiscountValidation {
  valid: boolean;
  code?: string;
  percent_off?: number;
  amount_off?: number;
  error?: string;
}

/** Client-side DEMO10 fallback when the validate API is unavailable. */
export function applyLocalDemoDiscount(
  code: string,
  subtotal: number
): { valid: boolean; code?: string; percent_off?: number; discountAmount: number; discountedSubtotal: number; error?: string } {
  const normalized = code.trim().toUpperCase();
  if (normalized === 'DEMO10') {
    const discountAmount = Math.round(subtotal * 0.1 * 100) / 100;
    return {
      valid: true,
      code: 'DEMO10',
      percent_off: 10,
      discountAmount,
      discountedSubtotal: Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100),
    };
  }
  return {
    valid: false,
    discountAmount: 0,
    discountedSubtotal: subtotal,
    error: 'Invalid discount code',
  };
}

export async function validateDiscount(code: string): Promise<DiscountValidation> {
  const trimmed = code.trim();
  if (!trimmed) {
    return { valid: false, error: 'Enter a discount code' };
  }

  try {
    const response = await fetch('/api/discount/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: trimmed }),
    });

    if (response.ok) {
      return (await response.json()) as DiscountValidation;
    }
  } catch {
    // fall through to local demo
  }

  const local = applyLocalDemoDiscount(trimmed, 0);
  if (local.valid) {
    return { valid: true, code: local.code, percent_off: local.percent_off };
  }
  return { valid: false, error: 'Invalid discount code' };
}

export async function startStripeCheckout(params: {
  items: CartItem[];
  email: string;
  name: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
  subtotal: number;
  shipping: number;
  total: number;
  discountCode?: string;
}): Promise<void> {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...params,
      successUrl: `${siteUrl}/checkout?success=1`,
      cancelUrl: `${siteUrl}/cart`,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Failed to start checkout');
  }

  const { url } = await response.json();
  if (!url) throw new Error('No checkout URL returned');
  window.location.href = url;
}
