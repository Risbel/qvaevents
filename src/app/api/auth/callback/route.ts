import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      // Check if this is a new user (first time signing in)
      const { data: existingProfile } = await supabase
        .from("ClientProfile")
        .select("id")
        .eq("user_id", data.user.id)
        .single();

      // If no existing profile, create one
      if (!existingProfile && data.user.email) {
        // Extract username from email (part before @)
        const username = data.user.email.split("@")[0];

        const { error: profileError } = await supabase.from("ClientProfile").insert({
          user_id: data.user.id,
          username: username,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || username,
        });
      }

      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?message=Error-Authentication-Google`);
}
