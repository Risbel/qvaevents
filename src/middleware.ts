import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const intlMiddleware = createMiddleware(routing);

  // Handle both auth and i18n
  const authResponse = await updateSession(request);
  const response = intlMiddleware(request);

  // Copy auth cookies
  authResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value);
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
