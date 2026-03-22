"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { APIError, Course } from "@/lib/api/course";
import { UpgradeModal } from "@/components/subscription/UpgradeModal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createCourseAction } from "@/lib/course/createCourseAction";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onCreated: (course: Course) => void;
}

export function AddCourseModal({
  isOpen,
  onClose,
  userId,
  onCreated,
}: AddCourseModalProps) {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] =
    useState<"planned" | "active" | "paused" | "completed">("planned");
  const [priority, setPriority] =
    useState<"low" | "medium" | "high">("medium");
  const [projectsEnabled, setProjectsEnabled] = useState(true);
  const [assignmentsEnabled, setAssignmentsEnabled] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setPurpose("");
    setType("");
    setStatus("planned");
    setPriority("medium");
    setProjectsEnabled(true);
    setAssignmentsEnabled(true);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!name || !type) return;
    setLoading(true);
    setError(null);
    try {
      const data = await createCourseAction({
        userId,
        title: name,
        purpose: purpose || undefined,
        type,
        status,
        priority,
        projectsEnabled,
        assignmentsEnabled,
      });
      resetForm();
      onCreated(data.course);
      onClose();
    } catch (err: unknown) {
      if (err instanceof APIError) {
        if (err.code === "PLAN_LIMIT_EXCEEDED") {
          setShowUpgrade(true);
          return;
        }
        setError(err.message);
        return;
      }
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">

      {/* Overlay */}
      <div className="fixed inset-0 bg-purple-950/20 backdrop-blur-sm" />

      {/* Panel wrapper */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-lg rounded-2xl bg-white border border-purple-100 shadow-xl shadow-purple-100/50 flex flex-col gap-0 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-purple-50">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 shadow-sm shadow-purple-200 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <Dialog.Title className="text-base font-semibold text-gray-800 tracking-tight">
                Add New Course
              </Dialog.Title>
            </div>
            <button
              onClick={onClose}
              className="h-7 w-7 flex items-center justify-center rounded-xl border border-purple-100 bg-purple-50 text-gray-400 hover:bg-purple-100 hover:text-purple-600 hover:border-purple-200 transition-all duration-200"
            >
              <X size={14} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex flex-col gap-5 px-7 py-6 overflow-y-auto max-h-[70vh]">

            {/* Course Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Course Name <span className="text-red-400 normal-case tracking-normal">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. React Basics"
                className="h-10 w-full rounded-xl border border-purple-100 bg-white px-4 text-sm text-gray-700 font-medium placeholder:text-gray-300 placeholder:font-normal shadow-sm shadow-purple-50 transition-all duration-200 hover:border-purple-200 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Purpose */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Purpose
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Why are you taking this course?"
                className="min-h-[88px] w-full rounded-xl border border-purple-100 bg-white px-4 py-3 text-sm text-gray-700 font-medium leading-relaxed placeholder:text-gray-300 placeholder:font-normal shadow-sm shadow-purple-50 resize-y transition-all duration-200 hover:border-purple-200 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Type <span className="text-red-400 normal-case tracking-normal">*</span>
              </label>
              <input
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="e.g. Frontend / Backend / DSA"
                className="h-10 w-full rounded-xl border border-purple-100 bg-white px-4 text-sm text-gray-700 font-medium placeholder:text-gray-300 placeholder:font-normal shadow-sm shadow-purple-50 transition-all duration-200 hover:border-purple-200 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Status + Priority row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Status
                </label>
                <Select value={status} onValueChange={(v) => setStatus(v as "planned" | "active" | "paused" | "completed")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Priority
                </label>
                <Select value={priority} onValueChange={(v) => setPriority(v as "low" | "medium" | "high")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col gap-3 rounded-xl border border-purple-100 bg-purple-50/40 p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-gray-700">Keep Projects</span>
                  <span className="text-xs text-gray-400">Track project-based work for this course</span>
                </div>
                <Checkbox
                  className="h-5 w-5"
                  checked={projectsEnabled}
                  onCheckedChange={(c) => setProjectsEnabled(!!c)}
                />
              </div>

              <div className="h-px bg-purple-100" />

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-gray-700">Keep Assignments</span>
                  <span className="text-xs text-gray-400">Track assignments and submissions</span>
                </div>
                <Checkbox
                  className="h-5 w-5"
                  checked={assignmentsEnabled}
                  onCheckedChange={(c) => setAssignmentsEnabled(!!c)}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <svg className="w-4 h-4 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm text-red-500 font-medium">{error}</p>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-purple-50">
            <button
              onClick={onClose}
              className="h-9 px-4 rounded-xl border border-purple-100 bg-white text-sm font-medium text-gray-500 hover:bg-purple-50 hover:text-gray-700 hover:border-purple-200 transition-all duration-200"
            >
              Cancel
            </button>
            <Button
              onClick={handleSubmit}
              disabled={!name || !type || loading}
              className="h-9 px-5 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white text-sm font-medium shadow-md shadow-purple-200 border-0 disabled:opacity-40 transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Creating…
                </span>
              ) : (
                "Create Course"
              )}
            </Button>
          </div>

        </Dialog.Panel>

        <UpgradeModal
          isOpen={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          message="You've reached the course limit for your current plan. Upgrade to create more courses."
        />
      </div>
    </Dialog>
  );
}