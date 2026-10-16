import { describe, expect, it } from 'vitest';
import { canReadOrder } from '@/lib/auth/orderAccess';
import { createOrderSchema } from '@/lib/orders/schema';
import { updateProductSchema } from '@/lib/validations/product.schema';
import { signPaymentBody, signaturesMatch } from '@/lib/payments/webhook';
import { credentialsRateLimit } from '@/lib/auth/loginLimit';
import { MemoryRateStore } from '@/lib/rateLimit/memoryStore';
import { setRateStore } from '@/lib/rateLimit/limit';

describe('order access', () => {
  const order = { userId: 'user-a' };

  it('denies a customer reading another customer order', () => {
    expect(canReadOrder({ id: 'user-b', role: 'USER' }, order)).toBe(false);
    expect(canReadOrder({ id: 'user-b', role: 'USER' }, { userId: null })).toBe(false);
    expect(canReadOrder(null, order)).toBe(false);
  });

  it('allows the owner and an admin', () => {
    expect(canReadOrder({ id: 'user-a', role: 'USER' }, order)).toBe(true);
    expect(canReadOrder({ id: 'staff', role: 'ADMIN' }, order)).toBe(true);
  });
});

describe('mass assignment', () => {
  it('drops role, price, and payment status from a checkout body', () => {
    const parsed = createOrderSchema.parse({
      firstName: 'A',
      address: 'Road 1',
      district: 'Dhaka - City',
      mobile: '01711111111',
      email: 'a@example.com',
      deliveryMethod: 'STORE_PICKUP',
      paymentMethod: 'CASH_ON_DELIVERY',
      role: 'ADMIN',
      paymentStatus: 'PAID',
      items: [{ productId: 'p1', quantity: 1, unitPrice: 1, price: 1 }],
    });
    expect(parsed).not.toHaveProperty('role');
    expect(parsed).not.toHaveProperty('paymentStatus');
    expect(parsed.items[0]).not.toHaveProperty('unitPrice');
    expect(parsed.items[0]).not.toHaveProperty('price');
  });

  it('drops role from a product update', () => {
    const parsed = updateProductSchema.parse({
      name: 'Sample drive',
      role: 'SUPER_ADMIN',
      isAdmin: true,
    });
    expect(parsed).not.toHaveProperty('role');
    expect(parsed).not.toHaveProperty('isAdmin');
  });
});

describe('payment webhook', () => {
  it('rejects a forged signature', () => {
    const body = JSON.stringify({ id: 'evt_1', type: 'payment_succeeded', orderNumber: 'LB1', amount: 100 });
    expect(signaturesMatch(body, 'deadbeef', 'test-secret')).toBe(false);
    expect(signaturesMatch(body, null, 'test-secret')).toBe(false);
    expect(signaturesMatch(body, signPaymentBody(body, 'other-secret'), 'test-secret')).toBe(false);
    expect(signaturesMatch(body, signPaymentBody(body, 'test-secret'), 'test-secret')).toBe(true);
  });
});

describe('login rate limit', () => {
  it('returns 429 when the credentials callback is abused', async () => {
    setRateStore(new MemoryRateStore());
    const headers = new Headers({ 'x-forwarded-for': `203.0.113.${Date.now() % 200}` });
    const path = '/api/auth/callback/credentials';
    for (let i = 0; i < 8; i++) {
      expect(await credentialsRateLimit(path, headers, 'admin@example.com')).toBeNull();
    }
    const blocked = await credentialsRateLimit(path, headers, 'admin@example.com');
    expect(blocked?.status).toBe(429);
    expect(blocked?.headers.get('Retry-After')).toBeTruthy();
  });
});
