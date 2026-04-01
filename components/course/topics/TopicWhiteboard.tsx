"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import "@excalidraw/excalidraw/index.css"
import { fetchWhiteboardFromBackend } from "@/lib/course/whiteboard"

const Excalidraw = dynamic(
    async () => (await import("@excalidraw/excalidraw")).Excalidraw,
    { ssr: false }
)

interface Props {
    documentId: string
}

export interface ExcalidrawSnapshot {
    elements: any[]
    appState: Record<string, any>
    files: Record<string, any>
}

export default function TopicWhiteboard({ documentId }: Props) {
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [initialData, setInitialData] = useState<ExcalidrawSnapshot | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        async function loadSnapshot() {
            let snapshot: ExcalidrawSnapshot | null = null

            try {
                snapshot = await fetchWhiteboardFromBackend(documentId)
            } catch (err) {
                if (err instanceof Error && err.message === "PLAN_UPGRADE_REQUIRED") {
                    console.log("Cloud whiteboard locked → using local mode")
                }
            }

            if (!snapshot) {
                const saved = localStorage.getItem(`whiteboard-${documentId}`)
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved)
                        if (Array.isArray(parsed?.elements)) {
                            snapshot = parsed
                        } else {
                            localStorage.removeItem(`whiteboard-${documentId}`)
                        }
                    } catch {
                        localStorage.removeItem(`whiteboard-${documentId}`)
                    }
                }
            }

            if (!cancelled) {
                setInitialData(snapshot)
                setIsLoading(false)
            }
        }

        loadSnapshot()
        return () => { cancelled = true }
    }, [documentId])

    const handleChange = useCallback(
        (elements: any[], appState: any, files: any) => {
            if (debounceRef.current) clearTimeout(debounceRef.current)

            debounceRef.current = setTimeout(() => {
                const snapshot: ExcalidrawSnapshot = {
                    elements,
                    appState: { viewBackgroundColor: appState.viewBackgroundColor },
                    files,
                }

                localStorage.setItem(
                    `whiteboard-${documentId}`,
                    JSON.stringify(snapshot)
                )
            }, 500)
        },
        [documentId]
    )

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [])

    // ✨ Premium Loader UI
    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white to-purple-50">
                <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white shadow-md border border-gray-100">
                    <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-sm text-gray-500 font-medium">
                        Loading your whiteboard...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-full bg-gradient-to-br from-white to-purple-50 p-2">
            {/* Canvas Card */}
            <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                <Excalidraw
                    initialData={
                        initialData
                            ? {
                                  elements: initialData.elements,
                                  appState: {
                                      viewBackgroundColor:
                                          initialData.appState?.viewBackgroundColor ?? "#ffffff",
                                  },
                                  files: initialData.files,
                              }
                            : null
                    }
                    onChange={(elements: any, appState: any, files: any) =>
                        handleChange(elements, appState, files)
                    }
                    UIOptions={{
                        canvasActions: {
                            saveToActiveFile: false,
                            loadScene: false,
                        },
                    }}
                />
            </div>
        </div>
    )
}