"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2, Plus, UserCheck2Icon } from "lucide-react";
import { createOrganizerProfile } from "@/actions/auth/createOrganizerProfile";
import { State } from "@/types/state";
import { useParams } from "next/navigation";
import { Plan } from "@/queries/server/getPlans";

export default function CreateOrganizerProfileForm({ plans }: { plans: Plan[] }) {
  const t = useTranslations("Profile");
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const initialState: State = { status: undefined };
  const [state, formAction, isPending] = useActionState(createOrganizerProfile, initialState);
  const [billingCycle, setBillingCycle] = useState<string>("1"); // 0 = monthly, 1 = yearly, 3 = quarterly

  // Filter plans based on billing cycle
  const filteredPlans = plans.filter((plan) => plan.billingCycle === parseInt(billingCycle));

  useEffect(() => {
    if (state.status === "success") {
      toast.success(t("createSuccess"));
      router.push(`/${locale}/profile`);
    } else if (state.status === "error") {
      toast.error(t("createError"));
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserCheck2Icon className="w-5 h-5" />
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

          <div className="space-y-2">
            <Label>{t("billingCycle")}</Label>
            <RadioGroup value={billingCycle} onValueChange={setBillingCycle} className="flex flex-row gap-8">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="yearly" className="cursor-pointer" />
                <Label htmlFor="yearly" className="cursor-pointer">
                  {t("yearly")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="monthly" className="cursor-pointer" />
                <Label htmlFor="monthly" className="cursor-pointer">
                  {t("monthly")}
                </Label>
              </div>
              {/* <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="quarterly" className="cursor-pointer" />
                <Label htmlFor="quarterly" className="cursor-pointer">
                  {t("quarterly")}
                </Label>
              </div> */}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="planId">{t("selectPlan")} *</Label>
            <Select
              name="planId"
              required
              onValueChange={(value: string) => {
                // Update hidden input when select value changes
                const hiddenInput = document.getElementById("planId") as HTMLInputElement;
                if (hiddenInput) {
                  hiddenInput.value = value;
                }
              }}
            >
              <SelectTrigger className={state.errors?.planId ? "border-destructive" : ""}>
                <SelectValue placeholder={t("selectPlanPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {filteredPlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id.toString()}>
                    {plan.name} - ${plan.price}/
                    {billingCycle === "0" ? t("month") : billingCycle === "3" ? t("quarter") : t("year")} -{" "}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input id="planId" name="planId" type="hidden" required />
            <input id="billingCycle" name="billingCycle" type="hidden" value={billingCycle} required />
            {state.errors?.planId && <p className="text-sm text-destructive">{state.errors.planId[0]}</p>}
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
                  {t("createOrganizerProfileButton")}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
