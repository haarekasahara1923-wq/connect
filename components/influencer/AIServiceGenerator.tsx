'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Sparkles, Loader2, Check } from 'lucide-react';
import { generateAIBio } from '@/actions/influencer';
import { toast } from 'sonner';

interface AIServiceGeneratorProps {
  onSelect: (bio: string) => void;
  serviceName: string;
}

export function AIServiceGenerator({ onSelect, serviceName }: AIServiceGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [versions, setVersions] = useState<{ type: string; content: string }[]>([]);
  const [open, setOpen] = useState(false);

  async function handleGenerate() {
    if (!prompt) {
      toast.error('Tell us a bit about this service node.');
      return;
    }
    
    setIsGenerating(true);
    try {
      // Reusing generateAIBio as it's a generic prompt processor for now
      const res = await generateAIBio(`Service: ${serviceName}. Description details: ${prompt}`);
      if (res.success && res.versions) {
        setVersions(res.versions);
        toast.success('Generated 3 unique descriptions!');
      } else {
        toast.error('AI generation failed.');
      }
    } catch (e) {
      toast.error('An error occurred.');
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSelect(content: string) {
    onSelect(content);
    setOpen(false);
    setVersions([]);
    setPrompt('');
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button 
            variant="outline" 
            type="button"
            className="bg-secondary/10 text-secondary border-secondary/20 rounded-full hover:bg-secondary hover:text-white transition-all group px-4 h-8 font-bold text-[10px]"
          />
        }
      >
          <Sparkles className="w-3 h-3 mr-2 group-hover:animate-spin" /> Descriptions AI
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-[2.5rem] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase grayscale group-hover:grayscale-0">Marketplace Narrative Engine</DialogTitle>
          <DialogDescription className="font-medium italic">Define the parameters of your `{serviceName}` node and let AI curate the copy.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="relative">
            <textarea 
               placeholder="e.g. A high-quality fashion reel with trending music, transition effects, and a custom voiceover highlighting the brand's key features..."
               className="w-full h-32 rounded-3xl border-border bg-muted/5 p-6 resize-none focus:ring-2 ring-secondary/20 outline-none font-medium italic"
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
            />
            <Button 
              disabled={isGenerating || !prompt} 
              onClick={handleGenerate}
              className="absolute bottom-4 right-4 bg-secondary text-white rounded-2xl px-6 h-10 font-bold italic shadow-xl shadow-secondary/20"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {isGenerating ? 'Synthesizing...' : 'Generate Description'}
            </Button>
          </div>

          {versions.length > 0 && (
            <div className="grid grid-cols-1 gap-4 mt-8">
               {versions.map((v) => (
                 <div key={v.type} className="bg-gray-50 border border-black/5 p-6 rounded-[2rem] hover:border-secondary/30 transition-all group relative">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-secondary/10 text-secondary px-3 py-1 rounded-full">{v.type} Node</span>
                        <Button 
                          onClick={() => handleSelect(v.content)}
                          size="sm" 
                          className="bg-black text-white hover:bg-secondary rounded-xl font-bold text-[10px] italic shadow-lg"
                        >
                          Inject Node <Check className="ml-2 w-3 h-3" />
                        </Button>
                    </div>
                    <p className="text-sm font-medium leading-relaxed italic text-gray-700">{v.content}</p>
                 </div>
               ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
