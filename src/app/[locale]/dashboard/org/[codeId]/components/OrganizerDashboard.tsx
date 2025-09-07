import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2 } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import BusinessList from "./BusinessList";
import { OrganizerProfile } from "@/queries/organizer/getOrganizerProfile";

interface OrganizerDashboardProps {
  codeId: string;
  organizer: OrganizerProfile;
  locale: string;
}

export default async function OrganizerDashboard({ codeId, organizer, locale }: OrganizerDashboardProps) {
  const t = await getTranslations("Dashboard");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Avatar className="h-12 w-12 md:h-16 md:w-16">
              <AvatarImage src={organizer.companyLogo || undefined} />
              <AvatarFallback className="text-lg">{getInitials(organizer.companyName || "")}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg md:text-xl">{organizer.companyName}</CardTitle>
              <CardDescription>{organizer.companyType}</CardDescription>
            </div>
          </div>
          <div className="flex justify-end">
            <Button asChild size="sm" className="max-w-fit">
              <Link href={`/${locale}/new/${organizer.codeId}`}>{t("createBusiness")}</Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Businesses Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <CardTitle>{t("businesses")}</CardTitle>
            </div>
          </div>
          <CardDescription>{t("businessesDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <BusinessList codeId={codeId} organizerId={organizer.id} locale={locale} />
        </CardContent>
      </Card>
    </div>
  );
}
