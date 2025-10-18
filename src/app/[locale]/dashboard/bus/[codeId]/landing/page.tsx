"use client";

import React from "react";
import { useParams } from "next/navigation";
import useGetBusinessByCodeId from "@/hooks/business/useGetBusinessByCodeId";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import UploadLogo from "./components/UploadLogo";
import { UploadBannerImages } from "./components/UploadBannerImages";

const BusinessLanding = () => {
  const params = useParams();
  const { codeId } = params;
  const t = useTranslations("Business");

  const { data: business } = useGetBusinessByCodeId(codeId as string);

  if (!business) {
    return (
      <Alert variant="destructive" className="max-w-md">
        <AlertTitle className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <p>{t("businessNotFound")}</p>
        </AlertTitle>
        <AlertDescription>
          <p>{t("businessNotFoundDescription")}</p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <section className="container space-y-4">
      <UploadLogo business={business} />
      <UploadBannerImages business={business} />
    </section>
  );
};

export default BusinessLanding;
