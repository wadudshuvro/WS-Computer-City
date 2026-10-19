'use client';

import { Plus, Trash2 } from 'lucide-react';

type SpecRow = { name: string; value: string };
type SpecGroup = { title: string; rows: SpecRow[] };

export function parseSpecTable(raw: string | undefined): SpecGroup[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as SpecGroup[];
    return Array.isArray(parsed)
      ? parsed
          .filter((group) => group && typeof group.title === 'string' && Array.isArray(group.rows))
          .map((group) => ({
            title: group.title,
            rows: group.rows.map((row) => ({ name: String(row?.name ?? ''), value: String(row?.value ?? '') })),
          }))
      : [];
  } catch {
    return [];
  }
}

interface SpecTableEditorProps {
  value: string;
  onChange: (next: string) => void;
}

/**
 * Edits the grouped specification table shown on the product page.
 * Each row value is multi-line: one line in the box is one line on the storefront.
 */
export default function SpecTableEditor({ value, onChange }: SpecTableEditorProps) {
  const groups = parseSpecTable(value);

  const commit = (next: SpecGroup[]) => onChange(next.length > 0 ? JSON.stringify(next) : '');

  const updateRow = (gi: number, ri: number, patch: Partial<SpecRow>) =>
    commit(
      groups.map((group, g) =>
        g !== gi ? group : { ...group, rows: group.rows.map((row, r) => (r === ri ? { ...row, ...patch } : row)) }
      )
    );

  return (
    <div className="space-y-5">
      {groups.map((group, gi) => (
        <div key={gi} className="rounded border border-gray-200">
          <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-3 py-2">
            <input
              value={group.title}
              onChange={(e) => commit(groups.map((g, i) => (i === gi ? { ...g, title: e.target.value } : g)))}
              className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm font-semibold text-gray-800"
              aria-label="Group title"
            />
            <button
              type="button"
              onClick={() => commit(groups.filter((_, i) => i !== gi))}
              className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
              aria-label="Remove group"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {group.rows.map((row, ri) => (
              <div key={ri} className="grid grid-cols-1 gap-2 p-3 md:grid-cols-[220px_1fr_auto]">
                <input
                  value={row.name}
                  onChange={(e) => updateRow(gi, ri, { name: e.target.value })}
                  placeholder="Label (e.g. Display)"
                  className="h-9 rounded border border-gray-300 px-2 text-sm"
                  aria-label="Row label"
                />
                <textarea
                  value={row.value}
                  onChange={(e) => updateRow(gi, ri, { value: e.target.value })}
                  rows={Math.min(Math.max(row.value.split('\n').length, 1), 10)}
                  placeholder="One detail per line"
                  className="rounded border border-gray-300 px-2 py-1.5 text-sm"
                  aria-label="Row value"
                />
                <button
                  type="button"
                  onClick={() =>
                    commit(groups.map((g, i) => (i === gi ? { ...g, rows: g.rows.filter((_, r) => r !== ri) } : g)))
                  }
                  className="h-9 rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove row"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <div className="p-3">
              <button
                type="button"
                onClick={() =>
                  commit(groups.map((g, i) => (i === gi ? { ...g, rows: [...g.rows, { name: '', value: '' }] } : g)))
                }
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                <Plus className="h-4 w-4" /> Add row
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => commit([...groups, { title: 'New Group', rows: [{ name: '', value: '' }] }])}
        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        <Plus className="h-4 w-4" /> Add group
      </button>
    </div>
  );
}
