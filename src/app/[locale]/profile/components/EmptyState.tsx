"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

const EmptyState = () => {
  const t = useTranslations("Profile");
  const params = useParams();
  const locale = params.locale as string;

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
            <Building className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-4">{t("noOrganizerProfile")}</h3>
          <Button asChild>
            <Link href={`/${locale}/new`}>
              <Plus className="w-4 h-4" />
              {t("createOrganizerProfile")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
