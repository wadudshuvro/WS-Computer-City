'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  CreditCard,
  Truck,
  Package,
  ClipboardList,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import {
  BD_DISTRICTS,
  DELIVERY_OPTIONS,
  DeliveryMethodId,
  getDeliveryFee,
} from '@/lib/cart/delivery';

interface FormErrors {
  firstName?: string;
  email?: string;
  address?: string;
  mobile?: string;
  agree?: string;
  form?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const clearCart = useCartStore((s) => s.clearCart);
  const [hydrated, setHydrated] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [upazila, setUpazila] = useState('');
  const [district, setDistrict] = useState<string>(BD_DISTRICTS[0]);
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodId>('HOME_DELIVERY');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const deliveryFee = useMemo(() => getDeliveryFee(deliveryMethod), [deliveryMethod]);
  const total = subtotal + deliveryFee;
  const selectedDeliveryLabel =
    DELIVERY_OPTIONS.find((o) => o.id === deliveryMethod)?.label ?? 'Home Delivery';

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!firstName.trim()) next.firstName = 'First name is required';
    const emailValue = email.trim();
    if (!emailValue) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      next.email = 'Enter a valid email address';
    }
    if (!address.trim()) next.address = 'Address is required';
    const phone = mobile.trim();
    if (!phone) next.mobile = 'Mobile number is required';
    else if (!/^(\+?88)?01[3-9]\d{8}$/.test(phone.replace(/[\s-]/g, ''))) {
      next.mobile = 'Enter a valid Bangladesh mobile number';
    }
    if (!agree) next.agree = 'Please agree to the terms and policies';
    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    if (items.length === 0) {
      setErrors({ form: 'Your cart is empty' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim() || undefined,
          address: address.trim(),
          upazila: upazila.trim() || undefined,
          district,
          mobile: mobile.trim(),
          email: email.trim(),
          comment: comment.trim() || undefined,
          deliveryMethod,
          paymentMethod: 'CASH_ON_DELIVERY',
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.name,
            productSlug: item.slug,
            imageUrl: item.imageUrl,
            variantLabel: item.variantLabel,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors({ form: data?.error?.message || 'Failed to place order' });
        return;
      }

      clearCart();
      router.push(`/checkout/success?order=${encodeURIComponent(data.data.orderNumber)}`);
    } catch {
      setErrors({ form: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-gray-50 text-gray-500">
        Loading checkout…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Nothing to checkout</h1>
          <p className="mt-2 text-gray-600">Add products to your cart first.</p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <nav className="mb-3 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/cart" className="hover:text-blue-600">
            Shopping Cart
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Checkout</span>
        </nav>

        <h1 className="mb-4 text-2xl font-bold text-gray-900">Checkout</h1>

        <div className="mb-6 rounded-md border border-teal-200 bg-[#e0f2f1] px-4 py-3 text-sm leading-relaxed text-gray-800">
          কারিগরী ত্রুটির কারণে পণ্যের মূল্য অসংগতিপূর্ণ হলে, LogicBay BD কর্তৃপক্ষ অর্ডার বাতিলের অধিকার সংরক্ষণ করে। অনুগ্রহ করে কাস্টমার সাপোর্ট এজেন্টের কনফার্মেশন ব্যতীত কোনো ধরনের পেমেন্ট প্রসেড না করার অনুরোধ করা হচ্ছে।
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3" noValidate>
          <div className="space-y-5 lg:col-span-2">
            {/* Shipping & Billing */}
            <section className="rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                <MapPin className="h-4 w-4 text-orange-500" />
                <h2 className="font-semibold text-gray-900">Shipping &amp; Billing</h2>
              </div>
              <div className="grid gap-4 p-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.firstName ? 'border-red-400' : 'border-gray-300'
                    }`}
                    autoComplete="given-name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    autoComplete="family-name"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-400' : 'border-gray-300'
                    }`}
                    autoComplete="email"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-400' : 'border-gray-300'
                    }`}
                    autoComplete="street-address"
                  />
                  {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Upazila / Thana</label>
                  <input
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value)}
                    placeholder="Upazila / Thana"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {BD_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2 sm:max-w-md">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.mobile ? 'border-red-400' : 'border-gray-300'
                    }`}
                    autoComplete="tel"
                    inputMode="tel"
                  />
                  {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Any special requirement/instruction for us?"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Payment + Delivery — same row (Star Tech layout) */}
            <div className="grid gap-4 md:grid-cols-2">
              <section className="rounded-lg border border-gray-200 bg-white">
                <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                  <CreditCard className="h-4 w-4 text-orange-500" />
                  <h2 className="font-semibold text-gray-900">Payment Method</h2>
                </div>
                <div className="p-4">
                  <p className="mb-3 text-sm text-gray-500">Select a payment method</p>
                  <div className="space-y-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2.5">
                      <input
                        type="radio"
                        name="payment"
                        checked
                        readOnly
                        className="h-4 w-4 accent-blue-600"
                      />
                      <span className="text-sm font-medium text-gray-900">Cash on Delivery</span>
                    </label>
                    <label className="flex cursor-not-allowed items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 opacity-60">
                      <input type="radio" name="payment" disabled className="h-4 w-4" />
                      <span className="text-sm font-medium text-gray-500">Online Payment</span>
                      <span className="ml-auto text-xs text-gray-400">Soon</span>
                    </label>
                    <label className="flex cursor-not-allowed items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 opacity-60">
                      <input type="radio" name="payment" disabled className="h-4 w-4" />
                      <span className="text-sm font-medium text-gray-500">POS on Delivery</span>
                      <span className="ml-auto text-xs text-gray-400">Soon</span>
                    </label>
                  </div>
                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <p className="mb-2 text-xs font-medium text-gray-600">We Accept:</p>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold tracking-wide text-gray-500">
                      <span className="rounded border border-gray-200 bg-white px-1.5 py-0.5">Cash</span>
                      <span className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-blue-700">VISA</span>
                      <span className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-red-600">MC</span>
                      <span className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-pink-600">bKash</span>
                      <span className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-orange-600">Nagad</span>
                      <span className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-emerald-600">Upay</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-gray-200 bg-white">
                <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                  <Truck className="h-4 w-4 text-orange-500" />
                  <h2 className="font-semibold text-gray-900">Delivery Method</h2>
                </div>
                <div className="p-4">
                  <p className="mb-3 text-sm text-gray-500">Select a delivery method</p>
                  <div className="space-y-2">
                    {DELIVERY_OPTIONS.map((option) => (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 ${
                          deliveryMethod === option.id
                            ? 'border-blue-200 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryMethod === option.id}
                          onChange={() => setDeliveryMethod(option.id)}
                          className="h-4 w-4 accent-blue-600"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {option.label} - {option.fee}৳
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Products */}
            <section className="rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                <Package className="h-4 w-4 text-orange-500" />
                <h2 className="font-semibold text-gray-900">Products</h2>
              </div>
              <ul className="divide-y divide-gray-100">
                {items.map((item) => (
                  <li key={item.id} className="flex items-start gap-3 px-4 py-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-gray-100">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.quantity} X {item.name}
                      </p>
                      {item.variantLabel && (
                        <span className="mt-1 inline-block rounded bg-orange-50 px-2 py-0.5 text-xs text-orange-700">
                          {item.variantLabel}
                        </span>
                      )}
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-gray-900">
                      {(item.unitPrice * item.quantity).toLocaleString()}৳
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Order summary */}
          <aside className="h-fit lg:sticky lg:top-4">
            <section className="rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                <ClipboardList className="h-4 w-4 text-orange-500" />
                <h2 className="font-semibold text-gray-900">Order Summary</h2>
              </div>
              <div className="space-y-3 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sub-Total:</span>
                  <span className="font-medium">{Math.round(subtotal).toLocaleString()}৳</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{selectedDeliveryLabel}:</span>
                  <span className="font-medium">{deliveryFee.toLocaleString()}৳</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold">
                  <span>Total:</span>
                  <span className="text-red-600">{Math.round(total).toLocaleString()}৳</span>
                </div>

                <label className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-gray-700">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 h-4 w-4"
                  />
                  <span>
                    I have read and agree to the{' '}
                    <Link href="/terms" className="font-medium text-red-600 hover:underline">
                      Terms and Conditions
                    </Link>
                    ,{' '}
                    <span className="font-medium text-red-600">Privacy Policy</span> and{' '}
                    <span className="font-medium text-red-600">Refund and Return Policy</span>
                  </span>
                </label>
                {errors.agree && <p className="text-xs text-red-600">{errors.agree}</p>}
                {errors.form && <p className="text-xs text-red-600">{errors.form}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Placing order…' : 'Confirm Order'}
                </button>
              </div>
            </section>
          </aside>
        </form>
      </div>
    </div>
  );
}
