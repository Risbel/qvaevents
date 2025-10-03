import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail, Shield, User, Clock, CheckCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import GoBackButton from "@/app/components/GoBackButton";
import ClientProfileCard from "./components/ClientProfileCard";
import ClientProfileCardSkeleton from "./components/ClientProfileCardSkeleton";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function MePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not found");
  }

  const t = await getTranslations("Profile");
  const tnav = await getTranslations("navigation");

  const getUserName = () => {
    return user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User";
  };

  const getUserAvatar = () => {
    return user.user_metadata?.avatar_url || user.user_metadata?.picture || undefined;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPrimaryProvider = () => {
    const providers = user.app_metadata?.providers || [];
    return providers[providers.length - 1] || "email";
  };

  return (
    <div className="space-y-4">
      {/* Auth User Info Card */}
      <Card className="border-0 shadow-lg shadow-primary/50 bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={getUserAvatar()} alt={getUserName()} />
              <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                {getInitials(getUserName())}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl font-bold">{getUserName()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Suspense fallback={<ClientProfileCardSkeleton />}>
            <ClientProfileCard userId={user.id} locale={locale} />
          </Suspense>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-muted-foreground">{t("email")}</p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <Badge variant="default" className="text-xs hidden md:block">
                {user.email_confirmed_at ? "Verified" : "Unverified"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{formatDate(user.created_at)}</p>
                <p className="text-sm text-muted-foreground">{t("memberSince") || "Member since"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{formatDate(user.last_sign_in_at)}</p>
                <p className="text-sm text-muted-foreground">{t("lastSignIn") || "Last sign in"}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">Authentication Methods</p>
              <div className="flex gap-2 mt-2">
                {user.app_metadata?.providers?.map((provider: string) => (
                  <Badge
                    key={provider}
                    variant={provider === getPrimaryProvider() ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {provider === "google" ? "Google" : provider}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
