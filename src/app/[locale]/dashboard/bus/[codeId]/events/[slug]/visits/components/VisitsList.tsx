"use client";

import { useState } from "react";
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
import { Button, buttonVariants } from "@/components/ui/button";
import MessageAllButton from "./MessageAllButton";
import EmailAllButton from "./EmailAllButton";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 20;

const VisitsList = () => {
  const tVisits = useTranslations("VisitsPage");
  const { slug, codeId } = useParams() as { slug: string; codeId: string };
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const searchField = searchParams.get("searchField") || undefined;
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetVisitsByEventSlug(slug, search, searchField, {
      pageSize: ITEMS_PER_PAGE,
      initialPage: currentPage,
    });

  const currentPageData = data?.pages[data.pages.length - 1];

  // Only show loading skeleton on initial load, not on every refetch
  if (isLoading && !currentPageData) {
    return (
      <div className="w-full space-y-3">
        <div className="w-full flex items-center justify-between">
          <Skeleton className="h-5 w-12" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
        <div className="w-full space-y-3">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="max-w-2xl w-full">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{tVisits("failedToLoadVisits")}</AlertTitle>
        <AlertDescription>{tVisits("failedToLoadVisitsDescription")}</AlertDescription>
      </Alert>
    );
  }

  if (!currentPageData || !data) {
    return null;
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between gap-1">
        <div className="flex gap-1 flex-wrap">
          <Badge variant="outline">
            <span>{tVisits("visits")}:</span>
            {currentPageData.totalVisits + currentPageData.totalCompanions} / {currentPageData.event.visitsLimit}
          </Badge>
          {search && <Badge variant="secondary">{tVisits("Filter.activeFilter")}</Badge>}
        </div>
        {currentPageData.totalVisits > 0 && (
          <div className="flex gap-1">
            <MessageAllButton data={data} />
            <EmailAllButton data={data} />
          </div>
        )}
      </div>

      <div className="space-y-2">
        {currentPageData.visits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-2">
            <Users2Icon className="size-12 text-muted-foreground" />
            <h3 className="font-semibold text-lg">{tVisits("noVisits")}</h3>
            <p className="text-sm text-muted-foreground text-center">{tVisits("noVisitsDescription")}</p>
          </div>
        ) : (
          <>
            {isFetchingNextPage ? (
              // Show skeleton when loading next page
              <div className="space-y-3">
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : (
              // Show current page visits
              data?.pages[currentPage - 1]?.visits.map((visit: any) => <VisitCard key={visit.id} visit={visit} />)
            )}
          </>
        )}
      </div>

      {currentPageData.totalPages > 1 && currentPageData.visits.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  currentPage === 1 ? "opacity-50 cursor-default" : "cursor-pointer"
                )}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  if (currentPage > 1) {
                    setCurrentPage((prev) => prev - 1);
                  }
                }}
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>

            {[...Array(Math.min(5, currentPageData.totalPages))].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  className={cn(i + 1 === currentPage && "shadow-sm")}
                  href={`/dashboard/bus/${codeId}/events/${slug}/visits?page=${i + 1}`}
                  onClick={async (e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    const targetPage = i + 1;
                    if (targetPage > data?.pages.length!) {
                      await fetchNextPage();
                    }
                    setCurrentPage(targetPage);
                  }}
                  isActive={i + 1 === currentPage}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {currentPageData.totalPages > 5 && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href={`/dashboard/bus/${codeId}/events/${slug}/visits?page=${currentPageData.totalPages}`}
                  >
                    {currentPageData.totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                className={cn(
                  currentPage >= currentPageData.totalPages ? "opacity-50 cursor-default" : "cursor-pointer",
                  buttonVariants({ variant: "outline" })
                )}
                href={`/dashboard/bus/${codeId}/events/${slug}/visits?page=${currentPage + 1}`}
                onClick={async (e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  if (currentPage < currentPageData.totalPages) {
                    if (currentPage >= data?.pages.length!) {
                      await fetchNextPage();
                    }
                    setCurrentPage((prev) => prev + 1);
                  }
                }}
                aria-disabled={currentPage >= currentPageData.totalPages || isFetchingNextPage}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default VisitsList;
