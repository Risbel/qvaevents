"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ArrowDownRightFromSquare, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

interface Companion {
  id: number;
  clientId: number;
  ClientProfile: {
    id: number;
    name: string | null;
    email: string | null;
    phone: string | null;
    username: string | null;
    avatar: string | null;
  };
}

interface CompanionsPopoverProps {
  companions: Companion[];
  totalCompanions: number;
}

const CompanionsPopover = ({ companions, totalCompanions }: CompanionsPopoverProps) => {
  const t = useTranslations("VisitsPage");
  const confirmedCount = companions.length;

  const getUserAvatar = (companion: Companion) => {
    if (companion.ClientProfile?.avatar) return companion.ClientProfile.avatar;
    const name = companion.ClientProfile?.name || companion.ClientProfile?.username || "User";
    const twoFirstLetters = name.slice(0, 2).toUpperCase();
    return `https://avatar.vercel.sh/${encodeURIComponent(name)}.svg?rounded=60&size=30&text=${twoFirstLetters}`;
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-center gap-2">
      <Users className="h-3 w-3 text-muted-foreground" />
      <Badge variant={confirmedCount >= totalCompanions ? "default" : "secondary"} className="text-xs">
        {confirmedCount} / {totalCompanions}
      </Badge>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
            <ArrowDownRightFromSquare className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-2 border-b bg-muted/50">
            <h4 className="font-semibold text-sm">
              {t("companions")} ({confirmedCount})
            </h4>
          </div>
          {companions.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">{t("noCompanionsConfirmed")}</div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full">
                <tbody>
                  {companions.map((companion) => (
                    <tr key={companion.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-1">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={getUserAvatar(companion)} />
                            <AvatarFallback>
                              {getInitials(companion.ClientProfile?.username || companion.ClientProfile?.name || "U")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate border-r pr-2">
                                {companion.ClientProfile?.name ||
                                  companion.ClientProfile?.username ||
                                  t("unknownCompanion")}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {companion.ClientProfile?.username || "No username"}
                              </p>
                            </div>

                            <p className="text-xs text-muted-foreground truncate">
                              {companion.ClientProfile?.email || "No email"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {companion.ClientProfile?.phone || "No phone"}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CompanionsPopover;
