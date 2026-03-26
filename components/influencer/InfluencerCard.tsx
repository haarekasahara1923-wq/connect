import Image from 'next/image';
import Link from 'next/link';
import { Star, CheckCircle2, Camera, Video, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getOptimizedUrl } from '@/lib/cloudinary';

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
}

export function InfluencerCard({ inf }: { inf: InfluencerCardProps }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Link href={`/influencers/${inf.slug}`}>
          <Image 
            src={inf.photo?.includes('res.cloudinary') ? getOptimizedUrl(inf.photo) : (inf.photo || '/avatar-placeholder.png')} 
            alt={inf.name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          />
        </Link>
        {inf.isVerified && (
          <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-1 shadow-md">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm flex items-center border border-gray-100/50">
          <Star className="w-3.5 h-3.5 text-yellow-500 mr-1 fill-yellow-500" />
          {Number(inf.rating) > 0 ? Number(inf.rating).toFixed(1) : 'New'}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <Link href={`/influencers/${inf.slug}`}>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1 cursor-pointer">{inf.name}</h3>
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mb-3 flex items-center font-medium">
          <MapPin className="w-3.5 h-3.5 mr-1" />
          {inf.city}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-5">
          {inf.categories && inf.categories.slice(0, 2).map((cat: string) => (
            <span key={cat} className="text-xs bg-red-50 text-red-700 font-medium px-2 py-1 rounded-md capitalize border border-red-100">
              {cat}
            </span>
          ))}
          {inf.categories && inf.categories.length > 2 && (
            <span className="text-xs bg-gray-50 text-gray-600 font-medium px-2 py-1 rounded-md">+{inf.categories.length - 2}</span>
          )}
        </div>
        
        <div className="mt-auto pt-4 border-t flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-0.5 flex items-center"><Camera className="w-3 h-3 mr-1"/> Fol</p>
            <p className="font-black text-secondary">{(inf.followers / 1000).toFixed(1)}K</p>
          </div>
          <div>
             <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-0.5 text-right">Starts at</p>
             <p className="font-black text-red-600">₹{inf.minPrice || '500'}</p>
          </div>
        </div>

        {/* Hover Action */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-white/90 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center p-3 border-t backdrop-blur-sm -z-10 group-hover:z-10">
           <Link href={`/influencers/${inf.slug}`} className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-500/20 inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors">
              View Profile &rarr;
           </Link>
        </div>
      </div>
    </div>
  );
}
