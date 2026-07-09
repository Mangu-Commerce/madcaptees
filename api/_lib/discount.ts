import { createClient } from '@supabase/supabase-js';

export interface DiscountResult {
  valid: boolean;
  code?: string;
  percent_off?: number;
  amount_off?: number;
  error?: string;
}

const DEMO_CODE = (process.env.DEMO_DISCOUNT_CODE || 'DEMO10').toUpperCase();
const DEMO_PERCENT = 10;

function demoDiscount(code: string): DiscountResult | null {
  if (code === DEMO_CODE) {
    return { valid: true, code: DEMO_CODE, percent_off: DEMO_PERCENT };
  }
  return null;
}

/**
 * Validate a discount code against Supabase discount_codes when available,
 * otherwise fall back to DEMO_DISCOUNT_CODE (default DEMO10 = 10% off).
 */
export async function validateDiscountCode(rawCode: unknown): Promise<DiscountResult> {
  const code = String(rawCode ?? '')
    .trim()
    .toUpperCase();

  if (!code) {
    return { valid: false, error: 'Discount code is required' };
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey) {
    try {
      const supabase = createClient(supabaseUrl, serviceKey);
      const { data, error } = await supabase
        .from('discount_codes')
        .select('code, percent_off, amount_off, active, expires_at')
        .ilike('code', code)
        .maybeSingle();

      if (!error && data) {
        if (data.active === false) {
          return { valid: false, code, error: 'Discount code is inactive' };
        }
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          return { valid: false, code, error: 'Discount code has expired' };
        }

        const percent_off =
          data.percent_off != null ? Number(data.percent_off) : undefined;
        const amount_off =
          data.amount_off != null ? Number(data.amount_off) : undefined;

        if (
          (percent_off == null || Number.isNaN(percent_off)) &&
          (amount_off == null || Number.isNaN(amount_off))
        ) {
          return { valid: false, code, error: 'Discount code is misconfigured' };
        }

        return {
          valid: true,
          code: String(data.code).toUpperCase(),
          ...(percent_off != null && !Number.isNaN(percent_off)
            ? { percent_off }
            : {}),
          ...(amount_off != null && !Number.isNaN(amount_off)
            ? { amount_off }
            : {}),
        };
      }

      // Table missing / query failed — fall through to demo code
      if (error && !/relation .* does not exist|Could not find the table/i.test(error.message)) {
        console.warn('discount_codes lookup warning:', error.message);
      }
    } catch (err) {
      console.warn('discount_codes lookup failed, using demo fallback:', err);
    }
  }

  const demo = demoDiscount(code);
  if (demo) return demo;

  return { valid: false, code, error: 'Invalid discount code' };
}

/** Apply a validated discount to a subtotal (dollars). Shipping is not discounted. */
export function applyDiscountToSubtotal(
  subtotal: number,
  discount: DiscountResult
): { discountedSubtotal: number; discountAmount: number } {
  if (!discount.valid || subtotal <= 0) {
    return { discountedSubtotal: subtotal, discountAmount: 0 };
  }

  let discountAmount = 0;
  if (discount.percent_off != null && discount.percent_off > 0) {
    discountAmount = (subtotal * discount.percent_off) / 100;
  } else if (discount.amount_off != null && discount.amount_off > 0) {
    discountAmount = Math.min(subtotal, discount.amount_off);
  }

  discountAmount = Math.round(discountAmount * 100) / 100;
  const discountedSubtotal = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);
  return { discountedSubtotal, discountAmount };
}

/**
 * Proportionally reduce line-item unit prices so Stripe totals match the
 * discounted subtotal. Returns new unit prices in dollars.
 */
export function proportionallyDiscountItems(
  items: { unit_price: number; quantity: number }[],
  discountedSubtotal: number
): number[] {
  const originalSubtotal = items.reduce(
    (sum, item) => sum + Number(item.unit_price) * (Number(item.quantity) || 1),
    0
  );

  if (originalSubtotal <= 0) {
    return items.map((item) => Number(item.unit_price));
  }

  const ratio = discountedSubtotal / originalSubtotal;
  const discountedUnitPrices = items.map(
    (item) => Math.round(Number(item.unit_price) * ratio * 100) / 100
  );

  // Fix penny drift on the last item so line totals match discountedSubtotal
  let running = 0;
  for (let i = 0; i < items.length; i++) {
    const qty = Number(items[i].quantity) || 1;
    if (i === items.length - 1) {
      const remaining = Math.round((discountedSubtotal - running) * 100) / 100;
      discountedUnitPrices[i] = Math.max(0, Math.round((remaining / qty) * 100) / 100);
    } else {
      running += discountedUnitPrices[i] * qty;
      running = Math.round(running * 100) / 100;
    }
  }

  return discountedUnitPrices;
}
