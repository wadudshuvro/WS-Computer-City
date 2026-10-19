interface SpecGroup {
  title: string;
  rows: { name: string; value: string }[];
}

interface CatalogSpecificationTableProps {
  getSpecValue: (key: string) => string | null;
}

export default function CatalogSpecificationTable({ getSpecValue }: CatalogSpecificationTableProps) {
  let groups: SpecGroup[] = [];
  try {
    const raw = getSpecValue('spec_table');
    if (raw) {
      const parsed = JSON.parse(raw) as SpecGroup[];
      if (Array.isArray(parsed)) {
        groups = parsed
          .map((group) => ({
            ...group,
            rows: (group?.rows ?? []).filter((row) => row?.name?.trim() && row?.value?.trim()),
          }))
          .filter((group) => group.title && group.rows.length);
      }
    }
  } catch {
    groups = [];
  }

  const hasWarranty = groups.some((group) => /warranty/i.test(group.title));
  if (!hasWarranty) {
    groups = [
      ...groups,
      {
        title: 'Warranty Information',
        rows: [{ name: 'Warranty', value: getSpecValue('warranty') || 'No Warranty' }],
      },
    ];
  }

  if (groups.length === 0) {
    return <p className="text-gray-500">No specification available for this product.</p>;
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.title} className="border border-gray-200 rounded overflow-hidden">
          <h3 className="text-sm font-semibold px-4 py-2 bg-gray-100 text-gray-900 border-b border-gray-200">
            {/^warranty$/i.test(group.title) ? 'Warranty Information' : group.title}
          </h3>
          <table className="w-full text-sm">
            <tbody>
              {group.rows.map((row) => (
                <tr key={`${group.title}-${row.name}`} className="border-t border-gray-100">
                  <td className="w-1/3 px-4 py-2.5 bg-gray-50 text-gray-600 align-top">{row.name}</td>
                  <td className="px-4 py-2.5 align-top leading-relaxed text-gray-900 whitespace-pre-line">
                    {row.value}
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
