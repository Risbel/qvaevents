import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import GoBackButton from "../../../components/GoBackButton";
import { getTranslations } from "next-intl/server";

const NewOrganizerProfileLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
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

  return (
    <div className="py-8">
      <GoBackButton text={tnav("goBack")} />
      {children}
    </div>
  );
};

export default NewOrganizerProfileLayout;
