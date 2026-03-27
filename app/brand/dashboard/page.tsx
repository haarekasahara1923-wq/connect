import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, Megaphone, Search, Wallet } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { brandProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function BrandDashboardPage() {
  const session = await auth();
  
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back 👋</h1>
          <p className="text-muted-foreground mt-1 text-sm">Here's what's happening with your brand campaigns right now.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3 w-full sm:w-auto">
          <Link href="/brand/discover" className="inline-flex items-center justify-center rounded-xl border border-border bg-background hover:bg-muted font-medium transition-colors text-sm h-9 px-4 py-2 flex-1 sm:flex-none text-foreground">
            <Search className="w-4 h-4 mr-2" /> Find Influencers
          </Link>
          <Link href="/brand/campaigns/create" className="inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors h-9 px-4 py-2 bg-primary hover:bg-primary/90 flex-1 sm:flex-none text-primary-foreground">
            <Megaphone className="w-4 h-4 mr-2" /> New Campaign
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Active Bookings"
          value={activeBookings}
          icon={<CalendarCheck className="w-5 h-5 text-primary" />}
        />
        <StatsCard
          title="Total Campaigns"
          value={totalCampaigns}
          icon={<Megaphone className="w-5 h-5 text-accent" />}
        />
        <StatsCard
          title="Wallet Balance"
          value={`₹${walletBalance}`}
          icon={<Wallet className="w-5 h-5 text-secondary" />}
        />
        <StatsCard
          title="Wishlisted"
          value={0}
          icon={<Search className="w-5 h-5 text-primary" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/30">
                <CalendarCheck className="w-12 h-12 text-muted-foreground/40 mb-3" />
                <h3 className="font-semibold text-foreground text-lg">No bookings yet</h3>
                <p className="mt-1 text-sm mb-4">Start by finding influencers in your city or launching a campaign.</p>
                <Link href="/brand/discover" className="inline-flex items-center justify-center rounded-xl font-medium transition-colors bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-4 py-2 mt-4 text-sm">
                  Discover Creators
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/brand/wallet" className="w-full text-left justify-start inline-flex items-center rounded-xl border border-border text-sm font-medium h-10 px-4 py-2 hover:bg-muted transition-colors text-foreground">
                <Wallet className="w-4 h-4 mr-2 text-secondary" /> Add Money to Wallet
              </Link>
              <Link href="/brand/messages" className="w-full text-left justify-start inline-flex items-center rounded-xl border border-border text-sm font-medium h-10 px-4 py-2 hover:bg-muted transition-colors text-foreground">
                View Messages
              </Link>
              <Link href="/brand/campaigns" className="w-full text-left justify-start inline-flex items-center rounded-xl border border-border text-sm font-medium h-10 px-4 py-2 hover:bg-muted transition-colors text-foreground">
                <Megaphone className="w-4 h-4 mr-2 text-primary" /> My Campaigns
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
