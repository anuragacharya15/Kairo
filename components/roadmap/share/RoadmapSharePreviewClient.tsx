"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Map, BookOpen, AlertTriangle, Loader2, CheckCircle2, Sparkles } from "lucide-react"
import { acceptRoadmapShare, RoadmapSharePreview } from "@/lib/course/roadmap-share"
import { UpgradeModal } from "@/components/subscription/UpgradeModal"

interface Props {
  token: string
  preview: RoadmapSharePreview
  isAuthenticated: boolean
}

const ERROR_MESSAGES: Record<string, string> = {
  PLAN_UPGRADE_REQUIRED: "You need a Pro plan to accept shared roadmaps.",
  COURSE_LIMIT_EXCEEDED: "This roadmap exceeds your course limit.",
  SHARE_EXPIRED: "This share link has expired.",
  UNKNOWN: "Something went wrong. Please try again.",
}

export function RoadmapSharePreviewClient({ token, preview, isAuthenticated }: Props) {
  const router = useRouter()
  const [isAccepting, setIsAccepting] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [newRoadmapId, setNewRoadmapId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)

  async function handleAccept() {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/share/roadmap/${token}`)
      return
    }

    setIsAccepting(true)
    setError(null)

    const result = await acceptRoadmapShare(token)
    setIsAccepting(false)

    if (result.success && result.roadmap_id) {
      setAccepted(true)
      setNewRoadmapId(result.roadmap_id)
      return
    }

    if (
      result.error_code === "PLAN_UPGRADE_REQUIRED" ||
      result.error_code === "COURSE_LIMIT_EXCEEDED"
    ) {
      setShowUpgrade(true)
      return
    }

    setError(ERROR_MESSAGES[result.error_code ?? "UNKNOWN"])
  }

  /* ───────── EXPIRED ───────── */
  if (preview.is_expired) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center px-4">
        <div className="p-4 rounded-full bg-muted">
          <AlertTriangle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Link expired</h1>
        <p className="text-muted-foreground max-w-sm">
          This share link is no longer valid. Ask the owner to generate a new one.
        </p>
      </div>
    )
  }

  /* ───────── SUCCESS ───────── */
  if (accepted && newRoadmapId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center px-4">
        <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold">Roadmap added!</h1>

        <p className="text-muted-foreground max-w-sm">
          <span className="font-medium">{preview.roadmap_title}</span> is now in your account.
        </p>

        <Button
          onClick={() => router.push(`/roadmap/${newRoadmapId}`)}
          className="mt-2"
        >
          Open roadmap
        </Button>
      </div>
    )
  }

  /* ───────── MAIN UI ───────── */
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="w-full max-w-md rounded-2xl border bg-card shadow-md overflow-hidden">

          {/* HEADER */}
          <div className="bg-gradient-to-br from-muted/40 to-muted/10 px-6 py-5 border-b">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Map className="w-5 h-5 text-primary" />
              </div>

              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">
                  Shared by {preview.created_by_name}
                </p>

                <h1 className="text-lg font-semibold leading-tight">
                  {preview.roadmap_title}
                </h1>

                {preview.roadmap_description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {preview.roadmap_description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="px-6 py-4 flex items-center justify-between border-b">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {preview.course_count} courses
              </div>

              {preview.whiteboards && (
                <Badge variant="secondary" className="text-xs">
                  🗒️ Notes included
                </Badge>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 py-5 flex flex-col gap-3">

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {preview.expires_at && (
              <p className="text-xs text-muted-foreground text-center">
                Expires on {new Date(preview.expires_at).toLocaleDateString()}
              </p>
            )}

            <Button
              className="w-full flex items-center justify-center gap-2"
              onClick={handleAccept}
              disabled={isAccepting}
            >
              {isAccepting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : isAuthenticated ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Add to my account
                </>
              ) : (
                "Sign in to continue"
              )}
            </Button>

            {!isAuthenticated && (
              <p className="text-xs text-center text-muted-foreground">
                You’ll return here after login
              </p>
            )}
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        message="Upgrade to Pro to unlock roadmap sharing."
      />
    </>
  )
}