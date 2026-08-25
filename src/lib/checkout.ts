'use client';

import type { CartItem } from '@/types';

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
}

export function isStripeCheckoutEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
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
}): Promise<void> {
  const siteUrl = getSiteUrl();
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
