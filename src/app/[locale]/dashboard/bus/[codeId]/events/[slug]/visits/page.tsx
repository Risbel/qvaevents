import { getTranslations } from "next-intl/server";
import VisitsList from "./components/VisitsList";
import VisitsSearchFilter from "./components/VisitsSearchFilter";

const VisitsPage = async () => {
  const t = await getTranslations("VisitsPage");

  return (
    <div className="max-w-3xl md:max-w-5xl lg:max-w-6xl w-full space-y-4">
      <h1 className="text-2xl font-bold mb-2">{t("visits")}</h1>
      <VisitsSearchFilter />
      <VisitsList />
    </div>
  );
};

export default VisitsPage;
