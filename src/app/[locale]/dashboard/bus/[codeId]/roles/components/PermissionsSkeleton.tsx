import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import ResourcesSkeleton from "./ResourcesSkeleton";

const CRUD_OPTIONS = ["Create", "Read", "Update", "Delete"];

const PermissionsSkeleton = ({ rows = 4 }: { rows?: number }) => {
  return (
    <Table>
      <TableBody>
        {Array.from({ length: rows }).map((_, index) => (
          <TableRow key={index}>
            {/* Permission name column */}
            <TableCell className="w-2/12">{CRUD_OPTIONS[index]}</TableCell>
            {/* Resources column */}
            <TableCell className="w-10/12">
              <ResourcesSkeleton />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PermissionsSkeleton;
