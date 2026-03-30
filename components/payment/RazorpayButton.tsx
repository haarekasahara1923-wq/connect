'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface Props {
  serviceId: string;
  influencerId: string;
  brief: string;
  deadline: string;
  serviceName: string;
}

declare global {
  interface Window { Razorpay: any; }
}

export function RazorpayButton({ serviceId, influencerId, brief, deadline, serviceName }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create order via our API
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, influencerId, brief, deadline }),
      });
      
      const orderData = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          toast.error(orderData.error || 'Please log in to book services');
          router.push('/login');
          setLoading(false);
          return;
        }
        if (res.status === 403) {
          toast.error(orderData.error || 'Only Brands can book services');
          setLoading(false);
          return;
        }
        throw new Error(orderData.error || 'Failed to create order');
      }
      // 2. Load Razorpay script dynamically
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Check your internet.');
      }

      // 3. Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: 'INR',
        name: 'InfluencerConnect',
        description: `Booking: ${serviceName}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          // 4. Verify payment via our API
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              serviceId, influencerId, brief, deadline,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success('Booking confirmed! 🎉');
            router.push(`/brand/bookings/${verifyData.bookingId}`);
          } else {
            toast.error('Payment verification failed');
          }
        },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#FF6B2B' },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={loading} 
      className="w-full bg-orange-500 hover:bg-orange-600 font-bold h-12 rounded-xl text-white shadow-lg shadow-orange-200"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : 'Pay & Book Now'}
    </Button>
  );
}
