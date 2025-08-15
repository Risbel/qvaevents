import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, ExternalLink, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Business, getOrganizerBusinesses } from "@/queries/business/getOrganizerBusinesses";

export default async function BusinessList({ organizerId, locale }: { organizerId: number; locale: string }) {
  const t = await getTranslations("Dashboard");

  const businessesResult = await getOrganizerBusinesses(organizerId);

  if (businessesResult.status === "error") {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <p className="text-destructive">{t("errorLoadingBusinesses")}</p>
      </div>
    );
  }

  const businesses = businessesResult.data?.businesses as Business[];

  if (businesses.length === 0) {
    return (
      <div className="text-center py-8">
        <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t("noBusinesses")}</h3>
        <p className="text-muted-foreground mb-4">{t("noBusinessesDescription")}</p>
        <Button asChild>
          <Link href={`/${locale}/new/${organizerId}`}>
            <Building2 className="w-4 h-4 mr-2" />
            {t("createFirstBusiness")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {businesses.map((business) => (
        <Card key={business.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">{business.name}</CardTitle>
              </div>
              <Badge variant={business.isActive ? "default" : "secondary"}>
                {business.isActive ? t("active") : t("inactive")}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">{business.description || t("noDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("slug")}:</span>
                <code className="bg-muted px-2 py-1 rounded text-xs">/{business.slug}</code>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("created")}:</span>
                <span>{new Date(business.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href={`/${locale}/${business.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t("viewBusiness")}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href={`/${locale}/dashboard/bus/${business.codeId}`}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    {t("dashboard")}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
