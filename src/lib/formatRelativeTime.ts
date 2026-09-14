/**
 * Contentful-style relative timestamps for CMS "Updated" columns.
 * Recent → "2 hours ago"; older → calendar date.
 */
export function formatRelativeUpdatedAt(
  value: string | Date | null | undefined,
  now: Date = new Date()
): string {
  if (!value) return '—';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 45) return 'Just now';
  if (diffSec < 90) return '1 minute ago';

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minutes ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour === 1) return '1 hour ago';
  if (diffHour < 24) return `${diffHour} hours ago`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;

  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 5) {
    return diffWeek === 1 ? '1 week ago' : `${diffWeek} weeks ago`;
  }

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) {
    return diffMonth <= 1 ? '1 month ago' : `${diffMonth} months ago`;
  }

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatAbsoluteUpdatedAt(value: string | Date | null | undefined): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
