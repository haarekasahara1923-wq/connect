'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function CreateCampaignPage() {
  return (
    <div className="w-full pb-20 lg:pb-0 max-w-2xl">
      <div className="mb-8">
        <Link href="/brand/campaigns" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1">
          ← Back to Campaigns
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mt-2">Create Campaign</h1>
        <p className="text-muted-foreground mt-1 text-sm">Define your campaign goals and target audience to find the best influencers.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-primary" /> Campaign Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Campaign Name *</label>
            <input
              type="text"
              placeholder="e.g. Summer Collection Launch 2025"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Description *</label>
            <textarea
              rows={4}
              placeholder="Describe your campaign, goals, and what you expect from influencers…"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Budget (₹)</label>
              <input
                type="number"
                placeholder="e.g. 10000"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Target City</label>
              <input
                type="text"
                placeholder="e.g. Jaipur"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Platform</label>
            <div className="flex gap-2 flex-wrap">
              {['Instagram', 'YouTube', 'Reels', 'Shorts', 'Live'].map((p) => (
                <button key={p} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors text-foreground">
                  {p}
                </button>
              ))}
            </div>
          </div>
          <button className="w-full inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 px-4 transition-colors mt-2">
            Launch Campaign <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
