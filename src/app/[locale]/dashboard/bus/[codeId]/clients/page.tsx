import { getTranslations } from "next-intl/server";
import ClientsList from "./components/ClientsList";
import ClientsSearchFilter from "./components/ClientsSearchFilter";

const ClientsPage = async () => {
  const t = await getTranslations("ClientsPage");

  return (
    <div className="max-w-3xl md:max-w-5xl lg:max-w-6xl w-full space-y-4">
      <h1 className="text-2xl font-bold mb-2">{t("clients")}</h1>
      <ClientsSearchFilter />
      <ClientsList />
    </div>
  );
};

export default ClientsPage;
