import { Tables } from "@/types/supabase";

export type Subscription = Tables<"Subscription">;

export function getSubscriptionStatusText(status: Subscription["status"], t: any): string {
  switch (status) {
    case 0:
      // expired
      return t("statusExpired");
    case 1:
      // active
      return t("statusActive");
    case 2:
      // trialing
      return t("statusTrialing");
    case 3:
      // canceled
      return t("statusCanceled");
    case 4:
      // paused
      return t("statusPaused");
    default:
      // unknown
      return t("statusUnknown");
  }
}

export function getSubscriptionStatusColor(status: Subscription["status"]): string {
  switch (status) {
    case 0: // expired
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case 1: // active
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case 2: // trialing
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case 3: // canceled
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    case 4: // paused
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
}
