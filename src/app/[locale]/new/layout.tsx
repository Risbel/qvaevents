import LocaleSwitcher from "@/app/components/LocaleSwitcher";
import ModeToggle from "@/app/components/ModeToggle";
import UserDropdown from "@/app/components/OrganizerUserDropdown";
import { Button } from "@/components/ui/button";

import { Home } from "lucide-react";

import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const NewOrganizerProfileLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/${locale}/auth/org/login`);
  }

  return (
    <>
      <nav className="flex justify-between items-center fixed w-full px-2 md:px-4 top-0 py-2 border-b z-50 bg-background/20 shadow-sm backdrop-blur-sm">
        <Button asChild variant="outline" size="icon">
          <Link href={`/${locale}`}>
            <Home />
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ModeToggle />
          <UserDropdown user={user} />
        </div>
      </nav>

      <div className="container mx-auto space-y-4 w-full max-w-2xl lg:max-w-4xl py-16 px-4">{children}</div>
    </>
  );
};

export default NewOrganizerProfileLayout;
