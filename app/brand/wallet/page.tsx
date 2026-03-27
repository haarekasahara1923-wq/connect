import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, PlusCircle, ArrowDownLeft } from 'lucide-react';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { brandProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wallet | InfluencerConnect',
};

export default async function BrandWalletPage() {
  const session = await auth();
  let walletBalance = '0.00';

  if (session?.user?.id) {
    const [brand] = await db.select({ wallet: brandProfiles.walletBalance })
      .from(brandProfiles)
      .where(eq(brandProfiles.userId, session.user.id));
    if (brand?.wallet) walletBalance = brand.wallet;
  }

  return (
    <div className="w-full pb-20 lg:pb-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Wallet</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage funds for your campaigns. Payments are held in escrow.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-8 text-center">
            <Wallet className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Available Balance</p>
            <p className="text-5xl font-black text-foreground">₹{walletBalance}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Add Funds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Top up your wallet to book influencers. Razorpay secure payment.</p>
            <div className="grid grid-cols-3 gap-2">
              {['500', '1000', '2000', '5000', '10000', '25000'].map((amt) => (
                <button key={amt} className="rounded-xl border border-border py-2 text-sm font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors text-foreground">
                  ₹{amt}
                </button>
              ))}
            </div>
            <button className="w-full mt-4 inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 px-4 transition-colors">
              <PlusCircle className="w-4 h-4 mr-2" /> Add Money
            </button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ArrowDownLeft className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">No transactions yet. Transactions will appear here after you add funds or make bookings.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
