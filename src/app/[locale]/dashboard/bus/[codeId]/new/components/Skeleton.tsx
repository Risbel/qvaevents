import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const NewEventConfigSkeleton = () => {
  return (
    <div className="space-y-2 w-full lg:max-w-4xl">
      {/* Title and description */}
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 mt-2" />
      </div>

      {/* Saved config + actions row */}
      <div className="flex justify-between">
        <Skeleton className="h-10 w-48" />
        {/* Right side reserved for future actions */}
        <div className="hidden md:block">
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      <div className="flex flex-col gap-2 md:gap-3 w-full lg:w-4xl">
        {/* Type Selector */}
        <Card className="gap-4">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-5 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Minors suitability / Event visibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
          <Card className="gap-2">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-5 w-44" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
          <Card className="gap-2">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-5 w-40" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Space type / Access type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
          <Card className="gap-2">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-5 w-36" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
          <Card className="gap-2">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-5 w-36" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Languages */}
        <Card className="gap-2">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-5 w-28" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-64" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-14" />
              <Skeleton className="h-8 w-12" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next button */}
      <div className="flex justify-end w-full">
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
};

export default NewEventConfigSkeleton;
