"use client";

import { useState } from "react";
import { Plus, Map, ClipboardPaste } from "lucide-react";
import { AddCourseModal } from "./AddCourseModal";
import { PasteCourseModal } from "./PasteCourseModal";
import { useRouter } from "next/navigation";
import { Course } from "@/lib/api/course";

interface DashboardHeaderProps {
  userId: string;
  onCourseCreated: () => void;
}

export function DashboardHeader({ userId, onCourseCreated }: DashboardHeaderProps) {
  const [open, setOpen] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        {/* Title block */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-1.5 rounded-full bg-gradient-to-b from-purple-400 to-violet-500 shrink-0" />
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight leading-none">
              Your Courses
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Track your learning progress across all courses
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => router.push("/roadmaps")}
            className="inline-flex items-center gap-2 rounded-xl border border-purple-100 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm shadow-purple-50 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all duration-200"
          >
            <Map size={14} className="text-gray-400" />
            Roadmaps
          </button>

          <button
            onClick={() => setPasteOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-purple-100 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm shadow-purple-50 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all duration-200"
          >
            <ClipboardPaste size={14} className="text-gray-400" />
            Import Course
          </button>

          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-purple-200 transition-all duration-200 active:scale-[0.98]"
          >
            <Plus size={14} />
            Add New Course
          </button>
        </div>

      </div>

      <AddCourseModal
        isOpen={open}
        onClose={() => setOpen(false)}
        userId={userId}
        onCreated={(course: Course) => {
          onCourseCreated();
          setOpen(false);
        }}
      />

      <PasteCourseModal
        isOpen={pasteOpen}
        onClose={() => setPasteOpen(false)}
        userId={userId}
        onCreated={(course: Course) => {
          onCourseCreated();
          setPasteOpen(false);
        }}
      />
    </>
  );
}