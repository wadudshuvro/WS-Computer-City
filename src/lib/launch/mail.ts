import { siteUrl } from '@/lib/launch/site';

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

export type FeedbackMail = {
  name: string;
  phone: string;
  email?: string | null;
  area: 'Website' | 'Platform' | 'Product';
  subject: string;
  details: string;
  pageUrl?: string | null;
};

/** Inbox for the public “report a problem” form. */
export function feedbackInbox(): string {
  return process.env.FEEDBACK_TO_EMAIL || 'wadudshuvro1993@gmail.com';
}

export async function sendFeedbackEmail(mail: FeedbackMail): Promise<'sent' | 'logged'> {
  const to = feedbackInbox();
  const subject = `LogicBay BD — ${mail.area} issue: ${mail.subject}`;
  const text = [
    `A shopper reported a problem on the LogicBay BD ${mail.area.toLowerCase()}.`,
    '',
    `Issue area: ${mail.area}`,
    `Summary: ${mail.subject}`,
    '',
    'What they wrote:',
    mail.details,
    '',
    `Reported by: ${mail.name}`,
    `Phone: ${mail.phone}`,
    `Email: ${mail.email || 'Not given'}`,
    `Page: ${mail.pageUrl || 'Not given'}`,
  ].join('\n');
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.SMTP_FROM || 'LogicBay BD <noreply@localhost>';

  if (apiKey) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: mail.email || undefined,
        subject,
        text,
      }),
    });
    if (res.ok) return 'sent';
    console.error(`[mail] provider rejected feedback: ${res.status}`);
  }

  const origin = siteUrl();
  const formId = process.env.FORMSUBMIT_FORM_ID || '1afc95c653c72f50a775bb9bf1c7b531';
  const res = await fetch(`https://formsubmit.co/ajax/${formId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Origin: origin,
      Referer: `${origin}/feedback`,
    },
    body: JSON.stringify({
      _subject: subject,
      _template: 'box',
      _captcha: 'false',
      ...(mail.email ? { _replyto: mail.email, email: mail.email } : { email: to }),
      name: mail.name,
      'Issue area': mail.area,
      Summary: mail.subject,
      'What they wrote': mail.details,
      Phone: mail.phone,
      Page: mail.pageUrl || 'Not given',
      message: text,
    }),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`[mail] feedback delivery failed: ${res.status}`, payload);
    return 'logged';
  }
  console.info(`[mail] feedback accepted for ${to}`, payload);
  return 'sent';
}
