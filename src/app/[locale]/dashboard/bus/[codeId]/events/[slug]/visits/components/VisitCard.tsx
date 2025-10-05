"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { Mail, Phone } from "lucide-react";

type VisitWithProfile = Tables<"Visit"> & {
  ClientProfile: Tables<"ClientProfile">;
};

interface VisitCardProps {
  visit: VisitWithProfile;
}

const VisitCard = ({ visit }: VisitCardProps) => {
  const tStatus = useTranslations("status");

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <Card className="py-2">
      <CardContent className="flex items-center justify-between relative px-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={visit.ClientProfile.avatar || undefined} />
            <AvatarFallback>{getInitials(visit.ClientProfile.username)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium leading-4"> {visit.ClientProfile.name}</p>

            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
              <div className="flex items-center gap-1 text-xs md:border-r md:pr-2">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-accent-foreground">{visit.ClientProfile.email || "No email"}</p>
              </div>

              <div className="flex items-center gap-1 text-xs">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-accent-foreground">{visit.ClientProfile?.phone || "No phone"}</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {tStatus("reservedOn")}:{" "}
              <span className="text-accent-foreground">{format(new Date(visit.createdAt), "PPp")}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 absolute right-2 top-0">
          {visit.isConfirmed && <Badge variant="outline">{tStatus("confirmed")}</Badge>}
          {visit.isAttended && <Badge variant="outline">{tStatus("attended")}</Badge>}
          {visit.isCanceled && <Badge variant="destructive">{tStatus("canceled")}</Badge>}
          {!visit.isConfirmed && !visit.isAttended && !visit.isCanceled && (
            <Badge variant="outline">{tStatus("pending")}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitCard;
