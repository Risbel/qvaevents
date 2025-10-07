import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ProfileForm from "./components/ProfileForm";
import OrganizerProfileInfo from "./components/OrganizerProfileInfo";
import SubscriptionInfo from "./components/SubscriptionInfo";
import LoadingCard from "./components/LoadingCard";

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/${locale}/auth/org/login`);
  }

  return (
    <>
      <Suspense fallback={<LoadingCard />}>
        <OrganizerProfileInfo user={user} locale={locale} />
      </Suspense>
      <ProfileForm user={user} />
      <Suspense fallback={<LoadingCard />}>
        <SubscriptionInfo user={user} />
      </Suspense>
    </>
  );
}
