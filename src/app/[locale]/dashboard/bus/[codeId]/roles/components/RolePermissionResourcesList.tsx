import { RolePermissionResourceWithResource } from "@/queries/client/roles/getRolePermissionResources";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const RolePermissionResourcesList = ({
  roleId,
  permissionId,
  data,
  onRemoveResource,
  isPending,
}: {
  roleId: number;
  permissionId: number;
  data: RolePermissionResourceWithResource[];
  onRemoveResource: (item: RolePermissionResourceWithResource) => void;
  isPending: boolean;
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {data?.map((rolePermissionResource: RolePermissionResourceWithResource) => (
        <div
          key={rolePermissionResource.id}
          className="flex items-center gap-2 border p-1 pl-3 border-primary/20 bg-primary/10 rounded-md"
        >
          <p className="text-sm text-primary">{rolePermissionResource.Resource?.name}</p>

          <Button
            disabled={isPending}
            className="hover:bg-primary/20 cursor-pointer h-5 w-5 rounded-xl"
            variant="ghost"
            size="icon"
            onClick={() => onRemoveResource(rolePermissionResource)}
          >
            <X className="size-3 cursor-pointer text-primary" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default RolePermissionResourcesList;
