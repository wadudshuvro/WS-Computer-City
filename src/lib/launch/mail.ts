import nodemailer from 'nodemailer';
import { siteName, siteUrl } from '@/lib/launch/site';

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

export type AdminOrderMail = {
  orderNumber: string;
  placedAt: Date;
  firstName: string;
  lastName?: string | null;
  mobile: string;
  email?: string | null;
  address: string;
  upazila?: string | null;
  district: string;
  deliveryMethod: string;
  paymentMethod: string;
  comment?: string | null;
  items: {
    productName: string;
    productSku?: string | null;
    variantLabel?: string | null;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
};

/** Inbox that receives a copy of every new order. */
export function orderInbox(): string {
  return process.env.ORDER_NOTIFY_EMAIL || process.env.FEEDBACK_TO_EMAIL || 'wadudshuvro1993@gmail.com';
}

function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

const taka = (value: number) => `৳${Math.round(value).toLocaleString('en-US')}`;

const DELIVERY_NAMES: Record<string, string> = {
  HOME_DELIVERY: 'Home Delivery',
  STORE_PICKUP: 'Store Pickup',
  EXPRESS: 'Express Delivery',
};

/**
 * Emails the shop owner every new order with the full customer + item details.
 * Never throws: an email problem must not stop a customer from ordering.
 */
export async function sendAdminOrderEmail(mail: AdminOrderMail): Promise<'sent' | 'logged'> {
  try {
    const to = orderInbox();
    const customer = [mail.firstName, mail.lastName].filter(Boolean).join(' ');
    const subject = `New order ${mail.orderNumber} - ${customer} - ${taka(mail.total)}`;
    const itemLines = mail.items.map((item, index) => {
      const extra = [item.variantLabel, item.productSku ? `SKU ${item.productSku}` : null].filter(Boolean).join(', ');
      return `${index + 1}. ${item.productName}${extra ? ` (${extra})` : ''}\n   ${item.quantity} x ${taka(item.unitPrice)} = ${taka(item.lineTotal)}`;
    });
    const text = [
      `New order received on ${siteName()}`,
      '',
      `Order number: ${mail.orderNumber}`,
      `Placed at: ${mail.placedAt.toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' })} (Dhaka time)`,
      '',
      'CUSTOMER',
      `First name: ${mail.firstName}`,
      `Last name: ${mail.lastName || '-'}`,
      `Mobile: ${mail.mobile}`,
      `Email: ${mail.email || '-'}`,
      '',
      'DELIVERY',
      `Address: ${mail.address}`,
      `Upazila / Thana: ${mail.upazila || '-'}`,
      `District: ${mail.district}`,
      `Delivery method: ${DELIVERY_NAMES[mail.deliveryMethod] || mail.deliveryMethod}`,
      `Payment: ${mail.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : mail.paymentMethod}`,
      `Customer note: ${mail.comment || '-'}`,
      '',
      'ITEMS ORDERED',
      ...itemLines,
      '',
      `Subtotal: ${taka(mail.subtotal)}`,
      `Delivery fee: ${taka(mail.deliveryFee)}`,
      `TOTAL: ${taka(mail.total)}`,
      '',
      `Manage this order: ${siteUrl()}/admin/orders`,
    ].join('\n');

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.SMTP_FROM || 'LogicBay BD <noreply@localhost>';

    // 1) Direct SMTP (e.g. Gmail with an App Password) - fastest and most reliable.
    if (smtpConfigured()) {
      try {
        const transport = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Number(process.env.SMTP_PORT || 587) === 465,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
          connectionTimeout: 10_000,
          greetingTimeout: 10_000,
          socketTimeout: 15_000,
        });
        await transport.sendMail({
          // Gmail only accepts the authenticated address as the sender.
          from: from.includes(process.env.SMTP_USER || '\0') ? from : `${siteName()} <${process.env.SMTP_USER}>`,
          to,
          replyTo: mail.email || undefined,
          subject,
          text,
        });
        console.info(`[mail] admin copy of order ${mail.orderNumber} sent via SMTP to ${to}`);
        return 'sent';
      } catch (error) {
        console.error(`[mail] SMTP failed for order ${mail.orderNumber}`, error);
      }
    }

    // 2) Resend API
    if (apiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to: [to], reply_to: mail.email || undefined, subject, text }),
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) return 'sent';
      console.error(`[mail] provider rejected admin copy of order ${mail.orderNumber}: ${res.status}`);
    }

    const origin = siteUrl();
    const formId = process.env.FORMSUBMIT_FORM_ID || '1afc95c653c72f50a775bb9bf1c7b531';
    const res = await fetch(`https://formsubmit.co/ajax/${formId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: origin,
        Referer: `${origin}/checkout`,
      },
      body: JSON.stringify({
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        ...(mail.email ? { _replyto: mail.email } : {}),
        // One row per field, in this order. Do not add a "message" field: it
        // would repeat everything as a second block of text.
        'Order number': mail.orderNumber,
        'Placed at': `${mail.placedAt.toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' })} (Dhaka time)`,
        'First name': mail.firstName,
        'Last name': mail.lastName || '-',
        'Mobile number': mail.mobile,
        'Email address': mail.email || '-',
        Address: mail.address,
        'Upazila / Thana': mail.upazila || '-',
        District: mail.district,
        'Delivery method': DELIVERY_NAMES[mail.deliveryMethod] || mail.deliveryMethod,
        Payment: mail.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : mail.paymentMethod,
        'Customer note': mail.comment || '-',
        ...Object.fromEntries(
          mail.items.map((item, index) => [
            `Product ${index + 1}`,
            `${item.productName}${item.variantLabel ? ` (${item.variantLabel})` : ''}${item.productSku ? ` [SKU ${item.productSku}]` : ''} - ${item.quantity} x ${taka(item.unitPrice)} = ${taka(item.lineTotal)}`,
          ])
        ),
        Subtotal: taka(mail.subtotal),
        'Delivery fee': taka(mail.deliveryFee),
        'TOTAL TO COLLECT': taka(mail.total),
        'Manage order': `${siteUrl()}/admin/orders`,
      }),
      signal: AbortSignal.timeout(60_000),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok || (payload as { success?: string | boolean }).success === 'false') {
      console.error(`[mail] admin copy of order ${mail.orderNumber} failed: ${res.status}`, payload);
      return 'logged';
    }
    console.info(`[mail] admin copy of order ${mail.orderNumber} accepted for ${to}`, payload);
    return 'sent';
  } catch (error) {
    console.error(`[mail] admin copy of order ${mail.orderNumber} errored`, error);
    return 'logged';
  }
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
