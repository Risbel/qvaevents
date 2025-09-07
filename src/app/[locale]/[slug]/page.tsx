import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getBusinessBySlug, BusinessWithOrganizer } from "@/queries/business/getBusinessBySlug";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar, MapPin, Phone, Globe, Mail } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function BusinessPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const t = await getTranslations("Business");

  const businessResult = await getBusinessBySlug(slug);

  if (businessResult.status === "error") {
    notFound();
  }

  const business = businessResult.data?.business as BusinessWithOrganizer;
  const organizer = business?.OrganizerProfile;

  if (!business || !organizer) {
    notFound();
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Business Logo/Image */}
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 lg:h-32 lg:w-32 border-4 border-background shadow-lg">
                <AvatarImage src={organizer.companyLogo || undefined} />
                <AvatarFallback className="text-2xl lg:text-3xl bg-primary/10">
                  {getInitials(business.name || organizer.companyName || "Business")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Business Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{business.name}</h1>
                  <p className="text-lg text-muted-foreground">
                    {organizer.companyName} • {organizer.companyType}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full md:max-w-xl lg:max-w-7xl mx-auto px-4 py-12">
        <Card className="gap-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              {t("about")} {business.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {business.description ? (
                <p className="text-muted-foreground leading-relaxed">{business.description}</p>
              ) : (
                <p className="text-muted-foreground italic">{t("noDescription")}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t("upcomingEvents")}
            </CardTitle>
            <CardDescription>{t("upcomingEventsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("noEventsYet")}</h3>
              <p className="text-muted-foreground">{t("noEventsDescription")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
