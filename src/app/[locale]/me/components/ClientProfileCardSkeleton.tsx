import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Calendar, Mail, Shield } from "lucide-react";

export default function ClientProfileCardSkeleton() {
  return (
    <>
      {/* Username skeleton */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
        <User className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      {/* Bio skeleton */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
        <Mail className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <Skeleton className="h-5 w-48 mb-1" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>

      {/* Birthday skeleton */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <div>
          <Skeleton className="h-5 w-36 mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Gender skeleton */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
        <Shield className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <Skeleton className="h-5 w-16 mb-2" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>

      {/* Edit button skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-9 w-32" />
      </div>
    </>
  );
}
