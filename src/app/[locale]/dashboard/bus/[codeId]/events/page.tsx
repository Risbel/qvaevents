"use client";

import EventsList from "./components/EventsList";
import EventsFilter from "./components/EventsFilter";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import useGetEventsByBusinessCodeId from "@/hooks/events/useGetEventsByBusinessCodeId";

const EventsPage = () => {
  const { codeId } = useParams();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "upcoming";
  const t = useTranslations("EventsList");
  const tError = useTranslations("EventsError");
  const { data: result, isLoading } = useGetEventsByBusinessCodeId(codeId as string, status);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">{t("events")}:</h1>

        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>

        <div className="flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="relative gap-4">
              <CardHeader>
                <div className="flex gap-2">
                  <Skeleton className="h-20 w-24" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-2/4" />
                    <Skeleton className="h-4 w-4/5" />
                    <div className="flex items-center flex-wrap gap-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardContent>
              <Skeleton className="h-10 w-12 absolute right-4 top-4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }
  if (result?.error || !result?.data?.events) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{tError("title")}</AlertTitle>
        <AlertDescription>{tError("description")}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">{t("events")}:</h1>

      <EventsFilter />

      <EventsList events={result.data?.events} />
    </div>
  );
};

export default EventsPage;
