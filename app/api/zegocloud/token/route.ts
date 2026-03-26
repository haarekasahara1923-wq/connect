import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateZegoToken } from '@/lib/zegocloud';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const token = generateZegoToken(session.user.id);
    return NextResponse.json({ 
      token,
      appId: Number(process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID || 0),
      userId: session.user.id,
      userName: session.user.name || 'User',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
