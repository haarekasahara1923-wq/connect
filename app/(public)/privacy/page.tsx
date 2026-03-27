import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Shield className="w-12 h-12 text-primary" />
        <h1 className="text-4xl font-black">Privacy Protocol</h1>
      </div>
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-muted-foreground font-medium">
        <section>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Lock className="w-6 h-6" /> Data Encryption
          </h2>
          <p>At InfluencerConnect, we employ military-grade encryption to ensure your personal and financial data remains secure. We do not sell your data to third parties.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Eye className="w-6 h-6" /> Information We Collect
          </h2>
          <p>We collect information necessary to facilitate authentic synergy between brands and creators, including profile details, analytics, and transaction history.</p>
        </section>
        <section>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <FileText className="w-6 h-6" /> Security Standards
            </h2>
            <p>Our infrastructure follows global security standards (ISO 27001) to protect against unauthorized access or breaches.</p>
        </section>
      </div>
    </div>
  );
}
