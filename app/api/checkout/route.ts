import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: 'Stripe is not configured on the server' }, { status: 503 });
  }

  try {
    const stripe = new Stripe(secretKey, { apiVersion: '2025-02-24.acacia' as any });
    const body = await req.json();
    const { items, email, subtotal, shipping, total, successUrl, cancelUrl } = body;

    if (!Array.isArray(items) || items.length === 0 || !email) {
      return NextResponse.json({ error: 'Invalid checkout payload' }, { status: 400 });
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      req.headers.get('origin') ||
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
      success_url: successUrl || `${siteUrl}/success`,
      cancel_url: cancelUrl || `${siteUrl}/cart`,
      automatic_tax: { enabled: true },
      metadata: {
        subtotal: String(subtotal ?? ''),
        shipping: String(shipping ?? ''),
        total: String(total ?? ''),
        cart_json: JSON.stringify(items).slice(0, 500),
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err: unknown) {
    console.error('checkout error:', err);
    const message = err instanceof Error ? err.message : 'Checkout failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
