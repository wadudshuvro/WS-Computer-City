'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  BatteryCharging,
  Box,
  Camera,
  CircuitBoard,
  Cpu,
  Fan,
  HardDrive,
  Headphones,
  Keyboard,
  MemoryStick,
  Monitor,
  Mouse,
  Plus,
  Printer,
  RefreshCw,
  Save,
  ShieldCheck,
  ShoppingCart,
  Speaker,
  Wifi,
  Wind,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { SHOW_LIVE_LOGO, TEST_LOGO_TEXT } from '@/lib/brandDisplay';
import { compatibilityWarnings, suggestedPsu, totalWatts } from '@/lib/pcBuilder/compat';
import { PC_BUILDER_SLOTS, type SlotDef, type SlotId } from '@/lib/pcBuilder/slots';
import { groupBySlot, usePcBuilderStore, type BuilderLine } from '@/store/pcBuilderStore';
import { useCartStore } from '@/store/cartStore';

const ICONS: Record<SlotId, LucideIcon> = {
  cpu: Cpu,
  'cpu-cooler': Fan,
  motherboard: CircuitBoard,
  ram: MemoryStick,
  storage: HardDrive,
  gpu: Cpu,
  psu: Zap,
  casing: Box,
  monitor: Monitor,
  'casing-cooler': Wind,
  keyboard: Keyboard,
  mouse: Mouse,
  speaker: Speaker,
  headphone: Headphones,
  wifi: Wifi,
  antivirus: ShieldCheck,
  ups: BatteryCharging,
};

const money = (n: number) => `${n.toLocaleString('en-US')}৳`;

const PRINT_CSS = `@media print {
  header, footer, body > nav, nav.sticky, .fixed, [data-no-print] { display: none !important; }
  body { background: #fff !important; }
}`;

const BLANK_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function SlotIcon({ id }: { id: SlotId }) {
  const Icon = ICONS[id];
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-indigo-50 text-indigo-700">
      <Icon className="h-5 w-5" />
    </span>
  );
}

function RequiredTag() {
  return <span className="ml-1.5 rounded bg-gray-600 px-1.5 py-px text-[10px] font-medium text-white">Required</span>;
}

function EmptyRow({ slot }: { slot: SlotDef }) {
  return (
    <div className="flex items-center gap-4 border-b border-gray-100 px-4 py-3">
      <SlotIcon id={slot.id} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-800">
          {slot.label}
          {slot.required && <RequiredTag />}
        </p>
        <div className="mt-2 space-y-1.5" aria-hidden>
          <div className="h-2 w-3/4 rounded bg-gray-100" />
          <div className="h-2 w-1/4 rounded bg-gray-100" />
        </div>
      </div>
      <Link
        href={`/pc-builder/${slot.id}`}
        data-no-shot
        className="shrink-0 rounded border border-indigo-700 px-5 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
      >
        Choose
      </Link>
    </div>
  );
}

