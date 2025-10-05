"use client";

import { Button } from "@/components/ui/button";
import useGetOrganizerProfile from "@/hooks/organizers/useGetOrganizerProfile";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

const OpenDashboardButton = ({ user }: { user: SupabaseUser }) => {
  const {
    data: organizerProfile,
    isLoading: organizerProfileLoading,
    isFetching: organizerProfileFetching,
  } = useGetOrganizerProfile(user.id);
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("Dashboard");

  const handleClick = () => {
    if (!organizerProfile) return;

    // If only one business, go directly to business dashboard
    if (organizerProfile.business?.length === 1) {
      window.location.href = `/${locale}/dashboard/bus/${organizerProfile.business[0].codeId}`;
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
