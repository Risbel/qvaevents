import { getVisitByCode } from "@/queries/server/visit/getVisitByCode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, MapPin, User, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { EventDateTime } from "@/app/components/EventDateTime";
import { getTranslations } from "next-intl/server";
import LocaleSwitcher from "@/app/components/LocaleSwitcher";
import ModeToggle from "@/app/components/ModeToggle";
import ClientsUserDropdown from "@/app/components/ClientsUserDropdown";
import Link from "next/link";
import Image from "next/image";
import ConfirmCompanionForm from "./components/ConfirmCompanionForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EventTextProvider } from "../../components/EventTextProvider";
import EventTitleConfirm from "./components/EventTitleConfirm";
import EventLocationConfirm from "./components/EventLocationConfirm";

const ConfirmCompanionPage = async ({
  params,
}: {
  params: Promise<{ slug: string; code: string; locale: string }>;
}) => {
  const { slug, code, locale } = await params;
  const t = await getTranslations("ConfirmCompanionPage");

  const visitResult = await getVisitByCode(code);

  if (!visitResult || visitResult.status !== "success" || !visitResult.data?.visit) {
    notFound();
  }

  const visit = visitResult.data.visit;
  const event = visit.Event;
  const organizer = visit.ClientProfile;
  const companions = visit.ClientCompanion || [];
  const currentCompanionsCount = companions.length;
  const maxCompanions = visit.companionsCount;

  const getUserAvatar = (user: { avatar?: string | null; name?: string | null; email?: string | null }) => {
    if (user.avatar) return user.avatar;
    const name = encodeURIComponent(user.name || user.email || "User");
    const twoFirstLetters = (user.name || user.email || "U").slice(0, 2).toUpperCase();
    return `https://avatar.vercel.sh/${name}.svg?rounded=60&size=30&text=${twoFirstLetters}`;
  };

  const getInitials = (name?: string | null) => {
    return (name || "U").slice(0, 2).toUpperCase();
  };

  return (
    <EventTextProvider eventTexts={event.EventText} defaultLocale={event.defaultLocale}>
      <nav className="flex flex-1 justify-between items-center space-x-2 px-2 md:px-4 py-2 sticky top-0 z-50 bg-background/50 backdrop-blur-sm border-b">
        <div className="flex items-center gap-2">
          {event.Business.logo && (
            <Image src={event.Business.logo} alt={event.Business.name || "Business Logo"} width={32} height={32} />
          )}
          <Link className="font-bold" href={`/${locale}/${event.Business.slug}`}>
            {event.Business.name}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ModeToggle />
          <ClientsUserDropdown />
        </div>
      </nav>

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pb-24 pt-6 max-w-2xl">
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{t("title")}</h1>
              <p className="text-muted-foreground">{t("description")}</p>
            </div>

            {/* Event Card */}
            <Card className="gap-2 shadow-primary/50">
              <CardHeader>
                <CardTitle className="text-xl">
                  <EventTitleConfirm />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <EventDateTime
                    startDate={event.startDate}
                    endDate={event.endDate}
                    locale={locale}
                    timeZoneId={event.timeZoneId}
                    timeZoneName={event.timeZoneName}
                    showTimeZone={true}
                    className="text-sm"
                  />
                </div>

                <EventLocationConfirm />
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card className="gap-2 shadow-primary/50">
              <CardHeader>
                <CardTitle className="text-lg">{t("organizer")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={getUserAvatar(organizer)} />
                    <AvatarFallback>{getInitials(organizer.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{organizer.name || organizer.email}</p>
                    <p className="text-sm text-muted-foreground">{t("invitedYou")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Companions Status */}
            <Card className="gap-2 shadow-primary/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{t("companions")}</CardTitle>
                  <Badge variant={currentCompanionsCount >= maxCompanions ? "destructive" : "secondary"}>
                    {currentCompanionsCount} / {maxCompanions}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {companions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">{t("noCompanionsYet")}</p>
                ) : (
                  <div className="space-y-2">
                    {companions.map((companion: any) => (
                      <div key={companion.id} className="flex items-center gap-3 p-2 border rounded-md">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={getUserAvatar(companion.ClientProfile)} />
                          <AvatarFallback className="text-xs">
                            {getInitials(companion.ClientProfile?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {companion.ClientProfile?.name || companion.ClientProfile?.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Confirmation Form */}
            <ConfirmCompanionForm
              visitId={visit.id}
              isFull={currentCompanionsCount >= maxCompanions}
              eventSlug={event.slug}
              confirmedClientIds={companions.map((c: any) => c.clientId)}
            />
          </div>
        </div>
      </main>
    </EventTextProvider>
  );
};

export default ConfirmCompanionPage;
