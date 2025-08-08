import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import ProfileForm from "./components/ProfileForm";
import OrganizerProfileSection from "./components/OrganizerProfileSection";

export default async function ProfilePage() {
  const t = await getTranslations("Profile");
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/org/login");
  }

  const { data: organizerProfiles, error: profileError } = await supabase
    .from("OrganizerProfile")
    .select("*")
    .eq("user_id", user.id)
    .eq("isDeleted", false);

  const organizerProfile = organizerProfiles && organizerProfiles.length > 0 ? organizerProfiles[0] : null;

  return (
    <>
      <ProfileForm user={user} />
      <OrganizerProfileSection user={user} organizerProfile={organizerProfile} hasError={!!profileError} />
    </>
  );
}
