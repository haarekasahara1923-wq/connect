import { Metadata } from 'next';
import { getServices } from '@/actions/influencer';
import { ServiceManager } from '@/components/influencer/ServiceManager';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Service Nodes | InfluencerConnect',
};

export default async function ServicesPage() {
  const { data: services = [] } = await getServices();

  return (
    <div className="w-full pb-20 lg:pb-0 px-4 md:px-8">
       <ServiceManager initialServices={services as any} />
    </div>
  );
}
