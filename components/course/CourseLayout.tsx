"use client";

import { ReactNode } from "react";

export function CourseLayout({ children }: { children: ReactNode }) {
  return (
    <div className="
      w-full
      min-h-screen
      flex
      flex-col
      gap-10
      px-6
      md:px-10
      lg:px-14
      py-6
    ">
      <div className="
        w-full
        max-w-[1400px]
        mx-auto
        flex
        flex-col
        gap-10
      ">
        {children}
      </div>
    </div>
  );
}