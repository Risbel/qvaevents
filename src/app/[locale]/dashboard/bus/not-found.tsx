import React from "react";
import { Building2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getTranslations } from "next-intl/server";

const BusinessNotFound = async () => {
  const t = await getTranslations("Business");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Alert variant="destructive" className="max-w-md">
        <Building2 className="h-4 w-4" />
        <AlertTitle>{t("businessNotFound")}</AlertTitle>
        <AlertDescription>{t("businessNotFoundDescription")}</AlertDescription>
      </Alert>
    </div>
  );
};

export default BusinessNotFound;
