/**
 * Renders product descriptions with readable paragraph formatting.
 * Handles plain text (wall of text), line breaks, and existing HTML.
 */

function containsHtml(text: string): boolean {
  return /<[a-z][\s\S]*>/i.test(text);
}

function splitIntoParagraphs(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  // Explicit paragraph breaks (blank line between paragraphs)
  if (/\n\s*\n/.test(trimmed)) {
    return trimmed.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  }

  // Single line breaks — each line becomes its own block
  if (trimmed.includes('\n')) {
    return trimmed.split('\n').map((p) => p.trim()).filter(Boolean);
  }

  // Wall of text — group sentences into readable paragraphs
  const sentences =
    trimmed.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) ?? [trimmed];

  if (sentences.length <= 2) return [trimmed];

  const paragraphs: string[] = [];
  const perParagraph = 3;

  for (let i = 0; i < sentences.length; i += perParagraph) {
    paragraphs.push(sentences.slice(i, i + perParagraph).join(' '));
  }

  return paragraphs;
}

interface ProductDescriptionProps {
  content: string;
  className?: string;
}

export function ProductDescription({ content, className = '' }: ProductDescriptionProps) {
  if (!content?.trim()) return null;

  if (containsHtml(content)) {
    return (
      <div
        className={`product-description prose prose-gray max-w-none prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-headings:text-gray-900 prose-li:text-gray-700 ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  const paragraphs = splitIntoParagraphs(content);

  return (
    <div className={`product-description space-y-4 ${className}`}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-[15px] text-gray-700 leading-relaxed text-justify">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
