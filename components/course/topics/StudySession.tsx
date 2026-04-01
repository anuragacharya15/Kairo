"use client"

import { useStudySession } from "@/hooks/useStudySession"
import { Button } from "@/components/ui/button"
import { PlayCircle, StopCircle, Clock, Flame, BookOpen } from "lucide-react"

interface Props {
  topicId: string
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export default function StudySession({ topicId }: Props) {
  const {
    isRunning,
    elapsedSeconds,
    stats,
    isLoadingStats,
    isSaving,
    start,
    stop,
  } = useStudySession({ topicId })

  return (
    <div className="rounded-2xl border border-purple-100 bg-white shadow-lg shadow-purple-100 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-purple-50/60 border-b border-purple-100">
        <span className="text-[11px] font-semibold text-purple-500 uppercase tracking-wide">
          Study Session
        </span>

        {isSaving && (
          <span className="text-[11px] text-gray-400 animate-pulse">
            Saving...
          </span>
        )}
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">

        {/* Timer */}
        <div className="flex flex-col items-center gap-3">
          <div
            className={`text-4xl font-mono font-bold tabular-nums tracking-tight transition-all duration-200 ${
              isRunning ? "text-purple-600" : "text-gray-300"
            }`}
          >
            {formatTime(elapsedSeconds)}
          </div>

          {isRunning ? (
            <Button
              size="sm"
              onClick={stop}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-sm"
            >
              <StopCircle className="w-4 h-4" />
              Stop Session
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={start}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-md shadow-purple-200"
            >
              <PlayCircle className="w-4 h-4" />
              Start Session
            </Button>
          )}

          {isRunning && (
            <p className="text-[11px] text-gray-400 text-center leading-relaxed">
              Session will save automatically when you leave
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 border-t border-purple-100 pt-4">

          {/* Total Time */}
          <div className="flex flex-col items-center gap-1.5 bg-purple-50/40 rounded-xl py-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-gray-700">
              {isLoadingStats ? "—" : formatMinutes(stats?.today_minutes ?? 0)}
            </span>
            <span className="text-[10px] text-gray-400">Total</span>
          </div>

          {/* Sessions */}
          <div className="flex flex-col items-center gap-1.5 bg-purple-50/40 rounded-xl py-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-gray-700">
              {isLoadingStats ? "—" : (stats?.total_sessions ?? 0)}
            </span>
            <span className="text-[10px] text-gray-400">Sessions</span>
          </div>

          {/* Streak */}
          <div className="flex flex-col items-center gap-1.5 bg-purple-50/40 rounded-xl py-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-semibold text-gray-700">
              {isLoadingStats ? "—" : `${stats?.streak_days ?? 0}d`}
            </span>
            <span className="text-[10px] text-gray-400">Streak</span>
          </div>

        </div>
      </div>
    </div>
  )
}