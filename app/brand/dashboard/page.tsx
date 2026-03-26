import { StatsCard } from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, Megaphone, Search, Wallet } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { brandProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function BrandDashboardPage() {
  const session = await auth();
  
  // Real stats fetching would go here.
  // Using placeholders for MVP phase, but wired into the DB setup securely where possible.
  let activeBookings = 0;
  let totalCampaigns = 0;
  let walletBalance = '0.00';

  if (session?.user?.id) {
    const [brand] = await db.select({ id: brandProfiles.id, wallet: brandProfiles.walletBalance })
      .from(brandProfiles)
      .where(eq(brandProfiles.userId, session.user.id));
      
    if (brand && brand.wallet) {
      walletBalance = brand.wallet;
    }
  }

  return (
    <div className="w-full pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back 👋</h1>
          <p className="text-muted-foreground mt-1 text-sm">Here's what's happening with your brand campaigns right now.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3 w-full sm:w-auto">
          <Link href="/brand/discover" className="inline-flex items-center justify-center rounded-lg border border-transparent has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 border-border bg-background hover:bg-muted font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 flex-1 sm:flex-none h-9 px-4 py-2"><Search className="w-4 h-4 mr-2" /> Find Influencers</Link>
          <Link href="/brand/campaigns/create" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-red-600 hover:bg-red-700 flex-1 sm:flex-none text-white"><Megaphone className="w-4 h-4 mr-2" /> New Campaign</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Active Bookings"
          value={activeBookings}
          icon={<CalendarCheck className="w-5 h-5 text-indigo-500" />}
        />
        <StatsCard
          title="Total Campaigns"
          value={totalCampaigns}
          icon={<Megaphone className="w-5 h-5 text-green-500" />}
        />
        <StatsCard
          title="Wallet Balance"
          value={`₹${walletBalance}`}
          icon={<Wallet className="w-5 h-5 text-orange-500" />}
        />
        <StatsCard
          title="Wishlisted"
          value={0}
          icon={<Search className="w-5 h-5 text-pink-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 border-2 border-dashed rounded-lg bg-gray-50">
                <CalendarCheck className="w-12 h-12 text-gray-300 mb-3" />
                <h3 className="font-semibold text-gray-900 text-lg">No bookings yet</h3>
                <p className="mt-1 text-sm mb-4">Start by finding influencers in your city or launching a campaign.</p>
                <Link href="/brand/discover" className="inline-flex items-center justify-center rounded-md font-medium transition-colors bg-red-600 hover:bg-red-700 text-white h-10 px-4 py-2 mt-4">Discover Creators</Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/brand/wallet" className="w-full text-left justify-start inline-flex items-center rounded-md border text-sm font-medium h-10 px-4 py-2 hover:bg-gray-100">Add Money to Wallet</Link>
              <Link href="/brand/messages" className="w-full text-left justify-start inline-flex items-center rounded-md border text-sm font-medium h-10 px-4 py-2 hover:bg-gray-100 mt-2">View Messages</Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
