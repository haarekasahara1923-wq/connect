'use server';

import { db } from '@/lib/db';
import { influencerProfiles, services, users } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq, and, sql } from 'drizzle-orm';
import { deleteCache, setCache } from '@/lib/redis';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required').max(5),
  languages: z.array(z.string()),
  instagramHandle: z.string().optional(),
  instagramFollowers: z.coerce.number().min(0).optional(),
  youtubeHandle: z.string().optional(),
  youtubeSubscribers: z.coerce.number().min(0).optional(),
  facebookHandle: z.string().optional(),
  facebookFollowers: z.coerce.number().min(0).optional(),
  telegramHandle: z.string().optional(),
  whatsappNumber: z.string().optional(),
  whatsappChannelHandle: z.string().optional(),
  linkedinHandle: z.string().optional(),
  snapchatHandle: z.string().optional(),
  xHandle: z.string().optional(),
  threadsHandle: z.string().optional(),
  address: z.string().optional(),
  socialMetrics: z.any().optional(),
  coverImage: z.string().optional(),
  profilePhoto: z.string().optional(), 
});

export async function getMyProfile() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'influencer') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const [profile] = await db.select()
      .from(influencerProfiles)
      .where(eq(influencerProfiles.userId, session.user.id));
      
    const [user] = await db.select({ photo: users.profileImage }).from(users).where(eq(users.id, session.user.id));

    return { 
      success: true, 
      data: { ...profile, profilePhoto: user?.photo } 
    };
  } catch (error) {
    return { success: false, error: 'Failed to fetch profile' };
  }
}

export async function updateProfile(formData: {
  bio?: string;
  city: string;
  state: string;
  categories: string[];
  languages: string[];
  instagramHandle?: string;
  instagramFollowers?: number;
  youtubeHandle?: string;
  youtubeSubscribers?: number;
  facebookHandle?: string;
  facebookFollowers?: number;
  telegramHandle?: string;
  whatsappNumber?: string;
  whatsappChannelHandle?: string;
  linkedinHandle?: string;
  snapchatHandle?: string;
  xHandle?: string;
  threadsHandle?: string;
  address?: string;
  socialMetrics?: any;
  coverImage?: string;
  profilePhoto?: string;
}) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'influencer') {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = updateProfileSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' };
  }

  const data = parsed.data;

  try {
    const [existing] = await db.select({ id: influencerProfiles.id, slug: influencerProfiles.slug })
      .from(influencerProfiles)
      .where(eq(influencerProfiles.userId, session.user.id));

    if (!existing) return { success: false, error: 'Profile not found' };

    await db.update(influencerProfiles)
      .set({
        bio: data.bio,
        city: data.city,
        state: data.state,
        categories: data.categories,
        languages: data.languages,
        instagramHandle: data.instagramHandle,
        instagramFollowers: data.instagramFollowers,
        youtubeHandle: data.youtubeHandle,
        youtubeSubscribers: data.youtubeSubscribers,
        facebookHandle: data.facebookHandle,
        facebookFollowers: data.facebookFollowers,
        telegramHandle: data.telegramHandle,
        whatsappNumber: data.whatsappNumber,
        whatsappChannelHandle: data.whatsappChannelHandle,
        linkedinHandle: data.linkedinHandle,
        snapchatHandle: data.snapchatHandle,
        xHandle: data.xHandle,
        threadsHandle: data.threadsHandle,
        address: data.address,
        socialMetrics: data.socialMetrics,
        coverImage: data.coverImage,
        totalReach: (data.instagramFollowers || 0) + (data.youtubeSubscribers || 0) + (data.facebookFollowers || 0),
        updatedAt: new Date(),
      })
      .where(eq(influencerProfiles.id, existing.id));

    if (data.profilePhoto) {
      await db.update(users)
        .set({ profileImage: data.profilePhoto })
        .where(eq(users.id, session.user.id));
    }

    await deleteCache(`influencer:profile:${existing.slug}`);
    revalidatePath('/influencer/profile');
    revalidatePath(`/influencers/${existing.slug}`);

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update profile' };
  }
}
