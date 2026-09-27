import { buildMotherboardPdpGroups } from '@/lib/motherboardPdpDisplay';

interface MotherboardSpecificationTableProps {
  getSpecValue: (key: string) => string | null;
}

export function MotherboardSpecificationTable({
  getSpecValue,
}: MotherboardSpecificationTableProps) {
  const groups = buildMotherboardPdpGroups(getSpecValue);

  if (groups.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No specifications available for this product.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group.title} className="border border-gray-200 overflow-hidden rounded-md">
          <h3 className="bg-[#e8eefc] text-[#1d4ed8] text-sm font-bold px-4 py-2.5 border-b border-gray-200">
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
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {spec.items.length === 1 && !/^[-*]/.test(spec.items[0] || '') ? (
                      <p className="leading-relaxed">{spec.items[0]}</p>
                    ) : (
                      <ul className="space-y-1.5 leading-relaxed">
                        {spec.items.map((item, itemIndex) => {
                          const isNote = /^\*{1,2}\s*/.test(item);
                          const isSubhead = /^(CPU|Chipset)\s*:/i.test(item);
                          const text = item.replace(/^[-–—•]\s*/, '');
                          return (
                            <li
                              key={itemIndex}
                              className={
                                isSubhead
                                  ? 'font-medium text-gray-800 pt-1 first:pt-0'
                                  : isNote
                                    ? 'pl-4 text-gray-600 list-none'
                                    : 'ml-4 list-disc'
                              }
                            >
                              {isNote ? text.replace(/^\*{1,2}\s*/, '') : text}
                            </li>
                          );
                        })}
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
