"use client";

import { v4 as uuid } from "uuid";
import { Plus, Trash2 } from "lucide-react";
import { CourseSection } from "../CourseSection";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditableField } from "@/components/ui/EditableField";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DraftProject } from "@/lib/course/draft";
import { useCourseEditor } from "../editor/CourseEditorContext";

export function ProjectsSection() {
  const { draft, setDraft, markDirty } = useCourseEditor();
  const projects = draft.projects.filter(p => !p.isDeleted);

  function updateProject(id: string, patch: Partial<DraftProject>) {
    setDraft(d => ({
      ...d,
      projects: d.projects.map(p =>
        p.id === id ? { ...p, ...patch } : p
      ),
    }));
    markDirty();
  }

  function addProject() {
    setDraft(d => ({
      ...d,
      projects: [
        ...d.projects,
        {
          id: `temp_${uuid()}`,
          project_id: null,
          title: "New project",
          status: "planned",
          description: null,
          isNew: true,
        },
      ],
    }));
    markDirty();
  }

  function deleteProject(id: string) {
    setDraft(d => ({
      ...d,
      projects: d.projects.map(p =>
        p.id === id ? { ...p, isDeleted: true } : p
      ),
    }));
    markDirty();
  }

  return (
    <CourseSection
      title="Projects"
      description="Hands-on practical work"
      action={
        <Button
          size="sm"
          onClick={addProject}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white rounded-xl px-4 py-2 shadow-md shadow-purple-200 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      }
    >
      {projects.length === 0 ? (
        <div className="text-sm text-gray-400 bg-white border border-purple-100 rounded-xl p-4 text-center shadow-sm shadow-purple-50">
          No projects added yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map(project => (
            <div
              key={project.id}
              className="bg-white border border-purple-100 rounded-2xl p-4 shadow-sm shadow-purple-50 hover:shadow-md hover:scale-[1.01] transition-all duration-200 flex flex-col gap-3"
            >
              {/* Title */}
              <EditableField
                value={project.title}
                onChange={v => updateProject(project.id, { title: v })}
              >
                {({ value, onChange, onBlur }) => (
                  <Input
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    placeholder="Project title"
                    className="border border-purple-100 rounded-xl px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-purple-100 focus:border-purple-300"
                  />
                )}
              </EditableField>

              {/* Description */}
              <EditableField
                value={project.description || ""}
                onChange={v => updateProject(project.id, { description: v })}
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
                    value={project.status}
                    onValueChange={v => updateProject(project.id, { status: v })}
                  >
                    <SelectTrigger className="w-32 h-8 text-xs rounded-xl border border-purple-100 bg-white shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Delete */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteProject(project.id)}
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