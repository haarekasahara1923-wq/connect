import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Bookings | InfluencerConnect',
};

export default function BrandBookingsPage() {
  return (
    <div className="w-full pb-20 lg:pb-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Bookings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Track all your influencer collaboration bookings here.</p>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/30">
        <CalendarCheck className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h3 className="font-semibold text-foreground text-xl">No bookings yet</h3>
        <p className="mt-2 text-sm max-w-sm">Once you book an influencer for your campaign, your booking status will appear here.</p>
        <Link
          href="/brand/discover"
          className="inline-flex items-center justify-center rounded-xl font-medium transition-colors bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-6 py-2 mt-6 text-sm"
        >
          Discover Creators
        </Link>
      </div>
    </div>
  );
}
