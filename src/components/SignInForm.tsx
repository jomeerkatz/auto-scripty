"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { UserAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const auth = UserAuth();

  if (!auth) {
    return (
      <div className="p-4 flex flex-col items-center text-red-700 bg-red-50 border border-red-200">
        Setup error: Auth context not found. Please refresh and try again.
      </div>
    );
  }

  const { session, signUpNewUser, signInUser, signOutUser, setSession } = auth;
  // todo: check before production
  console.log({
    isAuthed: !!session,
    user: session?.user,
    accessTokenPreview: session?.access_token?.slice(0, 12),
    expiresAt: session?.expires_at,
  });

  console.log("current email:", email);
  console.log("current password:", password);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    console.log("in handleSignIn");
    try {
      // sign in user
      const result = await signInUser({ email, password });
      // check it sign in was successful
      if (result.success) {
        router.push("/studio"); // if successful, redirect to studio
      } else {
        const errorMessage =
          result.error || "Sign in failed: An unknown error occurred.";
        setError(errorMessage);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(`Sign in failed: ${message}`);
      console.error("SignInForm.handleSignIn: unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <p>sign in now!</p>
      <p>
        don't have an account? signup{" "}
        <Link href="/signup" className="underline">
          here
        </Link>
      </p>
      {error && (
        <div className="mt-3 max-w-md w-full text-red-700 bg-red-50 border border-red-200 p-3">
          {error}
        </div>
      )}
      <form onSubmit={(event) => handleSignIn(event)}>
        <div className="flex flex-col gap-4 mt-4">
          <input
            type="email"
            name=""
            placeholder="enter your email here"
            required
            className="border border-black min-w-md p-3"
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError("");
            }}
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="enter your password here"
            className="border border-black min-w-md p-3"
            required
            onChange={(event) => {
              setPassword(event.target.value);
              if (error) setError("");
            }}
            disabled={loading}
          />
          <button
            className="border max-w-md hover:cursor-pointer hover:bg-white hover:text-black p-3"
            type="submit"
            disabled={loading}
          >
            {loading ? "signing in, this may take a moment..." : "sign in"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
