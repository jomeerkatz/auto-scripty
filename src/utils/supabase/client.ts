import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase Client for Browser/Client-side Usage
 * 
 * Creates a Supabase client instance configured for use in client components.
 * This client automatically handles:
 * - Browser cookie management for authentication
 * - Token refresh
 * - Session persistence
 * 
 * Use this client in:
 * - Client components (marked with "use client")
 * - React hooks and event handlers
 * - Browser-side authentication flows
 * 
 * Note: Do NOT use this in server components or API routes.
 * Use the server client from @/utils/supabase/server instead.
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);
