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

interface AIBioGeneratorProps {
  onSelect: (bio: string) => void;
}

export function AIBioGenerator({ onSelect }: AIBioGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [versions, setVersions] = useState<{ type: string; content: string }[]>([]);
  const [open, setOpen] = useState(false);

  async function handleGenerate() {
    if (!prompt) {
      toast.error('Please enter some details for the AI to work with.');
      return;
    }
    
    setIsGenerating(true);
    try {
      const res = await generateAIBio(prompt);
      if (res.success && res.versions) {
        setVersions(res.versions);
        toast.success('Generated 3 unique versions for you!');
      } else {
        toast.error('AI generation failed. Please try again.');
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
            className="bg-primary/10 text-primary border-primary/20 rounded-full hover:bg-primary hover:text-white transition-all group px-4 h-9 font-bold text-xs"
          />
        }
      >
          <Sparkles className="w-3.5 h-3.5 mr-2 group-hover:animate-pulse" /> Use Magic Write
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-[2.5rem] bg-white border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase grayscale group-hover:grayscale-0">AI Ecosystem Pitch Generator</DialogTitle>
          <DialogDescription className="font-medium italic">Describe your content, niche, or brand mission and let our AI craft your narrative node.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="relative">
            <textarea 
               placeholder="e.g. Regional fashion influencer based in Indore, specializing in affordable street wear for Gen Z and eco-friendly brands..."
               className="w-full h-32 rounded-3xl border-border bg-muted/5 p-6 resize-none focus:ring-2 ring-primary/20 outline-none font-medium italic"
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
            />
            <Button 
              disabled={isGenerating || !prompt} 
              onClick={handleGenerate}
              className="absolute bottom-4 right-4 bg-primary text-white rounded-2xl px-6 h-10 font-bold italic shadow-xl shadow-primary/20"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {isGenerating ? 'Synthesizing...' : 'Generate Bios'}
            </Button>
          </div>

          {versions.length > 0 && (
            <div className="grid grid-cols-1 gap-4 mt-8">
               {versions.map((v) => (
                 <div key={v.type} className="bg-gray-50 border border-black/5 p-6 rounded-[2rem] hover:border-primary/30 transition-all group relative">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary px-3 py-1 rounded-full">{v.type} version</span>
                        <Button 
                          onClick={() => handleSelect(v.content)}
                          size="sm" 
                          className="bg-black text-white hover:bg-primary rounded-xl font-bold text-[10px] italic shadow-lg"
                        >
                          Select & Use <Check className="ml-2 w-3 h-3" />
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
