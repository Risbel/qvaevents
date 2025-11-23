import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ResourcesSkeleton = () => {
  return (
    <Card className="rounded-md">
      <CardContent className="flex flex-wrap gap-2">
        {/* AddResource button skeleton */}
        <Button variant="outline" disabled>
          <Plus className="w-3 h-3" />
          Add Resource
        </Button>

        {/* Resource list items skeleton */}
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-24 border border-primary/20 bg-primary/10 rounded-md" />
        ))}
      </CardContent>
    </Card>
  );
};

export default ResourcesSkeleton;
