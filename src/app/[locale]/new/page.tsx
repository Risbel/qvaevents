import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateOrganizerProfileForm from "./components/CreateOrganizerProfileForm";
import { getPlansWithAssets, PlanWithPrices, Asset } from "@/queries/server/getPlansWithAssets";

import GoBackButton from "../../components/GoBackButton";
import { getTranslations } from "next-intl/server";

export default async function NewOrganizerProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tnav = await getTranslations("navigation");
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/${locale}/auth/org/login`);
  }

  const { data: existingProfiles, error: profileError } = await supabase
    .from("OrganizerProfile")
    .select("id")
    .eq("user_id", user.id)
    .eq("isDeleted", false);

  if (profileError) {
    redirect(`/${locale}/profile`);
  }

  if (existingProfiles && existingProfiles.length > 0) {
    redirect(`/${locale}/profile`);
  }

  const plansResponse = await getPlansWithAssets();

  if (plansResponse.status === "error") {
    redirect(`/${locale}/profile`);
  }

  return (
    <div className="flex flex-col justify-center py-16 space-y-4">
      <GoBackButton text={tnav("goBack")} className="w-fit" />

      <CreateOrganizerProfileForm
        plans={(plansResponse.data?.plans as PlanWithPrices[]) || []}
        assets={(plansResponse.data?.assets as Asset[]) || []}
      />
    </div>
  );
}
