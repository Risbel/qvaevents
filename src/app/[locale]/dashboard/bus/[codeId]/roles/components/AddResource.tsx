import useGetResources from "@/hooks/roles/useGetResources";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { RolePermissionResourceWithResource } from "@/queries/client/roles/getRolePermissionResources";
import { cn } from "@/lib/utils";
import { Square } from "lucide-react";

const AddResource = ({
  roleId,
  permissionId,
  data,
  onAddResource,
  isPending,
}: {
  roleId: number;
  permissionId: number;
  data: RolePermissionResourceWithResource[];
  onAddResource: (resourceId: number, resourceName: string, resourceDescription: string) => void;
  isPending: boolean;
}) => {
  const { data: resources, isLoading } = useGetResources();
  const [open, setOpen] = useState(false);

  const availableResources = resources?.filter((resource) => !data.some((r) => r.resourceId === resource.id));

  const handleAddResource = (resourceId: number, resourceName: string, resourceDescription: string) => {
    onAddResource(resourceId, resourceName, resourceDescription);
    setOpen(false);
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" disabled={isPending}>
            <Plus className="w-3 h-3" />
            Add Resource
          </Button>
        </PopoverTrigger>
        <PopoverContent dir="ltr" align="start" className="space-y-2 max-h-[300px] overflow-y-auto w-80">
          {availableResources?.map((resource) => (
            <div
              key={resource.id}
              onClick={() => handleAddResource(resource.id, resource.name, resource.description ?? "")}
              className={cn(
                "flex items-start gap-2 px-2 py-1 border cursor-pointer hover:text-accent-foreground transition-colors hover:bg-accent"
              )}
            >
              <div className="flex items-center justify-center w-4 h-4 shrink-0 mt-0.5">
                <Square className="w-4 h-4 stroke-[1]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{resource.name}</span>
                <p className="text-xs text-muted-foreground">{resource.description}</p>
              </div>
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AddResource;
