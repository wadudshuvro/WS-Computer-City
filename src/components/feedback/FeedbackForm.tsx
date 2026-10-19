'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

const areas = ['Website', 'Platform', 'Product'] as const;

export function FeedbackForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          phone: form.get('phone'),
          email: form.get('email'),
          area: form.get('area'),
          subject: form.get('subject'),
          details: form.get('details'),
          pageUrl: window.location.href,
          company: form.get('company'),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error?.message || 'We could not send that. Please try again.');
        return;
      }
      setSent(true);
    } catch {
      setError('We could not send that. Please check your connection and try again.');
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center">
        <h2 className="text-xl font-semibold text-emerald-900">Message received</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-emerald-800">
          Thank you. We have your note and will follow up if we need more detail.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-blue-700 hover:underline">
          Back to the shop
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-gray-900">
          Full name <span className="text-red-600">*</span>
          <input
            name="name"
            required
            minLength={2}
            maxLength={80}
            placeholder="Your name"
            className="mt-2 w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm font-normal outline-none focus:border-blue-600"
          />
        </label>
        <label className="block text-sm font-semibold text-gray-900">
          Phone <span className="text-red-600">*</span>
          <input
            name="phone"
            required
            minLength={8}
            maxLength={20}
            inputMode="tel"
            placeholder="Your mobile number"
            className="mt-2 w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm font-normal outline-none focus:border-blue-600"
          />
        </label>
      </div>
      <label className="block text-sm font-semibold text-gray-900">
        Email
        <input
          name="email"
          type="email"
          maxLength={120}
          placeholder="So we can reply, if you want"
          className="mt-2 w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm font-normal outline-none focus:border-blue-600"
        />
      </label>
      <label className="block text-sm font-semibold text-gray-900">
        Where is the problem? <span className="text-red-600">*</span>
        <select
          name="area"
          required
          defaultValue="Website"
          className="mt-2 w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm font-normal outline-none focus:border-blue-600"
        >
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-semibold text-gray-900">
        Short summary <span className="text-red-600">*</span>
        <input
          name="subject"
          required
          minLength={3}
          maxLength={120}
          placeholder="Example: The search box does nothing"
          className="mt-2 w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm font-normal outline-none focus:border-blue-600"
        />
      </label>
      <label className="block text-sm font-semibold text-gray-900">
        Details <span className="text-red-600">*</span>
        <textarea
          name="details"
          required
          minLength={10}
          maxLength={4000}
          rows={5}
          placeholder="What happened, and which page were you on?"
          className="mt-2 w-full resize-y border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm font-normal outline-none focus:border-blue-600"
        />
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-sky-500 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Submit your message'}
      </button>
    </form>
  );
}
