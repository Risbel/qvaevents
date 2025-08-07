"use client";

import { useTranslations } from "next-intl";
import { emailSignup } from "@/actions/auth/emailSignup";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { State } from "@/types/state";
import { useActionState, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import EmailConfirmationModal from "./components/EmailConfirmationModal";

export default function SignUpPage() {
  const t = useTranslations("Auth.signup");
  const params = useParams();
  const locale = params.locale as string;
  const initialState: State = { message: "", status: undefined };
  const [state, formAction, isPending] = useActionState(emailSignup, initialState);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      setShowEmailModal(true);
    }

    if (state.status === "error") {
      toast.error(state.message);
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
            <Input
              onChange={(e) => setUserEmail(e.target.value)}
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              autoComplete="email"
            />
            {state?.errors?.email && <p className="text-sm text-destructive">{state.errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input id="password" name="password" type="password" required autoComplete="new-password" />
            {state?.errors?.password && <p className="text-sm text-destructive">{state.errors.password}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="new-password" />
            {state?.errors?.confirmPassword && (
              <p className="text-sm text-destructive">{state.errors.confirmPassword}</p>
            )}
          </div>
          {state?.errors?.auth && <p className="text-sm text-destructive">{state.errors.auth}</p>}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                {t("creatingAccount")} <Loader2 className="w-4 h-4 animate-spin ml-2" />
              </>
            ) : (
              t("createAccount")
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="w-full" asChild>
          <a href={`/${locale}/auth/org/login`}>{t("alreadyHaveAccount")}</a>
        </Button>
      </CardFooter>

      <EmailConfirmationModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} email={userEmail} />
    </>
  );
}
