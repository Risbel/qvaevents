"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreVertical, UserCheck2, XCircle } from "lucide-react";
import { Tables } from "@/types/supabase";
import { useTranslations } from "next-intl";
import { markAsAttended } from "@/actions/visit/markAsAttended";
import { cancelVisit } from "@/actions/visit/cancelVisit";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

type VisitWithProfile = Tables<"Visit"> & {
  ClientProfile: Tables<"ClientProfile">;
  ClientCompanion: Array<{
    id: number;
    clientId: number;
    ClientProfile: Tables<"ClientProfile">;
  }>;
  clientVisitAffiliated: {
    id: number;
    clientId: number;
    createdAt: string;
    ClientProfile: Tables<"ClientProfile">;
  } | null;
};

interface VisitActionsProps {
  visit: VisitWithProfile;
}

const VisitActions = ({ visit }: VisitActionsProps) => {
  const t = useTranslations("VisitsPage");
  const tActions = useTranslations("actions");
  const { slug } = useParams() as { slug: string };
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const handleMarkAsAttended = () => {
    startTransition(async () => {
      try {
        await markAsAttended(visit.id);
        toast.success(t("attendedSuccess"));
        queryClient.invalidateQueries({ queryKey: ["visits", slug] });
        setIsOpen(false);
      } catch (error) {
        toast.error(t("attendedError"));
      }
    });
  };

  const handleCancelVisit = () => {
    startTransition(async () => {
      try {
        await cancelVisit(visit.id);
        toast.success(t("cancelSuccess"));
        queryClient.invalidateQueries({ queryKey: ["visits", slug] });
        setIsOpen(false);
      } catch (error) {
        toast.error(t("cancelError"));
      }
    });
  };

  if (visit.isCanceled || visit.isAttended) {
    return <span className="text-sm text-muted-foreground">-</span>;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="cursor-pointer h-8 w-8" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!visit.isAttended && (
          <DropdownMenuItem onClick={handleMarkAsAttended} disabled={isPending} className="cursor-pointer">
            <UserCheck2 className="h-4 w-4 text-green-500 mr-2" />
            {t("markAsAttended")}
          </DropdownMenuItem>
        )}

        {!visit.isAttended && <DropdownMenuSeparator />}

        <DropdownMenuItem onClick={handleCancelVisit} disabled={isPending} className="cursor-pointer">
          <XCircle className="h-4 w-4 text-destructive mr-2" />
          {tActions("cancel")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VisitActions;
