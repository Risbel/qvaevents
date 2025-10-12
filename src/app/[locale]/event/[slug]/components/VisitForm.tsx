import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createVisit } from "@/actions/visit/createVisit";
import { State } from "@/types/state";
import { Loader2, UserPlus, Share2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Tables } from "@/types/supabase";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function VisitForm({
  clientProfile,
  eventId,
  visitsLimit,
  visitsCount,
  organizerId,
  onSuccess,
}: {
  clientProfile: Tables<"ClientProfile">;
  eventId: number;
  visitsLimit: number;
  visitsCount: number;
  organizerId?: number;
  onSuccess?: () => void;
}) {
  const t = useTranslations("ReservationDialog");
  const tAction = useTranslations("actions");
  const queryClient = useQueryClient();
  const { slug, locale } = useParams();
  const initial: State<{ visitCode?: string; companionsCount?: number }> = { status: undefined };
  const [state, formAction, pending] = useActionState(createVisit, initial);
  const [showCompanions, setShowCompanions] = useState(false);
  const [companionsCount, setCompanionsCount] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [visitCode, setVisitCode] = useState<string | null>(null);
  const remainingCapacity = visitsLimit > 0 ? visitsLimit - visitsCount : 30;
  const maxCompanions = Math.max(0, remainingCapacity - 1);
  const canAddCompanions = maxCompanions > 0;

  useEffect(() => {
    if (state.status === "success") {
      toast.success(t("reservationCreated"));
      queryClient.invalidateQueries({ queryKey: ["visitsCount", eventId] });

      // Store the visit code from the action response
      if (state.data && "visitCode" in state.data && typeof state.data.visitCode === "string") {
        setVisitCode(state.data.visitCode);
      }

      // Show share modal only if companions were added
      if (state.data && "companionsCount" in state.data && Number(state.data.companionsCount) >= 1) {
        setShowShareModal(true);
      }
    } else if (state.status === "error") {
      const firstErrorKey = state.errors && Object.keys(state.errors)[0];
      const firstError = firstErrorKey ? state.errors?.[firstErrorKey]?.[0] : "Failed";
      toast.error(firstError || t("reservationFailed"));
    }
  }, [state]);

  const handleShare = () => {
    if (!visitCode) {
      setShowShareModal(false);
      return;
    }
    // Use confirmation URL if companions exist and we have a visit code
    const eventUrl = `${window.location.origin}/${locale}/event/${slug}/confirm/${visitCode}`;

    if (navigator.share) {
      navigator
        .share({
          title: t("shareEventTitle"),
          text: t("shareEventText", { clientName: clientProfile.name || "" }),
          url: eventUrl,
        })
        .then(() => {
          toast.success(t("sharedSuccessfully"));
          setShowShareModal(false);
          onSuccess?.();
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(eventUrl);
      toast.success(t("linkCopied"));
      setShowShareModal(false);
      onSuccess?.();
    }
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    onSuccess?.();
  };

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="eventId" value={eventId} />
      <input type="hidden" name="clientId" value={clientProfile.id} />
      <input type="hidden" name="organizerId" value={organizerId} />
      <input type="hidden" name="companionsCount" value={companionsCount} />

      {state?.errors?.auth && <p className="text-sm text-destructive">{state.errors.auth}</p>}
      {state?.errors?.profile && <p className="text-sm text-destructive">{state.errors.profile}</p>}
      {state?.errors?.visit && <p className="text-sm text-destructive">{state.errors.visit}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending} className="flex-1">
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t("creating")}
            </>
          ) : (
            t("confirmReservation")
          )}
        </Button>
      </div>

      {!showCompanions ? (
        <Button
          type="button"
          variant="outline"
          size={"sm"}
          onClick={() => setShowCompanions(true)}
          className="w-full"
          disabled={!canAddCompanions}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          {canAddCompanions ? t("addCompanions") : t("capacity.noSpaceForCompanions")}
        </Button>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="companionsCount">{t("companionsCountLabel")}</Label>
          <div className="flex gap-2">
            <Input
              id="companionsCount"
              type="number"
              min="1"
              max={maxCompanions}
              value={companionsCount}
              onChange={(e) =>
                setCompanionsCount(Math.max(1, Math.min(maxCompanions, parseInt(e.target.value) || 0)).toString())
              }
              autoComplete="off"
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onWheel={(e) => e.currentTarget.blur()}
            />

            <Button type="button" variant="outline" onClick={() => setShowCompanions(false)}>
              {tAction("discard")}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">{t("companionsHint")}</p>
          {visitsLimit > 0 && (
            <p className="text-xs text-muted-foreground">
              {t("capacity.remainingCapacity")}: {remainingCapacity} {t("capacity.spots")}
              {maxCompanions > 0 && (
                <>
                  {" "}
                  • {t("capacity.maxCompanions")}: {maxCompanions}
                </>
              )}
            </p>
          )}
        </div>
      )}

      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <DialogTitle className="text-center">{t("successTitle")}</DialogTitle>
            <DialogDescription className="text-center">{t("successDescription")}</DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button type="button" variant="default" onClick={handleShare} className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              {t("shareEvent")}
            </Button>
            <Button type="button" variant="outline" onClick={handleCloseShareModal} className="w-full">
              {tAction("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
