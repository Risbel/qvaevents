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

export default function ReservationDialog({ eventId }: { eventId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: clientProfile,
    isLoading: isLoadingClientProfile,
    error: errorClientProfile,
    isFetching: isFetchingClientProfile,
  } = useGetMyClientProfile({
    enabled: isOpen, // Only fetch when modal is open
  });
  const t = useTranslations("EventPage.ReservationDialog");
  const tAction = useTranslations("actions");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Ticket className="h-4 w-4 mr-2" />
          {t("reserve")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("reserveTitle")}</DialogTitle>
          <DialogDescription>{t("reserveDescription")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {isLoadingClientProfile || isFetchingClientProfile ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : errorClientProfile || !clientProfile ? (
            <p className="text-sm text-muted-foreground">{t("mustBeLoggedIn")}</p>
          ) : eventId && clientProfile ? (
            <VisitForm clientProfile={clientProfile} eventId={eventId} onSuccess={() => setIsOpen(false)} />
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
