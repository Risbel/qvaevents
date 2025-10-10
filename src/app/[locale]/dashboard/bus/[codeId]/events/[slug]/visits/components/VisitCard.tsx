"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { Mail, Phone, Users } from "lucide-react";

type VisitWithProfile = Tables<"Visit"> & {
  ClientProfile: Tables<"ClientProfile">;
  ClientCompanion: Array<{
    id: number;
    clientId: number;
    ClientProfile: Tables<"ClientProfile">;
  }>;
};

interface VisitCardProps {
  visit: VisitWithProfile;
}

const VisitCard = ({ visit }: VisitCardProps) => {
  const tStatus = useTranslations("status");
  const t = useTranslations("VisitsPage");

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

  return (
    <Card className="py-2">
      <CardContent className="flex items-center justify-between relative px-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={getUserAvatar()} />
            <AvatarFallback>{getInitials(visit.ClientProfile?.username || "")}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium leading-4"> {visit.ClientProfile?.name}</p>

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
            {hasCompanions && confirmedCount > 0 && (
              <div className="flex items-center flex-wrap space-x-2">
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
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 absolute right-2 top-0">
          <div className="flex items-center gap-2">
            {visit.isConfirmed && <Badge variant="outline">{tStatus("confirmed")}</Badge>}
            {visit.isAttended && <Badge variant="outline">{tStatus("attended")}</Badge>}
            {visit.isCanceled && <Badge variant="destructive">{tStatus("canceled")}</Badge>}
            {!visit.isConfirmed && !visit.isAttended && !visit.isCanceled && (
              <Badge variant="outline">{tStatus("pending")}</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitCard;
