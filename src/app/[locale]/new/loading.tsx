import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCheck2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center py-16 space-y-4">
      {/* Go Back Button Skeleton */}
      <Skeleton className="h-10 w-24" />

      {/* Main Form Card */}
      <Card className="shadow-primary/30 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserCheck2Icon className="w-5 h-5" />
            <Skeleton className="h-6 w-40" /> {/* Create Organizer Profile title */}
          </div>
          <Skeleton className="h-4 w-64 lg:w-96" /> {/* Description */}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Company Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" /> {/* Company Name label */}
                <Skeleton className="h-10 w-full" /> {/* Company Name input */}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" /> {/* Company Type label */}
                <Skeleton className="h-10 w-full" /> {/* Company Type input */}
              </div>
            </div>

            {/* Billing Cycle and Currency Section */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-2 border-r pr-4">
                <Skeleton className="h-4 w-20" /> {/* Billing Cycle label */}
                <div className="flex flex-row gap-4">
                  {/* Radio button skeletons */}
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Skeleton className="w-4 h-4 rounded-full" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-16" /> {/* Currency label */}
                <div className="flex flex-row gap-6">
                  {/* Currency radio button skeletons */}
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Skeleton className="w-4 h-4 rounded-full" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Plan Selection Section */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" /> {/* Select Plan label */}
              <Skeleton className="h-10 w-full" /> {/* Plan selector */}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center items-center">
              <Skeleton className="h-10 w-48" /> {/* Submit button */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
