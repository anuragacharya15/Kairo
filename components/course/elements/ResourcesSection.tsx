"use client";

import { v4 as uuid } from "uuid";
import { ExternalLink, Plus, Trash2 } from "lucide-react";

import { CourseSection } from "../CourseSection";
import { EditableField } from "@/components/ui/EditableField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DraftResource } from "@/lib/course/draft";
import { useCourseEditor } from "../editor/CourseEditorContext";

export function ResourcesSection() {
  const { draft, setDraft, markDirty } = useCourseEditor();

  const resources = draft.resources.filter(r => !r.isDeleted);

  function updateResource(id: string, patch: Partial<DraftResource>) {
    setDraft(d => ({
      ...d,
      resources: d.resources.map(r =>
        r.id === id ? { ...r, ...patch } : r
      ),
    }));
    markDirty();
  }

  function addResource() {
    setDraft(d => ({
      ...d,
      resources: [
        ...d.resources,
        {
          id: `temp_${uuid()}`,
          resource_id: null,
          course_id: d.course_id,
          topic_id: null,
          title: "New resource",
          url: "",
          isNew: true,
        },
      ],
    }));
    markDirty();
  }

  function deleteResource(id: string) {
    setDraft(d => ({
      ...d,
      resources: d.resources.map(r =>
        r.id === id ? { ...r, isDeleted: true } : r
      ),
    }));
    markDirty();
  }

  return (
    <CourseSection
      title="Resources"
      description="Docs, links, and reference material"
      action={
        <Button
          size="sm"
          onClick={addResource}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white rounded-xl px-4 py-2 shadow-md shadow-purple-200 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Add Resource
        </Button>
      }
    >
      {resources.length === 0 ? (
        <div className="text-sm text-gray-400 bg-white border border-purple-100 rounded-xl p-4 text-center shadow-sm shadow-purple-50">
          No resources added yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {resources.map(resource => (
            <div
              key={resource.id}
              className="bg-white border border-purple-100 rounded-2xl p-4 shadow-sm shadow-purple-50 hover:shadow-md hover:scale-[1.01] transition-all duration-200 flex items-center justify-between gap-4"
            >
              {/* LEFT */}
              <div className="flex flex-col gap-2 flex-1">

                {/* Title */}
                <EditableField
                  value={resource.title}
                  onChange={v =>
                    updateResource(resource.id, { title: v })
                  }
                >
                  {({ value, onChange, onBlur }) => (
                    <Input
                      value={value}
                      onChange={e => onChange(e.target.value)}
                      onBlur={onBlur}
                      placeholder="Resource title"
                      className="border border-purple-100 rounded-xl px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-purple-100 focus:border-purple-300"
                    />
                  )}
                </EditableField>

                {/* URL */}
                <EditableField
                  value={resource.url || ""}
                  onChange={v =>
                    updateResource(resource.id, { url: v })
                  }
                >
                  {({ value, onChange, onBlur }) => (
                    <Input
                      value={value}
                      onChange={e => onChange(e.target.value)}
                      onBlur={onBlur}
                      placeholder="https://..."
                      className="border border-purple-100 rounded-xl px-3 py-2 text-sm text-gray-500 focus:ring-2 focus:ring-purple-100 focus:border-purple-300"
                    />
                  )}
                </EditableField>

              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex items-center gap-3">

                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-purple-100 bg-white hover:bg-purple-50 transition-all"
                  >
                    <ExternalLink
                      size={14}
                      className="text-gray-400 hover:text-purple-600"
                    />
                  </a>
                )}

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteResource(resource.id)}
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