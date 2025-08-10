"use client";

import { SubscriptionStatus, getSubscriptionStatusText, getSubscriptionStatusColor } from "@/utils/subscriptionStatus";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export default function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  const t = useTranslations("Profile");

  return (
    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getSubscriptionStatusColor(status))}>
      {getSubscriptionStatusText(status, t)}
    </span>
  );
}
