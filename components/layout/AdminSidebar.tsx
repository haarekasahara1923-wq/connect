'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Users, 
  Megaphone, 
  AlertTriangle, 
  IndianRupee, 
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

const links = [
  { name: 'Overview', href: '/admin/dashboard', icon: BarChart3 },
  { name: 'Influencers', href: '/admin/influencers', icon: Users },
  { name: 'Campaigns', href: '/admin/campaigns', icon: Megaphone },
  { name: 'Disputes', href: '/admin/disputes', icon: AlertTriangle },
  { name: 'Payouts', href: '/admin/payouts', icon: IndianRupee },
  { name: 'Settings', href: '/admin/platform-settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex flex-col w-64 fixed inset-y-0 border-r bg-gray-900 z-40 text-gray-300">
      <div className="p-6">
        <Link href="/" className="font-bold text-2xl text-white block">
          IC Admin
        </Link>
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">
          Control Center
        </p>
      </div>
      <div className="flex-1 py-4 flex flex-col gap-1 px-4 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors my-0.5",
                isActive ? "bg-red-600 text-white" : "hover:text-white hover:bg-gray-800"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400")} />
              {link.name}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-gray-800">
        <Button variant="ghost" className="w-full text-left justify-start text-gray-400 hover:text-white hover:bg-gray-800" onClick={() => signOut()}>
          Sign out Securely
        </Button>
      </div>
    </div>
  );
}
