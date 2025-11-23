import { Role } from "@/queries/client/roles/getRoles";
import { Loader2, XIcon } from "lucide-react";
import React, { useTransition } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { deleteRole } from "@/actions/roles/deleteRole";

interface RoleTagProps {
  role: Role;
  isPendingSubmit?: boolean;
}

const RoleTag = ({ role, isPendingSubmit = false }: RoleTagProps) => {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const removeTag = () => {
    startTransition(async () => {
      const result = await deleteRole(role.id);
      if (result.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["roles"] });
        toast.success("Role removed successfully");
      } else {
        toast.error("Failed to remove role");
      }
    });
  };

  return (
    <div className="inline-flex items-center gap-1 pl-3 pr-1 py-1 text-sm bg-primary/10 text-primary border border-primary/20 rounded-md">
      <span>{role.name}</span>
      <button
        type="button"
        onClick={removeTag}
        className="hover:bg-primary/20 p-1 transition-colors cursor-pointer rounded"
        aria-label={`Remove ${role.name} role`}
        disabled={isPendingSubmit || isPending}
      >
        {isPending ? <Loader2 className="size-3 animate-spin" /> : <XIcon className="size-3" />}
      </button>
    </div>
  );
};

export default RoleTag;
