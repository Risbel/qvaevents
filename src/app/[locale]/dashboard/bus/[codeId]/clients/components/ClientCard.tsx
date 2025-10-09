"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { Mail, Phone, Calendar } from "lucide-react";
import BadgeSelect from "./BadgeSelect";

type ClientOnOrganizerWithProfile = Tables<"clientOnOrganizer"> & {
  ClientProfile: Tables<"ClientProfile">;
};

interface ClientCardProps {
  client: ClientOnOrganizerWithProfile;
}

const ClientCard = ({ client }: ClientCardProps) => {
  const t = useTranslations("ClientsPage");

  const getUserAvatar = () => {
    if (client.ClientProfile?.avatar) return client.ClientProfile.avatar;
    const name = encodeURIComponent(client.ClientProfile?.name || client.ClientProfile?.username || "User");
    const twoFirstLetters = (client.ClientProfile?.name || client.ClientProfile?.username || "U")
      .slice(0, 2)
      .toUpperCase();
    return `https://avatar.vercel.sh/${name}.svg?rounded=60&size=30&text=${twoFirstLetters}`;
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Card className="py-2">
      <CardContent className="flex items-center justify-between relative px-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={getUserAvatar()} />
            <AvatarFallback>{getInitials(client.ClientProfile?.username || "")}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex w-full justify-between items-center gap-2">
              <p className="font-medium leading-4">{client.ClientProfile?.name || client.ClientProfile?.username}</p>
              <BadgeSelect clientId={client.id} initialBadge={client.badge} />
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
              <div className="flex items-center gap-1 text-xs md:border-r md:pr-2">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-accent-foreground">{client.ClientProfile?.email || "No email"}</p>
              </div>

              <div className="flex items-center gap-1 text-xs">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-accent-foreground">{client.ClientProfile?.phone || "No phone"}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {t("registeredOn")}:{" "}
                <span className="text-accent-foreground">{format(new Date(client.createdAt), "PPp")}</span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
