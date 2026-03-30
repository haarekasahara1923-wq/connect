'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RazorpayButton } from './RazorpayButton';
import { calculatePricing } from '@/lib/razorpay';
import { Calendar, Info, ShieldCheck } from 'lucide-react';

interface BookingModalProps {
  service: {
    id: string;
    title: string;
    price: string;
    serviceType: string;
    deliveryDays: number;
    revisionsIncluded: number;
  };
  influencerId: string;
}

export function BookingModal({ service, influencerId }: BookingModalProps) {
  const [brief, setBrief] = useState('');
  const [deadline, setDeadline] = useState('');
  const [agreed, setAgreed] = useState(false);
  
  const pricing = calculatePricing(Number(service.price));
  
  const isReady = brief.length >= 20 && deadline !== '' && agreed;

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full text-lg px-8 shadow-xl shadow-red-600/20">
            Book This Service
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px] border-none shadow-2xl p-0 overflow-y-auto max-h-[90vh] overflow-x-hidden bg-white">
        <DialogHeader className="bg-gradient-to-br from-red-50 to-orange-50 p-6 md:p-8 shrink-0">
          <DialogTitle className="text-2xl font-black text-gray-900 flex items-center gap-2">
            Confirm Booking
          </DialogTitle>
          <div className="mt-4 p-4 bg-white rounded-2xl border border-red-100 shadow-sm">
             <div className="flex justify-between items-start">
               <div>
                  <p className="text-xs font-bold text-red-600 uppercase tracking-widest">{service.serviceType.replace('_', ' ')}</p>
                  <h4 className="font-extrabold text-lg text-gray-900 mt-0.5">{service.title}</h4>
               </div>
               <span className="text-2xl font-black text-red-600">₹{service.price}</span>
             </div>
             <div className="flex gap-4 mt-3 text-xs font-semibold text-gray-500 border-t pt-3">
               <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {service.deliveryDays} Days Delivery</span>
               <span className="flex items-center"><Info className="w-3.5 h-3.5 mr-1" /> {service.revisionsIncluded} Revisions</span>
             </div>
          </div>
        </DialogHeader>

        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <Label className="font-bold text-gray-900">Collaboration Brief (Required)</Label>
            <Textarea 
              className="resize-none h-24 border-gray-200 focus:ring-red-100" 
              placeholder="Explain exactly what you want the influencer to do..." 
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
            />
            <p className="text-[10px] text-gray-400 text-right">{brief.length}/20 minimum characters</p>
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-gray-900">Campaign Deadline</Label>
            <Input 
              type="date" 
              className="border-gray-200 focus:ring-red-100" 
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
             <div className="flex justify-between text-sm">
               <span className="text-gray-500">Service Price</span>
               <span className="font-bold">₹{pricing.servicePrice}</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-gray-500">Platform Fee (15%)</span>
               <span className="font-bold">₹{pricing.platformFee}</span>
             </div>
             <div className="flex justify-between text-lg font-black border-t pt-2 mt-2 text-gray-900">
               <span>Total Payable</span>
               <span className="text-red-600">₹{pricing.totalAmount}</span>
             </div>
          </div>

          <div className="flex items-start space-x-3 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
            <Checkbox id="terms" checked={agreed} onCheckedChange={(c) => setAgreed(!!c)} className="mt-1" />
            <label htmlFor="terms" className="text-xs leading-relaxed text-indigo-900 font-medium cursor-pointer">
              I agree that funds will be held in escrow and only released upon delivery or cancellation. I have read the Refund Policy.
            </label>
          </div>
        </div>

        <DialogFooter className="p-6 md:p-8 pt-0 flex flex-col gap-4 shrink-0">
           {isReady ? (
             <RazorpayButton 
                serviceId={service.id} 
                influencerId={influencerId}
                brief={brief}
                deadline={deadline}
                serviceName={service.title}
             />
           ) : (
             <Button disabled className="w-full bg-gray-200 text-gray-400 font-bold h-12 rounded-xl">
               Complete Form Above
             </Button>
           )}
           <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
             <ShieldCheck className="w-4 h-4 text-green-500" />
             100% Secure Escrow Protection
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
