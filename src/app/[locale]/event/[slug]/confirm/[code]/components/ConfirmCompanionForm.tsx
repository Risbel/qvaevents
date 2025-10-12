"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { confirmCompanion } from "@/actions/visit/confirmCompanion";
import { State } from "@/types/state";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import useGetMyClientProfile from "@/hooks/me/useGetMyClientProfile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";

interface ConfirmCompanionFormProps {
  visitId: number;
  isFull: boolean;
  eventSlug: string;
  confirmedClientIds: number[];
  businessId: number;
}

export default function ConfirmCompanionForm({
  visitId,
  isFull,
  eventSlug,
  confirmedClientIds,
  businessId,
}: ConfirmCompanionFormProps) {
  const t = useTranslations("ConfirmCompanionPage");
  const router = useRouter();
  const { locale } = useParams();
  const { data: clientProfile, isLoading: isLoadingProfile } = useGetMyClientProfile();
  const initial: State = { status: undefined };
  const [state, formAction, pending] = useActionState(confirmCompanion, initial);

  // Check if the current user is already confirmed
  const isAlreadyConfirmed = clientProfile ? confirmedClientIds.includes(clientProfile.id) : false;

  useEffect(() => {
    if (state.status === "success") {
      toast.success(t("confirmationSuccess"));
      // Redirect to event page after successful confirmation
      setTimeout(() => {
        router.push(`/${locale}/event/${eventSlug}`);
      }, 2000);
    } else if (state.status === "error") {
      const firstErrorKey = state.errors && Object.keys(state.errors)[0];
      const firstError = firstErrorKey ? state.errors?.[firstErrorKey]?.[0] : "Failed";
      toast.error(firstError || t("confirmationFailed"));
    }
  }, [state, t, router, locale, eventSlug]);

  if (isLoadingProfile) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!clientProfile) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("notLoggedIn")}</AlertTitle>
        <AlertDescription>{t("mustBeLoggedInDescription")}</AlertDescription>
      </Alert>
    );
  }

  if (isAlreadyConfirmed) {
    return (
      <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-800 dark:text-green-200">{t("alreadyConfirmed")}</AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-300">
          {t("alreadyConfirmedDescription")}
        </AlertDescription>
      </Alert>
    );
  }

  if (isFull) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("reservationFull")}</AlertTitle>
        <AlertDescription>{t("reservationFullDescription")}</AlertDescription>
      </Alert>
    );
  }

  if (state.status === "success") {
    return (
      <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-800 dark:text-green-200">{t("confirmed")}</AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-300">{t("confirmedDescription")}</AlertDescription>
      </Alert>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="visitId" value={visitId} />
      <input type="hidden" name="clientId" value={clientProfile.id} />
      <input type="hidden" name="businessId" value={businessId} />

      <Card className="gap-2 shadow-primary/50">
        <CardContent className="py-6 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">{t("confirmAsCompanion")}</p>
            <p className="font-medium">{clientProfile.name || clientProfile.username || clientProfile.email}</p>
          </div>

          <Button type="submit" disabled={pending || isFull || isAlreadyConfirmed} className="w-full" size="lg">
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("confirming")}
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {t("confirmButton")}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
