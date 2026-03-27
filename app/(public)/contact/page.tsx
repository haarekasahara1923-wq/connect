import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20">
        <div className="lg:w-1/2 space-y-12">
            <div>
                <h1 className="text-5xl font-black mb-6 leading-tight italic text-primary underline decoration-primary/20 underline-offset-8">Concierge Support</h1>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed">Reach out to Bharat's most elite influencer ecosystem. We are here to facilitate your brand's growth story.</p>
            </div>
            <div className="space-y-8">
                <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-md">
                        <Mail className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">General Inquiries</p>
                        <p className="text-2xl font-bold">concierge@influencerconnect.com</p>
                    </div>
                </div>
                <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 bg-secondary/5 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all shadow-md">
                        <Phone className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">VIP Support</p>
                        <p className="text-2xl font-bold">+91 98765 43210</p>
                    </div>
                </div>
                <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 bg-accent/5 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all shadow-md">
                        <MapPin className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Strategic Hub</p>
                        <p className="text-2xl font-bold italic">Dharamshala, HP, Bharat</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="lg:w-1/2 bg-card border border-border/50 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden backdrop-blur-3xl">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full" />
            <div className="relative z-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Input placeholder="Your Name" className="rounded-2xl border-border bg-background h-14 font-medium px-6" />
                    </div>
                    <div className="space-y-2">
                        <Input placeholder="Email Address" className="rounded-2xl border-border bg-background h-14 font-medium px-6" />
                    </div>
                </div>
                <Input placeholder="Subject" className="rounded-2xl border-border bg-background h-14 font-medium px-6" />
                <Textarea placeholder="How can we help you?" className="min-h-[200px] rounded-3xl border-border bg-background font-medium p-8 resize-none" />
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 text-lg font-black italic tracking-tight group">
                    Connect Now <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
