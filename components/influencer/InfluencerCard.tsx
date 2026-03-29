import Image from 'next/image';
import Link from 'next/link';
import { Star, CheckCircle2, Camera, MapPin, Video } from 'lucide-react';

interface InfluencerCardProps {
  id: string;
  slug: string;
  name: string;
  photo: string | null;
  city: string;
  categories: string[] | null;
  followers: number;
  rating: number;
  isVerified: boolean;
  minPrice?: number;
  portfolioVideos?: string[] | null;
}

export function InfluencerCard({ inf }: { inf: InfluencerCardProps }) {
  const videoUrl = inf.portfolioVideos && inf.portfolioVideos.length > 0 ? inf.portfolioVideos[0] : null;

  return (
    <Link href={`/influencers/${inf.slug}`}>
      <div className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full transform hover:-translate-y-2">
        {/* Top Floating Badge - Price */}
        <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/50 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
           <p className="text-[10px] uppercase tracking-widest font-black opacity-60 group-hover:opacity-100">Starts at</p>
           <p className="font-black text-lg italic">₹{inf.minPrice || '500'}</p>
        </div>

        {/* Hero Image / Video Hover */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
          <Image 
            src={inf.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(inf.name)}&background=F3F4F6&color=4B5563`} 
            alt={inf.name} 
            fill 
            className="object-cover group-hover:scale-110 group-hover:opacity-0 transition-all duration-1000"
          />
          {videoUrl && (
            <video 
              src={videoUrl} 
              autoPlay 
              muted 
              loop 
              playsInline
              className="absolute inset-0 w-full h-full object-cover scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {inf.isVerified && (
            <div className="absolute top-4 left-4 bg-blue-500 text-white rounded-full p-1.5 shadow-lg z-10">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
          {videoUrl && (
            <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
               <Video className="w-3 h-3 text-red-500 fill-red-500" /> Motion Narrative Active
            </div>
          )}
        </div>
        
        {/* Content Section */}
        <div className="p-6 flex flex-col items-center text-center">
            <h3 className="font-black text-2xl text-gray-900 group-hover:text-red-600 transition-colors italic tracking-tighter uppercase leading-none mb-2">
                {inf.name}
            </h3>
            
            <div className="flex items-center gap-3 mb-4">
               <div className="flex items-center text-xs font-bold text-gray-500 italic">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-red-500" />
                  {inf.city}
               </div>
               <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
               <div className="flex items-center bg-yellow-400/10 px-2 py-0.5 rounded-full text-[10px] font-black text-yellow-600 italic">
                  <Star className="w-3 h-3 mr-1 fill-yellow-600" />
                  {Number(inf.rating) > 0 ? Number(inf.rating).toFixed(1) : 'NEW'}
               </div>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                {(inf.categories || []).slice(0, 3).map((cat) => (
                    <span key={cat} className="text-[9px] font-black uppercase tracking-widest bg-gray-50 text-gray-400 border border-gray-100 px-2.5 py-1 rounded-full group-hover:border-red-100 group-hover:text-red-500 transition-colors">
                        {cat}
                    </span>
                ))}
            </div>

            <div className="w-full pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                <div className="text-left">
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-tighter italic">Ecosystem Reach</p>
                    <p className="text-xl font-black italic text-gray-900 group-hover:text-red-600 transition-colors">
                        {((inf.followers || 0) / 1000).toFixed(1)}K+
                    </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500 shadow-lg shadow-red-500/40">
                    &rarr;
                </div>
            </div>
        </div>
      </div>
    </Link>
  );
}
