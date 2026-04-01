"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Share2, Copy, Check, Loader2 } from "lucide-react"
import { createShareLink, ShareExpiry, ShareLink } from "@/lib/course/share"
import { toast } from "@/hooks/use-toast"
import { UpgradeModal } from "@/components/subscription/UpgradeModal"

interface Props {
  courseId: string
  isPro: boolean
}

export function ShareButton({ courseId, isPro }: Props) {
  const [open, setOpen] = useState(false)
  const [expiry, setExpiry] = useState<ShareExpiry>("never")
  const [shareLink, setShareLink] = useState<ShareLink | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [whiteboards, setWhiteboards] = useState(false)

  async function handleCreate() {
    if (!isPro) {
      setShowUpgrade(true)
      return
    }

    setIsCreating(true)
    try {
      const link = await createShareLink(courseId, expiry, whiteboards)
      setShareLink(link)
    } catch (err: any) {
      toast({
        title: "Failed to create link",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  async function handleCopy() {
    if (!shareLink) return
    await navigator.clipboard.writeText(shareLink.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({ title: "Link copied!" })
  }

  function handleOpenChange(val: boolean) {
    setOpen(val)
    if (!val) {
      setShareLink(null)
      setExpiry("never")
      setCopied(false)
      setWhiteboards(false)
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          if (!isPro) {
            setShowUpgrade(true)
            return
          }
          setOpen(true)
        }}
        className="flex items-center gap-2 rounded-xl border border-purple-100 bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 shadow-sm shadow-purple-50 transition-all duration-200"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md rounded-2xl border border-purple-100 bg-white p-6 shadow-xl shadow-purple-100/50">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Share this course
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400">
              Anyone with the link can preview and add this course to their account.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5 pt-3">
            {!shareLink ? (
              <>
                {/* Expiry */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Link expiry
                  </label>
                  <Select
                    value={expiry}
                    onValueChange={(v) => setExpiry(v as ShareExpiry)}
                  >
                    <SelectTrigger className="rounded-xl border border-purple-100 bg-white text-sm shadow-sm shadow-purple-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never expires</SelectItem>
                      <SelectItem value="7d">Expires in 7 days</SelectItem>
                      <SelectItem value="30d">Expires in 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Toggle */}
                <div className="flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50/40 px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <label className="text-sm font-medium text-gray-700">
                      Include whiteboards
                    </label>
                    <span className="text-xs text-gray-400">
                      Recipients will receive your whiteboard notes
                    </span>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={whiteboards}
                    onClick={() => setWhiteboards((v) => !v)}
                    className={`relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 ${
                      whiteboards
                        ? "bg-gradient-to-r from-purple-500 to-violet-500"
                        : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        whiteboards ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Button */}
                <Button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-md shadow-purple-200 transition-all duration-200"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating link…
                    </>
                  ) : (
                    "Generate share link"
                  )}
                </Button>
              </>
            ) : (
              <>
                {/* Link */}
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={shareLink.url}
                    className="text-sm font-mono rounded-xl border border-purple-100 bg-white shadow-sm"
                  />
                  <Button
                    size="icon"
                    onClick={handleCopy}
                    className="rounded-xl bg-white border border-purple-100 hover:bg-purple-50"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </Button>
                </div>

                {shareLink.expires_at && (
                  <p className="text-xs text-gray-400">
                    Expires{" "}
                    {new Date(shareLink.expires_at).toLocaleDateString()}
                  </p>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShareLink(null)}
                  className="rounded-xl border border-purple-100 hover:bg-purple-50"
                >
                  Generate a new link
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        message="Course sharing is a Pro feature. Upgrade to share your courses with others."
      />
    </>
  )
}