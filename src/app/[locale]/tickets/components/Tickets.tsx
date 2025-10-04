import useGetMyVisits from "@/hooks/visits/useGetMyVisits";
import { useParams } from "next/navigation";
import { TicketsListSkeleton } from "./TicketSkeletons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarX2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TicketCard from "./TicketCard";
import { useTranslations } from "next-intl";

const VISITS_PER_PAGE = 10;

const Tickets = ({ clientId }: { clientId: number }) => {
  const params = useParams();
  const t = useTranslations("TicketsPage");
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetMyVisits(
    clientId,
    VISITS_PER_PAGE
  );

  if (isLoading) {
    return <TicketsListSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("errorLoading")}</AlertTitle>
        <AlertDescription>{t("errorLoadingDescription")}</AlertDescription>
      </Alert>
    );
  }

  const visits = data?.pages.flatMap((page) => page.visits) || [];

  if (!visits.length) {
    return (
      <Alert>
        <CalendarX2 className="h-4 w-4" />
        <AlertTitle>{t("noTickets")}</AlertTitle>
        <AlertDescription>{t("noTicketsDescription")}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {visits.map((visit) => (
        <TicketCard key={visit.id} visit={visit} locale={params.locale as string} />
      ))}

      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? t("loadingMore") : t("loadMore")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Tickets;
