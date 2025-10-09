"use client";

import { useSearchParams } from "next/navigation";
import useGetClientsByOrganizerId from "@/hooks/clients/useGetClientsByOrganizerId";
import { ClientOnOrganizer } from "@/queries/client/clients/getClientsByOrganizerId";
import { type ClientsResponse } from "@/hooks/clients/useGetClientsByOrganizerId";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2, Users2Icon } from "lucide-react";
import ClientCard from "./ClientCard";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface ClientsListProps {
  organizerId: number | undefined;
}

const ClientsList = ({ organizerId }: ClientsListProps) => {
  const t = useTranslations("ClientsPage");
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const searchField = searchParams.get("searchField") || undefined;

  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetClientsByOrganizerId(
    organizerId,
    search,
    searchField
  ) as {
    data?: { pages: ClientsResponse[] };
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

  if (isError || !organizerId) {
    return (
      <Alert variant="destructive" className="max-w-2xl w-full">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t("failedToLoadClients")}</AlertTitle>
        <AlertDescription>{t("failedToLoadClientsDescription")}</AlertDescription>
      </Alert>
    );
  }

  const totalClients = firstPage?.total || 0;

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <Badge variant="outline">
          {t("totalClients")}: {totalClients}
        </Badge>
      </div>

      <div className="space-y-2">
        {firstPage?.clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-2">
            <Users2Icon className="size-12 text-muted-foreground" />
            <h3 className="font-semibold text-lg">{t("noClients")}</h3>
            <p className="text-sm text-muted-foreground text-center">{t("noClientsDescription")}</p>
          </div>
        ) : (
          <>
            {data?.pages.map((page: ClientsResponse, i: number) =>
              page.clients.map((client: ClientOnOrganizer[number]) => (
                <ClientCard key={`${client.id}-${i}`} client={client} />
              ))
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
            {isFetchingNextPage ? t("loadingMore") : t("loadMore")}
            {isFetchingNextPage && <Loader2 className="size-4 animate-spin" />}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClientsList;
