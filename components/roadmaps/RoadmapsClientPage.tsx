"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Map, ArrowRight, Trash2 } from "lucide-react"
import { useRoadmaps } from "./RoadmapsContext"
import { CreateRoadmapModal } from "./CreateRoadmapModal"
import { deleteRoadmap } from "@/lib/api/roadmap"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function RoadmapsClientPage() {
  const router = useRouter()
  const { roadmaps, removeRoadmap } = useRoadmaps()
  const [createOpen, setCreateOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!deletingId || deleting) return
    setDeleting(true)
    try {
      await deleteRoadmap(deletingId)
      removeRoadmap(deletingId)
      setDeletingId(null)
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col gap-10">

      {/* ───────── Header ───────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roadmaps</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Structured learning paths to reach your goals
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90 transition"
        >
          <Plus size={16} />
          New Roadmap
        </button>
      </div>

      {/* ───────── Empty State ───────── */}
      {roadmaps.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 py-28 text-center border rounded-2xl bg-muted/20">
          <div className="rounded-full bg-background p-6 shadow-sm">
            <Map size={32} className="text-muted-foreground" />
          </div>

          <div>
            <p className="font-semibold text-lg">No roadmaps yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first roadmap to start tracking your learning journey
            </p>
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90 transition"
          >
            <Plus size={16} />
            Create Roadmap
          </button>
        </div>
      ) : (

        /* ───────── Grid ───────── */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmaps.map(roadmap => (
            <div
              key={roadmap.roadmap_id}
              className="group rounded-2xl border bg-card p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all"
            >

              {/* Top */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-primary/10 p-2">
                    <Map size={18} className="text-primary" />
                  </div>

                  <div>
                    <h2 className="font-semibold leading-tight group-hover:text-primary transition">
                      {roadmap.title}
                    </h2>
                    {roadmap.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {roadmap.description}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setDeletingId(roadmap.roadmap_id)}
                  className="opacity-0 group-hover:opacity-100 transition p-1.5 rounded-md hover:bg-red-50 hover:text-red-500 text-muted-foreground"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Bottom */}
              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="text-xs text-muted-foreground">
                  {roadmap.course_ids.length} course
                  {roadmap.course_ids.length !== 1 ? "s" : ""}
                </span>

                <button
                  onClick={() => router.push(`/roadmap/${roadmap.roadmap_id}`)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2 transition-all"
                >
                  Open
                  <ArrowRight size={15} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ───────── Create Modal ───────── */}
      <CreateRoadmapModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      {/* ───────── Delete Dialog ───────── */}
      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete roadmap?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this roadmap. Your courses will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}