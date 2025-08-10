import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateOrganizerProfileForm from "./components/CreateOrganizerProfileForm";
import { getActivePlans, Plan } from "@/queries/getPlans";

export default async function NewOrganizerProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/org/login");
  }

  const { data: existingProfiles, error: profileError } = await supabase
    .from("OrganizerProfile")
    .select("id")
    .eq("user_id", user.id)
    .eq("isDeleted", false);

  if (profileError) {
    redirect("/profile");
  }

  if (existingProfiles && existingProfiles.length > 0) {
    redirect("/profile");
  }

  const plans = await getActivePlans();

  if (plans.status === "error") {
    redirect("/profile");
  }

  return <CreateOrganizerProfileForm plans={(plans.data?.plans as Plan[]) || []} />;
}
