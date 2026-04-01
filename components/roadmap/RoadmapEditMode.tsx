"use client"

import { useState } from "react"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"
import { GripVertical, X, Plus, Search, BookOpen } from "lucide-react"
import { useRoadmapEditor } from "./RoadmapEditorContext"
import { Course } from "@/lib/api/course"
import { AddCourseModal } from "@/components/dashboard/AddCourseModal"
import { Input } from "@/components/ui/input"

// ───────── Course Picker ─────────
function CoursePicker({ onClose }: { onClose: () => void }) {
  const { userCourses, courses, addExistingCourse } = useRoadmapEditor()
  const [search, setSearch] = useState("")

  const alreadyAdded = new Set(courses.map((c) => c.course_id))

  const filtered = userCourses.filter(
    (c) =>
      !alreadyAdded.has(c.course_id) &&
      c.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Add existing course</p>
        <button onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="pl-8 h-8 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1 max-h-52 overflow-y-auto">
        {filtered.map((course) => (
          <button
            key={course.course_id}
            onClick={() => {
              addExistingCourse(course)
              onClose()
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition"
          >
            <BookOpen size={14} />
            <span className="text-sm">{course.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ───────── MAIN ─────────
export function RoadmapEditMode() {
  const {
    title,
    description,
    courses,
    setCourses,
    setTitle,
    setDescription,
    removeCourse,
    addNewCourse,
    userId,
  } = useRoadmapEditor()

  const [showPicker, setShowPicker] = useState(false)
  const [showNewCourse, setShowNewCourse] = useState(false)

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return

    const reordered = Array.from(courses)
    const [removed] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, removed)

    setCourses(reordered)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Roadmap Info */}
      <div className="rounded-xl border p-5 flex flex-col gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Roadmap name"
          className="border rounded-lg px-3 py-2 text-sm"
        />

        <textarea
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Courses */}
      <div className="flex flex-col gap-3">
        <p className="text-xs text-muted-foreground">
          Courses ({courses.length})
        </p>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="courses">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col gap-2"
              >
                {courses.map((course, index) => (
                  <Draggable
                    key={course.course_id}
                    draggableId={course.course_id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center gap-3 border rounded-lg px-4 py-3"
                      >
                        <div {...provided.dragHandleProps}>
                          <GripVertical size={16} />
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {course.title}
                          </p>
                        </div>

                        <button
                          onClick={() => removeCourse(course.course_id)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Picker */}
        {showPicker && (
          <CoursePicker onClose={() => setShowPicker(false)} />
        )}

        {/* Buttons */}
        {!showPicker && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowPicker(true)}
              className="flex-1 border rounded-lg py-2 text-sm"
            >
              + Add existing
            </button>

            <button
              onClick={() => setShowNewCourse(true)}
              className="flex-1 border rounded-lg py-2 text-sm"
            >
              + Create new
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AddCourseModal
        isOpen={showNewCourse}
        onClose={() => setShowNewCourse(false)}
        userId={userId}
        onCreated={(newCourse: Course) => {
          addNewCourse(newCourse)
          setShowNewCourse(false)
        }}
      />
    </div>
  )
}