"use client";

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import useGetMyOrganizerProfile from "@/hooks/organizers/useGetMyOrganizerProfile";

const OpenDashboardButton = () => {
  const {
    data: organizerProfile,
    isLoading: organizerProfileLoading,
    isFetching: organizerProfileFetching,
  } = useGetMyOrganizerProfile();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("Dashboard");

  const handleClick = () => {
    if (!organizerProfile) return;

    // If only one business, go directly to business dashboard
    if (organizerProfile.codeId?.length === 1) {
      window.location.href = `/${locale}/dashboard/bus/${organizerProfile.codeId}`;
    } else {
      // If multiple or no businesses, go to organizer dashboard
      window.location.href = `/${locale}/dashboard/org/${organizerProfile.codeId}`;
    }
  };

  if (organizerProfileLoading || organizerProfileFetching) {
    return <Skeleton className="h-9 w-[85px] rounded-md" />;
  }

  return (
    <Button className="cursor-pointer" onClick={handleClick}>
      {t("dashboard")}
    </Button>
  );
};

export default OpenDashboardButton;
