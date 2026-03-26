import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { verifyRazorpaySignature, calculatePricing } from '@/lib/razorpay';
import { db } from '@/lib/db';
import { bookings, payments, services, brandProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== 'brand') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      serviceId,
      influencerId,
      brief,
      deadline,
    } = await req.json();

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );
    
    // Accept in dev without strict matching if dummy, but we enforce here
    if (!isValid && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    const [service] = await db.select().from(services).where(eq(services.id, serviceId));
    const [brandProfile] = await db
      .select()
      .from(brandProfiles)
      .where(eq(brandProfiles.userId, session.user.id));

    const pricing = calculatePricing(Number(service.price));

    const [payment] = await db.insert(payments).values({
      brandId: brandProfile.id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amount: pricing.totalAmount.toString(),
      status: 'captured',
      currency: 'INR',
    }).returning();

    const [booking] = await db.insert(bookings).values({
      brandId: brandProfile.id,
      influencerId,
      serviceId,
      brief,
      deadline: new Date(deadline),
      servicePrice: pricing.servicePrice.toString(),
      platformFee: pricing.platformFee.toString(),
      totalAmount: pricing.totalAmount.toString(),
      paymentId: payment.id,
      isPaid: true,
      status: 'pending',
    }).returning();

    // Trigger Notifications & Emails here

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
