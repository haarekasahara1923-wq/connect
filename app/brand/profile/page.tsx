'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Globe, Building2, Landmark, CheckCircle, ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { getMyBrandProfile, updateBrandProfile } from '@/actions/brand';
import { INDIAN_STATES, TIER2_CITIES } from '@/types';
import { ImageUpload } from '@/components/shared/ImageUpload';

const INDUSTRIES = [
  'Fashion & Apparel',
  'Food & Beverage',
  'Tech & Software',
  'Beauty & Personal Care',
  'Health & Wellness',
  'Travel & Tourism',
  'Education',
  'Gaming & Esports',
  'Business & Finance',
  'Real Estate',
  'Entertainment',
  'Sports & Fitness',
  'Other',
];

const brandProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  industry: z.string().min(1, 'Industry is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  gstNumber: z.string().optional().or(z.literal('')),
  logoUrl: z.string().optional(),
});

export default function BrandProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof brandProfileSchema>>({
    resolver: zodResolver(brandProfileSchema),
    defaultValues: {
      companyName: '',
      website: '',
      industry: '',
      city: '',
      state: '',
      gstNumber: '',
      logoUrl: '',
    },
  });

  useEffect(() => {
    async function loadData() {
      const res = await getMyBrandProfile();
      if (res.success && res.data) {
        const d = res.data;
        form.reset({
          companyName: d.companyName || '',
          website: d.website || '',
          industry: d.industry || '',
          city: d.city || '',
          state: d.state || '',
          gstNumber: d.gstNumber || '',
          logoUrl: d.logoUrl || '',
        });
      }
      setIsLoading(false);
    }
    loadData();
  }, [form]);

  async function onSubmit(values: z.infer<typeof brandProfileSchema>) {
    setIsSaving(true);
    try {
      const res = await updateBrandProfile(values);
      if (res.success) {
        toast.success('Business profile updated perfectly!');
      } else {
        toast.error(res.error || 'Update failed');
      }
    } catch (e: any) {
      toast.error(e.message || 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Retrieving business credentials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Header section with high premium italic branding */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-10">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter italic uppercase underline decoration-primary/20 decoration-8 underline-offset-8">
            Business Profile Setup
          </h1>
          <p className="text-lg text-muted-foreground mt-4 font-medium italic">
            Synchronize your regional brand presence and commercial verification.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => form.reset()}
            className="rounded-2xl px-8 h-14 font-black text-md border-2 border-primary/20 hover:bg-primary/5 active:scale-95 transition-all text-foreground"
          >
            Discard
          </Button>
          <Button
            disabled={isSaving}
            onClick={form.handleSubmit(onSubmit)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-8 h-14 text-lg font-black italic tracking-tight shadow-xl shadow-primary/20 active:scale-95 transition-all"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Synchronizing...
              </>
            ) : (
              'Synchronize Profile'
            )}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo upload block */}
            <div className="md:col-span-1">
              <Card className="border-primary/20 bg-primary/5 shadow-sm rounded-[2.5rem] overflow-hidden sticky top-8">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl flex items-center gap-2 text-primary font-black uppercase tracking-tight italic">
                    Brand Logo
                  </CardTitle>
                  <CardDescription className="text-xs font-bold text-muted-foreground">
                    Upload your official company emblem/avatar.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUpload
                            folder="brands"
                            defaultImage={field.value}
                            onUpload={(url) => field.onChange(url)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-6 p-4 bg-white/70 border border-primary/10 rounded-xl flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] font-bold text-muted-foreground leading-relaxed italic">
                      Verify your branding is transparent and fits the standard square proportion for high clarity.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Core credentials card */}
            <div className="md:col-span-2 space-y-8">
              <Card className="rounded-[2.5rem] border-border/50 shadow-xl overflow-hidden">
                <CardHeader className="p-8 lg:p-10 pb-4 border-b border-border/50 bg-muted/20">
                  <CardTitle className="text-2xl font-black italic tracking-tighter uppercase text-foreground flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-primary" /> Company Identity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 lg:p-10 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black text-xs uppercase tracking-widest opacity-70">
                            Registered Company Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Swad Restaurant"
                              className="rounded-xl h-12 font-bold border-border/50 bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black text-xs uppercase tracking-widest opacity-70">
                            Industry Classification
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl h-12 font-bold border-border/50 bg-background">
                                <SelectValue placeholder="Select Industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl">
                              {INDUSTRIES.map((ind) => (
                                <SelectItem key={ind} value={ind}>
                                  {ind}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-xs uppercase tracking-widest opacity-70 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-muted-foreground" /> Website URL
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com"
                            className="rounded-xl h-12 font-bold border-border/50 bg-background"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-[10px] font-semibold italic text-muted-foreground">
                          Optional. Add your link for creators to research your business catalog.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Taxation & Location Card */}
              <Card className="rounded-[2.5rem] border-border/50 shadow-xl overflow-hidden">
                <CardHeader className="p-8 lg:p-10 pb-4 border-b border-border/50 bg-muted/20">
                  <CardTitle className="text-2xl font-black italic tracking-tighter uppercase text-foreground flex items-center gap-2">
                    <Landmark className="w-6 h-6 text-primary" /> Region & Commerce
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 lg:p-10 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black text-xs uppercase tracking-widest opacity-70">
                            Geographic State
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl h-12 font-bold border-border/50 bg-background">
                                <SelectValue placeholder="Select State" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl">
                              {INDIAN_STATES.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
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
                          <FormLabel className="font-black text-xs uppercase tracking-widest opacity-70">
                            Hyperlocal City
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl h-12 font-bold border-border/50 bg-background">
                                <SelectValue placeholder="Select City" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl">
                              {TIER2_CITIES.map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="gstNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-xs uppercase tracking-widest opacity-70 flex items-center gap-1.5">
                          GSTIN / Business Tax Identification
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 22AAAAA0000A1Z5"
                            className="rounded-xl h-12 font-bold border-border/50 bg-background uppercase"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-[10px] font-semibold italic text-muted-foreground">
                          Optional. Used for legal B2B invoicing, escrow agreements, and billing payouts.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Status Box */}
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[2rem] flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-emerald-800 text-sm">Account Status Verified</h3>
                  <p className="text-emerald-700 text-xs mt-1 leading-relaxed italic">
                    Your brand account status is fully synchronized and ready for campaign creation, wallet deposits,
                    and hiring creators.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
