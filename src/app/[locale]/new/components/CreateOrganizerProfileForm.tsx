"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Building, Plus } from "lucide-react";
import { createOrganizerProfileAction } from "@/actions/auth/createOrganizerProfile";
import { State } from "@/types/state";
import { useParams } from "next/navigation";

export default function CreateOrganizerProfileForm() {
  const t = useTranslations("Profile");
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const initialState: State = { message: "", status: undefined };
  const [state, formAction, isPending] = useActionState(createOrganizerProfileAction, initialState);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      router.push(`/${locale}/profile`);
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          <CardTitle>{t("createOrganizerProfile")}</CardTitle>
        </div>
        <CardDescription>{t("createOrganizerProfileDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">{t("companyName")} *</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder={t("companyNamePlaceholder")}
                required
                className={state.errors?.companyName ? "border-destructive" : ""}
              />
              {state.errors?.companyName && <p className="text-sm text-destructive">{state.errors.companyName[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyType">{t("companyType")} *</Label>
              <Input
                id="companyType"
                name="companyType"
                placeholder={t("companyTypePlaceholder")}
                required
                className={state.errors?.companyType ? "border-destructive" : ""}
              />
              {state.errors?.companyType && <p className="text-sm text-destructive">{state.errors.companyType[0]}</p>}
            </div>
          </div>

          <div className="flex justify-center items-center">
            <Button type="submit" disabled={isPending} className="cursor-pointer">
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("creating")}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {t("createOrganizerProfile")}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
