"use client";
import { useState } from "react";
import { UserAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

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
  if (!auth) {
    return (
      <div className="p-4 flex flex-col items-center text-red-700 bg-red-50 border border-red-200">
        Setup error: Auth context not found. Please refresh and try again.
      </div>
    );
  }
  const { signInUser, signUpNewUser, session } = auth;

  // check if user exists by signing in with the email and password
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
        return { exists: true, session: data.session };
      }
      return { exists: false };
    } catch (error) {
      return {
        exists: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (enabledSignIn) {
      // sign in mode
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
      // sign up mode
      console.log("sign up mode");
      // check if user exists
      const checkUserExistsResult = await checkUserExists({
        email: userEmail,
        password: userPassword,
      });

      // user exists and session is valid - redirect to studio
      if (checkUserExistsResult.exists && checkUserExistsResult.session) {
        try {
          setIsRedirecting(true);
          // User exists and password is correct - sign them in automatically
          // We already signed them in during checkUserExists, so we just need to redirect
          auth.setSession(checkUserExistsResult.session);
          router.push("/studio");
          return;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          setErrorMessage(`Sign in failed: ${errorMessage}`);
        } finally {
          setLoading(false);
        }
      }

      try {
        const result = await signUpNewUser({
          email: userEmail,
          password: userPassword,
        });
        // if (result.success) {
        //   console.log("sign up successful");
        //   setConfirmationEmailSent(true);
        // } else if (result.error) {
        //   console.log("sign up failed:", result.error);
        // }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setErrorMessage(`Sign up failed: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    // Modal backdrop with blur
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      {/* Modal content */}
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
          {/* default: sign up */}
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
