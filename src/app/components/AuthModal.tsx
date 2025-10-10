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
import { Loader2, Eye, EyeOff } from "lucide-react";
import GoogleSignIn from "@/app/components/GoogleSignIn";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// AuthModal is used for both login and signup and redirect to the current pathname
export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const t = useTranslations("Auth.login");
  const tSignup = useTranslations("Auth.signup");
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const redirectTo = pathname;

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const initialState: State = { status: undefined };
  const [loginState, loginFormAction, isLoginPending] = useActionState(emailLogin, initialState);
  const [signupState, signupFormAction, isSignupPending] = useActionState(emailSignup, initialState);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (loginState.status === "success") {
      toast.success(t("loginSuccess"));
      onClose();
      setIsLoginMode(true);
      setUserEmail("");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["myClientProfile"] });
    }

    if (loginState.status === "error") {
      toast.error(t("loginError"));
    }
  }, [loginState]);

  useEffect(() => {
    if (signupState.status === "success") {
      toast.success(tSignup("signupSuccess"));
      setIsLoginMode(true);
      setUserEmail("");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["myClientProfile"] });
    }

    if (signupState.status === "error") {
      toast.error(tSignup("signupError"));
    }
  }, [signupState]);

  const handleClose = () => {
    onClose();
    setIsLoginMode(true);
    setUserEmail("");
    setShowLoginPassword(false);
    setShowSignupPassword(false);
    setShowConfirmPassword(false);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setUserEmail("");
    setShowLoginPassword(false);
    setShowSignupPassword(false);
    setShowConfirmPassword(false);
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
                <div className="relative">
                  <Input
                    className="pr-10"
                    id="password"
                    name="password"
                    type={showLoginPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
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
                <div className="relative">
                  <Input
                    className="pr-10"
                    id="signup-password"
                    name="password"
                    type={showSignupPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    aria-label={showSignupPassword ? "Hide password" : "Show password"}
                  >
                    {showSignupPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {signupState?.errors?.password && (
                  <p className="text-sm text-destructive">{signupState.errors.password}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{tSignup("confirmPassword")}</Label>
                <div className="relative">
                  <Input
                    className="pr-10"
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {signupState?.errors?.confirmPassword && (
                  <p className="text-sm text-destructive">{signupState.errors.confirmPassword}</p>
                )}
              </div>
              {signupState?.errors?.auth && (
                <p className="text-sm text-destructive">
                  {signupState.errors.auth[0] === "emailAlreadyRegistered"
                    ? tSignup("emailAlreadyRegistered")
                    : signupState.errors.auth}
                </p>
              )}
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
