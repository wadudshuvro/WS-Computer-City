import Link from 'next/link';
import {
  getMotherboardHighlightLines,
  getMotherboardModelName,
} from '@/lib/motherboardPdpDisplay';

interface MotherboardProductHighlightsProps {
  stockStatus: string;
  stockLabel: string;
  brand: { name: string; slug: string };
  productName: string;
  sku?: string;
  getSpecValue: (key: string) => string | null;
}

function FeatureBox({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-gray-200 rounded-md px-4 py-2.5 text-sm bg-white ${className}`}
    >
      <span className="text-gray-700">{label} : </span>
      {children}
    </div>
  );
}

export function MotherboardProductHighlights({
  stockStatus,
  stockLabel,
  brand,
  productName,
  sku,
  getSpecValue,
}: MotherboardProductHighlightsProps) {
  const model = getMotherboardModelName(productName);
  const warranty = getSpecValue('warranty') || 'No Warranty';
  const isInStock = stockStatus === 'IN_STOCK';
  const lines = getMotherboardHighlightLines(getSpecValue);

  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 gap-2 mb-3">
        <FeatureBox label="Stock">
          <span className={isInStock ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
            {stockLabel}
          </span>
        </FeatureBox>
        <FeatureBox label="PID">
          <span className="text-gray-900 font-medium">{sku || '—'}</span>
        </FeatureBox>
        <FeatureBox label="Brand">
          <Link
            href={`/brands/${brand.slug}`}
            className="text-gray-900 font-medium hover:text-blue-600 hover:underline"
          >
            {brand.name}
          </Link>
        </FeatureBox>
        <FeatureBox label="Model">
          <span className="text-gray-900 font-medium">{model}</span>
        </FeatureBox>
        <FeatureBox label="Warranty" className="col-span-2 sm:col-span-1">
          <span className="text-gray-900 font-medium">{warranty}</span>
        </FeatureBox>
      </div>

      {lines.length > 0 && (
        <ul className="text-sm text-gray-800 space-y-1 border-t border-gray-100 pt-3">
          {lines.map((line) => (
            <li key={line.label} className="leading-snug">
              <span className="text-gray-500">{line.label}</span>
              <span className="text-gray-400"> - </span>
              <span className="text-gray-900">{line.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
