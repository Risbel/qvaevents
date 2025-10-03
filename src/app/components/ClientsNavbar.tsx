import ModeToggle from "@/app/components/ModeToggle";
import LocaleSwitcher from "@/app/components/LocaleSwitcher";
import { getTranslations } from "next-intl/server";
import ClientsUserDropdown from "@/app/components/ClientsUserDropdown";

const ClientsNavbar = async () => {
  const t = await getTranslations("navigation");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex flex-1 justify-between items-center space-x-2 px-2 md:px-4 py-2">
        <div className="flex items-center gap-2">
          <a href="/" className="text-primary text-xl font-bold">
            {t("brand")}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ModeToggle />
          <ClientsUserDropdown />
        </div>
      </nav>
    </header>
  );
};

export default ClientsNavbar;
