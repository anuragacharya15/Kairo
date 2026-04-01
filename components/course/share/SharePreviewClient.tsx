"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Layers,
  AlertTriangle,
  Loader2,
  CheckCircle2
} from "lucide-react"
import { acceptShare, SharePreview } from "@/lib/course/share"
import { UpgradeModal } from "@/components/subscription/UpgradeModal"

interface Props {
  token: string
  preview: SharePreview
  isAuthenticated: boolean
}

const ERROR_MESSAGES: Record<string, string> = {
  PLAN_UPGRADE_REQUIRED: "You need a Pro plan to accept shared courses.",
  COURSE_LIMIT_EXCEEDED: "You've reached your course limit. Upgrade or delete a course to continue.",
  TOPIC_LIMIT_EXCEEDED: "This course has more topics than your plan allows.",
  SHARE_EXPIRED: "This share link has expired.",
  UNKNOWN: "Something went wrong. Please try again.",
}

export function SharePreviewClient({ token, preview, isAuthenticated }: Props) {
  const router = useRouter()
  const [isAccepting, setIsAccepting] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [newCourseId, setNewCourseId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)

  async function handleAccept() {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/share/${token}`)
      return
    }

    setIsAccepting(true)
    setError(null)

    const result = await acceptShare(token)

    setIsAccepting(false)

    if (result.success && result.course_id) {
      setAccepted(true)
      setNewCourseId(result.course_id)
      return
    }

    if (
      result.error_code === "PLAN_UPGRADE_REQUIRED" ||
      result.error_code === "COURSE_LIMIT_EXCEEDED" ||
      result.error_code === "TOPIC_LIMIT_EXCEEDED"
    ) {
      setShowUpgrade(true)
      return
    }

    setError(ERROR_MESSAGES[result.error_code ?? "UNKNOWN"])
  }

  // ❌ EXPIRED
  if (preview.is_expired) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-800">
          Link expired
        </h1>

        <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
          This share link is no longer valid. Ask the course owner to generate a new one.
        </p>
      </div>
    )
  }

  // ✅ SUCCESS
  if (accepted && newCourseId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-800">
          Course added!
        </h1>

        <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
          <span className="font-medium text-gray-700">
            {preview.course_title}
          </span>{" "}
          has been added to your courses.
        </p>

        <Button
          onClick={() => router.push(`/course/${newCourseId}`)}
          className="rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-md shadow-purple-200 hover:from-purple-600 hover:to-violet-600"
        >
          Open course
        </Button>
      </div>
    )
  }

  // 🎯 MAIN UI
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-md rounded-2xl border border-purple-100 bg-white shadow-xl shadow-purple-100 overflow-hidden">

          {/* HEADER */}
          <div className="bg-purple-50/50 px-6 py-5 border-b border-purple-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Shared by {preview.created_by_name}
                </p>

                <h1 className="text-lg font-semibold text-gray-800 leading-snug">
                  {preview.course_title}
                </h1>
              </div>

              <Badge className="bg-purple-100 text-purple-600 border-0">
                {preview.course_status}
              </Badge>
            </div>
          </div>

          {/* STATS */}
          <div className="px-6 py-4 flex items-center gap-6 border-b border-purple-100 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>{preview.topic_count} topics</span>
            </div>

            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>{preview.resource_count} resources</span>
            </div>

            <Badge variant="outline" className="border-purple-200 text-purple-500">
              {preview.course_type}
            </Badge>
          </div>

          {/* ACTION */}
          <div className="px-6 py-5 flex flex-col gap-3">
            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {preview.expires_at && (
              <p className="text-xs text-gray-400">
                Link expires {new Date(preview.expires_at).toLocaleDateString()}
              </p>
            )}

            <Button
              onClick={handleAccept}
              disabled={isAccepting}
              className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-md shadow-purple-200 hover:from-purple-600 hover:to-violet-600 disabled:opacity-40"
            >
              {isAccepting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding to your courses…
                </>
              ) : isAuthenticated ? (
                "Add to my courses"
              ) : (
                "Sign in to add this course"
              )}
            </Button>

            {!isAuthenticated && (
              <p className="text-xs text-center text-gray-400">
                You'll be redirected after login.
              </p>
            )}
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        message="Upgrade to Pro to accept shared courses and unlock unlimited sharing."
      />
    </>
  )
}