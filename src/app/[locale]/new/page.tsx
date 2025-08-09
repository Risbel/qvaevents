import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateOrganizerProfileForm from "./components/CreateOrganizerProfileForm";

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

  // If user already has a profile, redirect to profile page
  if (existingProfiles && existingProfiles.length > 0) {
    redirect("/profile");
  }

  return <CreateOrganizerProfileForm />;
}
