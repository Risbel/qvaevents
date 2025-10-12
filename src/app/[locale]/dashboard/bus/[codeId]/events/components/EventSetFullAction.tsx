"use client";

import { useState, useTransition } from "react";
import {
  Users,
  Loader2,
  CheckCircle,
  UserRoundXIcon,
  LucideDoorClosedLocked,
  TicketXIcon,
  DoorClosedLockedIcon,
  DoorOpenIcon,
} from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { setEventFull } from "@/actions/event/setEventFull";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface EventSetFullActionProps {
  eventId: number;
  isFull: boolean;
}

const EventSetFullAction = ({ eventId, isFull }: EventSetFullActionProps) => {
  const t = useTranslations("EventCard");
  const { codeId } = useParams() as { codeId: string };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const handleSetFull = () => {
    startTransition(async () => {
      try {
        await setEventFull(eventId, !isFull);
        toast.success(isFull ? t("unsetFullSuccess") : t("setFullSuccess"));

        // Invalidate events queries to refresh the list
        queryClient.invalidateQueries({ queryKey: ["events", codeId] });

        setIsDialogOpen(false);
      } catch (error) {
        toast.error(t("setFullError"));
      }
    });
  };

  return (
    <>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault();
          setIsDialogOpen(true);
        }}
        className="cursor-pointer"
      >
        {isFull ? (
          <>
            <DoorOpenIcon className="h-4 w-4 text-yellow-600" />
            <span className="text-yellow-600">{t("unsetFull")}</span>
          </>
        ) : (
          <>
            <DoorClosedLockedIcon className="h-4 w-4 text-yellow-600" />
            <span className="text-yellow-600">{t("setFull")}</span>
          </>
        )}
      </DropdownMenuItem>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isFull ? t("unsetFullTitle") : t("setFullTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {isFull ? t("unsetFullDescription") : t("setFullDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleSetFull();
              }}
              disabled={isPending}
              className="cursor-pointer"
              asChild
            >
              <Button className="cursor-pointer bg-yellow-600 hover:bg-yellow-600/90" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("updating")}
                  </>
                ) : (
                  <>
                    {isFull ? (
                      <>
                        <DoorOpenIcon className="h-4 w-4" />
                        {t("confirmUnsetFull")}
                      </>
                    ) : (
                      <>
                        <DoorClosedLockedIcon className="h-4 w-4" />
                        {t("confirmSetFull")}
                      </>
                    )}
                  </>
                )}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EventSetFullAction;
