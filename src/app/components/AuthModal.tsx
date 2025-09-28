"use client";

import { useTranslations } from "next-intl";
import { emailLogin } from "@/actions/auth/emailLogin";
import { emailSignup } from "@/actions/auth/emailSignup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useActionState, useEffect, useState } from "react";
import { State } from "@/types/state";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import GoogleSignIn from "@/app/components/GoogleSignIn";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// AuthModal is used for both login and signup and redirect to the current pathname
export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const t = useTranslations("Auth.login");
  const tSignup = useTranslations("Auth.signup");
  const pathname = usePathname();

  // Generate redirectTo URL from current pathname
  const redirectTo = pathname;

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  const initialState: State = { status: undefined };
  const [loginState, loginFormAction, isLoginPending] = useActionState(emailLogin, initialState);
  const [signupState, signupFormAction, isSignupPending] = useActionState(emailSignup, initialState);

  // Handle login success
  useEffect(() => {
    if (loginState.status === "success") {
      toast.success(t("loginSuccess"));
      onClose();
      setIsLoginMode(true);
      setUserEmail("");
    }

    if (loginState.status === "error") {
      toast.error(t("loginError"));
    }
  }, [loginState, t, onClose]);

  // Handle signup success
  useEffect(() => {
    if (signupState.status === "success") {
      toast.success(tSignup("signupSuccess"));
      setIsLoginMode(true);
      setUserEmail("");
    }

    if (signupState.status === "error") {
      toast.error(tSignup("signupError"));
    }
  }, [signupState, tSignup]);

  const handleClose = () => {
    onClose();
    setIsLoginMode(true);
    setUserEmail("");
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setUserEmail("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isLoginMode ? t("title") : tSignup("title")}</DialogTitle>
          <DialogDescription>{isLoginMode ? t("description") : tSignup("description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoginMode ? (
            <form action={loginFormAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                />
                {loginState?.errors?.email && <p className="text-sm text-destructive">{loginState.errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input id="password" name="password" type="password" required autoComplete="current-password" />
                {loginState?.errors?.password && <p className="text-sm text-destructive">{t("invalidCredentials")}</p>}
                {loginState?.errors?.auth && <p className="text-sm text-destructive">{t("invalidCredentials")}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isLoginPending}>
                {isLoginPending ? (
                  <>
                    {t("signingIn")} <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  </>
                ) : (
                  t("signIn")
                )}
              </Button>
            </form>
          ) : (
            <form action={signupFormAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">{tSignup("email")}</Label>
                <Input
                  onChange={(e) => setUserEmail(e.target.value)}
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                />
                {signupState?.errors?.email && <p className="text-sm text-destructive">{signupState.errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">{tSignup("password")}</Label>
                <Input id="signup-password" name="password" type="password" required autoComplete="new-password" />
                {signupState?.errors?.password && (
                  <p className="text-sm text-destructive">{signupState.errors.password}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{tSignup("confirmPassword")}</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                />
                {signupState?.errors?.confirmPassword && (
                  <p className="text-sm text-destructive">{signupState.errors.confirmPassword}</p>
                )}
              </div>
              {signupState?.errors?.auth && <p className="text-sm text-destructive">{signupState.errors.auth}</p>}
              <Button type="submit" className="w-full" disabled={isSignupPending}>
                {isSignupPending ? (
                  <>
                    {tSignup("creatingAccount")} <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  </>
                ) : (
                  tSignup("createAccount")
                )}
              </Button>
            </form>
          )}

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{isLoginMode ? t("or") : "or"}</span>
            </div>
          </div>

          <GoogleSignIn mode={isLoginMode ? "login" : "signup"} redirectTo={redirectTo} />
        </div>

        <div className="flex justify-center">
          <Button variant="link" onClick={toggleMode} className="text-sm">
            {isLoginMode ? t("createAccount") : tSignup("alreadyHaveAccount")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
