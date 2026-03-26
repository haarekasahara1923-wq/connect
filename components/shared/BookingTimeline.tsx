import { CheckCircle2, CircleDashed, Clock, FileWarning, PlayCircle, Star } from 'lucide-react';
import { StatusType } from './StatusBadge';
import { cn } from '@/lib/utils';

interface BookingTimelineProps {
  status: StatusType;
}

const steps = [
  { id: 'pending', label: 'Requested', sub: 'Awaiting Acceptance', icon: Clock },
  { id: 'accepted', label: 'Accepted', sub: 'Work Starting', icon: PlayCircle },
  { id: 'in_progress', label: 'In Progress', sub: 'Creating Content', icon: CircleDashed },
  { id: 'delivered', label: 'Delivered', sub: 'Awaiting Approval', icon: FileWarning },
  { id: 'completed', label: 'Completed', sub: 'Funds Released', icon: Star },
];

export function BookingTimeline({ status }: BookingTimelineProps) {
  // Determine current step index
  let currentIndex = 0;
  if (['cancelled', 'disputed'].includes(status)) {
    // Show broken timeline
    return <div className="p-4 bg-red-50 text-red-800 border rounded-lg">Timeline stopped. Status: {status}</div>;
  }
  
  if (status === 'accepted') currentIndex = 1;
  else if (status === 'in_progress' || status === 'revision_requested') currentIndex = 2;
  else if (status === 'delivered') currentIndex = 3;
  else if (status === 'completed') currentIndex = 4;

  return (
    <div className="w-full py-6">
      <div className="relative flex justify-between">
        {/* Background line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 -z-10" />
        
        {/* Fill line */}
        <div 
          className="absolute top-5 left-0 h-1 bg-green-500 transition-all duration-500 -z-10"
          style={{ width: `${(currentIndex / 4) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isUpcoming = idx > currentIndex;
          const Icon = isCompleted ? CheckCircle2 : step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center w-24 relative bg-white">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-300",
                  isCompleted ? "bg-green-500 text-white" : 
                  isCurrent ? "bg-red-600 text-white shadow-[0_0_0_4px_rgba(220,38,38,0.2)]" : 
                  "bg-gray-200 text-gray-500"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-center mt-3">
                <p className={cn("text-xs font-bold leading-tight", isCurrent ? "text-gray-900" : "text-gray-500")}>
                  {step.label}
                </p>
                <p className="text-[10px] text-gray-400 mt-1 hidden sm:block">
                  {step.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
