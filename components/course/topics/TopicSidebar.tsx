"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UpgradeModal } from "@/components/subscription/UpgradeModal"
import StudySession from "@/components/course/topics/StudySession"
import {
    Trash2,
    Plus,
    ArrowLeft,
    Pencil,
    PanelLeftClose,
    PanelLeftOpen,
    SaveIcon,
} from "lucide-react"
import { useState, useRef } from "react"
import {
    updateTopicTitle,
    addSubtopic,
    toggleSubtopic,
    updateSubtopicTitle,
    deleteSubtopic,
} from "@/lib/course/topicMutations"
import { saveWhiteboardToBackend } from "@/lib/course/whiteboard"
import { useCourseEditor } from "@/components/course/editor/CourseEditorContext"
import { toast } from "@/hooks/use-toast"

interface Props {
    topicId: string
    courseId: string
}

export default function TopicSidebar({ topicId, courseId }: Props) {
    const router = useRouter()
    const { draft, setDraft, markDirty } = useCourseEditor()
    const [showUpgrade, setShowUpgrade] = useState(false)
    const [editingTopic, setEditingTopic] = useState(false)
    const [editingSubId, setEditingSubId] = useState<string | null>(null)
    const [collapsed, setCollapsed] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const topicInputRef = useRef<HTMLInputElement>(null)

    const topic = draft.topics.find(t => t.id === topicId || t.topic_id === topicId)
    if (!topic || topic.isDeleted) return null
    const currentTopic = topic

    function handleTitleChange(title: string) {
        setDraft(d => updateTopicTitle(d, currentTopic.id, title))
        markDirty()
    }

    function handleAddSubtopic() {
        setDraft(d => addSubtopic(d, currentTopic.id))
        markDirty()
    }

    function handleToggle(subId: string) {
        setDraft(d => toggleSubtopic(d, currentTopic.id, subId))
        markDirty()
    }

    function handleSubtopicTitle(subId: string, title: string) {
        setDraft(d => updateSubtopicTitle(d, currentTopic.id, subId, title))
        markDirty()
    }

    function handleDeleteSubtopic(subId: string) {
        setDraft(d => deleteSubtopic(d, currentTopic.id, subId))
        markDirty()
    }

    async function handleSave() {
        const data = localStorage.getItem(`whiteboard-${currentTopic.id}`)
        if (!data) {
            toast({
                title: "Nothing to save",
                description: "No whiteboard data found to save.",
                variant: "destructive",
            })
            return
        }

        setIsSaving(true)

        try {
            const parsed = JSON.parse(data)
            const result = await saveWhiteboardToBackend(currentTopic.id, parsed)

            if (result?.success) {
                toast({
                    title: "Whiteboard saved",
                    description: "Your changes have been saved successfully.",
                })
                return
            }

            if (result?.error === "PLAN_UPGRADE_REQUIRED") {
                setShowUpgrade(true)
                return
            }

            toast({
                title: "Save failed",
                description: result?.error || "Unknown error occurred.",
                variant: "destructive",
            })
        } catch (err: any) {
            if (err?.message?.includes("PLAN_UPGRADE_REQUIRED")) {
                setShowUpgrade(true)
                return
            }

            toast({
                title: "Save failed",
                description: "Could not save whiteboard.",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const visibleSubtopics = currentTopic.subtopics.filter(s => !s.isDeleted)

    return (
        <aside
            className={`h-screen flex flex-col transition-all duration-300 border-r border-gray-200 bg-gradient-to-b from-white to-purple-50/30 shadow-sm ${
                collapsed ? "w-20" : "w-80"
            }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b bg-white/70 backdrop-blur">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/course/${courseId}`)}
                    className="flex items-center gap-2 text-gray-600 hover:text-black"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {!collapsed && "Back"}
                </Button>

                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setCollapsed(!collapsed)}
                    className="rounded-lg hover:bg-purple-100"
                >
                    {collapsed ? (
                        <PanelLeftOpen className="w-4 h-4" />
                    ) : (
                        <PanelLeftClose className="w-4 h-4" />
                    )}
                </Button>
            </div>

            {/* Body */}
            <div
                className={`flex flex-col flex-1 transition-all duration-300 ${
                    collapsed ? "invisible opacity-0 pointer-events-none" : "visible opacity-100"
                }`}
            >
                {/* Topic Title */}
                <div className="px-4 py-4 border-b">
                    {editingTopic ? (
                        <Input
                            ref={topicInputRef}
                            value={currentTopic.title}
                            autoFocus
                            onChange={e => handleTitleChange(e.target.value)}
                            onBlur={() => setEditingTopic(false)}
                            className="text-lg font-semibold rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-300"
                        />
                    ) : (
                        <div
                            className="flex items-center justify-between group cursor-pointer"
                            onClick={() => setEditingTopic(true)}
                        >
                            <h2 className="text-lg font-semibold">
                                {currentTopic.title || "Untitled topic"}
                            </h2>
                            <Pencil className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                        </div>
                    )}
                </div>

                {/* Subtopics */}
                <div className="px-4 pt-4 pb-2">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase">
                            Subtopics
                        </span>

                        <Button
                            size="sm"
                            onClick={handleAddSubtopic}
                            className="h-7 px-3 text-xs bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg shadow-sm"
                        >
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                        </Button>
                    </div>

                    <ScrollArea className="h-[45vh] pr-2">
                        <div className="flex flex-col gap-1">
                            {visibleSubtopics.map(sub => (
                                <div
                                    key={sub.id}
                                    className="group flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-purple-50 transition"
                                >
                                    <Checkbox
                                        checked={sub.is_completed}
                                        onCheckedChange={() => handleToggle(sub.id)}
                                    />

                                    <div
                                        className="flex-1 cursor-pointer"
                                        onClick={() => setEditingSubId(sub.id)}
                                    >
                                        {editingSubId === sub.id ? (
                                            <Input
                                                value={sub.title}
                                                autoFocus
                                                onChange={e =>
                                                    handleSubtopicTitle(sub.id, e.target.value)
                                                }
                                                onBlur={() => setEditingSubId(null)}
                                                className="border-none shadow-none px-0 text-sm bg-transparent focus:ring-0"
                                            />
                                        ) : (
                                            <span
                                                className={`text-sm ${
                                                    sub.is_completed
                                                        ? "line-through text-gray-400"
                                                        : ""
                                                }`}
                                            >
                                                {sub.title || "Untitled"}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex opacity-0 group-hover:opacity-100 transition">
                                        <Button size="icon" variant="ghost">
                                            <Pencil className="w-3.5 h-3.5 text-gray-400" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDeleteSubtopic(sub.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Save Button */}
                <div className="px-4 pb-3">
                    <Button
                        size="sm"
                        onClick={handleSave}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl shadow-md"
                    >
                        <SaveIcon className="w-4 h-4" />
                        {isSaving ? "Saving..." : "Save Whiteboard"}
                    </Button>
                </div>

                {/* Study Session */}
                <div className="px-4 pb-4 flex-1 overflow-auto">
                    <div className="bg-white rounded-2xl shadow-sm border p-3">
                        <StudySession topicId={topicId} />
                    </div>
                </div>
            </div>

            <UpgradeModal
                isOpen={showUpgrade}
                onClose={() => setShowUpgrade(false)}
                message="Saving whiteboards is a Pro feature. Upgrade to unlock unlimited saves."
            />
        </aside>
    )
}