"use client";
import { useState } from "react";
import { UserAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

/**
 * SignXFormModel Component
 * 
 * A modal component that handles both user sign-up and sign-in flows.
 * Implements a unified form that switches between sign-up and sign-in modes,
 * with automatic detection of existing users during sign-up to provide a
 * seamless experience.
 * 
 * Features:
 * - Toggle between sign-up and sign-in modes
 * - Automatic user detection during sign-up (if user exists, auto-signs them in)
 * - Email confirmation flow for new sign-ups
 * - Error handling and user feedback
 */
const SignXFormModel = () => {
  const [enabledSignIn, setEnabledSignIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const auth = UserAuth();
  const router = useRouter();
  
  // Early return if auth context is not available (shouldn't happen in normal flow)
  if (!auth) {
    return (
      <div className="p-4 flex flex-col items-center text-red-700 bg-red-50 border border-red-200">
        Setup error: Auth context not found. Please refresh and try again.
      </div>
    );
  }
  const { signInUser, signUpNewUser, session } = auth;

  // Hide modal if user is already authenticated or redirecting
  if (session || isRedirecting) {
    return null;
  }

  /**
   * Checks if a user exists by attempting to sign in with provided credentials.
   * This is used during sign-up flow to detect if the user already has an account.
   * 
   * Note: We sign out immediately after checking to avoid creating an unwanted session.
   * 
   * @param email - User's email address
   * @param password - User's password
   * @returns Object indicating if user exists and any error encountered
   */
  const checkUserExists = async ({
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
      if (data.session) {
        // Sign out immediately since we only wanted to check existence
        await supabase.auth.signOut();
        return { exists: true };
      }
      return { exists: false };
    } catch (error) {
      return {
        exists: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  /**
   * Handles form submission for both sign-in and sign-up flows.
   * 
   * Sign-in flow: Directly attempts to authenticate the user.
   * Sign-up flow: First checks if user exists (for UX improvement), then either
   * signs them in automatically if credentials match, or creates a new account.
   * 
   * @param event - Form submission event
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (enabledSignIn) {
      // Sign-in mode: Direct authentication attempt
      try {
        console.log("sign in user");
        const result = await signInUser({
          email: userEmail,
          password: userPassword,
        });
        if (result.success) {
          router.push("/studio");
        } else {
          const errorMessage =
            result.error || "Sign in failed: An unknown error occurred.";
          setErrorMessage(errorMessage);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setErrorMessage(`Sign in failed: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    } else {
      // Sign-up mode: Check if user exists first, then create account or auto-sign-in
      console.log("sign up mode");
      
      // Check if user already exists with these credentials
      const checkUserExistsResult = await checkUserExists({
        email: userEmail,
        password: userPassword,
      });

      if (checkUserExistsResult.exists) {
        // User exists with matching credentials - provide seamless UX by auto-signing in
        console.log(
          "user exists and password is correct - signing them in automatically"
        );
        setIsRedirecting(true);
        
        // Sign them in properly using the auth context (we signed out after checking)
        const signInResult = await signInUser({
          email: userEmail,
          password: userPassword,
        });

        if (signInResult.success) {
          setLoading(false);
          router.push("/studio");
        } else {
          setErrorMessage(
            "Account exists but sign in failed. Please try again."
          );
          // Fallback: Switch to sign-in mode so user can try again
          setEnabledSignIn(true);
        }
        return;
      }

      // User doesn't exist - proceed with sign-up
      try {
        const result = await signUpNewUser({
          email: userEmail,
          password: userPassword,
        });
        if (result.success) {
          console.log("sign up successful");
          setConfirmationEmailSent(true);
        } else if (result.error) {
          console.log("sign up failed:", result.error);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setErrorMessage(`Sign up failed: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }
  };

  console.log("enabledSignIn:", enabledSignIn);

  return (
    // Modal backdrop with blur effect for better visual separation
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      {/* Modal content container */}
      <div className="relative z-10 bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4">
        <div className="flex flex-col">
          <div className="text-center">
            <h1 className="text-2xl">
              {enabledSignIn ? "sign in!" : "sign up!"}
            </h1>
            <span>
              {" "}
              {enabledSignIn
                ? "dont have an account? sign up for free!"
                : "already have an account? sign in!"}{" "}
            </span>
            {/* Toggle button to switch between sign-up and sign-in modes */}
            <button
              type="button"
              onClick={() => setEnabledSignIn((prev) => !prev)}
              className="font-bold underline cursor-pointer bg-transparent border-none px-1 py-0.5 hover:text-blue-600 inline-block"
            >
              {enabledSignIn ? "sign up" : "sign in"}
            </button>
          </div>
        </div>

        <form onSubmit={(event) => handleSubmit(event)} className="mt-5">
          {/* Show confirmation message after successful sign-up */}
          {confirmationEmailSent && (
            <div>check your email for a confirmation link</div>
          )}
          <div className="flex flex-col gap-5">
            <input
              type="email"
              placeholder="enter your email here"
              required
              className="border border-black min-w-md p-3"
              onChange={(event) => {
                setUserEmail(event.target.value);
                // Clear error message when user starts typing
                if (errorMessage) setErrorMessage("");
              }}
              disabled={loading}
            ></input>
            <input
              type="password"
              placeholder="enter your password here"
              required
              className="border border-black min-w-md p-3"
              onChange={(event) => {
                setUserPassword(event.target.value);
                // Clear error message when user starts typing
                if (errorMessage) setErrorMessage("");
              }}
              disabled={loading}
            ></input>
            <button className="border p-3 min-w-md bg-black text-white hover:cursor-pointer hover:bg-white hover:text-black">
              {enabledSignIn ? "sign in now!" : "sign up now!"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignXFormModel;
