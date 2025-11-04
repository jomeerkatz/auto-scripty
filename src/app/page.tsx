"use client";
import Link from "next/link";
import SignXFormModel from "@/components/SignXFormModel";
import { UserAuth } from "@/context/AuthContext";

/**
 * Home Page Component
 * 
 * The landing page of the application. Displays:
 * - Welcome message
 * - Navigation link to the studio (protected route)
 * - Sign-up/Sign-in modal if user is not authenticated
 * 
 * The modal is conditionally rendered based on authentication status.
 */
export default function Home() {
  const currentSession = UserAuth()?.session;

  return (
    <div className="flex-1 flex flex-col">
      <div className="text-center">
        <h1 className="text-2xl py-4">welcome to auto scripty</h1>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Link
          href="/studio"
          className="px-6 py-3 bg-gray-200 text-black rounded-lg font-semibold 
                     hover:bg-gray-400 transition-colors cursor-pointer"
        >
          Go to Studio
        </Link>
      </div>
      {/* Show sign-up/sign-in modal only if user is not authenticated */}
      {!currentSession && <SignXFormModel />}
    </div>
  );
}
