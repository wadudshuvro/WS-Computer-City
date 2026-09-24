import Link from 'next/link';
import {
  formatCpuCoolerWarranty,
  getCpuCoolerModelName,
  getCpuCoolerShortDescriptionLines,
} from '@/lib/cpuCoolerSpecDefinitions';

interface CpuCoolerProductHighlightsProps {
  stockStatus: string;
  stockLabel: string;
  brand: { name: string; slug: string };
  productName: string;
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

export function CpuCoolerProductHighlights({
  stockStatus,
  stockLabel,
  brand,
  productName,
  getSpecValue,
}: CpuCoolerProductHighlightsProps) {
  const shortLines = getCpuCoolerShortDescriptionLines(getSpecValue);
  const model = getCpuCoolerModelName(productName);
  const warranty = formatCpuCoolerWarranty(getSpecValue);
  const isInStock = stockStatus === 'IN_STOCK';

  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 gap-2 mb-3">
        <FeatureBox label="Stock">
          <span className={isInStock ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
            {stockLabel}
          </span>
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

      {shortLines.length > 0 && (
        <div className="text-sm text-gray-700 space-y-0.5 border-t border-gray-100 pt-3">
          {shortLines.map(({ label, value }) => (
            <p key={label}>
              <span className="text-gray-600">{label}:</span>{' '}
              <span className="text-gray-900">{value}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
