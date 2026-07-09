import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import {
  applyDiscountToSubtotal,
  proportionallyDiscountItems,
  validateDiscountCode,
} from './_lib/discount';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(503).json({ error: 'Stripe is not configured on the server' });
  }

  try {
    const stripe = new Stripe(secretKey, { apiVersion: '2025-02-24.acacia' });
    const {
      items,
      email,
      subtotal,
      shipping,
      total,
      successUrl,
      cancelUrl,
      discountCode,
      discount,
    } = req.body ?? {};

    if (!Array.isArray(items) || items.length === 0 || !email) {
      return res.status(400).json({ error: 'Invalid checkout payload' });
    }

    const siteUrl =
      process.env.VITE_SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'http://localhost:3000';

    const computedSubtotal = items.reduce(
      (sum: number, item: { unit_price: number; quantity: number }) =>
        sum + Number(item.unit_price) * (Number(item.quantity) || 1),
      0
    );
    const baseSubtotal = Number(subtotal) > 0 ? Number(subtotal) : computedSubtotal;
    const shippingAmount = Math.max(0, Number(shipping) || 0);

    const rawDiscount = discountCode || discount?.code || discount || null;
    let appliedCode: string | null = null;
    let discountedSubtotal = baseSubtotal;
    let discountAmount = 0;

    if (rawDiscount) {
      const validated = await validateDiscountCode(rawDiscount);
      if (!validated.valid) {
        return res.status(400).json({ error: validated.error || 'Invalid discount code' });
      }
      appliedCode = validated.code ?? String(rawDiscount).toUpperCase();
      const applied = applyDiscountToSubtotal(baseSubtotal, validated);
      discountedSubtotal = applied.discountedSubtotal;
      discountAmount = applied.discountAmount;
    }

    const unitPrices =
      discountAmount > 0
        ? proportionallyDiscountItems(items, discountedSubtotal)
        : items.map((item: { unit_price: number }) => Number(item.unit_price));

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: { title: string; quantity: number }, index: number) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.title },
          unit_amount: Math.round(unitPrices[index] * 100),
        },
        quantity: Number(item.quantity) || 1,
      })
    );

    if (shippingAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping' },
          unit_amount: Math.round(shippingAmount * 100),
        },
        quantity: 1,
      });
    }

    const finalTotal = Math.round((discountedSubtotal + shippingAmount) * 100) / 100;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: lineItems,
      success_url: successUrl || `${siteUrl}/checkout?success=1`,
      cancel_url: cancelUrl || `${siteUrl}/cart`,
      metadata: {
        subtotal: String(discountedSubtotal),
        shipping: String(shippingAmount),
        total: String(finalTotal || total || ''),
        discount_code: appliedCode || '',
        discount_amount: String(discountAmount),
        cart_json: JSON.stringify(items).slice(0, 500),
      },
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err: unknown) {
    console.error('checkout error:', err);
    const message = err instanceof Error ? err.message : 'Checkout failed';
    return res.status(500).json({ error: message });
  }
}
