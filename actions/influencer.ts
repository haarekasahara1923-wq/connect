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

    // Ensure metrics keys are consistent
    const cleanedMetrics = data.socialMetrics || {};

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
        socialMetrics: cleanedMetrics,
        coverImage: data.coverImage,
        totalReach: (Number(data.instagramFollowers) || 0) + (Number(data.youtubeSubscribers) || 0) + (Number(data.facebookFollowers) || 0),
        updatedAt: new Date(),
      })
      .where(eq(influencerProfiles.id, existing.id));

    if (data.profilePhoto !== undefined) {
      await db.update(users)
        .set({ profileImage: data.profilePhoto })
        .where(eq(users.id, session.user.id));
    }

    await deleteCache(`influencer:profile:${existing.slug}`);
    await deleteCache('influencers:featured');
    
    revalidatePath('/influencer/profile');
    revalidatePath('/influencers');
    revalidatePath(`/influencers/${existing.slug}`);
    revalidatePath(`/influencers/${existing.slug}`, 'page');

    return { success: true };
  } catch (error) {
    console.error('Update Profile Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Database sync error' };
  }
}

export async function addService(data: {
  serviceType: any;
  title: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisionsIncluded: number;
}) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'influencer') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    if (isNaN(data.price) || data.price <= 0) {
      return { success: false, error: 'Invalid price amount' };
    }

    const [profile] = await db.select({ id: influencerProfiles.id, slug: influencerProfiles.slug })
      .from(influencerProfiles)
      .where(eq(influencerProfiles.userId, session.user.id));

    if (!profile) return { success: false, error: 'Profile not found' };

    const [newService] = await db.insert(services).values({
      influencerId: profile.id,
      ...data,
      price: data.price.toFixed(2),
    }).returning();

    revalidatePath(`/influencer/services`);
    revalidatePath(`/influencers/${profile.slug}`);
    return { success: true, data: newService };
  } catch (error) {
    console.error('Add Service Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Database collision error' };
  }
}

export async function deleteService(serviceId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    await db.delete(services).where(eq(services.id, serviceId));
    revalidatePath(`/influencer/services`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete service' };
  }
}

export async function updatePortfolio(data: { images?: string[], videos?: string[] }) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    const [profile] = await db.select({ id: influencerProfiles.id, slug: influencerProfiles.slug })
      .from(influencerProfiles)
      .where(eq(influencerProfiles.userId, session.user.id));

    if (!profile) return { success: false, error: 'Profile not found' };

    await db.update(influencerProfiles)
      .set({
        portfolioImages: data.images,
        portfolioVideos: data.videos,
      })
      .where(eq(influencerProfiles.id, profile.id));

    revalidatePath(`/influencer/media`);
    revalidatePath(`/influencers/${profile.slug}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update portfolio' };
  }
}

export async function generateAIBio(prompt: string) {
  // Simulated AI Bio Generation logic
  const versions = [
    {
      type: 'Professional',
      content: `I am a dedicated content creator specializing in ${prompt}. With a focus on high-quality production and strategic brand alignment, I help businesses reach their target audience effectively. My approach is data-driven, ensuring maximum ROI for every collaboration. Let's build something great together.`
    },
    {
      type: 'Creative',
      content: `Visual storyteller and vibe Curator. 🎨 I turn ${prompt} into digital art that resonates. I don't just post; I create experiences that capture the imagination. My community is built on authenticity and shared passion for aesthetic excellence. Join me on this journey of creative exploration.`
    },
    {
      type: 'Artistic',
      content: `Capturing the soul of ${prompt} through a poetic lens. 🎭 Every frame is a narrative, every caption a conversation. I believe in the power of artistic expression to transcend the ordinary. If you're looking for a collaboration that feels like a masterpiece, you've found your muse. ✨`
    }
  ];

  return { success: true, versions };
}

export async function getServices() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    const [profile] = await db.select({ id: influencerProfiles.id })
      .from(influencerProfiles)
      .where(eq(influencerProfiles.userId, session.user.id));

    if (!profile) return { success: false, error: 'Profile not found' };

    const data = await db.select().from(services).where(eq(services.influencerId, profile.id));
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to fetch services' };
  }
}

export async function getPortfolio() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    const [profile] = await db.select({ 
      portfolioImages: influencerProfiles.portfolioImages,
      portfolioVideos: influencerProfiles.portfolioVideos
    })
      .from(influencerProfiles)
      .where(eq(influencerProfiles.userId, session.user.id));

    if (!profile) return { success: false, error: 'Profile not found' };

    return { success: true, data: profile };
  } catch (error) {
    return { success: false, error: 'Failed' };
  }
}
