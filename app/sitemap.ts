import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { influencerProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const influencers = await db
    .select({ slug: influencerProfiles.slug, updatedAt: influencerProfiles.updatedAt })
    .from(influencerProfiles)
    .where(eq(influencerProfiles.verificationStatus, 'approved'));

  const influencerUrls = influencers.map(inf => ({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/influencers/${inf.slug}`,
    lastModified: inf.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', priority: 1.0 },
    { url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/influencers`, priority: 0.9 },
    ...influencerUrls,
  ];
}
