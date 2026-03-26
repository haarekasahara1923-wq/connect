import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-end bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-lg opacity-50" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <Skeleton className="h-4 w-20 rounded-lg shadow-sm" />
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-3 w-1/2 rounded-lg opacity-40 shadow-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
