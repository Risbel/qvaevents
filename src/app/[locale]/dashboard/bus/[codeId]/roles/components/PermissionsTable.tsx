"use client";

import useGetRoles from "@/hooks/roles/useGetRoles";
import React from "react";
import { useParams } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Permissions from "./Permissions";
import PermissionsSkeleton from "./PermissionsSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const PermissionsTable = () => {
  const { codeId } = useParams();
  const { data, isLoading } = useGetRoles(codeId as string);
  const roles = data?.Role || [];

  if (isLoading) return <Skeleton className="h-[400px] w-full border border-primary/20 rounded-md" />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-2/12">Role</TableHead>
          <TableHead className="w-10/12 font-semibold">Permissions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {roles.map((role) => (
          <TableRow key={role.id}>
            <TableCell className="w-2/12">{role.name}</TableCell>
            <TableCell className="w-10/12">
              <Permissions roleId={role.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PermissionsTable;
