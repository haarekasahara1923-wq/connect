'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, Play, Maximize2 } from 'lucide-react';
import Image from 'next/image';

interface MediaLightboxProps {
  mediaUrl: string;
  isVideo?: boolean;
  trigger: React.ReactNode;
}

export function MediaLightbox({ mediaUrl, isVideo = false, trigger }: MediaLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {trigger}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-black/95 flex items-center justify-center overflow-hidden rounded-[2rem]">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
            {isVideo ? (
              <video 
                src={mediaUrl} 
                className="max-w-full max-h-[85vh] rounded-3xl shadow-2xl" 
                controls 
                autoPlay
              />
            ) : (
              <div className="relative w-full h-[85vh]">
                <Image 
                  src={mediaUrl} 
                  alt="Full screen media" 
                  fill 
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
