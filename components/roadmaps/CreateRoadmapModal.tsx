"use client"

import { useState } from "react"
import { Dialog } from "@headlessui/react"
import { X, Map, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createRoadmap } from "@/lib/api/roadmap"
import { useRoadmaps } from "./RoadmapsContext"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function CreateRoadmapModal({ isOpen, onClose }: Props) {
  const router = useRouter()
  const { userId, addRoadmap } = useRoadmaps()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function reset() {
    setTitle("")
    setDescription("")
    setError(null)
  }

  async function handleCreate() {
    if (!title.trim()) return

    setLoading(true)
    setError(null)

    try {
      const roadmap = await createRoadmap({
        user_id: userId,
        title: title.trim(),
        description: description.trim() || undefined,
      })

      addRoadmap(roadmap)
      reset()
      onClose()
      router.push(`/roadmap/${roadmap.roadmap_id}?mode=edit`)
    } catch (err: any) {
      setError(err?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-card border shadow-xl p-6 flex flex-col gap-5 animate-in fade-in zoom-in-95">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2">
                <Map size={18} className="text-primary" />
              </div>
              <Dialog.Title className="text-lg font-semibold">
                Create Roadmap
              </Dialog.Title>
            </div>

            <button
              onClick={() => {
                reset()
                onClose()
              }}
              className="p-1.5 rounded-md hover:bg-muted transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Inputs */}
          <div className="flex flex-col gap-4">

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Name *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Full Stack Developer Path"
                className="rounded-lg border px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your roadmap..."
                rows={3}
                className="rounded-lg border px-3 py-2.5 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              />
            </div>

          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          {/* Action */}
          <Button
            onClick={handleCreate}
            disabled={!title.trim() || loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creating roadmap..." : "Create Roadmap"}
          </Button>

        </Dialog.Panel>
      </div>
    </Dialog>
  )
}