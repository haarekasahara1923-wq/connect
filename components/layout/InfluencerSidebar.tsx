'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  UserCircle, 
  ListPlus, 
  CalendarCheck, 
  IndianRupee, 
  Image as ImageIcon,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

const links = [
  { name: 'Dashboard', href: '/influencer/dashboard', icon: LayoutDashboard },
  { name: 'Profile', href: '/influencer/profile', icon: UserCircle },
  { name: 'Services', href: '/influencer/services', icon: ListPlus },
  { name: 'Bookings', href: '/influencer/bookings', icon: CalendarCheck },
  { name: 'Earnings', href: '/influencer/earnings', icon: IndianRupee },
  { name: 'Media', href: '/influencer/media', icon: ImageIcon },
  { name: 'Messages', href: '/influencer/messages', icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="hidden lg:flex flex-col w-64 fixed inset-y-0 border-r bg-white z-40">
        <div className="p-6">
          <Link href="/" className="font-bold text-2xl text-indigo-600 block">
            InfluencerConnect
          </Link>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">
            Creator Studio
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
                  isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-gray-400")} />
                {link.name}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full text-left justify-start text-gray-600 hover:bg-gray-100" onClick={() => signOut()}>
            Log out
          </Button>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex justify-around p-2 pb-safe">
        {links.slice(0, 5).map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg",
                isActive ? "text-indigo-600" : "text-gray-500"
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
