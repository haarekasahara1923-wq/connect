import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, TrendingUp, Users, Video, ShieldCheck, Zap } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-32">
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            How <span className="text-primary italic">InfluencerConnect</span> Works
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Directly connect with micro and nano-influencers in your city. No agencies, no middleman, just results.
          </p>
        </div>
      </section>

      {/* THREE STEP PROCESS */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-background border border-border shadow-xl hover:scale-105 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Discover</h3>
              <p className="text-muted-foreground">Search influencers by city, category, and budget. Filter through thousands of verified local voices.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-background border border-border shadow-xl hover:scale-105 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. Book</h3>
              <p className="text-muted-foreground">Select a package and pay via our secure escrow system. Funds are held until the content is delivered.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-background border border-border shadow-xl hover:scale-105 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Grow</h3>
              <p className="text-muted-foreground">Receive authentic video content that drives local footfall and builds trust with your community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOR BRANDS */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">For Brands & Local Businesses 🏢</h2>
            <div className="space-y-6">
              {[
                "Target local audiences with local faces they trust.",
                "Start with budgets as low as ₹1,000 per promotion.",
                "Direct chat with influencers to discuss campaign goals.",
                "Verified performance metrics and real-time tracking.",
                "Secure payout only after content approval."
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <p className="font-medium text-lg">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Link href="/register?role=brand">
                <Button size="lg" className="rounded-full px-8 py-6 text-lg font-bold">I am a Business</Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="aspect-square bg-gradient-to-tr from-primary to-accent rounded-3xl shadow-2xl overflow-hidden">
               <div className="absolute inset-0 flex items-center justify-center text-white p-12 text-center">
                  <span className="text-4xl font-black uppercase opacity-20">Secure Business Growth</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOR INFLUENCERS */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">For Creators & Influencers 📸</h2>
            <div className="space-y-6">
              {[
                "Get paid for your creativity and local influence.",
                "Zero platform fees for nano-influencers (under 10k followers).",
                "Manage all your collaborations in one dashboard.",
                "Direct bank payouts with 24-hour guarantee.",
                "Showcase your portfolio to thousands of local brands."
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
                  <p className="font-medium text-lg">{item}</p>
                </div>
              ))}
            </div>
             <div className="mt-10">
              <Link href="/register?role=influencer">
                <Button size="lg" variant="secondary" className="rounded-full px-8 py-6 text-lg font-bold">I am an Influencer</Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="aspect-square bg-gradient-to-tr from-secondary to-orange-400 rounded-3xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-white p-12 text-center">
                  <span className="text-4xl font-black uppercase opacity-20">Creative FREEDOM</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl md:text-4xl font-bold mb-16">Platform Security & Safety</h2>
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 rounded-2xl border bg-card">
                 <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
                 <h4 className="font-bold mb-2">Escrow Protected</h4>
                 <p className="text-sm text-muted-foreground">Payments are held safely until work is completed.</p>
              </div>
              <div className="p-8 rounded-2xl border bg-card">
                 <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
                 <h4 className="font-bold mb-2">Verified Profiles</h4>
                 <p className="text-sm text-muted-foreground">Every influencer is manually vetter by our team.</p>
              </div>
              <div className="p-8 rounded-2xl border bg-card">
                 <Zap className="w-12 h-12 text-accent mx-auto mb-4" />
                 <h4 className="font-bold mb-2">No Commission</h4>
                 <p className="text-sm text-muted-foreground">Transparent pricing with no hidden marketplace fees.</p>
              </div>
              <div className="p-8 rounded-2xl border bg-card">
                 <Video className="w-12 h-12 text-primary mx-auto mb-4" />
                 <h4 className="font-bold mb-2">Proof of Work</h4>
                 <p className="text-sm text-muted-foreground">Automatic tracking of campaign results and reach.</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
