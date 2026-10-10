import { getRamHighlightLines, getRamModelName } from '@/lib/ramPdpDisplay';

interface RamProductHighlightsProps {
  stockStatus: string;
  stockLabel: string;
  brand: { name: string; slug: string };
  productName: string;
  shortDescription?: string | null;
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

export function RamProductHighlights({
  stockStatus,
  stockLabel,
  brand,
  productName,
  shortDescription,
  getSpecValue,
}: RamProductHighlightsProps) {
  const model = getRamModelName(productName);
  const warranty = getSpecValue('warranty') || 'No Warranty';
  const isInStock = stockStatus === 'IN_STOCK';
  const lines = getRamHighlightLines(shortDescription, getSpecValue);

  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 gap-2 mb-3">
        <FeatureBox label="Stock">
          <span className={isInStock ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
            {stockLabel}
          </span>
        </FeatureBox>
        <FeatureBox label="Brand">
          <span className="text-gray-900 font-medium">{brand.name}</span>
        </FeatureBox>
        <FeatureBox label="Model">
          <span className="text-gray-900 font-medium">{model}</span>
        </FeatureBox>
        <FeatureBox label="Warranty">
          <span className="text-gray-900 font-medium">{warranty}</span>
        </FeatureBox>
      </div>

      {lines.length > 0 && (
        <div className="text-sm text-gray-700 space-y-1 border-t border-gray-100 pt-3">
          {lines.map((line, index) => (
            <p key={`${line.label}-${index}`}>
              {line.label ? (
                <>
                  <span className="text-gray-500">{line.label}:</span>{' '}
                  <span className="text-gray-900">{line.value}</span>
                </>
              ) : (
                <span className="text-gray-900">{line.value}</span>
              )}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
