import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
       <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-indigo-50 py-20 lg:py-32 flex flex-col items-center text-center">
          <Skeleton className="h-6 w-48 rounded-full mb-6" />
          <Skeleton className="h-16 w-3/4 max-w-2xl rounded-xl mb-6" />
          <Skeleton className="h-6 w-1/2 max-w-md rounded-lg mb-10" />
          <div className="flex gap-4">
             <Skeleton className="h-12 w-40 rounded-full" />
             <Skeleton className="h-12 w-40 rounded-full" />
          </div>
       </section>

       <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
             <div className="flex justify-between items-end mb-10">
                <div className="space-y-3">
                   <Skeleton className="h-8 w-64 rounded-xl" />
                   <Skeleton className="h-4 w-96 rounded-lg opacity-50" />
                </div>
                <Skeleton className="h-4 w-20 rounded-lg hidden sm:block" />
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => (
                   <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
                      <Skeleton className="aspect-square w-full rounded-xl" />
                      <Skeleton className="h-6 w-2/3 rounded-lg" />
                      <Skeleton className="h-4 w-1/2 rounded-lg opacity-50" />
                      <div className="flex justify-between items-center pt-4 border-t">
                         <div className="space-y-2">
                           <Skeleton className="h-2 w-10 text-xs" />
                           <Skeleton className="h-4 w-8" />
                         </div>
                         <Skeleton className="h-8 w-20 rounded-lg shadow-sm" />
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </section>
    </div>
  );
}