import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import CreateBusinessForm from "./components/CreateBusinessForm";

export default async function CreateBusinessPage({ params }: { params: Promise<{ codeId: string }> }) {
  const { codeId } = await params;
  const supabase = await createClient();

  // Check if organizer exists
  const { data: organizer, error } = await supabase
    .from("OrganizerProfile")
    .select("id, companyName")
    .eq("codeId", codeId)
    .eq("isDeleted", false)
    .single();

  if (error || !organizer) {
    notFound();
  }

  return <CreateBusinessForm organizerId={organizer.id} companyName={organizer.companyName} />;
}
