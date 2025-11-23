import { Card, CardContent } from "@/components/ui/card";
import { Permission } from "@/queries/client/roles/getPermissions";
import AddResource from "./AddResource";
import RolePermissionResourcesList from "./RolePermissionResourcesList";
import useGetRolePermissionResources from "@/hooks/roles/useGetRolePermissionResources";
import { useOptimistic, useTransition } from "react";
import { RolePermissionResourceWithResource } from "@/queries/client/roles/getRolePermissionResources";
import { createRolePermissionResource } from "@/actions/roles/createRolePermissionResource";
import { deleteRolePermissionResource } from "@/actions/roles/deleteRolePermissionResource";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ResourcesSkeleton from "./ResourcesSkeleton";

const Resources = ({ permission, roleId }: { permission: Permission; roleId: number }) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetRolePermissionResources(roleId, permission.id);
  const [isPending, startTransition] = useTransition();

  const [optimisticData, setOptimisticData] = useOptimistic(
    data ?? [],
    (currentData, action: { type: "add" | "remove"; item: RolePermissionResourceWithResource }) => {
      if (action.type === "add") {
        return [...currentData, action.item];
      } else {
        return currentData.filter((item) => item.id !== action.item.id);
      }
    }
  );

  const handleAddResource = (resourceId: number, resourceName: string, resourceDescription: string) => {
    // Create optimistic item with temporary ID
    const optimisticItem: RolePermissionResourceWithResource = {
      id: Date.now(), // Temporary ID
      roleId,
      permissionId: permission.id,
      resourceId,
      createdAt: new Date().toISOString(),
      Resource: {
        id: resourceId,
        name: resourceName,
        description: resourceDescription,
        key: "",
        createdAt: new Date().toISOString(),
      },
    };

    startTransition(() => {
      setOptimisticData({ type: "add", item: optimisticItem });

      createRolePermissionResource(roleId, permission.id, resourceId)
        .then((result) => {
          if (result.status === "error") {
            throw new Error(result.error);
          }
          queryClient.invalidateQueries({ queryKey: ["rolePermissionResources", roleId, permission.id] });
          toast.success("Resource added successfully");
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to add resource");
        });
    });
  };

  const handleRemoveResource = (item: RolePermissionResourceWithResource) => {
    if (!item.resourceId) return;

    startTransition(() => {
      setOptimisticData({ type: "remove", item });

      deleteRolePermissionResource(roleId, permission.id, item.resourceId!)
        .then((result) => {
          if (result.status === "error") {
            throw new Error(result.error);
          }
          queryClient.invalidateQueries({ queryKey: ["rolePermissionResources", roleId, permission.id] });
        })
        .catch((error) => {
          toast.error("Failed to remove resource");
        });
    });
  };

  if (isLoading) return <ResourcesSkeleton />;

  return (
    <Card className="rounded-md min-w-[500px]">
      <CardContent className="flex flex-wrap gap-2">
        <AddResource
          roleId={roleId}
          permissionId={permission.id}
          data={optimisticData}
          onAddResource={handleAddResource}
          isPending={isPending}
        />
        <RolePermissionResourcesList
          roleId={roleId}
          permissionId={permission.id}
          data={optimisticData}
          onRemoveResource={handleRemoveResource}
          isPending={isPending}
        />
      </CardContent>
    </Card>
  );
};

export default Resources;
