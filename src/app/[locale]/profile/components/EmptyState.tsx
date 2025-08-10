"use client";

import { Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const EmptyState = () => {
  const { locale } = useParams();
  const t = useTranslations("Profile");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Building className="w-5 h-5" />
          {t("organizerProfile")}
        </CardTitle>
        <CardDescription>{t("createOrganizerProfileDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t("noOrganizerProfile")}</h3>
          <p className="text-muted-foreground mb-4">{t("createOrganizerProfileDescription")}</p>

          <a
            href={`/${locale}/new`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t("createOrganizerProfile")}
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
