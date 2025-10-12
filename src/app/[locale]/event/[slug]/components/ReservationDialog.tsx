"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ticket } from "lucide-react";
import useGetMyClientProfile from "@/hooks/me/useGetMyClientProfile";
import VisitForm from "./VisitForm";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import useGetVisitsCountByEventId from "@/hooks/visits/useGetVisitsCountByEventId";

export default function ReservationDialog({
  eventId,
  visitsLimit,
  businessId,
  isFull,
}: {
  eventId: number;
  visitsLimit: number;
  businessId: number;
  isFull: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: visitsCount, isLoading: isLoadingVisitsCount } = useGetVisitsCountByEventId(eventId);

  const {
    data: clientProfile,
    isLoading: isLoadingClientProfile,
    error: errorClientProfile,
    isFetching: isFetchingClientProfile,
  } = useGetMyClientProfile({
    enabled: isOpen, // Only fetch when modal is open
  });
  const t = useTranslations("ReservationDialog");
  const tEventPage = useTranslations("EventPage");
  const tAction = useTranslations("actions");

  const totalReserved = visitsCount?.totalCount || 0;
  const isFullyBooked = visitsLimit > 0 && totalReserved >= visitsLimit;

  if (isLoadingVisitsCount) {
    return <Skeleton className="h-9 w-full" />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={isFullyBooked}>
          <Ticket className="h-4 w-4 mr-2" />
          {isFullyBooked ? t("fullyBooked") : t("reserve")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("reserveTitle")}</DialogTitle>
          <DialogDescription>{t("reserveDescription")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoadingClientProfile || isFetchingClientProfile || isLoadingVisitsCount ? (
            <div className="space-y-3">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : errorClientProfile || !clientProfile ? (
            <p className="text-sm text-muted-foreground">{t("mustBeLoggedIn")}</p>
          ) : isFullyBooked || isFull ? (
            <div className="space-y-4">
              <p className="text-sm">{t("fullyBookedDescription")}</p>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                  {tAction("close")}
                </Button>
              </div>
            </div>
          ) : eventId && clientProfile ? (
            <>
              <VisitForm
                clientProfile={clientProfile}
                eventId={eventId}
                visitsLimit={visitsLimit}
                visitsCount={visitsCount?.totalCount || 0}
                businessId={businessId}
                onSuccess={() => setIsOpen(false)}
              />
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                {tAction("close")}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
