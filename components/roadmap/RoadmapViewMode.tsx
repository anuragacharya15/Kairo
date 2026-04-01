"use client"

import { useRoadmapEditor } from "./RoadmapEditorContext"
import { Map } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const NODE_SIZE = 110
const ROW_GAP = 260
const SVG_W = 720
const LEFT_CX = 140
const RIGHT_CX = SVG_W - 140
const NODE_R = NODE_SIZE / 2

export function RoadmapViewMode() {
  const { courses } = useRoadmapEditor()

  if (!courses || courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-28 text-center">
        <div className="rounded-full bg-muted p-6">
          <Map size={28} className="text-muted-foreground" />
        </div>
        <p className="font-semibold text-lg">No courses in this roadmap</p>
      </div>
    )
  }

  const safeCourses = Array.isArray(courses) ? courses : []

  const totalH = (safeCourses.length - 1) * ROW_GAP + NODE_SIZE + 60

  const cy = (i: number) => 30 + NODE_R + i * ROW_GAP
  const cx = (i: number) => (i % 2 === 0 ? LEFT_CX : RIGHT_CX)

  const segments: { d: string; completed: boolean }[] = []

  for (let i = 0; i < safeCourses.length - 1; i++) {
    const c1: any = safeCourses[i]
    const c2: any = safeCourses[i + 1]

    const x1 = cx(i), y1 = cy(i)
    const x2 = cx(i + 1), y2 = cy(i + 1)

    const startY = y1 + NODE_R
    const endY = y2 - NODE_R

    const cp1Y = startY + (endY - startY) * 0.4
    const cp2Y = startY + (endY - startY) * 0.6

    const d = `M ${x1} ${startY} C ${x1} ${cp1Y}, ${x2} ${cp2Y}, ${x2} ${endY}`

    const total1 = c1?.total_topics ?? 0
    const done1 = c1?.completed_topics ?? 0
    const total2 = c2?.total_topics ?? 0
    const done2 = c2?.completed_topics ?? 0

    const completed = total1 > 0 && done1 === total1 && total2 > 0 && done2 === total2

    segments.push({ d, completed })
  }

  return (
    <div className="flex justify-center w-full">
      <div className="relative" style={{ width: SVG_W, minHeight: totalH }}>
        <svg
          className="absolute inset-0 pointer-events-none"
          width={SVG_W}
          height={totalH}
        >
          {segments.map(({ d, completed }, i) => (
            <g key={i}>
              <path
                d={d}
                fill="none"
                strokeWidth="2.5"
                strokeDasharray="8 6"
                className="stroke-border"
              />
              {completed && (
                <path
                  d={d}
                  fill="none"
                  strokeWidth="2.5"
                  className="stroke-primary"
                />
              )}
            </g>
          ))}
        </svg>

        {safeCourses.map((course: any, index: number) => {
          const centerX = cx(index)
          const centerY = cy(index)

          return (
            <CourseNode
              key={course.course_id ?? index}
              course={course}
              index={index}
              isLeft={index % 2 === 0}
              nodeLeft={centerX - NODE_R}
              nodeTop={centerY - NODE_R}
              nodeSize={NODE_SIZE}
            />
          )
        })}
      </div>
    </div>
  )
}

function CourseNode({
  course,
  index,
  isLeft,
  nodeLeft,
  nodeTop,
  nodeSize,
}: any) {
  const [hovered, setHovered] = useState(false)

  const total = course?.total_topics ?? 0
  const completed = course?.completed_topics ?? 0

  const progress = total > 0 ? completed / total : 0
  const isCompleted = progress === 1 && total > 0
  const isStarted = progress > 0 && progress < 1

  const radius = nodeSize / 2 - 5
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress)

  const topics = Array.isArray(course?.topics) ? course.topics : []

  return (
    <div
      className="absolute"
      style={{ left: nodeLeft, top: nodeTop, width: nodeSize, height: nodeSize }}
    >
      <Link
        href={`/course/${course?.course_id ?? ""}`}
        className="group block w-full h-full"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <svg className="w-full h-full -rotate-90">
          <circle
            cx={nodeSize / 2}
            cy={nodeSize / 2}
            r={radius}
            fill="none"
            strokeWidth="4"
            className="stroke-border"
          />
          {progress > 0 && (
            <circle
              cx={nodeSize / 2}
              cy={nodeSize / 2}
              r={radius}
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              className="stroke-primary"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          )}
        </svg>

        <div
          className={`absolute inset-3 rounded-full flex items-center justify-center font-semibold
          ${
            isCompleted
              ? "bg-primary text-primary-foreground"
              : isStarted
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isCompleted ? "✓" : index + 1}
        </div>
      </Link>

      <div
        className={`absolute top-1/2 -translate-y-1/2 w-[200px]
        ${isLeft ? "left-[120%]" : "right-[120%] text-right"}`}
      >
        <p className="text-sm font-medium">{course?.title ?? "Untitled"}</p>
      </div>

      {hovered && topics.length > 0 && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-52 bg-popover border rounded-lg p-3 shadow-lg
          ${isLeft ? "left-[180%]" : "right-[180%]"}`}
        >
          {topics.map((t: any, i: number) => (
            <div key={i} className="text-xs">
              {t?.title ?? "Topic"}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}