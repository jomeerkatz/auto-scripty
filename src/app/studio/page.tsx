"use client";
import ScriptTextArea from "@/components/ScriptTextArea";
import { UserAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
export default function Studio() {
  const router = useRouter();
  const auth = UserAuth();
  if (!auth) {
    return (
      <div className="p-4 flex flex-col items-center text-red-700 bg-red-50 border border-red-200">
        Setup error: Auth context not found. Please refresh and try again.
      </div>
    );
  }

  const { session, signOutUser } = auth;

  console.log("current session:", { session });

  const handleSignOut = async () => {
    try {
      const result = await signOutUser();
      if (result.success) {
        router.push("/signup");
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
