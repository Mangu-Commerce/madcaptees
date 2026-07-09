import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: { bodyParser: false },
};

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secretKey || !webhookSecret || !supabaseUrl || !serviceKey) {
    return res.status(503).json({ error: 'Webhook environment not configured' });
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2025-02-24.acacia' });
  const rawBody = await readRawBody(req);
  const signature = req.headers['stripe-signature'];

  if (!signature || typeof signature !== 'string') {
    return res.status(400).json({ error: 'Missing stripe-signature' });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    return res.status(400).json({ error: message });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: existing } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_session_id', session.id)
      .maybeSingle();

    if (!existing) {
      const email = session.customer_details?.email || session.customer_email || 'unknown@checkout.stripe';
      const total = (session.amount_total ?? 0) / 100;
      const subtotal = Number(session.metadata?.subtotal || total);
      const shippingCost = Number(session.metadata?.shipping || 0);

      await supabase.from('orders').insert({
        stripe_session_id: session.id,
        stripe_payment_intent_id:
          typeof session.payment_intent === 'string' ? session.payment_intent : null,
        total_amount: total,
        subtotal,
        shipping_cost: shippingCost,
        status: 'paid',
        email,
        shipping_address: session.shipping_details?.address
          ? {
              name: session.shipping_details.name ?? '',
              line1: session.shipping_details.address.line1 ?? '',
              line2: session.shipping_details.address.line2 ?? '',
              city: session.shipping_details.address.city ?? '',
              state: session.shipping_details.address.state ?? '',
              zip: session.shipping_details.address.postal_code ?? '',
              country: session.shipping_details.address.country ?? 'US',
            }
          : null,
      });
    }
  }

  return res.status(200).json({ received: true });
}
