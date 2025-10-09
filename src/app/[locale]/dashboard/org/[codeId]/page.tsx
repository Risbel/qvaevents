"use client";

import OrganizerDashboard from "./components/OrganizerDashboard";
import { useParams } from "next/navigation";
import { OrganizerDashboardSkeleton } from "./components/Skeletons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useGetMyOrganizerProfile from "@/hooks/organizers/useGetMyOrganizerProfile";

export default function OrganizerDashboardPage() {
  const { codeId } = useParams();

  const { data: organizer, isLoading: organizerLoading, isError: organizerError } = useGetMyOrganizerProfile();

  if (organizerLoading) {
    return <OrganizerDashboardSkeleton />;
  }

  if (organizerError || !organizer) {
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
