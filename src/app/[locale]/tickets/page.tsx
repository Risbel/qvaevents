"use client";

import useGetMyClientProfile from "@/hooks/me/useGetMyClientProfile";
import Tickets from "./components/Tickets";
import { TicketsListSkeleton } from "./components/TicketSkeletons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

const LoadingState = () => {
  return (
    <div className="mt-6">
      <TicketsListSkeleton />
    </div>
  );
};

const TicketsPage = () => {
  const { data: clientProfile, isLoading: isLoadingClientProfile } = useGetMyClientProfile();
  const t = useTranslations("TicketsPage");

  if (isLoadingClientProfile) {
    return <LoadingState />;
  }

  if (!clientProfile) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("profileNotFound")}</AlertTitle>
        <AlertDescription>{t("profileNotFoundDescription")}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-6">
      <Tickets clientId={clientProfile.id} />
    </div>
  );
};

export default TicketsPage;
