import Link from 'next/link';
import { db } from '@/lib/db';
import { influencerProfiles, users } from '@/lib/db/schema';
import { eq, and, or } from 'drizzle-orm';
import { getCached, setCache, CACHE_KEYS } from '@/lib/redis';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { getOptimizedUrl } from '@/lib/cloudinary';
import { INFLUENCER_CATEGORIES, TIER2_CITIES } from '@/types';
import { Star, CheckCircle2, TrendingUp, Users, Video, Globe, ShieldCheck, ArrowRight, Zap, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import RoleRedirect from '@/components/shared/RoleRedirect';

async function getFeaturedInfluencers() {
  const cacheKey = CACHE_KEYS.FEATURED_INFLUENCERS;
  const cached = await getCached<any[]>(cacheKey);
  if (cached) return cached;

  const results = await db
    .select({
      id: influencerProfiles.id,
      slug: influencerProfiles.slug,
      name: users.name,
      photo: users.profileImage,
      city: influencerProfiles.city,
      categories: influencerProfiles.categories,
      followers: influencerProfiles.totalReach,
      rating: influencerProfiles.averageRating,
      isVerified: influencerProfiles.isVerifiedBadge,
    })
    .from(influencerProfiles)
    .innerJoin(users, eq(influencerProfiles.userId, users.id))
    .where(
      and(
        eq(influencerProfiles.isFeatured, true),
        or(
          eq(influencerProfiles.verificationStatus, 'approved'),
          eq(influencerProfiles.verificationStatus, 'pending')
        )
      )
    )
    .limit(12);

  await setCache(cacheKey, results, 600); // 10 minutes cache
  return results;
}

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const featured = await getFeaturedInfluencers();

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      <RoleRedirect />
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-soft-light" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full animate-pulse-slow" />
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="lg:w-1/2 text-left space-y-8">
              <Badge variant="outline" className="bg-white/50 backdrop-blur-xl border-primary/20 px-6 py-2 text-sm font-bold uppercase tracking-widest text-primary shadow-sm">
                Next-Gen Hyperlocal Influencer Hub
              </Badge>
              <h1 className="text-5xl md:text-8xl font-black tracking-tight text-foreground leading-[1.3] mb-6 py-4">
                Amplify Your <br className="md:hidden" />
                <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary animate-gradient-text italic decoration-clone px-8 py-2 -mx-8 -my-2 transform-gpu">Brand Narrative</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl">
                Bridge the gap between local commerce and digital creators. Secure, scalable, and authentically Indian.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <Link href="/influencers">
                  <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 px-12 py-8 text-xl font-black transition-all hover:scale-105 active:scale-95 group">
                    Explore Creators <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="rounded-full border-2 border-primary/20 bg-white/10 backdrop-blur-md px-12 py-8 text-xl font-black transition-all hover:bg-white hover:text-primary hover:border-white shadow-lg">
                    Join the Elite
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 relative group perspective-1000">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary via-accent to-secondary rounded-[4rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/30 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] glass-morphism transform group-hover:rotate-1 group-hover:scale-[1.02] transition-all duration-700">
                <Image 
                  src="/images/grow_business.jpg" 
                  alt="Premium Marketing Growth" 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white/90 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl border border-white/50 max-w-xs animate-float">
                <div className="flex items-center gap-5 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div>
                    <h5 className="font-black text-foreground">Hyper-Growth</h5>
                    <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Region specific traction</p>
                  </div>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[85%] rounded-full animate-shimmer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETING STRATEGY / MEGAPHONE SECTION */}
      <section className="py-20 bg-card/50 relative">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-24 items-center">
             <div className="relative group">
                <div className="absolute -inset-10 bg-secondary/10 blur-[100px] rounded-full" />
                <div className="relative aspect-square rounded-[4rem] overflow-hidden border-4 border-white shadow-3xl transform -rotate-2 group-hover:rotate-0 transition-all duration-1000">
                    <Image src="/images/influencer_megaphone.jpg" alt="Influencer Strategy" fill className="object-cover" />
                </div>
             </div>
             <div className="text-left space-y-10">
                <h2 className="text-4xl md:text-6xl font-black leading-[1.1] mb-2">Authentic Voice & <span className="text-secondary italic pr-2">Digital Resonance</span></h2>
                <p className="text-xl text-muted-foreground leading-relaxed">We provide the tools for brands to amplify their message through local storytellers who command absolute trust within their communities.</p>
                <div className="grid gap-8">
                    {[
                        { title: "Local Authority", desc: "Influencers who are celebrities in your specific pin code.", icon: <Users /> },
                        { title: "Secure Payouts", desc: "Escrow system ensures total protection for both parties.", icon: <ShieldCheck /> },
                        { title: "Direct Connect", desc: "Zero agency involvement. Talk, trade, and grow together.", icon: <Zap /> }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-6 group items-start">
                            <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all shadow-md">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="text-2xl font-black mb-1">{item.title}</h4>
                                <p className="text-muted-foreground">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        </div>
      </section>

      {/* FEATURED WOMEN INFLUENCERS */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-24">
            <h2 className="text-4xl md:text-7xl font-black mb-6 leading-[1.1]">Spotlight: <span className="text-accent underline decoration-primary/40 underline-offset-8 pr-2">Trailblazing Creators</span></h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto italic">Directly empowering Bharat's top female voices to lead regional brand stories.</p>
        </div>
        
        <div className="container mx-auto px-4 mb-16 group">
             <div className="relative aspect-[21/9] rounded-[4rem] overflow-hidden border-8 border-white shadow-[0_48px_100px_-24px_rgba(0,0,0,0.1)] group-hover:shadow-[0_48px_100px_-24px_rgba(var(--primary),0.2)] transition-all duration-1000">
                <Image src="/images/featured_women.jpg" alt="Bharat's Top Influencers" fill className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-12 lg:p-20">
                    <div className="flex justify-between items-end w-full">
                        <div>
                            <h3 className="text-4xl lg:text-6xl font-black text-white italic">Influencer Connect Elite</h3>
                            <p className="text-xl text-white/70 mt-4 tracking-widest font-bold">12 VISIONARY CREATORS • CURATED EXCELLENCE</p>
                        </div>
                        <Link href="/influencers">
                            <Button size="lg" variant="secondary" className="rounded-full px-12 py-8 text-xl font-bold shadow-2xl">Browse Portfolios</Button>
                        </Link>
                    </div>
                </div>
             </div>
        </div>

        <div className="container mx-auto px-4">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {featured.length > 0 ? featured.map((inf) => (
                <Link key={inf.id} href={`/influencers/${inf.slug}`} className="group relative bg-[#ffffff05] backdrop-blur-3xl border border-white/20 rounded-[3rem] overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-[0_32px_128px_-32px_rgba(var(--primary),0.2)] hover:-translate-y-4 pb-8">
                    <div className="aspect-[4/5] overflow-hidden relative">
                         <Image 
                            src={inf.photo || 'https://ui-avatars.com/api/?name=Influencer&background=F3F4F6&color=4B5563'} 
                            alt={inf.name} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                         <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            View Profile
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="text-left">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-2xl font-black group-hover:text-primary transition-colors">{inf.name}</h3>
                                {inf.isVerified && <CheckCircle2 className="w-5 h-5 text-primary fill-primary/20" />}
                             </div>
                             <p className="text-muted-foreground font-bold tracking-widest opacity-60 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> {inf.city}
                             </p>
                        </div>
                         <div className="flex flex-wrap gap-2">
                            {inf.categories && inf.categories.slice(0, 2).map((cat: string) => (
                            <span key={cat} className="text-[11px] font-black uppercase tracking-widest bg-primary text-white px-4 py-1.5 rounded-full">{cat}</span>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-px bg-border/30 rounded-3xl overflow-hidden border border-border/30 backdrop-blur-md">
                            <div className="bg-background/20 p-5 text-center">
                                <p className="text-[10px] uppercase font-black text-muted-foreground mb-1 tracking-tighter">Followers</p>
                                <p className="font-black text-xl italic">{(inf.followers / 1000).toFixed(1)}K</p>
                            </div>
                            <div className="bg-background/20 p-5 text-center border-l border-border/30">
                                <p className="text-[10px] uppercase font-black text-muted-foreground mb-1 tracking-tighter">Rating</p>
                                <p className="font-black text-xl flex items-center justify-center gap-1 italic">
                                    {Number(inf.rating) > 0 ? inf.rating : '4.9'} <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
                )) : null}
             </div>
        </div>
      </section>

      {/* MARKETING FLOW / DIAGRAM SECTION */}
      <section className="py-20 bg-secondary/5 relative">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-32">
             <div className="lg:w-1/2 space-y-12 text-left">
                <Badge className="bg-secondary/10 text-secondary border-secondary/20 font-black">THE INFLUENCER FLOW</Badge>
                <h2 className="text-4xl md:text-7xl font-black leading-[1.1]">Mastering Your <br/><span className="italic text-secondary pr-4">Local Ecosystem</span></h2>
                <p className="text-xl text-muted-foreground max-w-xl">Our optimized campaign lifecycle ensures that every rupee spent delivers measurable impact in your specific territory.</p>
                <div className="space-y-8">
                     {[
                        "Discover creators with hyper-local engagement.",
                        "Direct communication without platform friction.",
                        "Verified Proof-of-Work documentation.",
                        "Immediate ROI through targeted traffic."
                     ].map((item, i) => (
                        <div key={i} className="flex gap-5 items-center">
                             <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-black">{i+1}</div>
                             <p className="text-lg font-bold">{item}</p>
                        </div>
                     ))}
                </div>
                <Link href="/how-it-works"><Button size="lg" className="rounded-full px-12 py-7 font-black text-lg bg-secondary hover:bg-secondary/90 shadow-2xl shadow-secondary/20">Learn the Architecture</Button></Link>
             </div>
             <div className="lg:w-1/2 relative group">
                <div className="absolute inset-0 bg-secondary/20 blur-[120px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
                <div className="relative aspect-[4/3] rounded-[4rem] overflow-hidden border-8 border-background shadow-4xl group-hover:rotate-1 group-hover:scale-[1.02] transition-all duration-700">
                    <Image src="/images/influencer_flow.jpg" alt="Marketing Architecture" fill className="object-cover" />
                </div>
             </div>
        </div>
      </section>

      {/* CTA COMMUNITY COLLAGE */}
      <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
              <div className="relative bg-gradient-to-tr from-primary via-accent to-secondary rounded-[5rem] p-12 lg:p-32 border border-white/20 overflow-hidden shadow-4xl group">
                   <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                   <div className="grid lg:grid-cols-2 gap-24 items-center relative z-10">
                       <div className="space-y-10">
                            <h2 className="text-4xl md:text-8xl font-black text-white leading-[1.1] italic tracking-tight pr-4">Join the <br/>Hyperlocal Elite</h2>
                            <p className="text-2xl text-white/80 max-w-lg font-medium leading-relaxed">Join 50,000+ visionaries redefining commerce across India's Tier 2 and Tier 3 cities.</p>
                            <div className="flex flex-wrap gap-6 pt-6">
                                <Link href="/register?role=brand"><Button size="lg" className="rounded-full bg-white text-primary hover:bg-white/90 px-14 py-9 font-black text-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500">I am a Brand</Button></Link>
                                <Link href="/register?role=influencer"><Button size="lg" variant="outline" className="rounded-full border-2 border-white text-white hover:bg-white hover:text-primary px-14 py-9 font-black text-2xl backdrop-blur-md group-hover:scale-105 transition-transform duration-500">I am an Influencer</Button></Link>
                            </div>
                       </div>
                       <div className="relative transform rotate-3 group-hover:rotate-0 transition-all duration-1000">
                            <div className="absolute -inset-10 bg-white/20 blur-[100px] rounded-full" />
                            <div className="relative aspect-square rounded-[4rem] overflow-hidden border-8 border-white shadow-4xl">
                                <Image src="/images/community_collage.jpg" alt="Platform Influencer Collage" fill className="object-cover" />
                            </div>
                            <div className="absolute top-[-20px] right-[-20px] bg-accent text-white font-black px-8 py-4 rounded-full shadow-2xl border-4 border-white animate-bounce-slow text-2xl italic tracking-tighter">
                                50K+ MEMBERS
                            </div>
                       </div>
                   </div>
              </div>
          </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-card border-t border-border py-16 relative overflow-hidden">
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full" />
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-20 relative z-10">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <span className="text-4xl font-black tracking-tighter text-primary italic">InfluencerConnect</span>
            <p className="text-muted-foreground max-w-md text-xl font-medium leading-relaxed opacity-80">
              India's premier hyperlocal ecosystem. Facilitating authentic synergy between regional commerce and digital storytelling.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-8 uppercase tracking-[0.2em] text-sm text-foreground opacity-90 underline decoration-primary decoration-4 underline-offset-8">Explore</h4>
            <ul className="space-y-6 text-muted-foreground font-bold text-lg">
              <li><Link href="/influencers" className="hover:text-primary hover:translate-x-2 transition-all inline-block">Directory of Talent</Link></li>
              <li><Link href="/how-it-works" className="hover:text-primary hover:translate-x-2 transition-all inline-block">Architecture of Flow</Link></li>
              <li><Link href="/pricing" className="hover:text-primary hover:translate-x-2 transition-all inline-block">Investment Models</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-8 uppercase tracking-[0.2em] text-sm text-foreground opacity-90 underline decoration-secondary decoration-4 underline-offset-8">Governance</h4>
            <ul className="space-y-6 text-muted-foreground font-bold text-lg">
              <li><Link href="/contact" className="hover:text-primary hover:translate-x-2 transition-all inline-block">Concierge Support</Link></li>
              <li><Link href="/privacy" className="hover:text-primary hover:translate-x-2 transition-all inline-block">Security Protocols</Link></li>
              <li><Link href="/terms" className="hover:text-primary hover:translate-x-2 transition-all inline-block">User Agreement</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-32 pt-16 border-t border-border flex flex-col md:flex-row justify-between items-center text-xs font-black text-muted-foreground uppercase tracking-[0.3em] opacity-60">
          <p>&copy; {new Date().getFullYear()} INFLUENCERCONNECT GLOBAL • DHARAMSHALA OFFICE</p>
          <div className="flex gap-12 mt-8 md:mt-0">
            <Link href="#" className="hover:text-primary transition-colors">INSTAGRAM</Link>
            <Link href="#" className="hover:text-primary transition-colors">YOUTUBE</Link>
            <Link href="#" className="hover:text-primary transition-colors">LINKEDIN</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
