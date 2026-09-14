'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { MenuTreeItem } from '@/lib/menu';
import {
  formatAbsoluteUpdatedAt,
  formatRelativeUpdatedAt,
} from '@/lib/formatRelativeTime';

type CategoryOption = { id: string; name: string; slug: string };

type FormState = {
  name: string;
  slug: string;
  parentId: string;
  insertAfterId: string;
  href: string;
  categoryId: string;
  isVisible: boolean;
  hideArrow: boolean;
};

const emptyForm = (): FormState => ({
  name: '',
  slug: '',
  parentId: '',
  insertAfterId: '',
  href: '',
  categoryId: '',
  isVisible: true,
  hideArrow: false,
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function flattenForSelect(
  items: MenuTreeItem[],
  depth = 0
): Array<{ id: string; label: string; level: number }> {
  const out: Array<{ id: string; label: string; level: number }> = [];
  for (const item of items) {
    out.push({
      id: item.id,
      label: `${'— '.repeat(depth)}${item.name}`,
      level: item.level,
    });
    out.push(...flattenForSelect(item.children, depth + 1));
  }
  return out;
}

export default function AdminMenusPage() {
  const router = useRouter();
  const [tree, setTree] = useState<MenuTreeItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) router.push('/admin/login');
  }, [router]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [menusRes, catsRes] = await Promise.all([
        fetch('/api/admin/menus'),
        fetch('/api/admin/categories'),
      ]);
      const menusJson = await menusRes.json();
      const catsJson = await catsRes.json();
      if (!menusRes.ok) throw new Error(menusJson.error?.message || 'Failed to load menus');
      setTree(menusJson.data || []);
      setCategories(
        (catsJson.data || []).map((c: CategoryOption) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
        }))
      );
      setExpanded((prev) => {
        const next = { ...prev };
        for (const top of menusJson.data || []) {
          if (next[top.id] === undefined) next[top.id] = true;
        }
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const parentOptions = useMemo(() => {
    // Can only parent under level 0 or 1 (max depth 3)
    return flattenForSelect(tree).filter((i) => i.level < 2);
  }, [tree]);

  const siblingOptions = useMemo(() => {
    const parentId = form.parentId || null;
    const findUnder = (items: MenuTreeItem[]): MenuTreeItem[] => {
      if (!parentId) return items;
      const walk = (nodes: MenuTreeItem[]): MenuTreeItem[] | null => {
        for (const n of nodes) {
          if (n.id === parentId) return n.children;
          const r = walk(n.children);
          if (r) return r;
        }
        return null;
      };
      return walk(items) ?? [];
    };

    return findUnder(tree).filter((s) => s.id !== editingId);
  }, [tree, form.parentId, editingId]);

  const openCreate = (parentId = '') => {
    setEditingId(null);
    setForm({ ...emptyForm(), parentId });
    setFormOpen(true);
  };

  const openEdit = (item: MenuTreeItem, parentId: string) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      slug: item.slug,
      parentId,
      insertAfterId: '',
      href: item.href || '',
      categoryId: item.categoryId || '',
      isVisible: item.isVisible,
      hideArrow: item.hideArrow,
    });
    setFormOpen(true);
  };

  const save = async () => {
    try {
      setSaving(true);
      setError('');
      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        parentId: form.parentId || null,
        insertAfterId: form.insertAfterId || null,
        href: form.href || null,
        categoryId: form.categoryId || null,
        isVisible: form.isVisible,
        hideArrow: form.hideArrow,
      };

      const res = editingId
        ? await fetch(`/api/admin/menus/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/admin/menus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Save failed');
      setFormOpen(false);
      setEditingId(null);
      setForm(emptyForm());
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (item: MenuTreeItem) => {
    await fetch(`/api/admin/menus/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVisible: !item.isVisible }),
    });
    await load();
  };

  const move = async (id: string, direction: 'up' | 'down') => {
    await fetch(`/api/admin/menus/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ move: direction }),
    });
    await load();
  };

  const remove = async (item: MenuTreeItem) => {
    if (
      !confirm(
        `Delete “${item.name}”?${item.children.length ? ' All sub-menus will be deleted too.' : ''}`
      )
    ) {
      return;
    }
    await fetch(`/api/admin/menus/${item.id}`, { method: 'DELETE' });
    await load();
  };

  const renderRows = (items: MenuTreeItem[], parentId = '', depth = 0) =>
    items.map((item) => {
      const hasChildren = item.children.length > 0;
      const isOpen = expanded[item.id];
      return (
        <div key={item.id} className="border-b border-gray-100 last:border-0">
          <div
            className="flex items-center gap-2 py-2.5 px-2 hover:bg-gray-50"
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
          >
            <button
              type="button"
              className="w-6 h-6 flex items-center justify-center text-gray-400"
              onClick={() =>
                setExpanded((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
              }
              disabled={!hasChildren}
            >
              {hasChildren ? (
                isOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )
              ) : (
                <span className="w-4" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-gray-900 truncate">{item.name}</span>
                <span className="text-xs text-gray-400 truncate">{item.slug}</span>
                {!item.isVisible && (
                  <span className="text-[10px] uppercase tracking-wide bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                    Hidden
                  </span>
                )}
                {item.href && (
                  <span className="text-[10px] text-blue-600 truncate max-w-[160px]" title={item.href}>
                    custom URL
                  </span>
                )}
                {item.updatedAt && (
                  <span
                    className="text-[11px] text-gray-400 shrink-0"
                    title={formatAbsoluteUpdatedAt(item.updatedAt)}
                  >
                    Updated {formatRelativeUpdatedAt(item.updatedAt)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button type="button" variant="ghost" size="sm" onClick={() => move(item.id, 'up')}>
                <ArrowUp className="w-3.5 h-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => move(item.id, 'down')}>
                <ArrowDown className="w-3.5 h-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => toggleVisible(item)}>
                {item.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </Button>
              {item.level < 2 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => openCreate(item.id)}>
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              )}
              <Button type="button" variant="ghost" size="sm" onClick={() => openEdit(item, parentId)}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => remove(item)}>
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </Button>
            </div>
          </div>
          {hasChildren && isOpen && renderRows(item.children, item.id, depth + 1)}
        </div>
      );
    });

  return (
    <AdminShell
      title="Menus"
      subtitle="Manage the storefront top menu, sub-menus, and child flyouts"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Menus' },
      ]}
      actions={
        <Button type="button" onClick={() => openCreate('')}>
          <Plus className="w-4 h-4 mr-1" />
          Add top menu
        </Button>
      }
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {formOpen && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit menu item' : 'Add menu item'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Name</label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    name: e.target.value,
                    slug: f.slug && editingId ? f.slug : slugify(e.target.value),
                  }))
                }
                placeholder="e.g. Graphics Card"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Slug</label>
              <Input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                placeholder="graphics-card"
              />
            </div>

            {!editingId && (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Parent (empty = top bar)
                  </label>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={form.parentId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, parentId: e.target.value, insertAfterId: '' }))
                    }
                  >
                    <option value="">— Top level —</option>
                    {parentOptions.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Insert after
                  </label>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={form.insertAfterId}
                    onChange={(e) => setForm((f) => ({ ...f, insertAfterId: e.target.value }))}
                  >
                    <option value="">— End of list —</option>
                    {siblingOptions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Product category (optional)
              </label>
              <select
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.categoryId}
                onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              >
                <option value="">— None —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.slug})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Custom URL (optional, overrides category)
              </label>
              <Input
                value={form.href}
                onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
                placeholder="/products?category=components&sub=processor"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 mt-2">
              <input
                type="checkbox"
                checked={form.isVisible}
                onChange={(e) => setForm((f) => ({ ...f, isVisible: e.target.checked }))}
              />
              Visible on storefront
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 mt-2">
              <input
                type="checkbox"
                checked={form.hideArrow}
                onChange={(e) => setForm((f) => ({ ...f, hideArrow: e.target.checked }))}
              />
              Hide flyout arrow
            </label>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button type="button" onClick={save} disabled={saving || !form.name}>
              {saving ? 'Saving…' : editingId ? 'Update' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormOpen(false);
                setEditingId(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-gray-500">Loading menus…</p>
        ) : tree.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            No menu items yet. Click <strong>Add top menu</strong> or run{' '}
            <code className="bg-gray-100 px-1 rounded">npm run db:seed-menus</code>.
          </div>
        ) : (
          renderRows(tree)
        )}
      </div>
    </AdminShell>
  );
}
