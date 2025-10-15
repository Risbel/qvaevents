"use client";

import { SavedConfigSelector } from "./SavedConfigSelector";
import useGetConfigsByBusinessCodeId from "@/hooks/events/useGetConfigsByBusinessCodeId";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export function SavedConfigSelectorWrapper() {
  const { codeId } = useParams();
  const { data: configsData, isLoading, isError } = useGetConfigsByBusinessCodeId(codeId as string);

  if (isLoading) {
    return <Skeleton className="h-8 w-64" />;
  }

  if (isError || !configsData) {
    return null;
  }

  return <SavedConfigSelector customEventConfigs={configsData.CustomEventConfig} />;
}
