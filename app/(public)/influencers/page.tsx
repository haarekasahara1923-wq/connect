import { Suspense } from 'react';
import { db } from '@/lib/db';
import { influencerProfiles, users, services } from '@/lib/db/schema';
import { eq, or, ilike, and, inArray, sql } from 'drizzle-orm';
import { FilterPanel } from '@/components/influencer/FilterPanel';
import { InfluencerCard } from '@/components/influencer/InfluencerCard';

interface SearchParams {
  q?: string;
  category?: string | string[];
  city?: string | string[];
  minPrice?: string;
  maxPrice?: string;
}

async function InfluencerList({ searchParamsPromise }: { searchParamsPromise: Promise<SearchParams> }) {
  // Extract params
  const searchParams = await searchParamsPromise;
  const { q, category, city } = searchParams;
  
  const categories = typeof category === 'string' ? [category] : category || [];
  const cities = typeof city === 'string' ? [city] : city || [];

  // Build Query Conditions
  let conditions = [];
  // Allow both approved and pending for real-time visibility during development
  conditions.push(or(eq(influencerProfiles.verificationStatus, 'approved'), eq(influencerProfiles.verificationStatus, 'pending')));

  if (q) {
    conditions.push(ilike(users.name, `%${q}%`));
  }

  if (cities.length > 0) {
    conditions.push(inArray(influencerProfiles.city, cities));
  }

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
      portfolioVideos: influencerProfiles.portfolioVideos,
      minPrice: sql<number>`MIN(${services.price})`.mapWith(Number),
    })
    .from(influencerProfiles)
    .innerJoin(users, eq(influencerProfiles.userId, users.id))
    .leftJoin(services, and(eq(services.influencerId, influencerProfiles.id), eq(services.isActive, true)))
    .where(and(...conditions))
    .groupBy(
        influencerProfiles.id, 
        influencerProfiles.slug, 
        users.name, 
        users.profileImage, 
        influencerProfiles.city, 
        influencerProfiles.categories, 
        influencerProfiles.totalReach, 
        influencerProfiles.averageRating, 
        influencerProfiles.isVerifiedBadge,
        influencerProfiles.portfolioVideos
    )
    .limit(50);

  // Post-filter logic for categories since Drizzle JSON array overlap is dialect-specific
  const filtered = categories.length > 0 
    ? results.filter(r => r.categories && (r.categories as string[]).some(c => categories.includes(c)))
    : results;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.length > 0 ? (
        filtered.map(inf => <InfluencerCard key={inf.id} inf={inf as any} />)
      ) : (
        <div className="col-span-full py-24 text-center text-gray-500 bg-white rounded-2xl border border-dashed">
          <span className="text-4xl block mb-4">🔍</span>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No influencers found</h3>
          <p>Try adjusting your filters or searching another city.</p>
        </div>
      )}
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default async function InfluencersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-secondary">
            Discover Influencers
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">Find the perfect voice for your local business.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <Suspense fallback={<div className="h-96 bg-gray-200 animate-pulse rounded-2xl" />}>
              <FilterPanel />
            </Suspense>
          </div>

          {/* Main Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm mb-6">
               <p className="text-sm font-semibold text-gray-500">Showing top results</p>
               <select className="border-gray-200 rounded-lg text-sm bg-gray-50 font-medium p-2">
                 <option>Sort by: Recommended</option>
                 <option>Sort by: Highest Rated</option>
                 <option>Sort by: Most Followers</option>
               </select>
            </div>
            
            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-2xl" />)}
              </div>
            }>
              <InfluencerList searchParamsPromise={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
