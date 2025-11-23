"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import useGetRolesByCode from "@/hooks/roles/useGetRoles";
import { useParams } from "next/navigation";
import { createRole } from "@/actions/roles/createRole";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import RoleTag from "./RoleTag";

const InputTagsRoles = () => {
  const [isPending, startTransition] = useTransition();
  const { codeId } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetRolesByCode(codeId as string);
  const roles = data?.Role || [];
  const businessId = data?.id;

  const [inputValue, setInputValue] = useState("");

  const addTag = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || !businessId) {
      return;
    }

    startTransition(async () => {
      if (isDuplicate(trimmedValue)) {
        toast.error("Role already exists");
        return;
      }

      const result = await createRole(businessId, trimmedValue);
      if (result.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["roles"] });
        toast.success("Role added successfully");
      } else {
        toast.error("Failed to add role");
      }

      setInputValue("");
    });
  };

  const isDuplicate = (value: string) => {
    return roles.some((role) => role.name?.toLowerCase() === value.toLowerCase());
  };

  return (
    <>
      <div className="flex flex-wrap gap-1 mb-2">
        {roles.map((role) => (
          <RoleTag key={role.id} role={role} isPendingSubmit={isPending} />
        ))}
      </div>

      <form onSubmit={addTag}>
        <div className="flex gap-2">
          <Input
            id="roles-tags-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type and press Enter to add a role"
            className="w-full"
            style={{ lineHeight: "1.2", fontSize: "14px" }}
            disabled={isPending || !businessId}
          />
          <Button variant="outline" size="icon" disabled={isPending || !inputValue.trim() || !businessId}>
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </>
  );
};

export default InputTagsRoles;
