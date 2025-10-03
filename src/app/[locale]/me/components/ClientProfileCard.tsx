import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Calendar, Mail, Shield, Clock, CheckCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import EditProfileModal from "./EditProfileModal";

interface ClientProfileCardProps {
  userId: string;
  locale: string;
}

export default async function ClientProfileCard({ userId, locale }: ClientProfileCardProps) {
  const supabase = await createClient();
  const t = await getTranslations("ClientProfile");
  const tClientProfileCard = await getTranslations("ClientProfile.ClientProfileCard");

  // Fetch ClientProfile data
  const { data: clientProfile, error: profileError } = await supabase
    .from("ClientProfile")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (profileError) {
    return (
      <Card className="border-0 shadow-lg shadow-destructive/50 bg-gradient-to-br from-background to-destructive/10">
        <CardContent className="p-6 text-center">
          <p className="text-destructive">{t("errorLoading")}</p>
          <p className="text-sm text-muted-foreground">{t("errorLoadingDescription")}</p>
        </CardContent>
      </Card>
    );
  }

  const getDateFnsLocale = (locale: string) => {
    switch (locale) {
      case "es":
        return es;
      case "en":
        return enUS;
      default:
        return enUS;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    // Parse the date string as local date to avoid timezone issues
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    const dateFnsLocale = getDateFnsLocale(locale);
    return format(date, "PPP", { locale: dateFnsLocale });
  };

  return (
    <>
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
        <User className="h-5 w-5 text-muted-foreground" />

        <p className="font-medium">
          <span className="text-muted-foreground font-normal">{tClientProfileCard("username")}:</span>{" "}
          {clientProfile?.username || "N/A"}
        </p>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
        <Mail className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <p className="font-medium">
            {clientProfile?.info || <span className="text-muted-foreground italic">{tClientProfileCard("noBio")}</span>}
          </p>
          <p className="text-sm text-muted-foreground">{tClientProfileCard("bio")}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="font-medium">
            {clientProfile?.birthday ? (
              formatDate(clientProfile.birthday)
            ) : (
              <span className="text-muted-foreground italic">{tClientProfileCard("noBirthday")}</span>
            )}
          </p>
          <p className="text-sm text-muted-foreground">{tClientProfileCard("birthday")}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
        <Shield className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <p className="font-medium">{tClientProfileCard("gender")}</p>
          <div className="flex gap-2 mt-2">
            {clientProfile?.sex ? (
              <Badge variant="outline" className="capitalize">
                {clientProfile.sex}
              </Badge>
            ) : (
              <span className="text-sm text-muted-foreground italic">{tClientProfileCard("noGender")}</span>
            )}
          </div>
        </div>
      </div>

      <EditProfileModal clientProfile={clientProfile} />
    </>
  );
}
