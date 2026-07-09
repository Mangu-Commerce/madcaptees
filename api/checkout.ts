import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

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
    } = req.body ?? {};

    if (!Array.isArray(items) || items.length === 0 || !email) {
      return res.status(400).json({ error: 'Invalid checkout payload' });
    }

    const siteUrl =
      process.env.VITE_SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'http://localhost:3000';

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: { title: string; unit_price: number; quantity: number }) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.title },
          unit_amount: Math.round(Number(item.unit_price) * 100),
        },
        quantity: Number(item.quantity) || 1,
      })
    );

    if (Number(shipping) > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping' },
          unit_amount: Math.round(Number(shipping) * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: lineItems,
      success_url: successUrl || `${siteUrl}/checkout?success=1`,
      cancel_url: cancelUrl || `${siteUrl}/cart`,
      metadata: {
        subtotal: String(subtotal ?? ''),
        shipping: String(shipping ?? ''),
        total: String(total ?? ''),
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
