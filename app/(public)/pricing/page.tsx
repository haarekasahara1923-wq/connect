import { Check, Sparkles, Building, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Growth",
    price: "Free",
    description: "Ideal for emerging creators and early-stage brands building a footprint.",
    features: ["Access to search directory", "Direct connection portal", "Basic profile visualization", "Community support"],
    icon: <Sparkles className="w-8 h-8 text-emerald-400" />
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored for established brands looking for exclusive, high-impact regional synergy.",
    features: ["Curated influencer sourcing", "Escrow-protected high-volume campaigns", "Analytics dashboard access", "Dedicated concierge support"],
    featured: true,
    icon: <Building className="w-8 h-8 text-primary" />
  },
  {
    name: "Global",
    price: "On Demand",
    description: "For international entities wanting to enter Bharat's Tier 2 and Tier 3 cities.",
    features: ["Strategic market entry reports", "Cultural consulting with top creators", "Full campaign lifecycle management", "Integration with global platforms"],
    icon: <Globe className="w-8 h-8 text-accent" />
  }
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-32">
       <div className="text-center mb-24 space-y-6">
          <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter leading-none mb-6">Investment <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">Models</span></h1>
          <p className="text-2xl text-muted-foreground font-medium italic max-w-2xl mx-auto">Facilitating Bharat's most elite commerce-creator synergy with transparent, scalable structures.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {tiers.map((tier, i) => (
             <div key={i} className={`relative p-12 lg:p-16 rounded-[4rem] flex flex-col justify-between transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_48px_100px_-24px_rgba(0,0,0,0.15)] bg-card border ${tier.featured ? 'border-primary/50 ring-4 ring-primary/10 shadow-2xl relative' : 'border-border/50 shadow-lg'}`}>
                {tier.featured && <div className="absolute top-0 right-10 translate-y-[-50%] bg-primary text-white text-xs font-black uppercase tracking-widest px-8 py-3 rounded-full shadow-2xl">Most Popular</div>}
                
                <div className="space-y-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-background rounded-3xl flex items-center justify-center border border-border/50 shadow-sm">{tier.icon}</div>
                        <div>
                            <h3 className="text-3xl font-black italic">{tier.name}</h3>
                            <p className="text-4xl font-black mt-1 text-primary italic">{tier.price}</p>
                        </div>
                    </div>
                    
                    <p className="text-lg font-medium text-muted-foreground leading-relaxed italic">{tier.description}</p>
                    
                    <ul className="space-y-6">
                        {tier.features.map((f, j) => (
                           <li key={j} className="flex gap-4 items-start">
                              <Check className="w-6 h-6 text-primary shrink-0 mt-1" />
                              <span className="text-lg font-bold text-foreground/80">{f}</span>
                           </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-16">
                    <Button size="lg" className={`w-full py-9 rounded-3xl text-xl font-black transition-all ${tier.featured ? 'bg-primary hover:bg-primary/90 text-white shadow-3xl shadow-primary/20 hover:scale-105' : 'bg-background hover:bg-background border-2 border-primary/20 text-primary hover:text-primary active:scale-95'}`}>Select Plan</Button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}
