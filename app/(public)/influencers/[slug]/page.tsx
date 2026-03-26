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
      igFollowers: influencerProfiles.instagramFollowers,
      igHandle: influencerProfiles.instagramHandle,
      ytSubscribers: influencerProfiles.youtubeSubscribers,
      ytHandle: influencerProfiles.youtubeHandle,
      fbFollowers: influencerProfiles.facebookFollowers,
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
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center">
              {/* Profile Photo over Cover */}
              <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white shrink-0 -mt-16 md:-mt-24">
                <Image 
                  src={data.photo?.includes('res.cloudinary') ? getOptimizedUrl(data.photo, 400, 400) : (data.photo || '/avatar-placeholder.png')} 
                  alt={data.name || ''} 
                  fill 
                  className="object-cover"
                />
              </div>

              {/* Header Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                  <div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 flex items-center gap-2">
                       {data.name}
                       {data.isVerified && <CheckCircle2 className="text-blue-500 w-8 h-8" />}
                    </h1>
                    <div className="flex items-center text-gray-500 mt-2 font-medium">
                      <MapPin className="w-4 h-4 mr-1" />
                      {data.city}, {data.state}
                    </div>
                  </div>
                  <Link href="#services">
                    <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white rounded-full text-lg px-8 shadow-xl shadow-red-600/20">
                      View Services
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {data.categories && (data.categories as string[]).map(cat => (
                    <Badge key={cat} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">{cat}</Badge>
                  ))}
                  {data.languages && (data.languages as string[]).map(lang => (
                    <Badge key={lang} variant="outline" className="text-gray-500">{lang}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Stats Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="flex flex-col items-center justify-center p-2 text-center border-r border-gray-200">
                  <div className="text-pink-600 mb-2"><Camera className="w-6 h-6" /></div>
                  <span className="text-2xl font-bold text-gray-900">{((data.igFollowers || 0) / 1000).toFixed(1)}K</span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1">Instagram</span>
               </div>
               <div className="flex flex-col items-center justify-center p-2 text-center md:border-r border-gray-200">
                  <div className="text-red-600 mb-2"><Video className="w-6 h-6" /></div>
                  <span className="text-2xl font-bold text-gray-900">{((data.ytSubscribers || 0) / 1000).toFixed(1)}K</span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1">YouTube</span>
               </div>
               <div className="flex flex-col items-center justify-center p-2 text-center border-r border-gray-200">
                  <div className="text-blue-600 mb-2"><Users className="w-6 h-6" /></div>
                  <span className="text-2xl font-bold text-gray-900">{((data.fbFollowers || 0) / 1000).toFixed(1)}K</span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1">Facebook</span>
               </div>
               <div className="flex flex-col items-center justify-center p-2 text-center relative overflow-hidden">
                  <span className="text-3xl font-extrabold text-indigo-600">{((data.totalReach || 0) / 1000).toFixed(1)}K+</span>
                  <span className="text-xs text-indigo-600 uppercase tracking-widest font-bold mt-1">Total Reach</span>
               </div>
            </div>

            {/* Bio Section */}
            {data.bio && (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4">About Me</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{data.bio}</p>
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
