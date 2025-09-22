"use client";

import EventsList from "./components/EventsList";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import useGetEventsByBusinessCodeId from "@/hooks/events/useGetEventsByBusinessCodeId";

const EventsPage = () => {
  const { codeId } = useParams();
  const t = useTranslations("EventsList");
  const tError = useTranslations("EventsError");
  const { data: result, isLoading } = useGetEventsByBusinessCodeId(codeId as string);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />

        <div className="flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-4/5" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
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

                <div className="flex gap-2 justify-end">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
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

      <EventsList events={result.data?.events} />
    </div>
  );
};

export default EventsPage;
