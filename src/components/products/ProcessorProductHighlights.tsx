import Link from 'next/link';

interface ProcessorProductHighlightsProps {
  stockStatus: string;
  stockLabel: string;
  brand: { name: string; slug: string };
  sku: string;
  shortDescription?: string;
  getSpecValue: (key: string) => string | null;
}

function featureLinesFromShortDescription(text?: string): string[] {
  return (text || '')
    .split(/\r?\n|•/)
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 8);
}

function stripGhz(value: string | null): string | null {
  if (!value) return null;
  return value.replace(/\s*GHz$/i, '').trim() || value;
}

function featureLinesFromSpecs(getSpecValue: (key: string) => string | null): string[] {
  const lines: string[] = [];
  const model = getSpecValue('processor_model') || getSpecValue('model_number');
  if (model) lines.push(`Model: ${model}`);

  const base = stripGhz(getSpecValue('base_clock'));
  const boost = stripGhz(getSpecValue('boost_clock'));
  if (base) {
    lines.push(
      boost ? `Clock Speed: ${base} GHz up to ${boost} GHz` : `Clock Speed: ${base} GHz`
    );
  }

  const cache = getSpecValue('cache_size');
  const socket = getSpecValue('socket_type');
  if (cache && socket) lines.push(`Cache: ${cache}, Socket: ${socket}`);
  else if (cache) lines.push(`Cache: ${cache}`);
  else if (socket) lines.push(`Socket: ${socket}`);

  const cores = getSpecValue('number_of_cores');
  const threads = getSpecValue('number_of_threads');
  if (cores && threads) {
    lines.push(`CPU Cores: ${cores}; CPU Threads: ${threads}`);
  } else if (cores) {
    lines.push(`CPU Cores: ${cores}`);
  } else if (threads) {
    lines.push(`CPU Threads: ${threads}`);
  }

  const graphics = getSpecValue('integrated_graphics');
  if (graphics) lines.push(graphics);

  return lines;
}

export function ProcessorProductHighlights({
  stockStatus,
  stockLabel,
  brand,
  sku,
  shortDescription,
  getSpecValue,
}: ProcessorProductHighlightsProps) {
  const lines = featureLinesFromShortDescription(shortDescription);
  const keyFeatures = lines.length > 0 ? lines : featureLinesFromSpecs(getSpecValue);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            stockStatus === 'IN_STOCK'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {stockLabel}
        </span>
        <span className="text-gray-500">
          PID: <span className="text-gray-900">{sku}</span>
        </span>
        <span className="text-gray-500">
          Brand:{' '}
          <Link href={`/brands/${brand.slug}`} className="text-blue-600 hover:underline">
            {brand.name}
          </Link>
        </span>
      </div>

      {keyFeatures.length > 0 && (
        <div className="mb-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">Key Features</h2>
          <ul className="list-none space-y-1 text-sm text-gray-700">
            {keyFeatures.map((line) => (
              <li key={line} className="leading-snug">
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
