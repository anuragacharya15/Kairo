import Link from "next/link";
import { Suspense } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { AuthButton } from "@/components/auth/AuthButton";

export function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-50 border-b border-purple-100 bg-white/80 backdrop-blur-md">
      <div className="h-16 w-full px-6 flex items-center justify-between max-w-screen-xl mx-auto">

        {/* Brand */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group"
        >
          <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 shadow-sm shadow-purple-200 flex items-center justify-center">
            <span className="text-white text-xs font-bold tracking-tight">B</span>
          </div>
          <span className="font-semibold text-sm tracking-tight text-gray-800 group-hover:text-purple-600 transition-colors duration-200">
            BEVENLEE
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl border border-purple-100 bg-white shadow-sm shadow-purple-50 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200">
            <ThemeSwitcher />
          </div>
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>

      </div>
    </nav>
  );
}