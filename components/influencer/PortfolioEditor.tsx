'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { Trash2, Film, ImageIcon, Loader2, Play } from 'lucide-react';
import { updatePortfolio } from '@/actions/influencer';
import { toast } from 'sonner';
import Image from 'next/image';

interface PortfolioEditorProps {
  initialImages: string[];
  initialVideos: string[];
}

export function PortfolioEditor({ initialImages, initialVideos }: PortfolioEditorProps) {
  const [images, setImages] = useState<string[]>(initialImages || []);
  const [videos, setVideos] = useState<string[]>(initialVideos || []);
  const [isSaving, setIsSaving] = useState(false);

  async function handleAddImage(url: string) {
    if (!url) return;
    const newImages = [...images, url];
    setImages(newImages);
    await syncWithDB(newImages, videos);
  }

  async function removeImage(index: number) {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    await syncWithDB(newImages, videos);
  }

  async function syncWithDB(imgArray: string[], vidArray: string[]) {
    setIsSaving(true);
    try {
      const res = await updatePortfolio({ images: imgArray, videos: vidArray });
      if (res.success) {
        toast.success('Portfolio synchronized!');
      } else {
        toast.error('Sync failed');
      }
    } catch (e) {
      toast.error('Error syncing');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-black italic tracking-tighter uppercase underline decoration-primary/20 decoration-8 underline-offset-8">Global Media Vault</h1>
           <p className="text-muted-foreground mt-2 font-bold italic">Curate your visual identity for brand ecosystem exploration.</p>
        </div>
        {isSaving && (
          <div className="flex items-center gap-2 text-primary animate-pulse font-bold italic text-sm">
             <Loader2 className="w-4 h-4 animate-spin" /> Synchronizing Nodes...
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images Column */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 border-b border-black/5 pb-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary"><ImageIcon className="w-6 h-6" /></div>
              <h2 className="text-xl font-black italic uppercase tracking-tighter">Still Capture Nodes</h2>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-3xl overflow-hidden group border border-black/5 shadow-sm hover:shadow-xl transition-all duration-500">
                   <Image src={url} alt="Portfolio" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        onClick={() => removeImage(idx)}
                        className="rounded-2xl scale-75 group-hover:scale-100 transition-transform"
                      >
                         <Trash2 className="w-5 h-5" />
                      </Button>
                   </div>
                </div>
              ))}
              <div className="aspect-square bg-muted/20 border-2 border-dashed border-border rounded-3xl flex items-center justify-center p-4 text-center">
                 <ImageUpload folder="portfolio" onUpload={handleAddImage} />
              </div>
           </div>
        </section>

        {/* Videos Column */}
        <section className="space-y-6 opacity-50 cursor-not-allowed">
           <div className="flex items-center gap-4 border-b border-black/5 pb-4">
              <div className="p-3 bg-secondary/10 rounded-xl text-secondary"><Film className="w-6 h-6" /></div>
              <h2 className="text-xl font-black italic uppercase tracking-tighter text-secondary">Motion Narrative Nodes</h2>
           </div>
           <div className="bg-muted/30 p-12 rounded-[2.5rem] border-2 border-dashed border-border text-center">
              <Play className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="font-bold italic text-muted-foreground">Video Narrative Engine initializing in Phase 2.</p>
           </div>
        </section>
      </div>
    </div>
  );
}
