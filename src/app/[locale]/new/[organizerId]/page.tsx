import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import CreateBusinessForm from "./components/CreateBusinessForm";

export default async function CreateBusinessPage({ params }: { params: Promise<{ organizerId: string }> }) {
  const { organizerId } = await params;
  const supabase = await createClient();

  // Validate organizerId is a number
  const organizerIdNumber = parseInt(organizerId);
  if (isNaN(organizerIdNumber)) {
    notFound();
  }

  // Check if organizer exists
  const { data: organizer, error } = await supabase
    .from("OrganizerProfile")
    .select("id, companyName")
    .eq("id", organizerId)
    .eq("isDeleted", false)
    .single();

  if (error || !organizer) {
    notFound();
  }

  return <CreateBusinessForm organizerId={organizerIdNumber} organizerName={organizer.companyName} />;
}
