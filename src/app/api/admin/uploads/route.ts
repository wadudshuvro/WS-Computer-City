import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * POST /api/admin/uploads
 * Multipart field "file" → saves under public/uploads/products/ and returns site-relative URL.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'No image file provided' } },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Only JPEG, PNG, WebP, GIF, or AVIF images are allowed',
          },
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Image must be 5 MB or smaller' } },
        { status: 400 }
      );
    }

    const ext =
      EXT_BY_TYPE[file.type] ||
      path.extname(file.name).toLowerCase() ||
      '.jpg';

    const safeBase = file.name
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);

    const unique = `${Date.now()}-${randomBytes(4).toString('hex')}`;
    const filename = `${safeBase || 'product'}-${unique}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/products/${filename}`;

    return NextResponse.json({ data: { url, filename } }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to upload image' } },
      { status: 500 }
    );
  }
}
