"use client";
import { Session } from "@supabase/supabase-js";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { supabase } from "@/utils/supabase/client";

/**
 * Type definition for the authentication context.
 * Provides session management and authentication methods to consuming components.
 */
type AuthContextType = {
  /** Current user session, null if not authenticated */
  session: Session | null;
  /** Function to manually update the session state */
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
  /** Signs up a new user with email and password */
  signUpNewUser: (params: { email: string; password: string }) => Promise<{
    success: boolean;
    data?: any;
    session?: Session | null;
    error?: string | null;
  }>;
  /** Signs out the current user */
  signOutUser: () => Promise<{ success: boolean; error?: string | null }>;
  /** Signs in an existing user with email and password */
  signInUser: (params: { email: string; password: string }) => Promise<{
    success: boolean;
    data?: any;
    session?: Session | null;
    isEmailNotConfirmed?: boolean;
    error?: string;
  }>;
};

/**
 * AuthContext instance for sharing authentication state across the application.
 * Undefined when used outside of AuthContextProvider.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthContextProvider Component
 * 
 * Provides authentication context to the entire application.
 * Manages user session state and provides authentication methods (sign up, sign in, sign out).
 * 
 * Automatically syncs session state with Supabase auth changes, including:
 * - Initial session retrieval on mount
 * - Real-time session updates on auth state changes (sign in, sign out, token refresh)
 * 
 * @param children - Child components that will have access to auth context
 */
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  /**
   * Initialize session on mount and set up auth state listener.
   * The listener automatically updates session state when auth changes occur
   * (e.g., user signs in, signs out, token refreshes, etc.).
   */
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth state changes (sign in, sign out, token refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  /**
   * Signs up a new user with email and password.
   * 
   * Note: Supabase may require email confirmation depending on configuration.
   * If email confirmation is required, the session may be null until the user confirms.
   * 
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to success status, session data, and any error
   */
  const signUpNewUser = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) {
        console.error(
          `AuthContext.signUpNewUser: failed to sign up for email ${email}:`,
          error
        );
        return {
          success: false,
          data: undefined,
          session: null,
          error: `Sign up failed: ${error.message}`,
        };
      }

      if (data.session) {
        setSession(data.session);
      }

      return {
        success: true,
        data: data,
        session: data.session,
        error: undefined,
      };
    } catch (err) {
      console.error("AuthContext.signUpNewUser: unexpected error:", err);
      const message = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        data: undefined,
        session: null,
        error: `Sign up failed: ${message}`,
      };
    }
  };

  /**
   * Signs out the current user.
   * Clears the session and invalidates the auth token.
   * 
   * @returns Promise resolving to success status and any error
   */
  const signOutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("AuthContext.signOutUser: failed to sign out:", error);
        return { success: false, error: `Sign out failed: ${error.message}` };
      }
      return { success: true, error: undefined };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: `Sign out failed: ${message}` };
    }
  };

  /**
   * Signs in an existing user with email and password.
   * 
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to success status, session data, and any error
   */
  const signInUser = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return {
          success: false,
          error: `Sign in failed: ${error.message}`,
          isEmailNotConfirmed: error.code === "email_not_confirmed",
        };
      }
      if (data.session) {
        setSession(data.session);
      }

      return { success: true, data: data, session: data.session };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: `Sign in failed: ${message}` };
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, setSession, signUpNewUser, signInUser, signOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the authentication context.
 * 
 * @returns AuthContextType if used within AuthContextProvider, undefined otherwise
 * @throws Error if used outside of AuthContextProvider (returns undefined)
 * 
 * Usage:
 * ```tsx
 * const auth = UserAuth();
 * if (!auth) {
 *   // Handle error: component not wrapped in AuthContextProvider
 * }
 * ```
 */
export const UserAuth = () => {
  return useContext(AuthContext);
};
