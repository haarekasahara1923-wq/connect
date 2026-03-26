'use server';

import { db } from '@/lib/db';
import { campaigns, brandProfiles } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const campaignSchema = z.object({
  title: z.string().min(5, 'Title is too short'),
  description: z.string().min(20, 'Provide more details'),
  budget: z.coerce.number().min(5000, 'Minimum budget is ₹5,000'),
  targetCategories: z.array(z.string()).min(1, 'Select at least one category'),
  targetCities: z.array(z.string()).min(1, 'Select at least one city'),
  targetMinFollowers: z.coerce.number().min(0).optional(),
  targetMaxFollowers: z.coerce.number().optional(),
  requiredDeliverables: z.array(z.string()).min(1, 'Select required deliverables'),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
});

export async function createCampaign(formData: z.infer<typeof campaignSchema>) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'brand') {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = campaignSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  try {
    const [brand] = await db.select({ id: brandProfiles.id })
      .from(brandProfiles)
      .where(eq(brandProfiles.userId, session.user.id));

    if (!brand) return { success: false, error: 'Brand profile not found' };

    const { deadline, ...rest } = parsed.data;

    const [campaign] = await db.insert(campaigns)
      .values({
        brandId: brand.id,
        ...rest,
        deadline: new Date(deadline),
        status: 'open',
        budget: rest.budget.toString(), // DB uses decimal
      })
      .returning();

    revalidatePath('/brand/campaigns');
    return { success: true, id: campaign.id };
  } catch (error) {
    console.error('Create campaign error', error);
    return { success: false, error: 'Internal server error while creating campaign' };
  }
}
