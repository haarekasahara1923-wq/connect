import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, TrendingUp, ArrowDownToLine } from 'lucide-react';
import { auth } from '@/lib/auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Earnings | InfluencerConnect',
};

export default async function EarningsPage() {
  const session = await auth();

  return (
    <div className="w-full pb-20 lg:pb-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Earnings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Track your revenue and request payouts to your bank account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-6 text-center">
            <IndianRupee className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Earned</p>
            <p className="text-4xl font-black text-foreground">₹0.00</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-10 h-10 text-accent mx-auto mb-3" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">This Month</p>
            <p className="text-4xl font-black text-foreground">₹0.00</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <ArrowDownToLine className="w-10 h-10 text-secondary mx-auto mb-3" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Available to Withdraw</p>
            <p className="text-4xl font-black text-foreground">₹0.00</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <IndianRupee className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">No earnings yet. Complete your first booking to start earning.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
