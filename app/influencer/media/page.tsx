import { Metadata } from 'next';
import { getPortfolio } from '@/actions/influencer';
import { PortfolioEditor } from '@/components/influencer/PortfolioEditor';

export const metadata: Metadata = {
  title: 'Media Vault | InfluencerConnect',
};

export default async function MediaPage() {
  const { data: portfolio } = await getPortfolio();

  return (
    <div className="w-full pb-20 lg:pb-0 px-4 md:px-8">
       <PortfolioEditor 
         initialImages={portfolio?.portfolioImages || []} 
         initialVideos={portfolio?.portfolioVideos || []} 
       />
    </div>
  );
}
