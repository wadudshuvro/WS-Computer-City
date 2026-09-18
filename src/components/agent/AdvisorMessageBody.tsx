'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Renders advisor text in a readable way for any age.
 * Strips/handles common markdown leftovers without a heavy markdown library.
 */
export function AdvisorMessageBody({ text, isUser }: { text: string; isUser?: boolean }) {
  if (isUser) {
    return <span className="whitespace-pre-wrap">{text}</span>;
  }

  const blocks = splitBlocks(normalizeAdvisorText(text));

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {blocks.map((block, i) => {
        if (block.type === 'list') {
          return (
            <ul key={i} className="list-disc space-y-1 pl-4">
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

function normalizeAdvisorText(input: string): string {
  return input
    .replace(/\r\n/g, '\n')
    // Turn markdown links into "Label" only (cards already link)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    // Unwrap bold/italic markers while keeping words
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/(^|[^*\w])\*([^*\n]+)\*(?!\*)/g, '$1$2')
    .replace(/(^|[^_\w])_([^_\n]+)_(?!_)/g, '$1$2')
    .trim();
}

type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] };

function splitBlocks(text: string): Block[] {
  const lines = text.split('\n');
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'paragraph', text: paragraph.join('\n').trim() });
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length) {
      blocks.push({ type: 'list', items: listItems });
      listItems = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    const bullet = line.match(/^[-*•]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      listItems.push(bullet[1] ?? '');
      continue;
    }
    if (!line) {
      flushList();
      flushParagraph();
      continue;
    }
    flushList();
    paragraph.push(line);
  }

  flushList();
  flushParagraph();
  return blocks.length ? blocks : [{ type: 'paragraph', text: text }];
}

function renderInline(text: string): ReactNode[] {
  // Remaining /products/slug paths become links
  const parts = text.split(/(\/products\/[a-z0-9-]+)/gi);
  return parts.map((part, i) => {
    if (/^\/products\/[a-z0-9-]+$/i.test(part)) {
      return (
        <Link
          key={i}
          href={part}
          className="font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          view product
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
