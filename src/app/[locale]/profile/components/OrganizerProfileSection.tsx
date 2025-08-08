"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building, Image } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import EditOrganizerProfileModal from "./EditOrganizerProfileModal";
import EmptyState from "./EmptyState";

interface OrganizerProfile {
  id: number;
  isDeleted: boolean;
  isActive: boolean;
  updatedAt: string;
  user_id: string;
  createdAt: string;
  companyName: string;
  companyType: string;
  companyLogo: string;
}

interface OrganizerProfileSectionProps {
  user: SupabaseUser;
  organizerProfile: OrganizerProfile | null;
  hasError: boolean;
}

export default function OrganizerProfileSection({ user, organizerProfile, hasError }: OrganizerProfileSectionProps) {
  const t = useTranslations("Profile");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (hasError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Building className="w-5 h-5" />
            {t("organizerProfile")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive">{t("errorLoading")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!organizerProfile) {
    return <EmptyState />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            <CardTitle className="text-xl">{t("organizerProfile")}</CardTitle>
          </div>
          <EditOrganizerProfileModal profile={organizerProfile} />
        </div>
        <CardDescription>{t("organizerProfileDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={organizerProfile.companyLogo} />
              <AvatarFallback className="text-lg">
                {getInitials(organizerProfile.companyName || user.user_metadata?.full_name || user.email || "")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-muted-foreground">{organizerProfile.companyType || t("noCompanyType")}</p>
              <h3 className="text-lg font-semibold">{organizerProfile.companyName || t("noCompanyName")}</h3>
            </div>
          </div>

          {organizerProfile.companyLogo && (
            <div className="space-y-2">
              <Label>{t("companyLogo")}</Label>
              <div className="flex items-center space-x-2">
                <Image className="w-4 h-4 text-muted-foreground" />
                <a
                  href={organizerProfile.companyLogo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {organizerProfile.companyLogo}
                </a>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
