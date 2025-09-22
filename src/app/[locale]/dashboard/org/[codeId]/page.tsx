"use client";

import { notFound, redirect } from "next/navigation";
import OrganizerDashboard from "./components/OrganizerDashboard";
import { useParams } from "next/navigation";
import useGetUser from "@/hooks/user/useGetUser";
import useGetOrganizerProfile from "@/hooks/organizers/useGetOrganizerProfile";
import { OrganizerDashboardSkeleton } from "./components/Skeletons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function OrganizerDashboardPage() {
  const { codeId, locale } = useParams();

  const { data: user, isLoading: userLoading, isError: userError } = useGetUser();
  const {
    data: organizer,
    isLoading: organizerLoading,
    isError: organizerError,
  } = useGetOrganizerProfile(user?.id || "");

  if (userLoading || organizerLoading) {
    return <OrganizerDashboardSkeleton />;
  }

  if (userError || organizerError || !organizer || user?.id !== organizer.user_id) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Error loading organization</AlertDescription>
        </Alert>
      </div>
    );
  }

  return <OrganizerDashboard codeId={codeId as string} organizer={organizer} />;
}
