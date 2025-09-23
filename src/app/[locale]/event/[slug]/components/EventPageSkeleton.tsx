import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Users, Shield, Ticket } from "lucide-react";

export function EventPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header Section */}
        <div className="flex items-center justify-end mb-2">
          <Skeleton className="h-8 w-32" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {/* Title and Date Section */}
          <div className="flex flex-col items-center gap-1 md:gap-2">
            <Skeleton className="h-8 md:h-10 w-3/4 max-w-md" />
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <Skeleton className="h-5 w-32" />
              <span className="text-muted-foreground">|</span>
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Image Carousel Skeleton */}
          <div className="relative w-full h-64 md:h-80 lg:h-96">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Event Description */}
          <Card className="gap-0">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="gap-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card className="gap-2">
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date & Time */}
              <div className="flex items-center gap-3 p-2 border rounded-md">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>

              {/* Event Type */}
              <div className="flex items-center gap-3 p-2 border rounded-md">
                <Ticket className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>

              {/* Capacity */}
              <div className="flex items-center gap-3 p-2 border rounded-md">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>

              {/* Minors Policy */}
              <div className="flex items-center gap-3 p-2 border rounded-md">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
