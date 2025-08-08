import LocaleSwitcher from "@/app/components/LocaleSwitcher";
import ModeToggle from "@/app/components/ModeToggle";
import { Button } from "@/components/ui/button";

import { Home } from "lucide-react";

import Link from "next/link";
import { getTranslations } from "next-intl/server";

const ProfileLayout = async ({ children }: { children: React.ReactNode }) => {
  const t = await getTranslations("Profile");

  return (
    <>
      <nav className="flex justify-between items-center fixed w-full px-2 md:px-4 top-0 py-2 border-b z-50 bg-background/20 shadow-sm backdrop-blur-sm">
        <Button asChild variant="outline" size="icon">
          <Link href="/">
            <Home />
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ModeToggle />
        </div>
      </nav>

      <div className="container mx-auto space-y-4 w-full max-w-2xl lg:max-w-4xl py-16 px-4">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        {children}
      </div>
    </>
  );
};

export default ProfileLayout;
