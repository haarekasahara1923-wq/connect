import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = (session?.user as any)?.role;

  // Brand routes
  if (pathname.startsWith('/brand') && role !== 'brand') {
    if (!session) return NextResponse.redirect(new URL('/login', req.url));
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Influencer routes
  if (pathname.startsWith('/influencer') && role !== 'influencer') {
    if (!session) return NextResponse.redirect(new URL('/login', req.url));
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Admin routes
  if (pathname.startsWith('/admin') && role !== 'admin') {
    if (!session) return NextResponse.redirect(new URL('/login', req.url));
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/brand/:path*',
    '/influencer/:path*',
    '/admin/:path*',
  ],
};
