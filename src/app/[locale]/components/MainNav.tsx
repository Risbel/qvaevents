"use client";

import { useTranslations } from "next-intl";
import ModeToggle from "@/app/components/ModeToggle";

const MainNav = () => {
  const t = useTranslations("navigation");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex flex-1 justify-between items-center space-x-2 px-2 md:px-4 py-2">
        <a href="#" className="text-primary text-xl font-bold">
          {t("brand")}
        </a>
        <div className="flex items-center gap-2 md:gap-4">
          <a href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
            {t("features")}
          </a>
          <a href="#contact" className="transition-colors hover:text-foreground/80 text-foreground/60">
            {t("contact")}
          </a>
        </div>

        <ModeToggle />
      </nav>
    </header>
  );
};

export default MainNav;
