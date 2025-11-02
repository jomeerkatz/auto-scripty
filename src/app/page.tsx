// src/app/page.tsx
import Link from "next/link";

export default function Home() {
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
    </div>
  );
}
