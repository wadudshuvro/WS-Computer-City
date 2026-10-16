import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin, isAdminActor } from '@/lib/auth/guard';
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

function imageMagicMatches(type: string, buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  if (type === 'image/jpeg' || type === 'image/jpg') return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (type === 'image/png') return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  if (type === 'image/gif') return buffer.subarray(0, 4).toString('ascii') === 'GIF8';
  if (type === 'image/webp') return buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  if (type === 'image/avif') return buffer.subarray(4, 8).toString('ascii') === 'ftyp';
  return false;
}

/**
 * POST /api/admin/uploads
 * Multipart field "file" → saves under public/uploads/products/ and returns site-relative URL.
 */
export async function POST(req: NextRequest) {
  const gate = await authorizeAdmin(req);
  if (!isAdminActor(gate)) return gate;
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
    if (!imageMagicMatches(file.type, buffer)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'File content does not match an allowed image' } },
        { status: 400 }
      );
    }
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
