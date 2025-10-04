import { Skeleton } from "@/components/ui/skeleton";

export const TicketSkeleton = () => {
  return (
    <div className="bg-card rounded-lg shadow-sm border">
      <div className="flex flex-row">
        <div className="relative w-32 md:w-48 aspect-square flex-shrink-0">
          <Skeleton className="h-full w-full rounded-l-lg" />
        </div>
        <div className="flex-1 p-3 md:p-4">
          <div className="flex justify-between items-start gap-2 mb-2">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="space-y-1 mt-4">
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex flex-row justify-between pt-2 mt-2 border-t gap-2">
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const TicketsListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-6">
      {[...Array(count)].map((_, i) => (
        <TicketSkeleton key={i} />
      ))}
    </div>
  );
};
