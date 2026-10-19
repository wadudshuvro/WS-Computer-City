import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendFeedbackEmail } from '@/lib/launch/mail';
import { guardAction } from '@/lib/rateLimit/http';

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(8).max(20),
  email: z.union([z.literal(''), z.string().trim().email().max(120)]).optional(),
  area: z.enum(['Website', 'Platform', 'Product']),
  subject: z.string().trim().min(3).max(120),
  details: z.string().trim().min(10).max(4000),
  pageUrl: z.string().trim().max(300).optional().or(z.literal('')),
  company: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  const limited = await guardAction(req, 'feedback');
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { message: 'Please fill in the form and try again.' } }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: 'Check your name, phone, subject, and details, then try again.' } },
      { status: 400 }
    );
  }

  if (parsed.data.company) {
    return NextResponse.json({ data: { ok: true } });
  }

  const email = parsed.data.email?.trim() || null;
  const pageUrl = parsed.data.pageUrl?.trim() || null;

  try {
    await prisma.$executeRaw`
      INSERT INTO site_messages (id, name, phone, email, subject, details, "pageUrl", "createdAt")
      VALUES (
        ${randomBytes(12).toString('hex')},
        ${parsed.data.name},
        ${parsed.data.phone},
        ${email},
        ${`${parsed.data.area}: ${parsed.data.subject}`},
        ${parsed.data.details},
        ${pageUrl},
        NOW()
      )
    `;
  } catch (error) {
    console.error('Failed to store site message', error);
    return NextResponse.json(
      { error: { message: 'We could not save your message. Please try again in a moment.' } },
      { status: 500 }
    );
  }

  await sendFeedbackEmail({
    name: parsed.data.name,
    phone: parsed.data.phone,
    email,
    area: parsed.data.area,
    subject: parsed.data.subject,
    details: parsed.data.details,
    pageUrl,
  });

  return NextResponse.json({ data: { ok: true } });
}
