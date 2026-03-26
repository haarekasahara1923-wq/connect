import Razorpay from 'razorpay';
import crypto from 'crypto';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export async function createRazorpayOrder(amountINR: number, bookingId: string) {
  const order = await razorpay.orders.create({
    amount: Math.round(amountINR * 100), // Convert to paise
    currency: 'INR',
    receipt: `booking_${bookingId}`,
    notes: { bookingId },
  });
  return order;
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}

export function calculatePricing(servicePrice: number) {
  const commissionRate = Number(process.env.PLATFORM_COMMISSION_BRAND || 15) / 100;
  const platformFee = Math.round(servicePrice * commissionRate);
  const totalAmount = servicePrice + platformFee;
  const influencerPayout = servicePrice - Math.round(
    servicePrice * (Number(process.env.PLATFORM_COMMISSION_INFLUENCER || 8) / 100)
  );
  return { servicePrice, platformFee, totalAmount, influencerPayout };
}
