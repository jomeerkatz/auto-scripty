import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * List of routes that require authentication to access.
 * Routes are matched using startsWith, so "/studio" will also protect "/studio/anything".
 * 
 * Add additional protected routes to this array as needed.
 */
const PROTECTED_ROUTES = [
  "/studio",
  // Add more protected routes here later:
  // "/dashboard",
  // "/settings",
  // "/admin",
];

/**
 * Next.js Middleware
 * 
 * Runs on every request before the page is rendered.
 * 
 * Responsibilities:
 * - Creates Supabase client with proper cookie handling for server-side auth
 * - Checks if the requested route requires authentication
 * - Redirects unauthenticated users away from protected routes
 * - Maintains session state via cookies
 * 
 * Cookie handling is necessary because middleware runs on the edge/server
 * and needs to read/write auth cookies properly.
 * 
 * @param request - Incoming Next.js request object
 * @returns NextResponse with appropriate redirect or pass-through
 */
export async function middleware(request: NextRequest) {
  // Initialize response that will be modified if cookies need to be set
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client configured for middleware/server-side usage
  // This requires special cookie handling because middleware runs on the edge
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        // Read cookies from the incoming request
        getAll() {
          return request.cookies.getAll();
        },
        // Write cookies to both request and response
        // This ensures cookies persist across the request lifecycle
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          // Create new response with updated cookies
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

  // Get the current user session from Supabase
  const sessionResponse = await supabase.auth.getSession();
  const sessionData = sessionResponse.data?.session;

  // Extract the pathname to check if this route requires protection
  const pathname = request.nextUrl.pathname;

  // Check if the current route is in the protected routes list
  // Uses startsWith to support nested routes (e.g., "/studio" protects "/studio/*")
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // If route is protected and user is not authenticated, redirect to home with error
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

/**
 * Middleware configuration
 * 
 * Defines which routes the middleware should run on.
 * 
 * The matcher pattern excludes:
 * - Next.js static files (_next/static)
 * - Next.js image optimization (_next/image)
 * - Favicon
 * - Static image files (svg, png, jpg, jpeg, gif, webp)
 * 
 * This ensures middleware only runs on actual page routes, improving performance.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
