import { useMemo } from "react";
import { createClient } from "@/utils/supabase/client";

function useSupabase() {
  return useMemo(createClient, []);
}

export default useSupabase;
