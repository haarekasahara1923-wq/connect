import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const folder = formData.get('folder') as string || 'general';

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  // Validate file size (max 500MB)
  if (file.size > 500 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Max 500MB.' }, { status: 400 });
  }

  // Validate file type
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 
    'video/mp4', 'video/quicktime', 'video/webm'
  ];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Allowed: JPG, PNG, WEBP, GIF, MP4, MOV, WEBM.' }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage(buffer, folder);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Cloudinary upload failed' }, { status: 500 });
  }
}
