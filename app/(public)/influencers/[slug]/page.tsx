import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { influencerProfiles, users, services, reviews } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getOptimizedUrl } from '@/lib/cloudinary';
import { StarRating } from '@/components/shared/StarRating';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Camera, MapPin, Video, Users, Clock, RefreshCw } from 'lucide-react';
import { BookingModal } from '@/components/payment/BookingModal';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const [profile] = await db.select({ name: users.name, city: influencerProfiles.city })
    .from(influencerProfiles)
    .innerJoin(users, eq(influencerProfiles.userId, users.id))
    .where(eq(influencerProfiles.slug, params.slug));

  if (!profile) return { title: 'Not Found' };

  return {
    title: `${profile.name} — Influencer from ${profile.city} | InfluencerConnect`,
  };
}

export const dynamic = 'force-dynamic';

// Simulated dynamic data fetching
export default async function InfluencerPublicProfile({ params }: { params: { slug: string } }) {
  const [data] = await db
    .select({
      id: influencerProfiles.id,
      name: users.name,
      photo: users.profileImage,
      cover: influencerProfiles.coverImage,
      city: influencerProfiles.city,
      state: influencerProfiles.state,
      bio: influencerProfiles.bio,
      categories: influencerProfiles.categories,
      languages: influencerProfiles.languages,
      igHandle: influencerProfiles.instagramHandle,
      ytHandle: influencerProfiles.youtubeHandle,
      fbHandle: influencerProfiles.facebookHandle,
      tgHandle: influencerProfiles.telegramHandle,
      waHandle: influencerProfiles.whatsappChannelHandle,
      liHandle: influencerProfiles.linkedinHandle,
      scHandle: influencerProfiles.snapchatHandle,
      xHandle: influencerProfiles.xHandle,
      trHandle: influencerProfiles.threadsHandle,
      socialMetrics: influencerProfiles.socialMetrics,
      rating: influencerProfiles.averageRating,
      isVerified: influencerProfiles.isVerifiedBadge,
      totalReach: influencerProfiles.totalReach,
    })
    .from(influencerProfiles)
    .innerJoin(users, eq(influencerProfiles.userId, users.id))
    .where(eq(influencerProfiles.slug, params.slug));

  if (!data) notFound();

  // Fetch Services
  const offeredServices = await db.select().from(services).where(and(eq(services.influencerId, data.id), eq(services.isActive, true)));

  const platforms = [
    { id: 'instagram', label: 'Instagram', icon: '📸', handle: data.igHandle },
    { id: 'youtube', label: 'YouTube', icon: '📺', handle: data.ytHandle },
    { id: 'facebook', label: 'Facebook', icon: '👥', handle: data.fbHandle },
    { id: 'telegram', label: 'Telegram', icon: '✈️', handle: data.tgHandle },
    { id: 'whatsapp', label: 'WhatsApp', icon: '💬', handle: data.waHandle },
    { id: 'linkedin', label: 'LinkedIn', icon: '💼', handle: data.liHandle },
    { id: 'snapchat', label: 'Snapchat', icon: '👻', handle: data.scHandle },
    { id: 'x', label: 'X (Twitter)', icon: '𝕏', handle: data.xHandle },
    { id: 'threads', label: 'Threads', icon: '🧵', handle: data.trHandle },
  ].filter(p => !!p.handle);

  const metrics = (data.socialMetrics as any) || {};

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Top Cover Banner */}
      <div className="w-full h-64 md:h-96 relative bg-gray-200">
        <Image 
          src={data.cover?.includes('res.cloudinary') ? getOptimizedUrl(data.cover, 1200, 600) : (data.cover || '/mesh.svg')} 
          alt="Cover" 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 max-w-5xl">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 backdrop-blur-3xl">
          <div className="p-8 md:p-12 lg:p-16">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center">
              {/* Profile Photo over Cover */}
              <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-[3rem] border-8 border-white overflow-hidden shadow-2xl bg-white shrink-0 -mt-24 md:-mt-32 transform rotate-3 group hover:rotate-0 transition-all duration-700">
                <Image 
                  src={data.photo?.includes('res.cloudinary') ? getOptimizedUrl(data.photo, 400, 400) : (data.photo || '/avatar-placeholder.png')} 
                  alt={data.name || ''} 
                  fill 
                  className="object-cover"
                />
              </div>

              {/* Header Info */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
                  <div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 flex items-center gap-3 italic tracking-tighter">
                       {data.name}
                       {data.isVerified && <CheckCircle2 className="text-blue-500 w-10 h-10" />}
                    </h1>
                    <div className="flex items-center text-muted-foreground mt-2 font-bold italic tracking-tight">
                      <MapPin className="w-5 h-5 mr-1.5 text-red-500" />
                      {data.city}, {data.state}
                    </div>
                  </div>
                  <Link href="#services">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-2xl text-xl font-black italic px-10 h-16 shadow-2xl shadow-primary/20">
                      Explore Services
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  {data.categories && (data.categories as string[]).map(cat => (
                    <Badge key={cat} variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-4 py-1 font-bold text-xs uppercase tracking-widest">{cat}</Badge>
                  ))}
                  {data.languages && (data.languages as string[]).map(lang => (
                    <Badge key={lang} variant="outline" className="text-muted-foreground border-border px-4 py-1 font-bold text-xs uppercase tracking-widest">{lang}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Global Reach Highlight */}
            <div className="mt-16 p-10 bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-[2.5rem] border border-primary/10 flex flex-col items-center justify-center text-center">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary/60 mb-2">Authenticated Global Reach</h3>
                <span className="text-6xl md:text-8xl font-black italic tracking-tighter text-primary">{((data.totalReach || 0) / 1000).toFixed(1)}K+</span>
                <p className="text-muted-foreground font-bold italic mt-2 italic px-2">Aggregated active nodes across the influencer ecosystem.</p>
            </div>

            {/* Social Ecosystem Footprint Grid */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {platforms.map((plat) => (
                    <div key={plat.id} className="bg-white p-6 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                         <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{plat.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 italic">{plat.label}</span>
                         </div>
                         <div className="grid grid-cols-2 gap-y-4">
                            <div>
                                <p className="text-[9px] font-black opacity-50 uppercase tracking-tighter">Followers</p>
                                <p className="text-xl font-black italic text-gray-900 tracking-tight">
                                    {(metrics[plat.id]?.followers / 1000).toFixed(1) || '0.0'}K
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black opacity-50 uppercase tracking-tighter">Views</p>
                                <p className="text-xl font-black italic text-gray-900 tracking-tight">
                                    {(metrics[plat.id]?.views / 1000).toFixed(1) || '0.0'}K
                                </p>
                            </div>
                         </div>
                    </div>
                ))}
            </div>

            {/* Bio Section */}
            {data.bio && (
              <div className="mt-16 p-10 bg-white border border-border/50 rounded-[2.5rem]">
                <h3 className="text-2xl font-black text-gray-900 mb-4 italic tracking-tighter uppercase underline decoration-primary/20 decoration-4 underline-offset-8">Synergy Pitch</h3>
                <p className="text-muted-foreground font-medium leading-relaxed text-xl italic">{data.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-10">
          <h2 id="services" className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 px-2 scroll-mt-20">Services & Pricing</h2>
          {offeredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offeredServices.map(service => (
                <div key={service.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="text-xl font-bold text-gray-900">{service.serviceType.replace('_', ' ').toUpperCase()}</h3>
                     <span className="text-2xl font-extrabold text-red-600">₹{service.price}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{service.title}</p>
                  
                  <div className="flex gap-4 mb-6 text-sm font-medium text-gray-500">
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {service.deliveryDays} Days</span>
                    <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-1.5" /> {service.revisionsIncluded} Revisions</span>
                  </div>
                  <BookingModal 
                    service={{
                      ...service,
                      price: service.price.toString(), // Ensure string
                      deliveryDays: service.deliveryDays || 3,
                      revisionsIncluded: service.revisionsIncluded || 1
                    }} 
                    influencerId={data.id} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-300 text-gray-500">
               <span className="block text-4xl mb-3 border-none">📋</span>
               <h3 className="text-lg font-bold text-gray-900">No Services Listed Yet</h3>
               <p className="mt-1">This creator hasn't published their public packages.</p>
            </div>
          )}
        </div>

        {/* Reviews Section Placeholder */}
        <div className="mt-10 mb-10">
           <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 px-2">Reviews</h2>
           <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-300">
               <div className="flex justify-center mb-3"><StarRating rating={Number(data.rating)} size="lg" /></div>
               <h3 className="text-xl font-bold text-gray-900">{Number(data.rating)} / 5.0</h3>
               <p className="text-gray-500 mt-2">Waiting for first feedback on the platform.</p>
           </div>
        </div>

      </div>
    </div>
  );
}
