"use client"

import { createContext, useContext } from "react"
import { RoadmapCourse } from "@/lib/api/roadmap"
import { Course } from "@/lib/api/course"

// ─────────────────────────────────────────────
// Context Types
// ─────────────────────────────────────────────
interface RoadmapEditorContextValue {
  // ───── Data ─────
  roadmapId: string
  title: string
  description: string | null
  courses: RoadmapCourse[]
  userCourses: Course[]
  userId: string

  // ───── State ─────
  isDirty: boolean
  isSaving: boolean
  mode: "view" | "edit"

  // ───── Setters ─────
  setTitle: (title: string) => void
  setDescription: (desc: string) => void
  setCourses: (courses: RoadmapCourse[]) => void
  setMode: (mode: "view" | "edit") => void

  // ───── Actions ─────
  addExistingCourse: (course: Course) => void
  addNewCourse: (course: Course) => void
  removeCourse: (courseId: string) => void
  save: () => Promise<void>
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
export const RoadmapEditorContext =
  createContext<RoadmapEditorContextValue | null>(null)

// ─────────────────────────────────────────────
// Hook (safe + clean error)
// ─────────────────────────────────────────────
export function useRoadmapEditor() {
  const ctx = useContext(RoadmapEditorContext)

  if (!ctx) {
    throw new Error(
      "useRoadmapEditor must be used inside <RoadmapEditorProvider />"
    )
  }

  return ctx
}