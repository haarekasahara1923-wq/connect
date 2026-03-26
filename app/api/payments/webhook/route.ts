import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { db } from '@/lib/db';
import { payments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-razorpay-signature') || '';

  if (!verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === 'payment.failed') {
    const paymentEntity = event.payload.payment.entity;
    await db.update(payments)
      .set({ status: 'failed' })
      .where(eq(payments.razorpayOrderId, paymentEntity.order_id));
  }

  return NextResponse.json({ received: true });
}
