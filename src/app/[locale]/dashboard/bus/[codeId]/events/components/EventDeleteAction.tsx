"use client";

import { useState, useTransition, useEffect } from "react";
import { Trash2, Loader2, AlertCircle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { deleteEvent } from "@/actions/event/deleteEvent";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EventDeleteActionProps {
  eventId: number;
}

const EventDeleteAction = ({ eventId }: EventDeleteActionProps) => {
  const t = useTranslations("EventCard");
  const tAction = useTranslations("actions");
  const { codeId } = useParams() as { codeId: string };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const confirmationPhrase = t("deleteConfirmPhrase");
  const isConfirmationValid = confirmText.trim().toLowerCase() === confirmationPhrase.toLowerCase();

  // Reset confirmation text when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      setConfirmText("");
    }
  }, [isDialogOpen]);

  const handleDelete = () => {
    if (!isConfirmationValid) {
      toast.error(t("deleteConfirmError"));
      return;
    }

    startTransition(async () => {
      try {
        await deleteEvent(eventId);
        toast.success(t("deleteSuccess"));

        // Invalidate events queries to refresh the list
        queryClient.invalidateQueries({ queryKey: ["events", codeId] });

        setIsDialogOpen(false);
      } catch (error) {
        toast.error(t("deleteError"));
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
        className="cursor-pointer text-destructive focus:text-destructive"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
        {t("delete")}
      </DropdownMenuItem>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogHeader hidden>
          <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
          <AlertDialogDescription>{t("deleteDescription")}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogContent>
          <div>
            <Label htmlFor="confirm-delete" className="text-sm font-medium">
              {t("deleteConfirmLabel")}
            </Label>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t("deleteDescription")}</p>

              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{t("warning")}</p>
              </div>

              <p className="text-xs text-muted-foreground">
                <span> {t("deleteConfirmInstruction")}</span>{" "}
                <span className="font-mono font-bold">{confirmationPhrase}</span>
              </p>
              <Input
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={confirmationPhrase}
                disabled={isPending}
                className="font-mono"
                autoComplete="off"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isPending || !isConfirmationValid}
              className="cursor-pointer bg-destructive hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("deleting")}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  {t("confirmDelete")}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EventDeleteAction;
