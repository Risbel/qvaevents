"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { Mail, Phone, Users, Loader2, UserCheck2, MoreVertical, CheckCircle2Icon, XCircle } from "lucide-react";
import { useTransition } from "react";
import { markAsAttended } from "@/actions/visit/markAsAttended";
import { cancelVisit } from "@/actions/visit/cancelVisit";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

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
  };
};

const VisitCard = ({ visit }: { visit: VisitWithProfile }) => {
  const tStatus = useTranslations("status");
  const tActions = useTranslations("actions");
  const { slug } = useParams() as { slug: string };
  const t = useTranslations("VisitsPage");
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const companions = visit.ClientCompanion || [];
  const confirmedCount = companions.length;
  const totalCompanions = visit.companionsCount || 0;
  const hasCompanions = totalCompanions > 0;

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const username = visit.ClientProfile?.username || visit.ClientProfile?.name || "User";
  const twoFirstLetters = username.slice(0, 2).toUpperCase();

  const getUserAvatar = () => {
    if (!visit.ClientProfile?.avatar)
      return `https://avatar.vercel.sh/${username}.svg?rounded=60&size=30&text=${twoFirstLetters}`;
    return visit.ClientProfile?.avatar;
  };

  const handleMarkAsAttended = () => {
    startTransition(async () => {
      try {
        await markAsAttended(visit.id);
        toast.success(t("attendedSuccess"));
        queryClient.invalidateQueries({ queryKey: ["visits", slug] });
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
      } catch (error) {
        toast.error(t("cancelError"));
      }
    });
  };

  return (
    <Card className={cn("py-2", visit.isCanceled && "bg-red-500/10")}>
      <CardContent className="flex items-center justify-between relative px-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={getUserAvatar()} />
            <AvatarFallback>{getInitials(visit.ClientProfile?.username || "")}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold"> {visit.ClientProfile?.name}</p>
              {visit.clientVisitAffiliated && (
                <div className="flex items-center gap-1 border-l pl-2">
                  <p className="text-xs text-muted-foreground">{t("Filter.affiliatedWith")}:</p>
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    {visit.clientVisitAffiliated?.ClientProfile?.username}
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
              <div className="flex items-center gap-1 text-xs md:border-r md:pr-2">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-accent-foreground">{visit.ClientProfile?.email || "No email"}</p>
              </div>

              <div className="flex items-center gap-1 text-xs">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-accent-foreground">{visit.ClientProfile?.phone || "No phone"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">
                {tStatus("reservedOn")}:{" "}
                <span className="text-accent-foreground">{format(new Date(visit.createdAt), "PPp")}</span>
              </p>
            </div>
            {/* Companions Section */}
            {hasCompanions && (
              <div className="flex items-center flex-wrap space-x-2 mr-10">
                <Users className="h-3 w-3 text-muted-foreground" />{" "}
                <span className="text-xs text-muted-foreground border-r pr-2">
                  {t("companions")}: {totalCompanions}
                </span>
                <span className="text-xs text-muted-foreground">
                  {tStatus("confirmed", { count: confirmedCount })}:
                </span>
                <Badge variant={confirmedCount >= totalCompanions ? "default" : "secondary"} className="text-[10px]">
                  {confirmedCount} / {totalCompanions}
                </Badge>{" "}
                {confirmedCount > 0 && (
                  <div className="flex flex-wrap gap-1 max-w-[200px] justify-end">
                    {companions.map((companion) => (
                      <Badge key={companion.id} variant="outline" className="text-[10px]">
                        {companion.ClientProfile?.name ||
                          companion.ClientProfile?.username ||
                          companion.ClientProfile?.email ||
                          t("unknownCompanion")}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 items-start absolute right-2 top-0">
          <div className="flex items-center gap-2">
            {visit.isConfirmed && <Badge variant="outline">{tStatus("confirmed")}</Badge>}
            {visit.isAttended && (
              <Badge className="bg-green-500">
                {tStatus("attended")} <CheckCircle2Icon />
              </Badge>
            )}
            {visit.isCanceled && (
              <Badge className="bg-red-500">
                {tStatus("canceled")} <XCircle className="h-4 w-4 text-white" />
              </Badge>
            )}
            {!visit.isConfirmed && !visit.isAttended && !visit.isCanceled && (
              <Badge variant="outline">{tStatus("pending")}</Badge>
            )}
          </div>
        </div>
        {!visit.isCanceled && !visit.isAttended && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="absolute right-2 bottom-0">
              <Button size="icon" variant="outline" className="cursor-pointer" disabled={isPending}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!visit.isAttended && (
                <DropdownMenuItem onClick={handleMarkAsAttended} disabled={isPending} className="cursor-pointer">
                  <UserCheck2 className="h-4 w-4 text-green-400" />
                  {t("markAsAttended")}
                </DropdownMenuItem>
              )}

              {!visit.isAttended && <DropdownMenuSeparator />}

              <DropdownMenuItem onClick={handleCancelVisit} disabled={isPending} className="cursor-pointer">
                <XCircle className="h-4 w-4 text-destructive" />
                {tActions("cancel")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardContent>
    </Card>
  );
};

export default VisitCard;
