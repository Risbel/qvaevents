import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import { useTranslations } from "next-intl";
import CreateOrganizerProfileModal from "./CreateOrganizerProfileModal";

const EmptyState = () => {
  const t = useTranslations("Profile");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Building className="w-5 h-5" />
          {t("organizerProfile")}
        </CardTitle>
        <CardDescription>{t("organizerProfileDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t("noOrganizerProfile")}</h3>
          <p className="text-muted-foreground mb-6">{t("createOrganizerProfileDescription")}</p>
          <CreateOrganizerProfileModal />
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
