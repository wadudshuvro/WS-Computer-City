'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';

type Row = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  subject: string;
  details: string;
  pageUrl: string | null;
  status: string;
  solvedAt: string | null;
  createdAt: string;
};

type Filter = 'OPEN' | 'SOLVED' | 'ALL';

export default function AdminFeedbackPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState<Filter>('OPEN');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    const res = await fetch('/api/admin/feedback');
    if (res.status === 401) {
      router.push('/admin/login');
      return;
    }
    const json = await res.json();
    setRows(json.data || []);
  }

  useEffect(() => {
    load()
      .catch(() => setError('Could not load reports.'))
      .finally(() => setLoading(false));
  }, [router]);

  async function setStatus(id: string, status: 'OPEN' | 'SOLVED') {
    setError('');
    const res = await fetch(`/api/admin/feedback/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setError('Could not update that report.');
      return;
    }
    setRows((current) => current.map((row) => (row.id === id ? { ...row, status, solvedAt: status === 'SOLVED' ? new Date().toISOString() : null } : row)));
  }

  const openCount = rows.filter((row) => row.status !== 'SOLVED').length;
  const solvedCount = rows.length - openCount;
  const visible = rows.filter((row) => filter === 'ALL' || row.status === filter);

  return (
    <AdminShell
      title="Issues"
      subtitle={`${openCount} open · ${solvedCount} solved`}
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Issues' }]}
    >
      <div className="mb-4 flex gap-2">
        {(
          [
            ['OPEN', `Open (${openCount})`],
            ['SOLVED', `Solved (${solvedCount})`],
            ['ALL', `All (${rows.length})`],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full px-3 py-1 text-sm ${filter === value ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            {label}
          </button>
        ))}
      </div>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      {loading ? (
        <p className="text-sm text-gray-500">Loading reports…</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-gray-500">No reports in this list.</p>
      ) : (
        <ul className="space-y-4">
          {visible.map((row) => {
            const solved = row.status === 'SOLVED';
            return (
              <li key={row.id} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${solved ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
                      {solved ? 'Solved' : 'Open'}
                    </span>
                    <h2 className="mt-2 font-semibold text-gray-900">{row.subject}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStatus(row.id, solved ? 'OPEN' : 'SOLVED')}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    {solved ? 'Mark as open' : 'Mark as solved'}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {row.name} · {row.phone}
                  {row.email ? ` · ${row.email}` : ''}
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm text-gray-800">{row.details}</p>
                <p className="mt-2 text-xs text-gray-500">
                  Submitted {new Date(row.createdAt).toLocaleString()}
                  {row.pageUrl ? ` · ${row.pageUrl}` : ''}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </AdminShell>
  );
}
