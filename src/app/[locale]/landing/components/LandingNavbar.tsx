import ModeToggle from "@/app/components/ModeToggle";
import LocaleSwitcher from "@/app/components/LocaleSwitcher";
import UserDropdown from "@/app/components/OrganizerUserDropdown";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import OpenDashboardButton from "@/app/components/OpenDashboardButton";
import Image from "next/image";
import LogoIcon from "./LogoIcon";

const LandingNavbar = async () => {
  const t = await getTranslations("navigation");
  const tAuth = await getTranslations("Auth");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex flex-1 justify-between items-center space-x-2 px-4 py-2">
        <LogoIcon size={30} className="rounded-md shadow-md" />

        <div className="flex items-center gap-2">
          {user && <OpenDashboardButton />}
          <LocaleSwitcher />
          <ModeToggle />
          {user ? (
            <UserDropdown user={user} />
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link href="/auth/org/login">{tAuth("login.signIn")}</Link>
              </Button>
              <Button asChild variant="default">
                <Link href="/auth/org/signup">{tAuth("signup.signUp")}</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default LandingNavbar;
