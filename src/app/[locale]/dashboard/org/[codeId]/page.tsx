import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";
import OrganizerDashboard from "./components/OrganizerDashboard";

export default async function OrganizerDashboardPage({
  params,
}: {
  params: Promise<{ codeId: string; locale: string }>;
}) {
  const { codeId, locale } = await params;

  const supabase = await createClient();
  const t = await getTranslations("Dashboard");

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/${locale}/auth/login`);
  }

  // Check if organizer exists and user has access
  const { data: organizer, error: organizerError } = await supabase
    .from("OrganizerProfile")
    .select("*")
    .eq("codeId", codeId)
    .eq("isDeleted", false)
    .single();

  if (organizerError || !organizer) {
    console.error(organizerError);
    notFound();
  }

  // Check if user owns this organizer
  if (organizer.user_id !== user.id) {
    redirect(`/${locale}/profile`);
  }

  return <OrganizerDashboard organizer={organizer} locale={locale} />;
}
