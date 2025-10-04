import GoBackButton from "@/app/components/GoBackButton";
import LocaleSwitcher from "@/app/components/LocaleSwitcher";
import ModeToggle from "@/app/components/ModeToggle";
import { getTranslations } from "next-intl/server";

const TicketsLayout = async ({ children }: { children: React.ReactNode }) => {
  const t = await getTranslations("TicketsPage");

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex justify-between items-center fixed w-full px-2 py-2 md:px-4 border-b z-50 bg-background/20 shadow-sm backdrop-blur-sm">
        <GoBackButton />
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ModeToggle />
        </div>
      </nav>

      <main className="mx-auto space-y-6 w-full max-w-2xl lg:max-w-4xl py-16 px-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        {children}
      </main>
    </div>
  );
};

export default TicketsLayout;
