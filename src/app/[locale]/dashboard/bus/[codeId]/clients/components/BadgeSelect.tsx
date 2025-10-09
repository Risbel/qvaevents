"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Crown, User2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import useSupabase from "@/hooks/use-supabase";

type BadgeType = "REGULAR" | "VIP";

const isBadgeType = (badge: string | null | undefined): badge is BadgeType => {
  return badge === "REGULAR" || badge === "VIP";
};

interface BadgeSelectProps {
  clientId: number;
  initialBadge?: string | null;
}

const BadgeSelect = ({ clientId, initialBadge }: BadgeSelectProps) => {
  const t = useTranslations("ClientsPage");
  const supabase = useSupabase();
  const [currentBadge, setCurrentBadge] = useState<BadgeType>(isBadgeType(initialBadge) ? initialBadge : "REGULAR");
  const [isPending, startTransition] = useTransition();

  const handleBadgeChange = async (newBadge: BadgeType) => {
    // Optimistically update UI
    setCurrentBadge(newBadge);

    startTransition(async () => {
      try {
        const { error } = await supabase.from("clientOnOrganizer").update({ badge: newBadge }).eq("id", clientId);

        if (error) throw error;
        toast.success(t("badges.badgeUpdated"));
      } catch (error) {
        // Revert UI state on error
        setCurrentBadge(isBadgeType(initialBadge) ? initialBadge : "REGULAR");
        toast.error(t("badges.badgeUpdateError"));
      }
    });
  };

  return (
    <div className="flex w-full justify-between items-center">
      <Badge variant="secondary" className="text-xs flex items-center gap-1">
        {currentBadge === "VIP" ? (
          <>
            <Crown className="h-3 w-3 text-yellow-500" />
            VIP
          </>
        ) : (
          <>
            <User2 className="h-3 w-3 text-muted-foreground" />
            {t("badges.regular")}
          </>
        )}
      </Badge>
      <Select value={currentBadge} onValueChange={(value: BadgeType) => handleBadgeChange(value)} disabled={isPending}>
        <SelectTrigger className="w-fit absolute right-2 top-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent dir="rtl">
          <SelectItem dir="ltr" value="REGULAR" className="flex items-center gap-1">
            <User2 className="h-3 w-3 text-muted-foreground" />
            {t("badges.regular")}
          </SelectItem>
          <SelectItem dir="ltr" value="VIP" className="flex items-center gap-1">
            <Crown className="h-3 w-3 text-yellow-500" />
            VIP
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default BadgeSelect;
