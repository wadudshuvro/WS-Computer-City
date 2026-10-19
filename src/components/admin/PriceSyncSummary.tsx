'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Summary = {
  run: {
    startedAt: string;
    finishedAt: string | null;
    updated: number;
    unchanged: number;
    flagged: number;
    failed: number;
    stoppedReason: string | null;
  } | null;
  flagged: Array<{ id: string; name: string; price: number; sourcePrice: number | null; reason: string | null }>;
};

export function PriceSyncSummary() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetch('/api/admin/price-sync')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setSummary(data))
      .catch(() => setSummary(null));
  }, []);

  if (!summary) return null;
  const run = summary.run;

  return (
    <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-gray-900">Price sync</h2>
      {run ? (
        <p className="mt-1 text-sm text-gray-600">
          Last run {new Date(run.startedAt).toLocaleString()}: updated {run.updated}, unchanged {run.unchanged}, flagged{' '}
          {run.flagged}, failed {run.failed}
          {run.stoppedReason ? `. Stopped: ${run.stoppedReason}` : ''}
        </p>
      ) : (
        <p className="mt-1 text-sm text-gray-600">No price sync has run yet.</p>
      )}
      {summary.flagged.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {summary.flagged.map((row) => (
            <li key={row.id}>
              <Link href={`/admin/products/${row.id}/edit`} className="text-amber-800 hover:underline">
                {row.name}
              </Link>
              <span className="text-gray-600">
                {' '}
                — selling ৳{row.price.toLocaleString()}
                {row.sourcePrice != null ? `, source ৳${row.sourcePrice.toLocaleString()}` : ''}. {row.reason}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
