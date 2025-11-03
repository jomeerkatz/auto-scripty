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

type AuthContextType = {
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
  signUpNewUser: (params: { email: string; password: string }) => Promise<{
    success: boolean;
    data?: any;
    session?: Session | null;
    error?: string | null;
  }>;
  signOutUser: () => Promise<{ success: boolean; error?: string | null }>;
  signInUser: (params: { email: string; password: string }) => Promise<{
    success: boolean;
    data?: any;
    session?: Session | null;
    error?: string;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  // get session on mount and listen for changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // sign up function
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

  // sign out function
  const signOutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("AuthContext.signOutUser: failed to sign out:", error);
        return { success: false, error: `Sign out failed: ${error.message}` };
      }
      return { success: true, error: undefined };
    } catch (err) {
      console.error("AuthContext.signOutUser: unexpected error:", err);
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: `Sign out failed: ${message}` };
    }
  };

  // sign in function
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
        console.error(
          `AuthContext.signInUser: failed to sign in for email ${email}:`,
          error
        );
        return { success: false, error: `Sign in failed: ${error.message}` };
      }
      if (data.session) {
        setSession(data.session);
      }

      return { success: true, data: data, session: data.session };
    } catch (err) {
      console.error("AuthContext.signInUser: unexpected error:", err);
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

export const UserAuth = () => {
  return useContext(AuthContext);
};
