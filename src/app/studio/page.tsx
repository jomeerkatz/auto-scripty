"use client";
import ScriptTextArea from "@/components/ScriptTextArea";
import { UserAuth } from "@/context/AuthContext";
export default function Studio() {
  const auth = UserAuth();
  if (!auth) {
    return (
      <div className="p-4 flex flex-col items-center text-red-700 bg-red-50 border border-red-200">
        Setup error: Auth context not found. Please refresh and try again.
      </div>
    );
  }

  const { session, signOutUser } = auth;
  console.log({ session });
  return (
    <div>
      <div className="bg-red-500">
        <p>sign out</p>
        <ScriptTextArea></ScriptTextArea>
      </div>
    </div>
  );
}
