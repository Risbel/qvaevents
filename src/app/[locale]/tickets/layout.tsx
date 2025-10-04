import ClientsNavbar from "@/app/components/ClientsNavbar";
import { getTranslations } from "next-intl/server";

const TicketsLayout = async ({ children }: { children: React.ReactNode }) => {
  const t = await getTranslations("TicketsPage");

  return (
    <div className="min-h-screen bg-background">
      <ClientsNavbar />

      <main className="mx-auto space-y-6 w-full max-w-2xl lg:max-w-4xl py-4 px-4">
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
