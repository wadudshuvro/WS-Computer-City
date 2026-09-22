'use client';

import { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

export interface AdminProductImageRow {
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

interface AdminProductImagesEditorProps {
  images: AdminProductImageRow[];
  onChange: (images: AdminProductImageRow[]) => void;
  error?: string;
  /** Accent color class for focus rings (pink for product forms) */
  accent?: 'pink' | 'blue';
}

export function AdminProductImagesEditor({
  images,
  onChange,
  error,
  accent = 'pink',
}: AdminProductImagesEditorProps) {
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState('');

  const ring =
    accent === 'blue'
      ? 'focus:ring-blue-500 focus:border-blue-500'
      : 'focus:ring-pink-500 focus:border-pink-500';
  const hoverAdd =
    accent === 'blue'
      ? 'hover:border-blue-400 hover:text-blue-600'
      : 'hover:border-pink-400 hover:text-pink-600';
  const checkColor =
    accent === 'blue' ? 'text-blue-600 focus:ring-blue-500' : 'text-pink-600 focus:ring-pink-500';

  const updateImage = (
    index: number,
    field: keyof AdminProductImageRow,
    value: string | boolean | number
  ) => {
    const next = [...images];
    const current = next[index];
    if (!current) return;

    if (field === 'isPrimary' && value === true) {
      next.forEach((img, i) => {
        img.isPrimary = i === index;
      });
    } else {
      next[index] = { ...current, [field]: value } as AdminProductImageRow;
    }
    onChange(next);
  };

  const addImage = () => {
    onChange([
      ...images,
      {
        url: '',
        alt: '',
        isPrimary: images.length === 0,
        order: images.length,
      },
    ]);
  };

  const removeImage = (index: number) => {
    const next = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i }));
    if (next.length > 0 && !next.some((img) => img.isPrimary)) {
      next[0]!.isPrimary = true;
    }
    onChange(next);
  };

  const uploadFile = async (index: number, file: File) => {
    setUploadError('');
    setUploadingIndex(index);
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/admin/uploads', { method: 'POST', body });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error?.message || 'Upload failed');
      }
      const url = json.data.url as string;
      const next = images.map((img, i) => {
        if (i !== index) return img;
        return {
          ...img,
          url,
          alt: img.alt?.trim() ? img.alt : file.name.replace(/\.[^.]+$/, ''),
        };
      });
      onChange(next);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      {images.map((image, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-start"
        >
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap gap-2">
              <input
                ref={(el) => {
                  fileInputRefs.current[index] = el;
                }}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (file) void uploadFile(index, file);
                }}
              />
              <button
                type="button"
                disabled={uploadingIndex === index}
                onClick={() => fileInputRefs.current[index]?.click()}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-60"
              >
                {uploadingIndex === index ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploadingIndex === index ? 'Uploading…' : 'Upload from computer'}
              </button>
              <span className="self-center text-xs text-gray-500">or paste a URL below</span>
            </div>

            <input
              type="text"
              value={image.url}
              onChange={(e) => updateImage(index, 'url', e.target.value)}
              className={`w-full rounded-lg border border-gray-300 px-4 py-2 ${ring}`}
              placeholder="Image URL or /uploads/… path"
            />
            <input
              type="text"
              value={image.alt || ''}
              onChange={(e) => updateImage(index, 'alt', e.target.value)}
              className={`w-full rounded-lg border border-gray-300 px-4 py-2 ${ring}`}
              placeholder="Alt text (optional)"
            />
          </div>

          {image.url ? (
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded border bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt={image.alt || ''} className="h-full w-full object-contain" />
            </div>
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded border border-dashed border-gray-300 bg-white text-[10px] text-gray-400">
              Preview
            </div>
          )}

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={image.isPrimary}
              onChange={(e) => updateImage(index, 'isPrimary', e.target.checked)}
              className={`rounded border-gray-300 ${checkColor}`}
            />
            <span className="text-sm font-medium">Primary</span>
          </label>

          <button
            type="button"
            onClick={() => removeImage(index)}
            className="rounded-lg px-3 py-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addImage}
        className={`w-full rounded-lg border-2 border-dashed border-gray-300 px-4 py-4 text-gray-600 transition-colors ${hoverAdd}`}
      >
        + Add Image
      </button>

      {(error || uploadError) && (
        <p className="mt-1 text-sm text-red-500">{error || uploadError}</p>
      )}
      <p className="text-xs text-gray-500">
        Upload JPEG, PNG, WebP, GIF, or AVIF (max 5 MB). Files are saved under{' '}
        <code className="rounded bg-gray-100 px-1">/uploads/products/</code> and appear on the
        storefront after you save the product.
      </p>
    </div>
  );
}
