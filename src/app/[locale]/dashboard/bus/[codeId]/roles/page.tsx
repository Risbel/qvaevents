import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputTagsRoles from "./components/InputTagsRoles";
import PermissionsTable from "./components/PermissionsTable";

const RolesPage = () => {
  return (
    <div className="max-w-3xl md:max-w-4xl lg:max-w-5xl w-full space-y-4">
      <h1 className="text-2xl font-bold mb-2">Roles</h1>

      <Card className="gap-2">
        <CardHeader>
          <CardTitle>Roles</CardTitle>
        </CardHeader>

        <CardContent>
          <InputTagsRoles />
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardContent>
          <PermissionsTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default RolesPage;
