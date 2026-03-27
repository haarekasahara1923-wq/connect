import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon, Upload, PlusCircle } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Media | InfluencerConnect',
};

export default function MediaPage() {
  return (
    <div className="w-full pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Media Portfolio</h1>
          <p className="text-muted-foreground mt-1 text-sm">Showcase your best content to attract brand collaborations.</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 py-2">
          <Upload className="w-4 h-4 mr-2" /> Upload Media
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/30">
        <ImageIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h3 className="font-semibold text-foreground text-xl">No media uploaded yet</h3>
        <p className="mt-2 text-sm max-w-sm">Upload your best photos and videos to build a compelling portfolio that brands love.</p>
        <button className="inline-flex items-center justify-center rounded-xl font-medium transition-colors bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-6 py-2 mt-6 text-sm">
          <Upload className="w-4 h-4 mr-2" /> Upload Your First Media
        </button>
      </div>
    </div>
  );
}
