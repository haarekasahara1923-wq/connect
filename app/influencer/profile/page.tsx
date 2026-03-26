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
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  bio: z.string().max(500, 'Max 500 characters').optional().or(z.literal('')),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  categories: z.string().min(1, 'At least one category is required'), // Comma separated for MVP simple approach
  languages: z.string(), // Comma separated
  instagramHandle: z.string().optional().or(z.literal('')),
  instagramFollowers: z.coerce.number().min(0).optional(),
  youtubeHandle: z.string().optional().or(z.literal('')),
  youtubeSubscribers: z.coerce.number().min(0).optional(),
  facebookHandle: z.string().optional().or(z.literal('')),
  facebookFollowers: z.coerce.number().min(0).optional(),
  coverImage: z.string().optional(),
  profilePhoto: z.string().optional(),
});

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      bio: '', city: '', state: '', categories: '', languages: '',
      instagramHandle: '', instagramFollowers: 0,
      youtubeHandle: '', youtubeSubscribers: 0,
      facebookHandle: '', facebookFollowers: 0,
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
          categories: Array.isArray(data.categories) ? data.categories.join(', ') : '',
          languages: Array.isArray(data.languages) ? data.languages.join(', ') : 'Hindi, English',
          instagramHandle: data.instagramHandle || '',
          instagramFollowers: data.instagramFollowers || 0,
          youtubeHandle: data.youtubeHandle || '',
          youtubeSubscribers: data.youtubeSubscribers || 0,
          facebookHandle: data.facebookHandle || '',
          facebookFollowers: data.facebookFollowers || 0,
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

      const res = await updateProfile(payload);
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
    return <div className="h-64 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your public storefront and portfolio limits.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <Card>
            <CardHeader><CardTitle>Profile Imagery</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="profilePhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Photo (Headshot)</FormLabel>
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
                      <FormLabel>Cover Banner (Landscape)</FormLabel>
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

          <Card>
            <CardHeader><CardTitle>Basic Details</CardTitle></CardHeader>
            <CardContent className="space-y-6">
               <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Bio (Max 500 characters)</FormLabel>
                      <FormControl><Textarea className="resize-none" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Categories (comma separated)</FormLabel>
                      <FormDescription>Example: Fashion, Food, Tech, Comedy</FormDescription>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger></FormControl>
                          <SelectContent>{INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
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
                        <FormLabel>City</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger></FormControl>
                          <SelectContent>{TIER2_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Social Footprint</CardTitle></CardHeader>
            <CardContent className="space-y-6">
               <div className="grid grid-cols-2 gap-4 border-b pb-4">
                  <FormField control={form.control} name="instagramHandle" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram Handle</FormLabel>
                        <FormControl><Input placeholder="@username" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="instagramFollowers" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram Followers</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
               </div>
                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                  <FormField control={form.control} name="youtubeHandle" render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube Channel Link</FormLabel>
                        <FormControl><Input placeholder="youtube.com/c/..." {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="youtubeSubscribers" render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube Subscribers</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
               </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 border-t pt-4">
             <Button variant="outline" type="button" onClick={() => form.reset()}>Discard Changes</Button>
             <Button disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 w-32">
                {isSaving ? <Loader2 className="animate-spin w-4 h-4 ml-2" /> : 'Save Profile'}
             </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
