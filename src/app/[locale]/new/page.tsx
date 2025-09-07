import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateOrganizerProfileForm from "./components/CreateOrganizerProfileForm";
import { getActivePlans, Plan } from "@/queries/getPlans";
import GoBackButton from "../components/GoBackButton";
import { getTranslations } from "next-intl/server";

export default async function NewOrganizerProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Profile");
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

  const plans = await getActivePlans();

  if (plans.status === "error") {
    redirect(`/${locale}/profile`);
  }

  return (
    <div className="flex flex-col justify-center py-16">
      <GoBackButton text={tnav("goBack")} className="w-fit" />

      <CreateOrganizerProfileForm plans={(plans.data?.plans as Plan[]) || []} />
    </div>
  );
}
