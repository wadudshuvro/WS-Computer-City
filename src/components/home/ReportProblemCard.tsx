'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2, MessageSquareWarning, Send } from 'lucide-react';

const AREAS = [
  { value: 'Website', label: 'Website' },
  { value: 'Product', label: 'Product' },
  { value: 'Platform', label: 'Order / other' },
] as const;

type Area = (typeof AREAS)[number]['value'];

const inputClass =
  'w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-orange-400 focus:bg-white/15 focus:ring-2 focus:ring-orange-400/30';

export function ReportProblemCard({ className = '' }: { className?: string }) {
  const [area, setArea] = useState<Area>('Website');
  const [details, setDetails] = useState('');
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const text = details.trim();
    if (text.length < 10) {
      setError('Please describe the problem in a few more words.');
      return;
    }
    setPending(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          phone: form.get('phone'),
          email: '',
          area,
          subject: text.replace(/\s+/g, ' ').slice(0, 80),
          details: text,
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

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#10204a] via-[#1d3a8a] to-[#2563eb] p-5 text-white shadow-lg ${className}`}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-orange-400/25 blur-3xl" />

      {sent ? (
        <div className="relative flex flex-1 flex-col items-center justify-center text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-300" />
          <h3 className="mt-3 text-lg font-semibold text-white">Thanks, we got it</h3>
          <p className="mt-1 max-w-[16rem] text-sm text-white/80">
            Our team will look into it and call you if we need more detail.
          </p>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setDetails('');
            }}
            className="mt-4 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold transition hover:bg-white/25"
          >
            Report something else
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="relative flex flex-1 flex-col gap-2.5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 shadow-md">
              <MessageSquareWarning className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-semibold leading-tight text-white">Something not working?</h3>
              <p className="mt-0.5 text-xs text-white/75">Tell us here. It goes straight to our team.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="What is the problem about?">
            {AREAS.map((item) => (
              <button
                key={item.value}
                type="button"
                role="radio"
                aria-checked={area === item.value}
                onClick={() => setArea(item.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  area === item.value
                    ? 'bg-white text-blue-900 shadow'
                    : 'bg-white/10 text-white/85 ring-1 ring-white/20 hover:bg-white/20'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              rows={3}
              maxLength={600}
              placeholder="What went wrong? Which page or product?"
              aria-label="Describe the problem"
              className={`${inputClass} resize-none`}
            />
            <span className="pointer-events-none absolute bottom-1.5 right-2.5 text-[10px] text-white/40">
              {details.length}/600
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input name="name" required minLength={2} maxLength={80} placeholder="Your name" className={inputClass} />
            <input
              name="phone"
              required
              minLength={8}
              maxLength={20}
              inputMode="tel"
              placeholder="Phone number"
              className={inputClass}
            />
          </div>
          <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

          {error && (
            <p className="text-xs font-medium text-orange-200" role="alert">
              {error}
            </p>
          )}

          <div className="mt-auto flex items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold shadow-md transition hover:bg-orange-600 disabled:opacity-60"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {pending ? 'Sending…' : 'Send to our team'}
            </button>
            <Link href="/feedback" className="text-xs text-white/70 underline-offset-2 hover:text-white hover:underline">
              Full form
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
