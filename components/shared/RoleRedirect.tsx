'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function RoleRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect on the exact home page and only on initial load
    // Don't redirect if user is already navigating or explicitly on home
    if (status === 'authenticated' && session?.user && pathname === '/') {
      const role = (session.user as any).role;
      // Use replace to avoid back-button loop, and only auto-redirect once
      if (role === 'influencer') {
        router.replace('/influencer/dashboard');
      } else if (role === 'brand') {
        router.replace('/brand/dashboard');
      } else if (role === 'admin') {
        router.replace('/admin/dashboard');
      }
    }
  }, [session, status, router, pathname]);

  return null;
}
