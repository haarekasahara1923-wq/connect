import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { influencerProfiles, users, services, reviews } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getOptimizedUrl } from '@/lib/cloudinary';
import { StarRating } from '@/components/shared/StarRating';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Camera, MapPin, Video, Users, Clock, RefreshCw, Star, Share2 } from 'lucide-react';
import { BookingModal } from '@/components/payment/BookingModal';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [profile] = await db.select({ name: users.name, city: influencerProfiles.city })
    .from(influencerProfiles)
    .innerJoin(users, eq(influencerProfiles.userId, users.id))
    .where(eq(influencerProfiles.slug, slug));

  if (!profile) return { title: 'Not Found' };

  return {
    title: `${profile.name} — Influencer from ${profile.city} | InfluencerConnect`,
  };
}

export const dynamic = 'force-dynamic';

// Simulated dynamic data fetching
export default async function InfluencerPublicProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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
      portfolioImages: influencerProfiles.portfolioImages,
      portfolioVideos: influencerProfiles.portfolioVideos,
    })
    .from(influencerProfiles)
    .innerJoin(users, eq(influencerProfiles.userId, users.id))
    .where(eq(influencerProfiles.slug, slug));

  if (!data) notFound();

  // Fetch Services
  const offeredServices = await db.select().from(services).where(and(eq(services.influencerId, data.id), eq(services.isActive, true)));

  const metrics = (data.socialMetrics as any) || {};

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
  ].filter(p => !!p.handle || (metrics[p.id] && Object.values(metrics[p.id] as object).some(v => Number(v) > 0)));

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Top Cover Banner */}
      <div className="w-full h-64 md:h-96 relative bg-gray-200">
        <Image 
          src={data.cover || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop'} 
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
                  src={data.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=F3F4F6&color=4B5563`} 
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

            {/* Social Ecosystem Footprint Grid */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {platforms.map((plat) => {
                    const platformMetrics = metrics[plat.id] || { followers: 0, views: 0, likes: 0, comments: 0 };
                    const iconSlug = plat.id === 'x' ? 'x' : plat.id;
                    const iconColor = plat.id === 'instagram' ? 'E4405F' : 
                                     plat.id === 'youtube' ? 'FF0000' : 
                                     plat.id === 'facebook' ? '1877F2' : 
                                     '000000';

                    return (
                        <div key={plat.id} className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                             {/* Background Accent */}
                             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
                             
                             <div className="flex items-center justify-between mb-8 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform bg-white border border-black/5 overflow-hidden p-3 pt-4">
                                        <img
                                            src={`https://unpkg.com/simple-icons@v11/icons/${iconSlug}.svg`}
                                            alt={plat.label}
                                            className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity"
                                            style={{ filter: `invert(1) sepia(1) saturate(5) hue-rotate(${plat.id === 'instagram' ? '300deg' : plat.id === 'youtube' ? '0deg' : '200deg'})` }} // Very rough color filter as SVGs are usually black on unpkg
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black italic tracking-tighter uppercase">{plat.label}</h4>
                                        <a href={plat.handle?.startsWith('http') ? plat.handle : `https://${plat.id}.com/${plat.handle}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-primary hover:underline italic flex items-center gap-1">
                                            Visit Node <span className="text-xs">&rarr;</span>
                                        </a>
                                    </div>
                                </div>
                             </div>

                             <div className="grid grid-cols-2 gap-6 relative z-10">
                                {[
                                    { label: 'Followers', value: platformMetrics.followers, icon: <Users className="w-3 h-3" /> },
                                    { label: 'Avg Views', value: platformMetrics.views, icon: <Video className="w-3 h-3" /> },
                                    { label: 'Avg Likes', value: platformMetrics.likes, icon: <Star className="w-3 h-3" /> },
                                    { label: 'Comments', value: platformMetrics.comments, icon: <RefreshCw className="w-3 h-3" /> }
                                ].map((m) => (
                                    <div key={m.label} className="bg-gray-50/50 p-4 rounded-2xl border border-black/5">
                                        <p className="text-[9px] font-black opacity-40 uppercase tracking-widest flex items-center gap-1.5 mb-1.5 italic">
                                            {m.icon} {m.label}
                                        </p>
                                        <p className="text-2xl font-black italic text-gray-900 tracking-tight">
                                            {Number(m.value) >= 1000 ? (Number(m.value) / 1000).toFixed(1) + 'K' : m.value}
                                        </p>
                                    </div>
                                ))}
                             </div>
                        </div>
                    );
                })}
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

        {/* Media Portfolio Section */}
        {data.portfolioImages && (data.portfolioImages as string[]).length > 0 && (
          <div className="mt-10 px-2 lg:px-0">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 italic tracking-tighter uppercase underline decoration-primary/20 decoration-4 underline-offset-8">Visual Narrative nodes</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {(data.portfolioImages as string[]).map((img, idx) => (
                 <div key={idx} className="relative aspect-square rounded-[2rem] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all duration-500 group">
                    <Image src={img} alt={`Work ${idx}`} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                 </div>
               ))}
            </div>
          </div>
        )}

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
