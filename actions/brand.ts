'use server';

import { db } from '@/lib/db';
import { brandProfiles, users } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const updateBrandProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  industry: z.string().min(1, 'Industry is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  gstNumber: z.string().optional().or(z.literal('')),
  logoUrl: z.string().optional(),
});

export async function getMyBrandProfile() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'brand') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const [profile] = await db.select()
      .from(brandProfiles)
      .where(eq(brandProfiles.userId, session.user.id));
      
    const [user] = await db.select({ photo: users.profileImage }).from(users).where(eq(users.id, session.user.id));

    return { 
      success: true, 
      data: { ...profile, logoUrl: profile?.logoUrl || user?.photo } 
    };
  } catch (error) {
    console.error('Fetch brand profile error:', error);
    return { success: false, error: 'Failed to fetch brand profile' };
  }
}

export async function updateBrandProfile(formData: {
  companyName: string;
  website?: string;
  industry: string;
  city: string;
  state: string;
  gstNumber?: string;
  logoUrl?: string;
}) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'brand') {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = updateBrandProfileSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' };
  }

  const data = parsed.data;

  try {
    const [existing] = await db.select({ id: brandProfiles.id })
      .from(brandProfiles)
      .where(eq(brandProfiles.userId, session.user.id));

    if (!existing) {
      // If profile doesn't exist, create it (should already be created during registration but safety fallback)
      const [newProfile] = await db.insert(brandProfiles).values({
        userId: session.user.id,
        companyName: data.companyName,
        website: data.website,
        industry: data.industry,
        city: data.city,
        state: data.state,
        gstNumber: data.gstNumber,
        logoUrl: data.logoUrl,
      }).returning();
      
      if (data.logoUrl) {
        await db.update(users)
          .set({ profileImage: data.logoUrl, name: data.companyName })
          .where(eq(users.id, session.user.id));
      } else {
        await db.update(users)
          .set({ name: data.companyName })
          .where(eq(users.id, session.user.id));
      }
    } else {
      await db.update(brandProfiles)
        .set({
          companyName: data.companyName,
          website: data.website,
          industry: data.industry,
          city: data.city,
          state: data.state,
          gstNumber: data.gstNumber,
          logoUrl: data.logoUrl,
        })
        .where(eq(brandProfiles.id, existing.id));

      if (data.logoUrl) {
        await db.update(users)
          .set({ profileImage: data.logoUrl, name: data.companyName })
          .where(eq(users.id, session.user.id));
      } else {
        await db.update(users)
          .set({ name: data.companyName })
          .where(eq(users.id, session.user.id));
      }
    }

    revalidatePath('/brand/dashboard');
    revalidatePath('/brand/profile');

    return { success: true };
  } catch (error) {
    console.error('Update Brand Profile Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Database sync error' };
  }
}
