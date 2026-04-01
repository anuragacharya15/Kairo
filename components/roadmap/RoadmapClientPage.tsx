"use client"

import { useRoadmapEditor } from "./RoadmapEditorContext"
import { RoadmapViewMode } from "./RoadmapViewMode"
import { RoadmapEditMode } from "./RoadmapEditMode"
import { Pencil, X, Save, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RoadmapShareButton } from "./share/RoadmapShareButton"

export function RoadmapClientPage() {
  const {
    title,
    description,
    mode,
    setMode,
    isDirty,
    isSaving,
    save,
    roadmapId,
  } = useRoadmapEditor()

  async function handleSave() {
    await save()
    setMode("view")
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8">

      {/* ───────── HEADER CARD ───────── */}
      <div className="rounded-2xl border bg-card shadow-sm p-6 flex items-start justify-between gap-6">

        {/* LEFT */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h1 className="text-2xl font-semibold leading-tight">
              {title}
            </h1>
          </div>

          {description && (
            <p className="text-sm text-muted-foreground max-w-xl">
              {description}
            </p>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 shrink-0">

          {mode === "edit" ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode("view")}
                disabled={isSaving}
                className="gap-1.5"
              >
                <X size={14} />
                Cancel
              </Button>

              <Button
                size="sm"
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                className="gap-1.5"
              >
                {isSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <>
              <RoadmapShareButton roadmapId={roadmapId} />

              <Button
                variant="outline"
                size="sm"
                onClick={() => setMode("edit")}
                className="gap-1.5 hover:shadow-sm"
              >
                <Pencil size={14} />
                Edit
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ───────── CONTENT AREA ───────── */}
      <div className="rounded-2xl border bg-background p-6 shadow-sm">
        {mode === "view" ? <RoadmapViewMode /> : <RoadmapEditMode />}
      </div>

    </div>
  )
}