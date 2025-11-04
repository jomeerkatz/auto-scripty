"use client";
import ScriptTextArea from "@/components/ScriptTextArea";
import { UserAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

/**
 * Studio Page Component
 * 
 * Protected page that allows authenticated users to:
 * - View their current session information
 * - Create and save scripts using the ScriptTextArea component
 * - Sign out from their account
 * 
 * This page requires authentication (enforced by middleware).
 * Users without a session will be redirected to the home page.
 */
export default function Studio() {
  const router = useRouter();
  const auth = UserAuth();

  // Early return if auth context is not available (shouldn't happen in normal flow)
  if (!auth) {
    return (
      <div className="p-4 flex flex-col items-center text-red-700 bg-red-50 border border-red-200">
        Setup error: Auth context not found. Please refresh and try again.
      </div>
    );
  }

  const { session, signOutUser } = auth;

  console.log("current session:", { session });

  /**
   * Handles user sign-out.
   * Signs out the user and redirects to the home page.
   * Shows an alert if sign-out fails.
   */
  const handleSignOut = async () => {
    try {
      const result = await signOutUser();
      if (result.success) {
        router.push("/");
      } else {
        alert("sign out failed");
        console.error("sign out failed:", result.error);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      alert(`sign out failed: ${message}`);
      console.error("sign out failed:", error);
    }
  };

  return (
    <div>
      <div className="bg-red-500">
        <div className="flex justify-end p-4" onClick={handleSignOut}>
          <p className="underline cursor-pointer border-1 p-2">sign out</p>
        </div>
        <div>
          <p className="bg-white">welcome back, {session?.user?.email}</p>
        </div>
        <ScriptTextArea></ScriptTextArea>
      </div>
    </div>
  );
}
