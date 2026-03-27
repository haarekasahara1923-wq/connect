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
      <div className="hidden lg:flex flex-col w-64 fixed inset-y-0 border-r bg-card z-40 shadow-sm">
        <div className="p-6 border-b border-border">
          <Link href="/" className="font-black text-2xl text-primary block italic tracking-tighter">
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
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 my-0.5",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                {link.name}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full text-left justify-start text-muted-foreground hover:bg-muted hover:text-foreground" 
            onClick={() => signOut()}
          >
            Log out
          </Button>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex justify-around p-2 pb-safe">
        {links.slice(0, 5).map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
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
