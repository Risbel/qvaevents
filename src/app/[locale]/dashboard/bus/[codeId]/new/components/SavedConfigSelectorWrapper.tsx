import { Suspense } from "react";
import { BusinessWithOrganizer, getBusinessByCodeId } from "@/queries/business/getBusinessByCodeId";
import { SavedConfigSelector } from "./SavedConfigSelector";

interface SavedConfigSelectorWrapperProps {
  codeId: string;
}

async function SavedConfigSelectorServer({ codeId }: SavedConfigSelectorWrapperProps) {
  const businessResult = await getBusinessByCodeId(codeId);

  if (businessResult.status !== "success" || !businessResult.data?.business) {
    return <SavedConfigSelector customEventConfigs={[]} />;
  }

  const business = businessResult.data.business as BusinessWithOrganizer;
  const customEventConfigs = business.CustomEventConfig || [];

  return <SavedConfigSelector customEventConfigs={customEventConfigs} />;
}

export function SavedConfigSelectorWrapper({ codeId }: SavedConfigSelectorWrapperProps) {
  return (
    <Suspense fallback={<SavedConfigSelector customEventConfigs={[]} />}>
      <SavedConfigSelectorServer codeId={codeId} />
    </Suspense>
  );
}
