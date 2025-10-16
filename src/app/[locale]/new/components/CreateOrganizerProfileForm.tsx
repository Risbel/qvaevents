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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Loader2, Plus, UserCheck2Icon } from "lucide-react";
import { createOrganizerProfile } from "@/actions/auth/createOrganizerProfile";
import { State } from "@/types/state";
import { useParams } from "next/navigation";
import { PlanWithPrices } from "@/queries/server/getPlansWithAssets";
import { Tables } from "@/types/supabase";
import AssetsSelector from "./AssetsSelector";

type Asset = Tables<"Asset">;

export default function CreateOrganizerProfileForm({ plans, assets }: { plans: PlanWithPrices[]; assets: Asset[] }) {
  const t = useTranslations("Profile");
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const initialState: State = { status: undefined };
  const [state, formAction, isPending] = useActionState(createOrganizerProfile, initialState);

  // Form state
  const [billingCycle, setBillingCycle] = useState<string>("1");
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  // Filter plans based on billing cycle
  const filteredPlans = plans.filter((plan) => plan.billingCycle === parseInt(billingCycle));

  // Auto-select first asset when assets are available and no selection exists
  const selectedAssetIdOrFirst = selectedAssetId || assets?.[0]?.id.toString() || "";

  // Get the selected plan price ID based on current selections
  const selectedPlanPriceId = (() => {
    if (!selectedPlanId || !selectedAssetIdOrFirst) return "";

    const plan = filteredPlans.find((p) => p.id.toString() === selectedPlanId);
    const planPrice = plan?.PlanPrice.find((price) => price.Asset.id.toString() === selectedAssetIdOrFirst);

    return planPrice?.id.toString() || "";
  })();

  // Simple event handlers - no complex state synchronization needed
  const handleBillingCycleChange = (value: string) => {
    setBillingCycle(value);
    setSelectedPlanId(""); // Reset plan when billing cycle changes
  };

  const handleAssetChange = (value: string) => {
    setSelectedAssetId(value);
    // Don't reset plan - let the derived state handle the planPriceId
  };

  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
  };

  // Auto-select first asset when assets are available
  useEffect(() => {
    if (assets && assets.length > 0 && !selectedAssetId) {
      setSelectedAssetId(assets[0].id.toString());
    }
  }, [assets, selectedAssetId]);

  // Handle form submission success/error
  useEffect(() => {
    if (state.status === "success") {
      toast.success(t("createSuccess"));
      router.push(`/${locale}/profile`);
    } else if (state.status === "error") {
      toast.error(t("createError"));
    }
  }, [state]);

  return (
    <Card className="shadow-primary/30 shadow-lg">
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

          <div className={`flex flex-wrap items-center gap-4`}>
            <div className="space-y-2 border-r pr-4">
              <Label>{t("billingCycle")}</Label>
              <RadioGroup value={billingCycle} onValueChange={handleBillingCycleChange} className="flex flex-row gap-6">
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

            <AssetsSelector
              assets={assets}
              selectedAsset={selectedAssetIdOrFirst}
              onAssetChange={handleAssetChange}
              showLabel={true}
              labelText="Currency"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="planId">{t("selectPlan")} *</Label>
            <Select name="planId" required value={selectedPlanId} onValueChange={handlePlanChange}>
              <SelectTrigger className={state.errors?.planId ? "border-destructive" : ""}>
                <SelectValue placeholder={t("selectPlanPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {selectedAssetIdOrFirst ? (
                  filteredPlans
                    .filter((plan) => {
                      // Only show plans that have pricing for the selected asset
                      return plan.PlanPrice.some((price) => price.Asset.id.toString() === selectedAssetIdOrFirst);
                    })
                    .map((plan) => {
                      const planPrice = plan.PlanPrice.find(
                        (price) => price.Asset.id.toString() === selectedAssetIdOrFirst
                      );
                      const asset = planPrice?.Asset;
                      const amount = planPrice?.amount || 0;

                      return (
                        <SelectItem key={plan.id} value={plan.id.toString()}>
                          <span className="font-bold text-primary">{plan.name}</span> - {asset?.symbol}
                          {amount}/{billingCycle === "0" ? t("month") : billingCycle === "3" ? t("quarter") : t("year")}
                          {asset?.code ? ` (${asset.code})` : ""}
                        </SelectItem>
                      );
                    })
                ) : (
                  <SelectItem value="" disabled>
                    Select a currency first
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {/* Use controlled inputs instead of hidden inputs */}
            <input name="planId" type="hidden" value={selectedPlanId} required />
            <input name="planPriceId" type="hidden" value={selectedPlanPriceId} required />
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
                <>{t("createOrganizerProfileButton")}</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
