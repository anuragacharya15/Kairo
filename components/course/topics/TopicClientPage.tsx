"use client"

import TopicSidebar from "@/components/course/topics/TopicSidebar"
import TopicWhiteboard from "./TopicWhiteboard"

interface Props {
  topicId: string
  courseId: string
}

export default function TopicClientPage({ topicId, courseId }: Props) {
  return (
    <div className="flex h-full overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-50">

      {/* Sidebar */}
      <aside className="w-[280px] h-full border-r border-purple-100 bg-white/80 backdrop-blur-md">
        <TopicSidebar topicId={topicId} courseId={courseId} />
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 h-full relative">

        {/* Top subtle header bar */}
        <div className="absolute top-0 left-0 right-0 h-12 z-10 flex items-center px-5 border-b border-purple-100 bg-white/70 backdrop-blur-md">
          <span className="text-xs font-medium text-gray-400">
            Topic Workspace
          </span>
        </div>

        {/* Whiteboard */}
        <div className="h-full pt-12">
          <TopicWhiteboard documentId={topicId} />
        </div>

      </main>
    </div>
  )
}