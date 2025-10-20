"use client";

import React from "react";
import { useParams } from "next/navigation";
import useGetBusinessByCodeId from "@/hooks/business/useGetBusinessByCodeId";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ExternalLinkIcon, Link } from "lucide-react";
import { useTranslations } from "next-intl";
import UploadLogo from "./components/UploadLogo";
import { UploadBannerImages } from "./components/UploadBannerImages";
import FooterConfigForm from "./components/FooterConfigForm";
import { Button } from "@/components/ui/button";
import { FooterConfigType } from "@/lib/validations/footer";

const BusinessLanding = () => {
  const params = useParams();
  const { codeId, locale } = params;
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
    <section className="container space-y-4 relative py-4">
      <Button variant="outline" size={"sm"} asChild className="absolute top-0 right-0">
        <a href={`/${locale}/${business.slug}`} target="_blank" className="flex items-center gap-2">
          <ExternalLinkIcon className="h-4 w-4" />
          <span className="text-xs font-medium">View Landing</span>
        </a>
      </Button>

      <UploadLogo business={business} />
      <UploadBannerImages business={business} />
      <FooterConfigForm footerConfig={business.footerConfig as FooterConfigType} businessId={business.id} />
    </section>
  );
};

export default BusinessLanding;
