import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createVisit } from "@/actions/visit/createVisit";
import { State } from "@/types/state";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Tables } from "@/types/supabase";
import { useTranslations } from "next-intl";

export default function VisitForm({
  clientProfile,
  eventId,
  organizerId,
  onSuccess,
}: {
  clientProfile: Tables<"ClientProfile">;
  eventId: number;
  organizerId?: number;
  onSuccess?: () => void;
}) {
  const t = useTranslations("EventPage.ReservationDialog");
  const initial: State = { status: undefined };
  const [state, formAction, pending] = useActionState(createVisit, initial);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(t("reservationCreated"));
      onSuccess?.();
    } else if (state.status === "error") {
      const firstErrorKey = state.errors && Object.keys(state.errors)[0];
      const firstError = firstErrorKey ? state.errors?.[firstErrorKey]?.[0] : "Failed";
      toast.error(firstError || t("reservationFailed"));
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="eventId" value={eventId} />
      <input type="hidden" name="clientId" value={clientProfile.id} />
      <input type="hidden" name="organizerId" value={organizerId} />

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
    </form>
  );
}
