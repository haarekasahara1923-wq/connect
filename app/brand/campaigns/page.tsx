import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Campaigns | InfluencerConnect',
};

export default function CampaignsPage() {
  return (
    <div className="w-full pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Campaigns</h1>
          <p className="text-muted-foreground mt-1 text-sm">Create and manage your influencer marketing campaigns.</p>
        </div>
        <Link
          href="/brand/campaigns/create"
          className="inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 py-2"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Create Campaign
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/30">
        <Megaphone className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h3 className="font-semibold text-foreground text-xl">No campaigns yet</h3>
        <p className="mt-2 text-sm max-w-sm">Launch your first campaign to start connecting with local influencers in your target city.</p>
        <Link
          href="/brand/campaigns/create"
          className="inline-flex items-center justify-center rounded-xl font-medium transition-colors bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-6 py-2 mt-6 text-sm"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Create Your First Campaign
        </Link>
      </div>
    </div>
  );
}
