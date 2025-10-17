import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, UserCheck2 } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import EditOrganizerProfileModal from "./EditOrganizerProfileModal";
import { getOrganizerProfile, OrganizerProfile } from "@/queries/server/organizer/getOrganizerProfile";
import { getTranslations } from "next-intl/server";
import EmptyState from "./EmptyState";
import ProfilePictureUpload from "./ProfilePictureUpload";
import ProfilePictureDelete from "./ProfilePictureDelete";
import Link from "next/link";
import Image from "next/image";

interface OrganizerProfileInfoProps {
  user: SupabaseUser;
  locale: string;
}

export default async function OrganizerProfileInfo({ user, locale }: OrganizerProfileInfoProps) {
  const t = await getTranslations("Profile");

  const organizerProfileResult = await getOrganizerProfile(user.id);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (organizerProfileResult.status === "error") {
    return (
      <Card className="shadow-md shadow-primary/40">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <UserCheck2 className="w-5 h-5" />
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

  const organizerProfile = organizerProfileResult.data?.organizerProfile as OrganizerProfile | null;

  if (!organizerProfile) {
    return <EmptyState />;
  }

  return (
    <Card className="shadow-md shadow-primary/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck2 className="w-5 h-5" />
            <CardTitle className="text-xl">{t("organizerProfile")}</CardTitle>
          </div>
          <EditOrganizerProfileModal profile={organizerProfile} />
        </div>
        <CardDescription>{t("organizerProfileDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={organizerProfile.logo || undefined} />
                <AvatarFallback className="text-lg">
                  {getInitials(organizerProfile.companyName || user.user_metadata?.full_name || user.email || "")}
                </AvatarFallback>
              </Avatar>
              {organizerProfile.logo ? (
                <ProfilePictureDelete organizerId={organizerProfile.id} logoUrl={organizerProfile.logo} />
              ) : (
                <ProfilePictureUpload organizerId={organizerProfile.id} />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{organizerProfile.companyName || t("noCompanyName")}</h3>
              <p className="text-muted-foreground">{organizerProfile.companyType || t("noCompanyType")}</p>
            </div>
          </div>

          <Button asChild size="sm">
            <Link href={`/${locale}/dashboard/org/${organizerProfile.codeId}`}>
              <LayoutDashboard className="w-4 h-4" />
              {t("viewDashboard")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
