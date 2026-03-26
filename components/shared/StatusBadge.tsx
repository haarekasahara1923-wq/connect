import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusType = 
  | 'pending' | 'accepted' | 'in_progress' | 'delivered' 
  | 'revision_requested' | 'completed' | 'cancelled' | 'disputed'
  | 'draft' | 'open' | 'processing' | 'paid' | 'failed';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig: Record<string, { label: string; cn: string }> = {
    // Bookings & Escrow
    pending: { label: 'Pending', cn: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200' },
    accepted: { label: 'Accepted', cn: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200' },
    in_progress: { label: 'In Progress', cn: 'bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200' },
    delivered: { label: 'Delivered', cn: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-indigo-200' },
    revision_requested: { label: 'Revision', cn: 'bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200' },
    completed: { label: 'Completed', cn: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200' },
    cancelled: { label: 'Cancelled', cn: 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200' },
    disputed: { label: 'Disputed', cn: 'bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200' },
    // Campaigns
    draft: { label: 'Draft', cn: 'bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200' },
    open: { label: 'Open', cn: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200' },
    // Payouts
    processing: { label: 'Processing', cn: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200' },
    paid: { label: 'Paid', cn: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200' },
    failed: { label: 'Failed', cn: 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200' },
  };

  const config = statusConfig[status] || { label: status, cn: 'bg-gray-100 text-gray-800 border-gray-200' };

  return (
    <Badge variant="outline" className={cn("capitalize px-2.5 py-0.5", config.cn, className)}>
      {config.label}
    </Badge>
  );
}
