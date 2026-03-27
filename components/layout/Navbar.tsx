'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { data: session, status } = useSession();

  const getDashboardLink = () => {
    switch (session?.user?.role) {
      case 'brand': return '/brand/dashboard';
      case 'influencer': return '/influencer/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-black tracking-tighter text-primary italic">
            InfluencerConnect
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link href="/influencers" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Browse Influencers
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              How it Works
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-10 w-10 rounded-full focus:outline-none hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {session.user.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user.name && <p className="font-medium">{session.user.name}</p>}
                      {session.user.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                      <p className="text-xs uppercase font-bold text-primary mt-1 tracking-wider">
                        {session.user.role}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem>
                    <Link href={getDashboardLink()} className="w-full">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <span className="w-full">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login" className={buttonVariants({ variant: 'ghost' })}>
                  Log in
                </Link>
                <Link href="/register" className={cn(buttonVariants({ variant: 'default' }), 'bg-primary hover:bg-primary/90 text-white rounded-full px-6')}>
                  Register
                </Link>
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'md:hidden')}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 py-4">
                <Link href="/" className="text-xl font-bold tracking-tight text-red-600">
                  InfluencerConnect
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link href="/" className="text-sm font-medium">Home</Link>
                  <Link href="/influencers" className="text-sm font-medium">Browse Influencers</Link>
                  <Link href="/how-it-works" className="text-sm font-medium">How it Works</Link>
                </nav>
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t">
                  {session?.user ? (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={session.user.image || ''} />
                          <AvatarFallback>{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{session.user.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{session.user.role}</p>
                        </div>
                      </div>
                      <Link href={getDashboardLink()} className={cn(buttonVariants({ variant: 'outline' }), 'w-full justify-start')}>
                        Dashboard
                      </Link>
                      <Button variant="destructive" className="w-full justify-start" onClick={() => signOut()}>
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
                        Log in
                      </Link>
                      <Link href="/register" className={cn(buttonVariants({ variant: 'default' }), 'w-full bg-primary hover:bg-primary/90 text-white')}>
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
