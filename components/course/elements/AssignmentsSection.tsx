"use client";

import { v4 as uuid } from "uuid";
import { Plus, Trash2 } from "lucide-react";
import { CourseSection } from "../CourseSection";
import { EditableField } from "@/components/ui/EditableField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCourseEditor } from "../editor/CourseEditorContext";
import { DraftAssignment } from "@/lib/course/draft";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AssignmentsSection() {
  const { draft, setDraft, markDirty } = useCourseEditor();

  const assignments = draft.assignments.filter(a => !a.isDeleted);

  function updateAssignment(id: string, patch: Partial<DraftAssignment>) {
    setDraft(d => ({
      ...d,
      assignments: d.assignments.map(a =>
        a.id === id ? { ...a, ...patch } : a
      ),
    }));
    markDirty();
  }

  function addAssignment() {
    setDraft(d => ({
      ...d,
      assignments: [
        ...d.assignments,
        {
          id: `temp_${uuid()}`,
          assignment_id: null,
          title: "New assignment",
          status: "pending",
          description: null,
          isNew: true,
        },
      ],
    }));
    markDirty();
  }

  function deleteAssignment(id: string) {
    setDraft(d => ({
      ...d,
      assignments: d.assignments.map(a =>
        a.id === id ? { ...a, isDeleted: true } : a
      ),
    }));
    markDirty();
  }

  return (
    <CourseSection
      title="Assignments"
      description="Evaluate your understanding"
      action={
        <Button
          size="sm"
          onClick={addAssignment}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white rounded-xl px-4 py-2 shadow-md shadow-purple-200 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Add Assignment
        </Button>
      }
    >
      {assignments.length === 0 ? (
        <div className="text-sm text-gray-400 bg-white border border-purple-100 rounded-xl p-4 text-center shadow-sm shadow-purple-50">
          No assignments added yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {assignments.map(assignment => (
            <div
              key={assignment.id}
              className="bg-white border border-purple-100 rounded-2xl p-4 shadow-sm shadow-purple-50 hover:shadow-md hover:scale-[1.01] transition-all duration-200 flex flex-col gap-3"
            >
              {/* Title */}
              <EditableField
                value={assignment.title}
                onChange={v => updateAssignment(assignment.id, { title: v })}
              >
                {({ value, onChange, onBlur }) => (
                  <Input
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    placeholder="Assignment title"
                    className="border border-purple-100 rounded-xl px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-purple-100 focus:border-purple-300"
                  />
                )}
              </EditableField>

              {/* Description */}
              <EditableField
                value={assignment.description || ""}
                onChange={v => updateAssignment(assignment.id, { description: v })}
              >
                {({ value, onChange, onBlur }) => (
                  <Textarea
                    rows={2}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    placeholder="Add description…"
                    className="border border-purple-100 rounded-xl px-3 py-2 text-sm text-gray-600 focus:ring-2 focus:ring-purple-100 focus:border-purple-300"
                  />
                )}
              </EditableField>

              {/* Footer */}
              <div className="flex items-center justify-between">
                {/* Status */}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>Status:</span>
                  <Select
                    value={assignment.status}
                    onValueChange={v =>
                      updateAssignment(assignment.id, { status: v })
                    }
                  >
                    <SelectTrigger className="w-32 h-8 text-xs rounded-xl border border-purple-100 bg-white shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Delete */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteAssignment(assignment.id)}
                  className="rounded-xl hover:bg-red-50 transition-all"
                >
                  <Trash2 className="h-4 w-4 text-red-400 hover:text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </CourseSection>
  );
}