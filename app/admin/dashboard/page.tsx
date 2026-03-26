import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, Users, ShoppingCart, ShieldAlert } from 'lucide-react';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { influencerProfiles, users, bookings } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export default async function AdminDashboardPage() {
  const session = await auth();

  // Perform highly optimized dashboard metric fetches
  const [userCount] = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(users);
  
  const [pendingApprovals] = await db.select({ count: sql`count(*)`.mapWith(Number) })
    .from(influencerProfiles)
    .where(sql`verification_status = 'pending'`);

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Control Center</h1>
        <p className="text-muted-foreground mt-1 text-sm">Monitor platform health and process pending actions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <StatsCard
          title="Total Users"
          value={userCount.count || 0}
          icon={<Users className="w-5 h-5 text-blue-500" />}
        />
        <StatsCard
          title="Revenue (This Month)"
          value="₹0.00"
          icon={<IndianRupee className="w-5 h-5 text-emerald-500" />}
        />
        <StatsCard
          title="Active Bookings"
          value={0}
          icon={<ShoppingCart className="w-5 h-5 text-indigo-500" />}
        />
        <StatsCard
          title="Pending Approvals"
          value={pendingApprovals.count || 0}
          icon={<ShieldAlert className={pendingApprovals.count > 0 ? "w-5 h-5 text-red-500" : "w-5 h-5 text-gray-400"} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Platform Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                [ Chart.js / Recharts Component mounting via hydrated data ]
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
           <Card className="h-full border-red-100">
            <CardHeader className="bg-red-50/50 rounded-t-lg border-b border-red-50">
              <CardTitle className="text-red-900 text-lg">Needs Attention</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                <li className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium">Payout Requests</span>
                  <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-bold">0</span>
                </li>
                <li className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium">KYC Approvals</span>
                  <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-bold">{pendingApprovals.count || 0}</span>
                </li>
                <li className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium">Disputes</span>
                  <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-bold">0</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
