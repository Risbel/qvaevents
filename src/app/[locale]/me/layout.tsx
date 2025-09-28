import LocaleSwitcher from "@/app/components/LocaleSwitcher";
import ModeToggle from "@/app/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Home, User } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

const MeLayout = async ({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const t = await getTranslations("Profile");

  return (
    <>
      <nav className="flex justify-between items-center fixed w-full px-2 py-2 md:px-4 border-b z-50 bg-background/20 shadow-sm backdrop-blur-sm">
        <Button asChild variant="outline" size="icon">
          <Link href={`/${locale}`}>
            <Home />
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ModeToggle />
        </div>
      </nav>

      <div className="container mx-auto space-y-4 w-full max-w-2xl lg:max-w-4xl py-24 px-4">{children}</div>
    </>
  );
};

export default MeLayout;
