'use server';

import { db } from '@/lib/db';
import { bookings, brandProfiles, influencerProfiles, payouts, walletTransactions } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { calculatePricing } from '@/lib/razorpay';

export async function acceptBooking(bookingId: string) {
  const session = await auth();
  if (!session || session.user.role !== 'influencer') return { success: false, error: 'Unauthorized' };
  
  try {
    const [infProfile] = await db.select().from(influencerProfiles).where(eq(influencerProfiles.userId, session.user.id));
    
    const [updated] = await db.update(bookings)
      .set({ 
        status: 'accepted',
        acceptedAt: new Date(),
        updatedAt: new Date()
      })
      .where(and(
        eq(bookings.id, bookingId),
        eq(bookings.influencerId, infProfile.id)
      ))
      .returning();
      
    if (!updated) return { success: false, error: 'Booking not found or not owned by you' };

    revalidatePath('/brand/bookings');
    revalidatePath('/influencer/bookings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function declineBooking(bookingId: string) {
  const session = await auth();
  if (!session || session.user.role !== 'influencer') return { success: false, error: 'Unauthorized' };
  
  try {
    const [infProfile] = await db.select().from(influencerProfiles).where(eq(influencerProfiles.userId, session.user.id));
    
    const [updated] = await db.update(bookings)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(and(
        eq(bookings.id, bookingId),
        eq(bookings.influencerId, infProfile.id),
        eq(bookings.status, 'pending')
      ))
      .returning();
      
    if (!updated) return { success: false, error: 'Cannot cancel' };

    revalidatePath('/brand/bookings');
    revalidatePath('/influencer/bookings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function submitDelivery(bookingId: string, deliveryUrl: string, note?: string) {
  const session = await auth();
  if (!session || session.user.role !== 'influencer') return { success: false, error: 'Unauthorized' };
  
  try {
    const [infProfile] = await db.select().from(influencerProfiles).where(eq(influencerProfiles.userId, session.user.id));
    
    await db.update(bookings)
      .set({ 
        status: 'delivered',
        deliveredAt: new Date(),
        deliverables: { url: deliveryUrl, note },
        updatedAt: new Date()
      })
      .where(and(
        eq(bookings.id, bookingId),
        eq(bookings.influencerId, infProfile.id)
      ));
      
    revalidatePath('/brand/bookings');
    revalidatePath('/influencer/bookings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function approveDelivery(bookingId: string) {
  const session = await auth();
  if (!session || session.user.role !== 'brand') return { success: false, error: 'Unauthorized' };
  
  try {
    const [brandProfile] = await db.select().from(brandProfiles).where(eq(brandProfiles.userId, session.user.id));
    
    const [booking] = await db.select()
      .from(bookings)
      .where(and(eq(bookings.id, bookingId), eq(bookings.brandId, brandProfile.id)));
      
    if (!booking || booking.status !== 'delivered') return { success: false, error: 'Invalid booking state' };

    const pricing = calculatePricing(Number(booking.servicePrice));

    // Transactional Update
    await db.transaction(async (tx) => {
      await tx.update(bookings)
        .set({ 
          status: 'completed', 
          completedAt: new Date(), 
          isInfluencerPaid: true,
          updatedAt: new Date()
        })
        .where(eq(bookings.id, bookingId));

      await tx.insert(payouts).values({
        influencerId: booking.influencerId,
        amount: pricing.influencerPayout.toString(),
        status: 'pending'
      });

      await tx.insert(walletTransactions).values({
        userId: (await tx.select().from(influencerProfiles).where(eq(influencerProfiles.id, booking.influencerId)).limit(1))[0].userId,
        type: 'credit',
        amount: pricing.influencerPayout.toString(),
        description: `Collaboration Payout: ${booking.id}`,
      });
    });

    revalidatePath('/brand/bookings');
    revalidatePath('/influencer/bookings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function requestRevision(bookingId: string, note: string) {
  const session = await auth();
  if (!session || session.user.role !== 'brand') return { success: false, error: 'Unauthorized' };
  
  try {
    const [brandProfile] = await db.select().from(brandProfiles).where(eq(brandProfiles.userId, session.user.id));
    
    await db.update(bookings)
      .set({ 
        status: 'revision_requested',
        revisionNote: note,
        revisionCount: sql`${bookings.revisionCount} + 1`,
        updatedAt: new Date()
      })
      .where(and(
        eq(bookings.id, bookingId),
        eq(bookings.brandId, brandProfile.id),
        eq(bookings.status, 'delivered')
      ));
      
    revalidatePath('/brand/bookings');
    revalidatePath('/influencer/bookings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
