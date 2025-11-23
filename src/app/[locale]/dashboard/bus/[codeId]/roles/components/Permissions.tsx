import React from "react";
import useGetPermissions from "@/hooks/roles/useGetPermissions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Resources from "./Resources";
import PermissionsSkeleton from "./PermissionsSkeleton";

const Permissions = ({ roleId }: { roleId: number }) => {
  const { data, isLoading } = useGetPermissions();

  if (isLoading) return <PermissionsSkeleton />;

  return (
    <Table>
      <TableBody>
        {data?.map((permission) => (
          <TableRow key={permission.id}>
            <TableCell className="w-2/12">{permission.name}</TableCell>
            <TableCell className="w-10/12">
              <Resources permission={permission} roleId={roleId} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Permissions;
