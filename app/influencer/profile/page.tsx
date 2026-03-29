'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { updateProfile, getMyProfile } from '@/actions/influencer';
import { INFLUENCER_CATEGORIES, TIER2_CITIES, INDIAN_STATES } from '@/types';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { Loader2, Globe, Sparkles } from 'lucide-react';
import { AIBioGenerator } from '@/components/influencer/AIBioGenerator';

const profileSchema = z.object({
  bio: z.string().max(500, 'Max 500 characters').optional().or(z.literal('')),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  address: z.string().optional().or(z.literal('')),
  whatsappNumber: z.string().optional().or(z.literal('')),
  categories: z.string().min(1, 'At least one category is required'), 
  languages: z.string(),
  instagramHandle: z.string().optional().or(z.literal('')),
  instagramFollowers: z.coerce.number().min(0).optional(),
  youtubeHandle: z.string().optional().or(z.literal('')),
  youtubeSubscribers: z.coerce.number().min(0).optional(),
  facebookHandle: z.string().optional().or(z.literal('')),
  facebookFollowers: z.coerce.number().min(0).optional(),
  telegramHandle: z.string().optional().or(z.literal('')),
  whatsappChannelHandle: z.string().optional().or(z.literal('')),
  linkedinHandle: z.string().optional().or(z.literal('')),
  snapchatHandle: z.string().optional().or(z.literal('')),
  xHandle: z.string().optional().or(z.literal('')),
  threadsHandle: z.string().optional().or(z.literal('')),
  socialMetrics: z.record(z.string(), z.object({
    followers: z.coerce.number().default(0),
    views: z.coerce.number().default(0),
    likes: z.coerce.number().default(0),
    comments: z.coerce.number().default(0),
  })).optional(),
  coverImage: z.string().optional(),
  profilePhoto: z.string().optional(),
});

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      bio: '', city: '', state: '', address: '', whatsappNumber: '',
      categories: '', languages: '',
      instagramHandle: '', instagramFollowers: 0,
      youtubeHandle: '', youtubeSubscribers: 0,
      facebookHandle: '', facebookFollowers: 0,
      telegramHandle: '', whatsappChannelHandle: '',
      linkedinHandle: '', snapchatHandle: '',
      xHandle: '', threadsHandle: '',
      socialMetrics: {
        instagram: { followers: 0, views: 0, likes: 0, comments: 0 },
        youtube: { followers: 0, views: 0, likes: 0, comments: 0 },
        facebook: { followers: 0, views: 0, likes: 0, comments: 0 },
        telegram: { followers: 0, views: 0, likes: 0, comments: 0 },
        whatsapp: { followers: 0, views: 0, likes: 0, comments: 0 },
        linkedin: { followers: 0, views: 0, likes: 0, comments: 0 },
        snapchat: { followers: 0, views: 0, likes: 0, comments: 0 },
        x: { followers: 0, views: 0, likes: 0, comments: 0 },
        threads: { followers: 0, views: 0, likes: 0, comments: 0 },
      },
      coverImage: '', profilePhoto: ''
    },
  });

  useEffect(() => {
    async function loadData() {
      const { success, data } = await getMyProfile();
      if (success && data) {
        form.reset({
          bio: data.bio || '',
          city: data.city || '',
          state: data.state || '',
          address: data.address || '',
          whatsappNumber: data.whatsappNumber || '',
          categories: Array.isArray(data.categories) ? data.categories.join(', ') : '',
          languages: Array.isArray(data.languages) ? data.languages.join(', ') : 'Hindi, English',
          instagramHandle: data.instagramHandle || '',
          instagramFollowers: data.instagramFollowers || 0,
          youtubeHandle: data.youtubeHandle || '',
          youtubeSubscribers: data.youtubeSubscribers || 0,
          facebookHandle: data.facebookHandle || '',
          facebookFollowers: data.facebookFollowers || 0,
          telegramHandle: data.telegramHandle || '',
          whatsappChannelHandle: data.whatsappChannelHandle || '',
          linkedinHandle: data.linkedinHandle || '',
          snapchatHandle: data.snapchatHandle || '',
          xHandle: data.xHandle || '',
          threadsHandle: data.threadsHandle || '',
          socialMetrics: (data.socialMetrics as any) || {
            instagram: { followers: 0, views: 0, likes: 0, comments: 0 },
            youtube: { followers: 0, views: 0, likes: 0, comments: 0 },
            facebook: { followers: 0, views: 0, likes: 0, comments: 0 },
            telegram: { followers: 0, views: 0, likes: 0, comments: 0 },
            whatsapp: { followers: 0, views: 0, likes: 0, comments: 0 },
            linkedin: { followers: 0, views: 0, likes: 0, comments: 0 },
            snapchat: { followers: 0, views: 0, likes: 0, comments: 0 },
            x: { followers: 0, views: 0, likes: 0, comments: 0 },
            threads: { followers: 0, views: 0, likes: 0, comments: 0 },
          },
          coverImage: data.coverImage || '',
          profilePhoto: data.profilePhoto || ''
        });
      }
      setIsLoading(false);
    }
    loadData();
  }, [form]);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsSaving(true);
    try {
      const payload = {
        ...values,
        categories: values.categories.split(',').map(s => s.trim()).filter(Boolean),
        languages: values.languages.split(',').map(s => s.trim()).filter(Boolean),
      };

      const res = await updateProfile(payload as any);
      if (res.success) {
        toast.success("Profile updated perfectly!");
      } else {
        toast.error(res.error || "Update failed");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Loading your profile data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-12">
        <div>
          <h1 className="text-5xl font-black tracking-tighter italic uppercase underline decoration-primary/20 decoration-8 underline-offset-8">Dashboard Node</h1>
          <p className="text-xl text-muted-foreground mt-4 font-medium italic">Synchronize your regional identity and global metrics.</p>
        </div>
        <div className="flex gap-4">
            <Button variant="outline" type="button" onClick={() => form.reset()} className="rounded-2xl px-12 h-14 font-black text-lg border-2 border-primary/20 hover:bg-primary/5 active:scale-95 transition-all">Discard</Button>
            <Button disabled={isSaving} onClick={form.handleSubmit(onSubmit)} className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-12 h-14 text-xl font-black italic tracking-tight shadow-2xl shadow-primary/20 active:scale-95 transition-all">
                {isSaving ? <Loader2 className="animate-spin w-6 h-6 mr-2" /> : 'Synchronize Profile'}
            </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-16">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-primary/20 bg-primary/5 shadow-sm rounded-[3rem] overflow-hidden">
              <CardHeader className="p-10 pb-4"><CardTitle className="text-2xl flex items-center gap-2 text-primary font-black uppercase tracking-tight italic">Profile Imagery</CardTitle></CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="grid grid-cols-1 gap-12">
                  <FormField
                    control={form.control}
                    name="profilePhoto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-xs uppercase tracking-widest opacity-70">Profile Photo (Headshot)</FormLabel>
                        <FormControl>
                          <ImageUpload folder="profiles" defaultImage={field.value} onUpload={(url) => field.onChange(url)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-xs uppercase tracking-widest opacity-70">Cover Banner (Landscape)</FormLabel>
                        <FormControl>
                          <ImageUpload folder="covers" defaultImage={field.value} onUpload={(url) => field.onChange(url)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 bg-secondary/5 shadow-sm rounded-[3rem] overflow-hidden">
              <CardHeader className="p-10 pb-4"><CardTitle className="text-2xl flex items-center gap-2 text-secondary font-black uppercase tracking-tight italic">Private Credentials</CardTitle></CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/20">
                    <p className="text-sm font-bold text-secondary leading-relaxed italic">Encryption active. These details are strictly for admin verification and post-escrow commerce. They will NEVER appear on your public storefront.</p>
                </div>
                <FormField
                   control={form.control}
                   name="whatsappNumber"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel className="font-black text-xs uppercase tracking-widest opacity-70">Direct WhatsApp Node</FormLabel>
                       <FormControl><Input placeholder="+91 91..." className="rounded-2xl h-14 font-bold border-secondary/20 bg-white" {...field} /></FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={form.control}
                   name="address"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel className="font-black text-xs uppercase tracking-widest opacity-70">Physical Logistics Hub (Address)</FormLabel>
                       <FormControl><Textarea className="rounded-2xl min-h-[160px] resize-none font-bold border-secondary/20 bg-white" placeholder="H.No, Street, Landmark..." {...field} /></FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-[3rem] border-border/50 shadow-2xl overflow-hidden backdrop-blur-3xl">
            <CardHeader className="p-12 pb-6 border-b border-border/50 bg-muted/20"><CardTitle className="text-3xl font-black italic tracking-tighter uppercase underline decoration-primary/20 decoration-8 underline-offset-8">Regional Identity</CardTitle></CardHeader>
            <CardContent className="p-12 space-y-12">
               <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                    <div className="flex items-center justify-between mb-4">
                      <FormLabel className="font-black text-xs uppercase tracking-widest opacity-70">Brand Synergy Pitch (Bio)</FormLabel>
                      <AIBioGenerator onSelect={(bio) => field.onChange(bio)} />
                    </div>
                      <FormControl><Textarea className="resize-none rounded-3xl min-h-[140px] border-border text-xl font-medium p-8 leading-relaxed" placeholder="I help regional brands dominate..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <FormField
                      control={form.control}
                      name="categories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black text-xs uppercase tracking-widest opacity-70">Content Niche</FormLabel>
                          <FormDescription className="text-[10px] font-bold italic">Example: Fashion, Food, Tech, Comedy</FormDescription>
                          <FormControl><Input className="rounded-2xl h-14 font-black border-border/50" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="languages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black text-xs uppercase tracking-widest opacity-70">Linguistic Reach</FormLabel>
                          <FormDescription className="text-[10px] font-bold italic">Example: Hindi, English, Punjabi</FormDescription>
                          <FormControl><Input className="rounded-2xl h-14 font-black border-border/50" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>

               <div className="grid grid-cols-2 gap-12">
                 <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-xs uppercase tracking-widest opacity-70">Geographic State</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="rounded-2xl h-14 font-black border-border/50"><SelectValue placeholder="Select state" /></SelectTrigger></FormControl>
                          <SelectContent className="rounded-2xl">{INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-xs uppercase tracking-widest opacity-70">Hyperlocal City</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="rounded-2xl h-14 font-black border-border/50"><SelectValue placeholder="Select city" /></SelectTrigger></FormControl>
                          <SelectContent className="rounded-2xl">{TIER2_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               </div>
            </CardContent>
          </Card>

          <div className="space-y-16">
             <div className="flex items-center gap-8 border-b-4 border-primary/20 pb-8">
                 <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary shadow-inner">
                    <Globe className="w-12 h-12" />
                 </div>
                 <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Global Network Footprint</h2>
                    <p className="text-xl text-muted-foreground font-bold mt-2 italic">Detailed performance metrics across all major nodes.</p>
                 </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                {[
                    { id: 'instagram', label: 'Instagram', color: 'border-pink-500/20 bg-pink-500/5', icon: '📸', handleField: 'instagramHandle' },
                    { id: 'youtube', label: 'YouTube', color: 'border-red-500/20 bg-red-500/5', icon: '📺', handleField: 'youtubeHandle' },
                    { id: 'facebook', label: 'Facebook', color: 'border-blue-600/20 bg-blue-600/5', icon: '👥', handleField: 'facebookHandle' },
                    { id: 'telegram', label: 'Telegram', color: 'border-cyan-400/20 bg-cyan-400/5', icon: '✈️', handleField: 'telegramHandle' },
                    { id: 'whatsapp', label: 'WhatsApp', color: 'border-emerald-500/20 bg-emerald-500/5', icon: '💬', handleField: 'whatsappChannelHandle' },
                    { id: 'linkedin', label: 'LinkedIn', color: 'border-blue-700/20 bg-blue-700/5', icon: '💼', handleField: 'linkedinHandle' },
                    { id: 'snapchat', label: 'Snapchat', color: 'border-yellow-400/20 bg-yellow-400/5', icon: '👻', handleField: 'snapchatHandle' },
                    { id: 'x', label: 'X (Twitter)', color: 'border-slate-800/20 bg-slate-800/5', icon: '𝕏', handleField: 'xHandle' },
                    { id: 'threads', label: 'Threads', color: 'border-black/20 bg-black/5', icon: '🧵', handleField: 'threadsHandle' }
                ].map((plat) => (
                    <Card key={plat.id} className={`${plat.color} border shadow-2xl rounded-[3rem] overflow-hidden group hover:scale-[1.02] transition-all duration-500`}>
                        <CardHeader className="p-10 pb-8 border-b border-black/5">
                            <CardTitle className="text-3xl font-black italic mb-8 flex items-center justify-between">
                                {plat.label} <span className="text-4xl grayscale group-hover:grayscale-0 transition-all">{plat.icon}</span>
                            </CardTitle>
                            <FormField
                                control={form.control}
                                name={plat.handleField as any}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl><Input placeholder={plat.label + " Node Link"} className="rounded-2xl border-black/10 bg-white font-bold h-14" {...field} /></FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardHeader>
                        <CardContent className="p-10 pt-10 bg-white/60 backdrop-blur-3xl">
                             <div className="grid grid-cols-2 gap-10">
                                 {['followers', 'views', 'likes', 'comments'].map((metric) => (
                                      <FormField
                                        key={metric}
                                        control={form.control}
                                        name={`socialMetrics.${plat.id}.${metric}` as any}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 italic">{metric}</FormLabel>
                                                <FormControl><Input type="number" className="rounded-2xl border-black/10 bg-white h-14 font-black italic text-lg" {...field} /></FormControl>
                                            </FormItem>
                                        )}
                                      />
                                 ))}
                             </div>
                        </CardContent>
                    </Card>
                ))}
             </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
