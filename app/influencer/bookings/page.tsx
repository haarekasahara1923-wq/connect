import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Bookings | InfluencerConnect',
};

export default function InfluencerBookingsPage() {
  return (
    <div className="w-full pb-20 lg:pb-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Bookings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your pending, active, and completed collaboration requests.</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6 border-b border-border pb-2">
        {['All', 'Pending', 'Active', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === 'All' ? 'text-primary border-b-2 border-primary -mb-[2px]' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/30">
        <CalendarCheck className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h3 className="font-semibold text-foreground text-xl">No bookings yet</h3>
        <p className="mt-2 text-sm max-w-sm">Once brands book your services, you'll manage everything from here — accept, deliver, and get paid.</p>
      </div>
    </div>
  );
}
