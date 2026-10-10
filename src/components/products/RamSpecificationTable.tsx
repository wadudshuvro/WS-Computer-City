import { buildRamPdpGroups } from '@/lib/ramPdpDisplay';

interface RamSpecificationTableProps {
  getSpecValue: (key: string) => string | null;
}

export function RamSpecificationTable({ getSpecValue }: RamSpecificationTableProps) {
  const groups = buildRamPdpGroups(getSpecValue);

  if (groups.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No specifications available for this product.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-base font-bold uppercase tracking-wide text-gray-900">Specifications</h2>
      {groups.map((group) => (
        <div key={group.title} className="border border-gray-200 overflow-hidden rounded-md">
          <h3 className="bg-gray-100 text-gray-800 text-sm font-bold px-4 py-2.5 border-b border-gray-200">
            {group.title}
          </h3>
          <table className="w-full">
            <tbody>
              {group.specs.map((spec, specIndex) => (
                <tr
                  key={`${spec.name}-${specIndex}`}
                  className={`border-b border-gray-100 last:border-0 ${
                    specIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-500 w-[34%] align-top font-medium">
                    {spec.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-semibold">
                    {spec.items.length === 1 ? (
                      <p className="leading-relaxed font-semibold text-gray-900">{spec.items[0]}</p>
                    ) : (
                      <ul className="list-disc pl-4 space-y-1.5 leading-relaxed font-normal">
                        {spec.items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
