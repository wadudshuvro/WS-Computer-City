import type { Metadata } from 'next';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { siteName } from '@/lib/launch/site';

export const metadata: Metadata = {
  title: `Report a problem | ${siteName()}`,
  description: `Tell ${siteName()} about a page, product, or order problem. We read every message.`,
  alternates: { canonical: '/feedback' },
  robots: { index: true, follow: true },
};

export default function FeedbackPage() {
  return (
    <main className="bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-lg bg-white px-6 py-10 shadow-sm sm:px-12">
        <h1 className="text-center text-2xl font-semibold text-sky-500">Report a problem</h1>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-6 text-gray-600">
          Tell us whether the problem is on the website, the platform, or a product. We will review it and follow up when we can.
        </p>
        <hr className="my-8 border-gray-200" />
        <FeedbackForm />
      </div>
    </main>
  );
}
