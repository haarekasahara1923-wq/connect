import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { 
    default: 'InfluencerConnect — Tier 2-3 City Influencer Marketplace India', 
    template: '%s | InfluencerConnect' 
  },
  description: 'Find micro and nano influencers from Tier 2 and Tier 3 cities in India. Connect local businesses with affordable influencers for Instagram, YouTube, and more.',
  keywords: ['influencer marketing', 'tier 2 cities influencer', 'micro influencer India', 'local influencer'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'InfluencerConnect',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
