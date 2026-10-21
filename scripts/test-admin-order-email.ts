/**
 * Sends one sample "new order" email to the admin inbox and prints the provider response.
 * Usage: npx tsx scripts/test-admin-order-email.ts
 */
import { orderInbox, sendAdminOrderEmail } from '../src/lib/launch/mail';

async function main() {
  console.log(`Sending sample order email to ${orderInbox()} ...`);
  const result = await sendAdminOrderEmail({
    orderNumber: 'LB-TEST-0001',
    placedAt: new Date(),
    firstName: 'Test',
    lastName: 'Customer',
    mobile: '01712345678',
    email: 'customer@example.com',
    address: 'House 1, Road 2, Test Area',
    upazila: 'Mirpur',
    district: 'Dhaka - City',
    deliveryMethod: 'HOME_DELIVERY',
    paymentMethod: 'CASH_ON_DELIVERY',
    comment: 'Sample email from scripts/test-admin-order-email.ts',
    items: [{ productName: 'Sample Product', productSku: 'SKU-1', quantity: 2, unitPrice: 100, lineTotal: 200 }],
    subtotal: 200,
    deliveryFee: 60,
    total: 260,
  });
  console.log('Result:', result);
}

main();
