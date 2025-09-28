"use client";

import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import AuthModal from "@/app/components/AuthModal";
import { useState } from "react";

export default function MeError({ error }: { error: Error & { digest?: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("actions");
  const tAuth = useTranslations("Auth");
  const tNavigation = useTranslations("navigation");
  const params = useParams();
  const router = useRouter();

  return (
    <div className="container mx-auto space-y-4 w-full max-w-2xl lg:max-w-4xl py-16 px-4">
      <Alert variant="destructive">
        <AlertTitle className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> <p className="font-medium">{tAuth("error.title")}</p>
        </AlertTitle>
        <AlertDescription className="mt-2">
          {error.message.includes("auth") || error.message.includes("user")
            ? tAuth("error.description")
            : tAuth("error.message")}
        </AlertDescription>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            className="w-24 mt-4 cursor-pointer text-secondary-foreground"
            onClick={() => router.push(`/${params.locale}/`)}
          >
            {tNavigation("goHome")}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-24 mt-4 cursor-pointer text-secondary-foreground"
            onClick={() => setIsOpen(true)}
          >
            {t("login")}
          </Button>
        </div>

        <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </Alert>
    </div>
  );
}
