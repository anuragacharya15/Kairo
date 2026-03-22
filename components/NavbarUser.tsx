"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { getInitials } from "@/lib/profile/getInitials";
import { LogoutButton } from "@/components/auth/LogoutButton";

interface Props {
  name: string;
  email: string;
}

export function NavbarUser({ name, email }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials = getInitials(name || email);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>

      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border border-transparent hover:border-purple-100 hover:bg-purple-50 transition-all duration-200"
      >
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 shadow-sm shadow-purple-200 flex items-center justify-center text-xs font-bold text-white shrink-0">
          {initials}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:inline max-w-[120px] truncate">
          {name || email}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 hidden sm:block transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-purple-100 bg-white shadow-xl shadow-purple-100/50 p-1.5 animate-in fade-in zoom-in-95 duration-150">

          {/* User info header */}
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 shadow-sm shadow-purple-200 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              {name && (
                <span className="text-sm font-semibold text-gray-800 truncate leading-snug">
                  {name}
                </span>
              )}
              <span className="text-xs text-gray-400 truncate leading-snug">
                {email}
              </span>
            </div>
          </div>

          <div className="h-px bg-purple-100 mx-1 mb-1" />

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150"
          >
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            Profile
          </Link>

          <Link
            href="/billing"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150"
          >
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            Billing
          </Link>

          <div className="h-px bg-purple-100 mx-1 my-1" />

          <LogoutButton
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
          />

        </div>
      )}
    </div>
  );
}