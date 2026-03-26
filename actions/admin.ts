'use server';

import { db } from '@/lib/db';
import { influencerProfiles, users, bookings } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq, sql } from 'drizzle-orm';
import { deleteCache } from '@/lib/redis';
import { revalidatePath } from 'next/cache';

export async function approveInfluencer(influencerProfileId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const [updated] = await db.update(influencerProfiles)
      .set({
        verificationStatus: 'approved',
        isVerifiedBadge: true,
      })
      .where(eq(influencerProfiles.id, influencerProfileId))
      .returning();

    // Invalidate Redis
    await deleteCache(`influencer:profile:${updated.slug}`);
    await deleteCache('influencers:featured');
    
    revalidatePath('/admin/influencers');
    revalidatePath(`/influencers/${updated.slug}`);
    
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: 'Failed to approve influencer' };
  }
}

export async function toggleFeatured(influencerProfileId: string, isFeatured: boolean) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const [updated] = await db.update(influencerProfiles)
      .set({ isFeatured })
      .where(eq(influencerProfiles.id, influencerProfileId))
      .returning();

    await deleteCache('influencers:featured');
    revalidatePath('/admin/influencers');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to toggle featured status' };
  }
}

export async function rejectInfluencer(influencerProfileId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const [updated] = await db.update(influencerProfiles)
      .set({
        verificationStatus: 'rejected',
        isVerifiedBadge: false,
      })
      .where(eq(influencerProfiles.id, influencerProfileId))
      .returning();

    await deleteCache(`influencer:profile:${updated.slug}`);
    revalidatePath('/admin/influencers');
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed' };
  }
}
