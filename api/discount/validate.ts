import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateDiscountCode } from '../_lib/discount';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body ?? {};
    const result = await validateDiscountCode(code);

    if (!result.valid) {
      return res.status(200).json({
        valid: false,
        code: result.code,
        error: result.error || 'Invalid discount code',
      });
    }

    return res.status(200).json({
      valid: true,
      code: result.code,
      ...(result.percent_off != null ? { percent_off: result.percent_off } : {}),
      ...(result.amount_off != null ? { amount_off: result.amount_off } : {}),
    });
  } catch (err: unknown) {
    console.error('discount validate error:', err);
    const message = err instanceof Error ? err.message : 'Validation failed';
    return res.status(500).json({ error: message });
  }
}
