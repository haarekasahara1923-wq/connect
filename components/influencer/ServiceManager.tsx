'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { PlusCircle, Trash2, Edit2, Clock, RefreshCw, Loader2 } from 'lucide-react';
import { addService, deleteService } from '@/actions/influencer';
import { toast } from 'sonner';

interface Service {
  id: string;
  serviceType: string;
  title: string;
  description: string | null;
  price: string;
  deliveryDays: number | null;
  revisionsIncluded: number | null;
}

export function ServiceManager({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: 'instagram_reel',
    title: '',
    description: '',
    price: '',
    deliveryDays: '3',
    revisionsIncluded: '1'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await addService({
        ...formData,
        price: Number(formData.price),
        deliveryDays: Number(formData.deliveryDays),
        revisionsIncluded: Number(formData.revisionsIncluded),
        serviceType: formData.serviceType as any
      });

      if (res.success) {
        toast.success('Service added successfully!');
        window.location.reload(); // Quick way to sync for now
        setIsOpen(false);
      } else {
        toast.error(res.error || 'Failed to add service');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await deleteService(id);
      if (res.success) {
        setServices(services.filter(s => s.id !== id));
        toast.success('Service deleted');
      }
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase underline decoration-primary/20 decoration-8 underline-offset-8">Marketplace Nodes</h1>
          <p className="text-muted-foreground mt-2 font-bold italic">Define your commercial offerings for the regional ecosystem.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 px-6 font-black italic tracking-tight shadow-xl shadow-primary/20" />} >
             <PlusCircle className="w-4 h-4 mr-2" /> Add Service
          </DialogTrigger>
          <DialogContent className="max-w-xl rounded-[2.5rem] bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">New Service Capsule</DialogTitle>
              <DialogDescription className="font-medium italic">Parameters for your digital collaboration.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Service Type</label>
                  <Select onValueChange={(v) => setFormData({...formData, serviceType: v || 'instagram_reel'})} defaultValue={formData.serviceType}>
                    <SelectTrigger className="rounded-2xl border-black/10 h-12 font-bold italic"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-2xl">
                        <SelectItem value="instagram_reel">Instagram Reel</SelectItem>
                        <SelectItem value="instagram_post">Instagram Post</SelectItem>
                        <SelectItem value="instagram_story">Instagram Story</SelectItem>
                        <SelectItem value="youtube_video">YouTube Video</SelectItem>
                        <SelectItem value="youtube_short">YouTube Short</SelectItem>
                        <SelectItem value="facebook_post">Facebook Post</SelectItem>
                        <SelectItem value="shoutout_video">Shoutout Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Price (₹)</label>
                  <Input 
                    type="number" 
                    required 
                    className="rounded-2xl border-black/10 h-12 font-black italic text-lg" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Service Title</label>
                <Input 
                    placeholder="e.g. Premium Fashion Reel with Voiceover" 
                    required 
                    className="rounded-2xl border-black/10 h-12 font-bold italic" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Description</label>
                <Textarea 
                    placeholder="Describe what's included..." 
                    className="rounded-2xl border-black/10 min-h-[100px] font-medium italic" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Delivery Days</label>
                    <Input 
                        type="number" 
                        className="rounded-2xl border-black/10 h-12 font-bold italic" 
                        value={formData.deliveryDays}
                        onChange={(e) => setFormData({...formData, deliveryDays: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Revisions</label>
                    <Input 
                        type="number" 
                        className="rounded-2xl border-black/10 h-12 font-bold italic" 
                        value={formData.revisionsIncluded}
                        onChange={(e) => setFormData({...formData, revisionsIncluded: e.target.value})}
                    />
                 </div>
              </div>

              <DialogFooter>
                <Button disabled={isSubmitting} type="submit" className="w-full bg-black text-white hover:bg-primary rounded-2xl h-14 text-lg font-black italic tracking-tight shadow-xl shadow-black/20">
                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Activate Service Node'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {services.length === 0 ? (
          <Card className="col-span-full py-20 border-border/50 border-dashed rounded-[3rem] bg-muted/5 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400 mb-6 group-hover:scale-110 transition-transform">
               <PlusCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black italic opacity-40 uppercase tracking-tighter">No Active Services</h3>
          </Card>
        ) : (
          services.map(service => (
            <Card key={service.id} className="rounded-[2.5rem] border-black/5 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group">
               <CardHeader className="bg-muted/10 p-8 border-b border-black/5 flex flex-row items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full mb-3 inline-block">
                        {service.serviceType.replace('_', ' ')}
                    </span>
                    <CardTitle className="text-xl font-black italic tracking-tighter uppercase leading-none">{service.title || 'Untitled Service'}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                     <Button size="icon" variant="ghost" className="rounded-xl hover:bg-black hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></Button>
                     <Button size="icon" variant="ghost" onClick={() => handleDelete(service.id)} className="rounded-xl hover:bg-red-600 hover:text-white transition-colors text-red-600"><Trash2 className="w-4 h-4" /></Button>
                  </div>
               </CardHeader>
               <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-8">
                     <p className="text-3xl font-black italic text-primary tracking-tighter">₹{service.price}</p>
                     <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground opacity-60 italic">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{service.deliveryDays || 3}d</span>
                        <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" />{service.revisionsIncluded || 1}r</span>
                     </div>
                  </div>
                  <p className="text-sm font-medium leading-relaxed italic opacity-70 line-clamp-2">{service.description || 'No description available.'}</p>
               </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
