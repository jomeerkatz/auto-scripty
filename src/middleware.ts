import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// List of all protected routes (add more as needed)
const PROTECTED_ROUTES = [
  "/studio",
  // Add more protected routes here later:
  // "/dashboard",
  // "/settings",
  // "/admin",
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    // configuration object for the supabase server client
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // const {
  //   data: { session },  // ← Hole "data", dann hole "session" aus data
  // } = await supabase.auth.getSession();

  // Get the current session
  const sessionResponse = await supabase.auth.getSession();
  // getSession: returns a response object with the session data like the user's email, id, etc.

  const sessionData = sessionResponse.data?.session;
  // sessionData: is the session data object with the user's email, id, etc.

  // Get the pathname of the request for example: /studio, /signin, /signup, etc.
  const pathname = request.nextUrl.pathname;

  // Check if the route is protected
  const isProtected = PROTECTED_ROUTES.some(
    (
      route // some: checks if ANY of the routes in the PROTECTED_ROUTES array start with the pathname
    ) => pathname.startsWith(route)
  );

  if (!sessionData && isProtected) {
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("error", "unauthorized");
    redirectUrl.searchParams.set(
      "message",
      "Please sign in to access this page"
    );
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
