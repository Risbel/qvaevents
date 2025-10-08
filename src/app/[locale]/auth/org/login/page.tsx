"use client";

import { useTranslations } from "next-intl";
import { emailLogin } from "@/actions/auth/emailLogin";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useActionState, useEffect, useState } from "react";
import { State } from "@/types/state";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import GoogleSignIn from "@/app/components/GoogleSignIn";

export default function LoginPage() {
  const t = useTranslations("Auth.login");
  const tEmailConfirmation = useTranslations("Auth.emailConfirmation");
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = params.locale as string;
  const initialState: State = { status: undefined };
  const [state, formAction, isPending] = useActionState(emailLogin, initialState);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(t("loginSuccess"));
      router.push(`/${locale}/new`);
    }

    if (state.status === "error") {
      toast.error(t("loginError"));
    }
  }, [state]);

  return (
    <>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" name="email" type="email" placeholder="name@example.com" required autoComplete="email" />
            {state?.errors?.email && <p className="text-sm text-destructive">{state.errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="password" className="mb-2">
              {t("password")}
            </Label>
            <div className="relative">
              <Input
                className="mb-1 pr-10"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {state?.errors?.password && <p className="text-sm text-destructive">{t("invalidCredentials")}</p>}
            {state?.errors?.auth && <p className="text-sm text-destructive">{t("invalidCredentials")}</p>}
          </div>

          {searchParams.get("message") && (
            <p className="text-sm text-destructive">
              {searchParams.get("message") === "Error-Email-Confirmation"
                ? tEmailConfirmation("error")
                : searchParams.get("message")}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                {t("signingIn")} <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              t("signIn")
            )}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{t("or")}</span>
          </div>
        </div>

        <GoogleSignIn mode="login" redirectTo={`/${locale}/new`} />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button variant="link" className="w-full" asChild>
          <a href={`/${locale}/auth/org/signup`}>{t("createAccount")}</a>
        </Button>
      </CardFooter>
    </>
  );
}
