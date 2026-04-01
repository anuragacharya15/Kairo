"use client";

import { useEffect, useRef, useState } from "react";
import { CourseEditorContext } from "./CourseEditorContext";
import { DraftCourse, hydrateDraftCourse } from "@/lib/course/draft";

export function CourseEditorProvider({
  initialData,
  userId,
  isPro,
  children,
}: {
  initialData: any;
  userId: string;
  isPro: boolean;
  children: React.ReactNode;
}) {
  const [draft, _setDraft] = useState<DraftCourse | null>(null);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (!hasHydrated.current && initialData?.course) {
      _setDraft(hydrateDraftCourse(initialData, userId));
      hasHydrated.current = true;
    }
  }, [initialData, userId]);

  const setDraft: React.Dispatch<
    React.SetStateAction<DraftCourse>
  > = (updater) => {
    _setDraft((prev) => {
      if (!prev) return prev;

      return typeof updater === "function"
        ? (updater as (d: DraftCourse) => DraftCourse)(prev)
        : updater;
    });
  };

  function markDirty() {
    setDraft((d) => ({ ...d, isDirty: true }));
  }

  // ✅ Improved loading UI (instead of null)
  if (!draft) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-purple-100 bg-white shadow-sm shadow-purple-50 animate-pulse">
          <div className="h-4 w-4 rounded-full bg-gradient-to-br from-purple-400 to-violet-400" />
          <span className="text-sm text-gray-400 font-medium">
            Loading course...
          </span>
        </div>
      </div>
    );
  }

  return (
    <CourseEditorContext.Provider
      value={{ draft, setDraft, markDirty, isPro }}
    >
      {children}
    </CourseEditorContext.Provider>
  );
}