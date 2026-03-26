import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createRazorpayOrder, calculatePricing } from '@/lib/razorpay';
import { db } from '@/lib/db';
import { services } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const schema = z.object({
  serviceId: z.string().uuid(),
  influencerId: z.string().uuid(),
  brief: z.string().min(20),
  deadline: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== 'brand') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    }

    const { serviceId } = parsed.data;

    const [service] = await db.select().from(services).where(eq(services.id, serviceId));
    if (!service || !service.isActive) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const pricing = calculatePricing(Number(service.price));

    // Create Razorpay order
    const order = await createRazorpayOrder(pricing.totalAmount, `temp_${Date.now()}`);

    return NextResponse.json({
      orderId: order.id,
      amount: pricing.totalAmount,
      pricing,
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      serviceDetails: {
        title: service.title,
        type: service.serviceType,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
