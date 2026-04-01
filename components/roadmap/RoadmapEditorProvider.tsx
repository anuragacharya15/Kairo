"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { RoadmapEditorContext } from "./RoadmapEditorContext"
import { RoadmapDetail, RoadmapCourse, saveRoadmap } from "@/lib/api/roadmap"
import { Course } from "@/lib/api/course"

export function RoadmapEditorProvider({
  initialDetail,
  userCourses,
  userId,
  children,
}: {
  initialDetail: RoadmapDetail
  userCourses: Course[]
  userId: string
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get("mode") === "edit" ? "edit" : "view"

  const [title, setTitleState] = useState(initialDetail.roadmap.title)
  const [description, setDescriptionState] = useState<string | null>(
    initialDetail.roadmap.description
  )
  const [courses, setCoursesState] = useState<RoadmapCourse[]>(
    initialDetail.courses
  )
  const [mode, setMode] = useState<"view" | "edit">(initialMode)
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const roadmapId = initialDetail.roadmap.roadmap_id

  function markDirty() {
    setIsDirty(true)
  }

  function setTitle(t: string) {
    setTitleState(t)
    markDirty()
  }

  function setDescription(d: string) {
    setDescriptionState(d)
    markDirty()
  }

  function setCourses(c: RoadmapCourse[]) {
    setCoursesState(c)
    markDirty()
  }

  // ✅ safer add (no stale state bug)
  function addExistingCourse(course: Course) {
    setCoursesState((prev) => {
      const already = prev.some((c) => c.course_id === course.course_id)
      if (already) return prev

      const newCourse: RoadmapCourse = {
        course_id: course.course_id,
        title: course.title,
        type: course.type,
        status: course.status,
        priority: course.priority,
        purpose: course.purpose ?? null,
        projects_enabled: false,
        assignments_enabled: false,
        topics: [],
        total_topics: 0,
        completed_topics: 0,
      }

      setIsDirty(true)
      return [...prev, newCourse]
    })
  }

  function addNewCourse(course: Course) {
    addExistingCourse(course)
  }

  // ✅ safer remove
  function removeCourse(courseId: string) {
    setCoursesState((prev) => {
      setIsDirty(true)
      return prev.filter((c) => c.course_id !== courseId)
    })
  }

  async function save() {
    setIsSaving(true)
    try {
      await saveRoadmap(roadmapId, {
        title,
        description,
        course_ids: courses.map((c) => c.course_id),
      })
      setIsDirty(false)
    } finally {
      setIsSaving(false)
    }
  }

  // ✅ prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      roadmapId,
      title,
      description,
      courses,
      userCourses,
      userId,
      isDirty,
      isSaving,
      mode,
      setTitle,
      setDescription,
      setCourses,
      setMode,
      addExistingCourse,
      addNewCourse,
      removeCourse,
      save,
    }),
    [
      roadmapId,
      title,
      description,
      courses,
      userCourses,
      userId,
      isDirty,
      isSaving,
      mode,
    ]
  )

  return (
    <RoadmapEditorContext.Provider value={value}>
      {children}
    </RoadmapEditorContext.Provider>
  )
}