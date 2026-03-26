import { Metadata } from 'next';
import { Sidebar } from '@/components/layout/AdminSidebar';

export const metadata: Metadata = {
  title: 'Admin Dashboard | InfluencerConnect',
  description: 'Manage platform operations and approvals.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <main className="flex-1 w-full p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
