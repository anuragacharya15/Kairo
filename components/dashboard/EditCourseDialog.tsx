"use client"

import { useState } from "react"
import { Course, updateCourseMetadata } from "@/lib/api/course"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Props {
  course: Course
  onClose: () => void
  onSaved: () => void
}

export function EditCourseDialog({ course, onClose, onSaved }: Props) {
  const [title, setTitle] = useState(course.title)
  const [purpose, setPurpose] = useState(course.purpose || "")
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (saving) return
    try {
      setSaving(true)
      await updateCourseMetadata(course.course_id, { title, purpose })
      onSaved()
    } catch (err) {
      console.error(err)
      alert("Failed to update")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl border-purple-100 bg-white p-0 shadow-xl shadow-purple-100/50 overflow-hidden">

        <DialogHeader className="px-7 pt-6 pb-5 border-b border-purple-50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 shadow-sm shadow-purple-200 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <DialogTitle className="text-base font-semibold text-gray-800 tracking-tight">
              Edit Course
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-5 px-7 py-6">

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Course Title
            </label>
            <Input
              value={title}
              disabled={saving}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. React Fundamentals"
              className="h-10 rounded-xl border-purple-100 bg-white px-4 text-sm text-gray-700 font-medium placeholder:text-gray-300 shadow-sm focus:border-purple-300 focus:ring-2 focus:ring-purple-100 disabled:opacity-40 disabled:bg-gray-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Purpose
            </label>
            <Input
              value={purpose}
              disabled={saving}
              onChange={e => setPurpose(e.target.value)}
              placeholder="Why are you taking this course?"
              className="h-10 rounded-xl border-purple-100 bg-white px-4 text-sm text-gray-700 font-medium placeholder:text-gray-300 shadow-sm focus:border-purple-300 focus:ring-2 focus:ring-purple-100 disabled:opacity-40 disabled:bg-gray-50"
            />
          </div>

        </div>

        <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-purple-50">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={saving}
            className="h-9 px-4 rounded-xl border border-purple-100 bg-white text-sm font-medium text-gray-500 hover:bg-purple-50 hover:text-gray-700 hover:border-purple-200 transition-all duration-200 shadow-none"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="h-9 px-5 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white text-sm font-medium shadow-md shadow-purple-200 border-0 disabled:opacity-40 transition-all duration-200"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Saving…
              </span>
            ) : "Save changes"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  )
}