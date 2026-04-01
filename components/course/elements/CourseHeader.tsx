"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EditableField } from "../../ui/EditableField";
import { ShareButton } from "@/components/course/share/ShareButton";
import { useCourseEditor } from "../editor/CourseEditorContext";

export function CourseHeader() {
  const { draft, setDraft, markDirty, isPro } = useCourseEditor();

  const update = (patch: Partial<typeof draft>) => {
    setDraft(d => ({
      ...d,
      ...patch,
      isDirty: true,
    }));
  };

  if (!draft) return null;

  return (
    <div className="flex flex-col gap-6 pb-8">

      {/* CARD WRAPPER */}
      <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm shadow-purple-50 flex flex-col gap-6">

        {/* TITLE + SHARE */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <EditableField
              value={draft.title}
              onChange={(v) => update({ title: v })}
            >
              {({ value, onChange, onBlur }) => (
                <Input
                  autoFocus
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={onBlur}
                  placeholder="Course title..."
                  className="text-2xl font-semibold px-4 py-2 rounded-xl border border-purple-100 focus:ring-2 focus:ring-purple-100 focus:border-purple-300 text-gray-800"
                />
              )}
            </EditableField>
          </div>

          <div className="shrink-0 pt-1">
            <ShareButton courseId={draft.course_id} isPro={isPro} />
          </div>
        </div>

        {/* META */}
        <div className="flex flex-wrap items-center gap-4">

          {/* TYPE */}
          <EditableField
            value={draft.type}
            onChange={(v) => update({ type: v })}
          >
            {({ value, onChange, onBlur }) => (
              <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                placeholder="Type"
                className="w-36 rounded-xl border border-purple-100 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-purple-100 focus:border-purple-300"
              />
            )}
          </EditableField>

          {/* PRIORITY */}
          <Select
            value={draft.priority}
            onValueChange={(v) =>
              update({ priority: v as typeof draft.priority })
            }
          >
            <SelectTrigger className="w-32 rounded-xl border border-purple-100 bg-white shadow-sm text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          {/* STATUS */}
          <Select
            value={draft.status}
            onValueChange={(v) =>
              update({ status: v as typeof draft.status })
            }
          >
            <SelectTrigger className="w-36 rounded-xl border border-purple-100 bg-white shadow-sm text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <StatusBadge status={draft.status} />
        </div>

        {/* DESCRIPTION */}
        <EditableField
          value={draft.purpose || ""}
          onChange={(v) => update({ purpose: v })}
        >
          {({ value, onChange, onBlur }) => (
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              placeholder="Add a short description..."
              rows={3}
              className="rounded-xl border border-purple-100 px-4 py-3 text-sm text-gray-600 focus:ring-2 focus:ring-purple-100 focus:border-purple-300 resize-none"
            />
          )}
        </EditableField>

        {/* TOGGLES */}
        <div className="flex gap-6 pt-2 text-sm text-gray-600">

          <label className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-xl border border-purple-100">
            <Switch
              checked={draft.projects_enabled}
              onCheckedChange={(v) => update({ projects_enabled: v })}
            />
            Projects
          </label>

          <label className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-xl border border-purple-100">
            <Switch
              checked={draft.assignments_enabled}
              onCheckedChange={(v) => update({ assignments_enabled: v })}
            />
            Assignments
          </label>

        </div>
      </div>
    </div>
  );
}