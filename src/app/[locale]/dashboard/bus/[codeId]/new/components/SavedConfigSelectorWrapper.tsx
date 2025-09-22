"use client";

import { SavedConfigSelector } from "./SavedConfigSelector";
import useGetBusinessByCodeId from "@/hooks/business/useGetBusinessByCodeId";
import { useParams } from "next/navigation";

export function SavedConfigSelectorWrapper() {
  const { codeId } = useParams();
  const { data: business } = useGetBusinessByCodeId(codeId as string);

  return <SavedConfigSelector customEventConfigs={business?.CustomEventConfig || []} />;
}
