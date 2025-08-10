import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { getOrganizerProfile, OrganizerProfile, Subscription } from "@/queries/organizer/geyOrganizerProfile";
import { getTranslations } from "next-intl/server";
import SubscriptionStatusBadge from "@/app/components/SubscriptionStatusBadge";
import { getOrganizerSubscription } from "@/queries/organizer/getOrganizerSubscription";

interface SubscriptionInfoProps {
  user: SupabaseUser;
}

export default async function SubscriptionInfo({ user }: SubscriptionInfoProps) {
  const t = await getTranslations("Profile");

  const organizerProfileResult = await getOrganizerProfile(user.id);

  if (organizerProfileResult.status === "error" || !organizerProfileResult.data?.organizerProfile) {
    return null;
  }

  const organizerProfile = organizerProfileResult.data.organizerProfile as OrganizerProfile;

  const subscriptionResult = await getOrganizerSubscription(organizerProfile.id);

  if (subscriptionResult.status === "error" || !subscriptionResult.data?.subscription) {
    return null;
  }

  const subscription = subscriptionResult.data.subscription as Subscription;

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          <CardTitle className="text-xl">{t("subscription")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("plan")}</span>
              <span className="font-medium">{subscription.Plan.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("price")}</span>
              <span className="font-medium">
                ${subscription.Plan.price}/{t("month")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("status")}</span>
              <SubscriptionStatusBadge status={subscription.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("expiresAt")}</span>
              <span className="font-medium">{new Date(subscription.expDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
