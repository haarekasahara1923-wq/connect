'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RoleRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const role = (session.user as any).role;
      if (role === 'influencer') {
        router.push('/influencer/dashboard');
      } else if (role === 'brand') {
        router.push('/brand/dashboard');
      } else if (role === 'admin') {
        router.push('/admin/dashboard');
      }
    }
  }, [session, status, router]);

  return null;
}