function FilledRow({
  slot,
  line,
  onRemove,
  addMore,
}: {
  slot: SlotDef;
  line: BuilderLine;
  onRemove: () => void;
  addMore: boolean;
}) {
  return (
    <div className="border-b border-gray-100 px-4 py-3">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded bg-white">
          {line.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={line.imageUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain"
            />
          ) : (
            <SlotIcon id={slot.id} />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-indigo-700">
            {slot.label}
            {slot.required && <RequiredTag />}
          </p>
          <Link
            href={line.href}
            target="_blank"
            className="line-clamp-2 text-sm font-medium text-gray-900 hover:text-indigo-700"
          >
            {line.name}
          </Link>
          {line.watts != null && (
            <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-gray-500">
              <Zap className="h-3 w-3 text-orange-500" />
              {line.watts}W
            </span>
          )}
        </div>
        <p className="shrink-0 text-right text-sm font-bold text-gray-900">{money(line.price)}</p>
        <div className="flex shrink-0 items-center gap-1" data-no-shot>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${line.name}`}
            className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
          <Link
            href={`/pc-builder/${slot.id}?swap=${line.lineId}`}
            aria-label={`Change ${slot.label}`}
            className="rounded p-1.5 text-gray-500 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <RefreshCw className="h-4 w-4" />
          </Link>
        </div>
      </div>
      {addMore && (
        <Link
          href={`/pc-builder/${slot.id}?add=1`}
          data-no-shot
          className="ml-[72px] mt-2 inline-flex items-center gap-1 rounded bg-indigo-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-indigo-800"
        >
          <Plus className="h-3 w-3" /> Add Another {slot.noun}
        </Link>
      )}
    </div>
  );
}

export default function PcBuilderClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardRef = useRef<HTMLDivElement>(null);
  const lines = usePcBuilderStore((s) => s.lines);
  const removeLine = usePcBuilderStore((s) => s.removeLine);
  const setParts = usePcBuilderStore((s) => s.setParts);
  const clear = usePcBuilderStore((s) => s.clear);
  const addToCart = useCartStore((s) => s.addItem);

  const [mounted, setMounted] = useState(false);
  const [hideEmpty, setHideEmpty] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => setMounted(true), []);

  // Opening a shared link (?build=slug,slug) loads that build.
  useEffect(() => {
    const build = searchParams.get('build');
    if (!build) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/pc-builder/products?slugs=${encodeURIComponent(build)}`);
        const json = await res.json();
        if (cancelled) return;
        if (res.ok && json.data.products.length > 0) {
          setParts(json.data.products);
          setNotice({ kind: 'ok', text: 'Shared build loaded. Parts that are out of stock were left out.' });
        } else {
          setNotice({ kind: 'error', text: 'That shared build could not be loaded.' });
        }
      } catch {
        if (!cancelled) setNotice({ kind: 'error', text: 'That shared build could not be loaded.' });
      }
      router.replace('/pc-builder');
    })();
    return () => {
      cancelled = true;
    };
  }, [searchParams, setParts, router]);

  const visibleLines = mounted ? lines : [];
  const grouped = useMemo(() => groupBySlot(visibleLines), [visibleLines]);
  const total = visibleLines.reduce((sum, l) => sum + l.price, 0);
  const watts = totalWatts(visibleLines);
  const psu = suggestedPsu(watts);
  const warnings = useMemo(() => compatibilityWarnings(grouped), [grouped]);

  const missingRequired = PC_BUILDER_SLOTS.filter((slot) => slot.required && !grouped[slot.id]);

  const handleAddToCart = () => {
    if (visibleLines.length === 0) {
      setNotice({ kind: 'error', text: 'Choose at least one component first.' });
      return;
    }
    if (missingRequired.length > 0) {
      setNotice({
        kind: 'error',
        text: `Please choose the required components: ${missingRequired.map((s) => s.label).join(', ')}.`,
      });
      return;
    }
    for (const line of visibleLines) {
      addToCart({
        productId: line.id,
        slug: line.slug,
        name: line.name,
        imageUrl: line.imageUrl ?? undefined,
        unitPrice: line.price,
      });
    }
    router.push('/cart');
  };

  const handleSave = async () => {
    if (visibleLines.length === 0) {
      setNotice({ kind: 'error', text: 'Choose at least one component before saving.' });
      return;
    }
    const link = `${window.location.origin}/pc-builder?build=${visibleLines.map((l) => l.slug).join(',')}`;
    try {
      await navigator.clipboard.writeText(link);
      setNotice({ kind: 'ok', text: 'Link copied. Open it on any device to load this build.' });
    } catch {
      window.prompt('Copy this link to open the build later:', link);
    }
  };

  const handleScreenshot = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: '#ffffff',
        cacheBust: true,
        pixelRatio: 2,
        imagePlaceholder: BLANK_PIXEL,
        filter: (node) => !(node instanceof HTMLElement && node.hasAttribute('data-no-shot')),
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'pc-build.png';
      a.click();
    } catch {
      setNotice({ kind: 'error', text: 'Screenshot failed. Use Print and save as PDF instead.' });
    } finally {
      setBusy(false);
    }
  };

  const renderGroup = (group: SlotDef['group'], title: string) => {
    const slots = PC_BUILDER_SLOTS.filter((s) => s.group === group);
    const rows = slots.flatMap((slot) => {
      const items = grouped[slot.id] ?? [];
      if (items.length === 0) {
        return hideEmpty ? [] : [<EmptyRow key={slot.id} slot={slot} />];
      }
      return items.map((line, index) => (
        <FilledRow
          key={line.lineId}
          slot={slot}
          line={line}
          onRemove={() => removeLine(line.lineId)}
          addMore={index === items.length - 1 && items.length < slot.max}
        />
      ));
    });
    if (rows.length === 0) return null;
    return (
      <section>
        <h2 className="bg-slate-500 px-3 py-1 text-[11px] font-semibold text-white">{title}</h2>
        {rows}
      </section>
    );
  };

  const actions = [
    { label: 'Add to Cart', icon: ShoppingCart, onClick: handleAddToCart },
    { label: 'Save PC', icon: Save, onClick: handleSave },
    { label: 'Print', icon: Printer, onClick: () => window.print() },
    { label: busy ? 'Saving…' : 'Screenshot', icon: Camera, onClick: handleScreenshot },
  ];

  return (
    <div className="bg-gray-100 pb-10">
      <style>{PRINT_CSS}</style>
      <div className="container mx-auto px-4">
        <nav className="py-3 text-xs text-gray-500" aria-label="Breadcrumb" data-no-print>
          <Link href="/" className="hover:text-gray-800">
            Home
          </Link>{' '}
          / <span>PC Builder</span>
        </nav>

        <div ref={cardRef} className="mx-auto max-w-3xl rounded border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            {SHOW_LIVE_LOGO ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/logo.png" alt="LogicBay BD" className="h-8 w-auto" />
            ) : (
              <span className="text-base font-medium text-gray-900">{TEST_LOGO_TEXT}</span>
            )}
            <div className="flex items-center gap-4" data-no-shot data-no-print>
              {actions.map(({ label, icon: Icon, onClick }) => (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  className="flex flex-col items-center gap-1 text-[11px] font-medium text-gray-700 hover:text-indigo-700"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
            <div>
              <h1 className="text-sm font-semibold text-indigo-800">PC Builder - Build Your Own Computer</h1>
              <label className="mt-1 flex items-center gap-1.5 text-xs text-gray-500" data-no-shot data-no-print>
                <input
                  type="checkbox"
                  checked={hideEmpty}
                  onChange={(e) => setHideEmpty(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-gray-300"
                />
                Hide Unconfigured Components
              </label>
            </div>
            <div className="flex items-stretch gap-2">
              <div
                className="flex min-w-[96px] flex-col items-center justify-center rounded border border-red-200 px-3 py-1.5"
                title={psu > 0 ? `Suggested power supply: ${psu}W or more` : undefined}
              >
                <span className="text-base font-bold text-gray-900">{watts}W</span>
                <span className="text-[10px] text-gray-500">Estimated Wattage</span>
              </div>
              <div className="flex min-w-[120px] flex-col items-center justify-center rounded bg-indigo-700 px-4 py-1.5 text-white">
                <span className="text-lg font-bold">{money(total)}</span>
                <span className="text-[10px] opacity-90">
                  {visibleLines.length} {visibleLines.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>
            </div>
          </div>

          {psu > 0 && (
            <p className="px-4 pb-2 text-xs text-gray-500">
              Suggested power supply: <strong className="text-gray-800">{psu}W or more</strong>. Wattage is an
              estimate from each part&apos;s listed power use and typical values.
            </p>
          )}

          {(warnings.length > 0 || notice) && (
            <div className="space-y-2 px-4 pb-3" data-no-shot data-no-print>
              {warnings.map((w) => (
                <p key={w} className="flex items-start gap-2 rounded bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  <AlertTriangle className="mt-px h-4 w-4 shrink-0" />
                  {w}
                </p>
              ))}
              {notice && (
                <p
                  role="status"
                  className={`rounded px-3 py-2 text-xs ${
                    notice.kind === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {notice.text}
                </p>
              )}
            </div>
          )}

          {renderGroup('core', 'Core Components')}
          {renderGroup('peripherals', 'Peripherals & Others')}

          {mounted && visibleLines.length > 0 && (
            <div className="flex justify-end px-4 py-3" data-no-shot data-no-print>
              <button
                type="button"
                onClick={() => {
                  clear();
                  setNotice(null);
                }}
                className="text-xs text-gray-500 underline hover:text-red-600"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
