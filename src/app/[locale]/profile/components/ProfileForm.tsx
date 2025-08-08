import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Calendar, Shield, MailCheck } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface ProfileFormProps {
  user: SupabaseUser;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const t = useTranslations("Profile");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getUserName = () => {
    return user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "No name";
  };

  const getUserAvatar = () => {
    return user.user_metadata?.avatar_url || user.user_metadata?.picture || "";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={getUserAvatar()} />
            <AvatarFallback className="text-lg">{getInitials(getUserName())}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{t("basicInfo")}</CardTitle>
            <CardDescription>{t("basicInfoDescription")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              {t("personalInfo")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t("fullName")}</Label>
                <Input id="fullName" value={getUserName()} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <Input id="email" value={user.email || ""} disabled className="bg-muted" />
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t("accountInfo")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="createdAt">{t("memberSince")}</Label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Input id="createdAt" value={formatDate(user.created_at)} disabled className="bg-muted" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastSignIn">{t("lastSignIn")}</Label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="lastSignIn"
                    value={user.last_sign_in_at ? formatDate(user.last_sign_in_at) : t("never")}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>

            {user.email_confirmed_at && (
              <div className="space-y-2">
                <Label htmlFor="emailConfirmed">{t("emailConfirmed")}</Label>
                <div className="flex items-center space-x-2">
                  <MailCheck className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="emailConfirmed"
                    value={formatDate(user.email_confirmed_at)}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">{t("basicInfoNote")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
