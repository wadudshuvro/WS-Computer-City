'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdvisorMessageBody } from '@/components/agent/AdvisorMessageBody';
import { cn } from '@/lib/utils';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type ProductCard = {
  slug: string;
  name: string;
  price: number;
  stockStatus: string;
  brand: string | null;
  url: string;
  imageUrl: string | null;
};

function formatBdt(price: number) {
  return `৳${Math.round(price).toLocaleString('en-BD')}`;
}

function formatStock(status: string) {
  return status
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const SUGGESTIONS = [
  'Budget Ryzen 5 under 20000',
  'Show Intel processors in stock',
  'What CPUs do you have?',
];

export function ProductAdvisorChat() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hi — I am the LogicBay product advisor. Ask about CPUs, budgets, brands, or stock. I only recommend items from our live catalog.',
    },
  ]);
  const [products, setProducts] = useState<ProductCard[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, products, open, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content,
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const payload = nextMessages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payload.length ? payload : [{ role: 'user', content }],
        }),
      });

      const data = (await res.json()) as {
        reply?: string;
        products?: ProductCard[];
        error?: string;
      };

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.reply || data.error || 'No response from advisor.',
        },
      ]);

      if (Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: 'Network error — could not reach the advisor. Try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          role="dialog"
          aria-labelledby={titleId}
          className="flex h-[min(28rem,70vh)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-md"
        >
          <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
            <div>
              <h2 id={titleId} className="text-sm font-semibold leading-snug">
                Product advisor
              </h2>
              <p className="text-xs text-muted-foreground">Catalog-only answers</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'max-w-[92%] rounded-md px-3 py-2',
                  m.role === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}
              >
                <AdvisorMessageBody text={m.content} isUser={m.role === 'user'} />
              </div>
            ))}

            {products.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Suggested products</p>
                {products.map((p) => (
                  <Link
                    key={p.slug}
                    href={p.url}
                    className="flex gap-2 rounded-md border border-border bg-background p-2 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => setOpen(false)}
                  >
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.imageUrl}
                        alt=""
                        className="h-12 w-12 shrink-0 rounded-md border border-border object-contain"
                      />
                    ) : (
                      <div className="h-12 w-12 shrink-0 rounded-md border border-border bg-muted" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium leading-snug">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.brand ? `${p.brand} · ` : ''}
                        {formatStock(p.stockStatus)}
                      </p>
                      <p className="text-sm font-bold">{formatBdt(p.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Searching catalog…
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {!loading && messages.length <= 2 && (
            <div className="flex flex-wrap gap-1.5 border-t border-border px-3 py-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => send(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            className="flex items-center gap-2 border-t border-border px-3 py-2"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <label htmlFor="advisor-input" className="sr-only">
              Ask about products
            </label>
            <input
              id="advisor-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products…"
              disabled={loading}
              className="h-9 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      )}

      <Button
        type="button"
        size="icon"
        className="h-12 w-12 rounded-full shadow-md"
        aria-expanded={open}
        aria-label={open ? 'Close product advisor' : 'Open product advisor'}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>
    </div>
  );
}
