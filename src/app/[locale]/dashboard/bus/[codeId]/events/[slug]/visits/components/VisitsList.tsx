"use client";

import { useParams, useSearchParams } from "next/navigation";
import useGetVisitsByEventSlug from "@/hooks/visits/useGetVisitsByEventSlug";
import { Visit } from "@/queries/client/visits/getVisitsByEventSlug";
import { type VisitsResponse } from "@/hooks/visits/useGetVisitsByEventSlug";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2, Users2Icon } from "lucide-react";
import VisitCard from "./VisitCard";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const VisitsList = () => {
  const tVisits = useTranslations("VisitsPage");
  const { slug } = useParams() as { slug: string };
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const searchField = searchParams.get("searchField") || undefined;

  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetVisitsByEventSlug(
    slug,
    search,
    searchField
  ) as {
    data?: { pages: VisitsResponse[] };
    isLoading: boolean;
    isError: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
  };

  const firstPage = data?.pages?.[0];

  if (isLoading) {
    return (
      <div className="max-w-2xl w-full space-y-3">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-[72px] w-full" />
        ))}
      </div>
    );
  }

  if (isError || !firstPage?.event) {
    return (
      <Alert variant="destructive" className="max-w-2xl w-full">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{tVisits("failedToLoadVisits")}</AlertTitle>
        <AlertDescription>{tVisits("failedToLoadVisitsDescription")}</AlertDescription>
      </Alert>
    );
  }

  const { event } = firstPage;
  const totalVisits = firstPage.total;

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <Badge variant="outline">
          {totalVisits} / {event.visitsLimit}
        </Badge>
      </div>

      <div className="space-y-2">
        {firstPage?.visits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-2">
            <Users2Icon className="size-12 text-muted-foreground" />
            <h3 className="font-semibold text-lg">{tVisits("noVisits")}</h3>
            <p className="text-sm text-muted-foreground text-center">{tVisits("noVisitsDescription")}</p>
          </div>
        ) : (
          <>
            {data?.pages.map((page: VisitsResponse, i: number) =>
              page.visits.map((visit: Visit[number]) => <VisitCard key={`${visit.id}-${i}`} visit={visit} />)
            )}

            {isFetchingNextPage && (
              <div className="space-y-3 mt-4">
                {[...Array(1)].map((_, i) => (
                  <Skeleton key={i} className="h-[72px] w-full" />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {hasNextPage && (
        <div className="flex justify-end">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? tVisits("loadingMore") : tVisits("loadMore")}
            {isFetchingNextPage && <Loader2 className="size-4 animate-spin" />}
          </Button>
        </div>
      )}
    </div>
  );
};

export default VisitsList;
