import { Scale, CheckCircle2, AlertCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="flex items-center gap-4 mb-8 text-secondary">
        <Scale className="w-12 h-12" />
        <h1 className="text-4xl font-black text-foreground">User Agreement</h1>
      </div>
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-muted-foreground font-medium">
        <section>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Platform Usage
          </h2>
          <p>By using InfluencerConnect, you agree to provide authentic information and respect our community standards. We do not tolerate fraudulent profiles or data manipulation.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-500" /> Professional Conduct
          </h2>
          <p>Both Brands and Influencers must adhere to agreed-upon campaign deadlines. Failure to deliver may result in restricted platform access.</p>
        </section>
      </div>
    </div>
  );
}
