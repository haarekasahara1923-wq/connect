import Link from 'next/link';
import { db } from '@/lib/db';
import { influencerProfiles, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCached, setCache, CACHE_KEYS } from '@/lib/redis';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { getOptimizedUrl } from '@/lib/cloudinary';
import { INFLUENCER_CATEGORIES, TIER2_CITIES } from '@/types';
import { Star, CheckCircle2, TrendingUp, Users, Video } from 'lucide-react';

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
      followers: influencerProfiles.instagramFollowers,
      rating: influencerProfiles.averageRating,
      isVerified: influencerProfiles.isVerifiedBadge,
    })
    .from(influencerProfiles)
    .innerJoin(users, eq(influencerProfiles.userId, users.id))
    .where(
      and(
        eq(influencerProfiles.isFeatured, true),
        eq(influencerProfiles.verificationStatus, 'approved')
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
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-indigo-50 py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('/mesh.svg')] opacity-20 bg-cover bg-center" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-red-100 text-red-700 hover:bg-red-200 border-red-200 px-4 py-1 text-sm">
            India's #1 Hyperlocal Marketplace
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-secondary max-w-4xl mx-auto leading-tight">
            Apne Sheher Ka Influencer Dhundo, <span className="text-red-600 bg-clip-text">Business Badhao</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Tier 2-3 cities ke micro/nano influencers se direct connect karo. Authentic local promotions sirf ₹5,000 se shuru.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/influencers" className="inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all hover:scale-105">
              Influencer Dhundo &rarr;
            </Link>
            <Link href="/register" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-semibold text-secondary shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all">
              Influencer Bano &rarr;
            </Link>
          </div>

          <div className="mt-20 border-t border-gray-200/60 pt-10">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 divide-x divide-gray-200/60">
              <div className="flex flex-col items-center">
                <Users className="w-8 h-8 text-red-500 mb-3" />
                <p className="text-3xl font-bold text-secondary">500+</p>
                <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">Influencers</p>
              </div>
              <div className="flex flex-col items-center">
                <TrendingUp className="w-8 h-8 text-orange-500 mb-3" />
                <p className="text-3xl font-bold text-secondary">1,000+</p>
                <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">Campaigns</p>
              </div>
              <div className="flex flex-col items-center col-span-2 md:col-span-1 border-t md:border-t-0 border-gray-200/60 pt-8 md:pt-0 mt-8 md:mt-0">
                <Video className="w-8 h-8 text-indigo-500 mb-3" />
                <p className="text-3xl font-bold text-secondary">₹50L+</p>
                <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">Creators ko mila</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES PILL SCROLL */}
      <section className="py-8 border-y bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {INFLUENCER_CATEGORIES.map((cat, i) => (
              <Link 
                key={cat} 
                href={`/influencers?category=${cat}`}
                className="snap-start flex-none whitespace-nowrap bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 hover:text-red-700 text-gray-700 font-medium px-6 py-2.5 rounded-full transition-colors capitalize"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED INFLUENCERS GRID */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-secondary">Trending Influencers</h2>
              <p className="mt-2 text-muted-foreground">Top rated creators ready to promote your brand</p>
            </div>
            <Link href="/influencers" className="hidden sm:flex text-red-600 font-medium hover:text-red-700 items-center">
              View all <span aria-hidden="true" className="ml-1">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.length > 0 ? featured.map((inf) => (
              <Link key={inf.id} href={`/influencers/${inf.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
                <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                  <Image 
                    src={inf.photo?.includes('res.cloudinary') ? getOptimizedUrl(inf.photo) : inf.photo || '/avatar-placeholder.png'} 
                    alt={inf.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {inf.isVerified && (
                    <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-1 shadow-md">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm flex items-center">
                    <Star className="w-3.5 h-3.5 text-yellow-500 mr-1 fill-yellow-500" />
                    {Number(inf.rating) > 0 ? inf.rating : 'New'}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">{inf.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{inf.city}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {inf.categories && inf.categories.slice(0, 2).map((cat: string) => (
                      <span key={cat} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md capitalize">
                        {cat}
                      </span>
                    ))}
                    {inf.categories && inf.categories.length > 2 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">+{inf.categories.length - 2}</span>
                    )}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Instagram</p>
                      <p className="font-semibold text-sm">{(inf.followers / 1000).toFixed(1)}K</p>
                    </div>
                    <Button size="sm" className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                      Book Now
                    </Button>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed">
                <p>No featured influencers yet. They will appear here once approved!</p>
              </div>
            )}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/influencers" className="w-full inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100 transition-colors">
              View all influencers
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-secondary">How InfluencerConnect Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">Easy, secure, and transparent for everyone.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            <div className="bg-red-50 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Users className="w-48 h-48" /></div>
              <h3 className="text-2xl font-bold mb-8 text-red-900 relative z-10">For Brands 🏢</h3>
              <div className="space-y-8 relative z-10">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">1</div>
                  <div>
                    <h4 className="font-bold text-lg">Search & Filter</h4>
                    <p className="text-red-800/80 mt-1">Find the perfect creator in your specific city and niche.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">2</div>
                  <div>
                    <h4 className="font-bold text-lg">Secure Booking</h4>
                    <p className="text-red-800/80 mt-1">Pay via escrow. Funds are held safely until the video is delivered.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">3</div>
                  <div>
                    <h4 className="font-bold text-lg">Get Results</h4>
                    <p className="text-red-800/80 mt-1">Receive authentic content that actually drives footfall to your business.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10"><Star className="w-48 h-48" /></div>
              <h3 className="text-2xl font-bold mb-8 text-indigo-900 relative z-10">For Influencers 📸</h3>
              <div className="space-y-8 relative z-10">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">1</div>
                  <div>
                    <h4 className="font-bold text-lg">Create Profile</h4>
                    <p className="text-indigo-800/80 mt-1">List your packages, pricing, and showcase your past work.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">2</div>
                  <div>
                    <h4 className="font-bold text-lg">Get Booked</h4>
                    <p className="text-indigo-800/80 mt-1">Accept paid collaboration requests directly from local brands.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">3</div>
                  <div>
                    <h4 className="font-bold text-lg">Guaranteed Payout</h4>
                    <p className="text-indigo-800/80 mt-1">Deliver the work and get your money directly in your bank account.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CITY SECTION */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Apne Sheher Ke Influencers</h2>
            <p className="mt-4 text-gray-400">Target local audiences with local faces</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
            {TIER2_CITIES.slice(0, 15).map(city => (
              <Link 
                key={city} 
                href={`/influencers?city=${city}`}
                className="bg-white/10 hover:bg-white hover:text-secondary text-white border border-white/20 px-6 py-3 rounded-full font-medium transition-all"
              >
                {city}
              </Link>
            ))}
            <Link href="/influencers" className="bg-red-600 hover:bg-red-700 text-white border border-transparent px-6 py-3 rounded-full font-medium transition-all">
              Discover All Cities &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 bg-gradient-to-t from-gray-50 to-white text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-10 md:p-16 border shadow-2xl shadow-red-100">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-secondary">
              Aaj hi shuru karo — <span className="text-red-600">bilkul free</span> mein
            </h2>
            <p className="mt-6 text-xl text-gray-500 mb-10">Join thousands of brands and influencers growing together across India.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link href="/register?role=brand" className="inline-flex items-center justify-center rounded-xl bg-secondary px-8 py-4 text-lg font-semibold text-white shadow-xl hover:bg-gray-800 transition-all">
                I am a Brand
              </Link>
              <Link href="/register?role=influencer" className="inline-flex items-center justify-center rounded-xl bg-red-600 px-8 py-4 text-lg font-semibold text-white shadow-xl hover:bg-red-700 transition-all">
                I am an Influencer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold tracking-tight text-red-600 block mb-4">InfluencerConnect</span>
            <p className="text-gray-500 max-w-md">
              India's first hyperlocal influencer marketplace. Connecting local businesses with powerful local voices to drive authentic growth.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-secondary">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/influencers" className="hover:text-red-600">Browse Influencers</Link></li>
              <li><Link href="/how-it-works" className="hover:text-red-600">How it Works</Link></li>
              <li><Link href="/pricing" className="hover:text-red-600">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-secondary">Support</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/contact" className="hover:text-red-600">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-red-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-red-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} InfluencerConnect India. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Instagram</span>
            <span>YouTube</span>
            <span>WhatsApp</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
