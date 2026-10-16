export type OrderMail = {
  to: string;
  orderNumber: string;
  total: number;
  firstName: string;
};

/**
 * Sends the order receipt when RESEND_API_KEY is set.
 * Without a key, the message is logged so local checkout still completes.
 *
 * DNS (add these on the domain after you buy it, before mail goes to customers):
 * - SPF:  v=spf1 include:amazonses.com ~all   (use the include your provider documents)
 * - DKIM: the provider's CNAME records on the sending domain
 * - DMARC: v=DMARC1; p=none; rua=mailto:you@yourdomain
 */
export async function sendOrderEmail(mail: OrderMail): Promise<'sent' | 'logged'> {
  const subject = `Order ${mail.orderNumber} received`;
  const text = `Hello ${mail.firstName}, we received order ${mail.orderNumber}. Total: ৳${mail.total}. We will confirm it by phone.`;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.SMTP_FROM || 'LogicBay BD <noreply@localhost>';

  if (!apiKey) {
    console.info(`[mail] (not sent, no RESEND_API_KEY) to=${mail.to} ${subject}`);
    return 'logged';
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [mail.to], subject, text }),
  });
  if (!res.ok) {
    console.error(`[mail] provider rejected order ${mail.orderNumber}: ${res.status}`);
    return 'logged';
  }
  return 'sent';
}
