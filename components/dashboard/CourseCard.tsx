"use client"

import Link from "next/link"
import { ArrowRight, MoreVertical, Pencil, Trash } from "lucide-react"
import { Course } from "@/lib/api/course"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { deleteCourse } from "@/lib/api/course"
import { useRouter } from "next/navigation"
import { useState } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Props {
  course: Course
  onEdit?: (course: Course) => void
  onDeleted?: (courseId: string) => void
}

export function CourseCard({ course, onEdit, onDeleted }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (deleting) return
    try {
      setDeleting(true)
      await deleteCourse(course.course_id)
      setOpen(false)
      onDeleted?.(course.course_id)
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="group rounded-2xl border border-purple-100 bg-white p-5 flex flex-col gap-4 shadow-sm shadow-purple-50 hover:shadow-md hover:shadow-purple-100/60 hover:border-purple-200 transition-all duration-200">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold text-base text-gray-800 leading-snug tracking-tight flex-1">
          {course.title}
        </h2>

        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={course.status} />

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-center h-7 w-7 rounded-xl border border-purple-100 bg-white text-gray-400 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-all duration-150 focus:outline-none">
              <MoreVertical size={14} />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  if (onEdit) onEdit(course)
                  else console.warn("onEdit not provided")
                }}
              >
                <Pencil size={13} className="mr-2 text-gray-400" />
                Edit
              </DropdownMenuItem>

              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault()
                      setOpen(true)
                    }}
                    className="text-red-500 focus:text-red-500 focus:bg-red-50"
                  >
                    <Trash size={13} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete course?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently
                      delete this course and its progress.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={deleting}
                      className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white border-0 shadow-sm shadow-red-200"
                    >
                      {deleting ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          Deleting…
                        </span>
                      ) : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Purpose */}
      {course.purpose && (
        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
          {course.purpose}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-500 tracking-wide">
          {course.type}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-purple-50 flex justify-end">
        <Link
          href={`/course/${course.course_id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-500 hover:text-purple-700 transition-colors duration-150 group/link"
        >
          Open course
          <ArrowRight size={13} className="transition-transform duration-150 group-hover/link:translate-x-0.5" />
        </Link>
      </div>

    </div>
  )
}