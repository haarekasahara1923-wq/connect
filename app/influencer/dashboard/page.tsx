import { StatsCard } from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, Eye, IndianRupee, ListPlus, Search, Star, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { influencerProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function InfluencerDashboardPage() {
  const session = await auth();

  let earned = '0.00';
  let rating = '0.0';

  if (session?.user?.id) {
    const [profile] = await db.select({ 
      rating: influencerProfiles.averageRating
    })
      .from(influencerProfiles)
      .where(eq(influencerProfiles.userId, session.user.id));
      
    if (profile) {
      if (profile.rating) rating = profile.rating;
    }
  }

  return (
    <div className="w-full pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Creator Studio 🎥</h1>
          <p className="text-muted-foreground mt-1 text-sm">Review incoming requests and track your earnings.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3 w-full sm:w-auto">
          <Link href="/influencer/services" className="inline-flex items-center justify-center rounded-md border text-sm font-medium h-9 px-4 py-2 flex-1 sm:flex-none hover:bg-gray-100"><ListPlus className="w-4 h-4 mr-2" /> Add Service</Link>
          <Link href="/influencer/profile" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 flex-1 sm:flex-none text-white">Edit Profile</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <StatsCard
          title="Total Earned"
          value={`₹${earned}`}
          icon={<IndianRupee className="w-5 h-5 text-emerald-500" />}
          trend={{ value: 0, isPositive: true }}
        />
        <StatsCard
          title="Active Bookings"
          value={0}
          icon={<CalendarCheck className="w-5 h-5 text-blue-500" />}
        />
        <StatsCard
          title="Profile Views"
          value={0}
          icon={<Eye className="w-5 h-5 text-indigo-500" />}
        />
        <StatsCard
          title="Average Rating"
          value={rating}
          icon={<Star className="w-5 h-5 text-yellow-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Incoming Requests</CardTitle>
              <Link href="/influencer/bookings" className="text-sm font-medium text-indigo-600 hover:underline">
                View All
              </Link>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 border-2 border-dashed rounded-lg bg-gray-50">
                <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                <h3 className="font-semibold text-gray-900 text-lg">You're all caught up!</h3>
                <p className="mt-1 text-sm mb-4">No new collaboration requests right now. Great time to update your portfolio!</p>
                <Link href="/influencer/media" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white mt-4">Update Media</Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ready to withdraw?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-lg text-center mb-4 border border-emerald-100">
                <p className="text-xs uppercase tracking-wider font-bold text-emerald-700 mb-1">Available for payout</p>
                <p className="text-3xl font-extrabold">₹0.00</p>
              </div>
              <div className="w-full text-center inline-flex items-center justify-center rounded-md border text-sm font-medium h-10 px-4 py-2 bg-gray-100 text-gray-400 cursor-not-allowed">Request Withdrawal</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
