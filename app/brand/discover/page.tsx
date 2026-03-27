import { Card, CardContent } from '@/components/ui/card';
import { Search, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { influencerProfiles, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import Image from 'next/image';
import { getOptimizedUrl } from '@/lib/cloudinary';
import { CheckCircle2, MapPin, Star } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover Influencers | InfluencerConnect',
};

export const dynamic = 'force-dynamic';

export default async function DiscoverPage() {
  const influencers = await db
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
      bio: influencerProfiles.bio,
    })
    .from(influencerProfiles)
    .innerJoin(users, eq(influencerProfiles.userId, users.id))
    .where(eq(influencerProfiles.verificationStatus, 'approved'))
    .limit(24);

  return (
    <div className="w-full pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Discover Creators</h1>
          <p className="text-muted-foreground mt-1 text-sm">Find the perfect influencer for your brand campaigns.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by city, category, or name…"
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {influencers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/30">
          <Search className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="font-semibold text-foreground text-xl">No influencers found yet</h3>
          <p className="mt-2 text-sm max-w-sm">Approved influencer profiles will appear here once they complete verification.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {influencers.map((inf) => (
            <Link
              key={inf.id}
              href={`/influencers/${inf.slug}`}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={inf.photo?.includes('res.cloudinary') ? getOptimizedUrl(inf.photo) : inf.photo || '/avatar-placeholder.png'}
                  alt={inf.name || 'Influencer'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{inf.name}</h3>
                  {inf.isVerified && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </div>
                {inf.city && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {inf.city}
                  </p>
                )}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {inf.followers ? `${(inf.followers / 1000).toFixed(1)}K followers` : 'N/A'}
                  </span>
                  {Number(inf.rating) > 0 && (
                    <span className="flex items-center gap-1 text-xs font-bold text-foreground">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      {inf.rating}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
