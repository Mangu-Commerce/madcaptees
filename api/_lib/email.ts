export interface OrderReceiptParams {
  to: string;
  orderTotal: number;
  orderId?: string;
  discountCode?: string | null;
}

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function buildReceiptHtml(params: OrderReceiptParams): string {
  const total = formatUsd(params.orderTotal);
  const orderLine = params.orderId
    ? `<p style="margin:0 0 12px;color:#64748B;font-size:14px;">Order reference: ${params.orderId}</p>`
    : '';
  const discountLine = params.discountCode
    ? `<p style="margin:0 0 12px;color:#64748B;font-size:14px;">Discount applied: ${params.discountCode}</p>`
    : '';

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;background:#F5F0E8;font-family:Arial,Helvetica,sans-serif;color:#0A0A0A;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #0A0A0A20;">
      <h1 style="margin:0 0 8px;font-size:28px;letter-spacing:0.04em;">MADCAP TEES</h1>
      <p style="margin:0 0 24px;color:#64748B;font-size:14px;">Order confirmed</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">
        Thanks for your order. We appreciate the support — your gear will be produced and shipped soon.
      </p>
      ${orderLine}
      ${discountLine}
      <p style="margin:0 0 8px;font-size:14px;color:#64748B;">Order total</p>
      <p style="margin:0 0 24px;font-size:24px;font-weight:bold;">${total}</p>
      <p style="margin:0;font-size:13px;color:#64748B;line-height:1.5;">
        Questions? Reply to this email or visit madcaptees.com.
      </p>
    </div>
  </body>
</html>`;
}

/**
 * Send an order confirmation via Resend HTTP API.
 * No-ops when RESEND_API_KEY is missing. Never throws — logs failures.
 */
export async function sendOrderReceipt(params: OrderReceiptParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || process.env.SKIP_EMAILS === 'true') {
    return false;
  }

  if (!params.to || params.to === 'unknown@checkout.stripe') {
    console.warn('Skipping order receipt: missing customer email');
    return false;
  }

  const from =
    process.env.RESEND_FROM || 'Madcap Tees <onboarding@resend.dev>';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [params.to],
        subject: 'Order confirmed — Madcap Tees',
        html: buildReceiptHtml(params),
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.error('Resend email failed:', response.status, body);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Resend email error:', err);
    return false;
  }
}
