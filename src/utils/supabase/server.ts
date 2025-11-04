import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client configured for server-side usage.
 * 
 * This client is designed for use in:
 * - Server Components
 * - API Routes (Route Handlers)
 * - Server Actions
 * 
 * Features:
 * - Reads/writes cookies from Next.js cookie store
 * - Handles authentication on the server side
 * - Properly manages session state via cookies
 * 
 * Note: The setAll cookie handler includes error handling because it may be
 * called from Server Components where cookie setting is restricted. This is
 * safe to ignore if middleware is handling session refresh.
 * 
 * @returns Promise resolving to a configured Supabase client instance
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        // Read cookies from Next.js cookie store
        getAll() {
          return cookieStore.getAll();
        },
        // Write cookies to Next.js cookie store
        // Error handling needed because Server Components may restrict cookie setting
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
