"use client";

import { v4 as uuid } from "uuid";
import { CourseSection } from "../CourseSection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Pencil,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useCourseEditor } from "../editor/CourseEditorContext";
import { DraftSubtopic, DraftTopic } from "@/lib/course/draft";

export function TopicsSection() {
  const { draft, setDraft, markDirty } = useCourseEditor();
  const topics = draft.topics.filter((t) => !t.isDeleted);
  const router = useRouter();
  const [showSaveWarning, setShowSaveWarning] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  function toggleExpanded(id: string) {
    setDraft((d) => ({
      ...d,
      topics: d.topics.map((t) =>
        t.id === id ? { ...t, isExpanded: !t.isExpanded } : t
      ),
    }));
  }

  function toggleTopicCompleted(id: string, currentStatus: string) {
    const newStatus =
      currentStatus === "completed" ? "Not Started" : "completed";
    setDraft((d) => ({
      ...d,
      topics: d.topics.map((t) =>
        t.id === id ? { ...t, status: newStatus } : t
      ),
    }));
    markDirty();
  }

  function updateSubtopic(
    topicId: string,
    subId: string,
    patch: Partial<DraftSubtopic>
  ) {
    setDraft((d) => ({
      ...d,
      topics: d.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subtopics: t.subtopics.map((s) =>
                s.id === subId ? { ...s, ...patch } : s
              ),
            }
          : t
      ),
    }));
    markDirty();
  }

  function addSubtopic(topicId: string) {
    setDraft((d) => ({
      ...d,
      topics: d.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subtopics: [
                ...t.subtopics,
                {
                  id: `temp_${uuid()}`,
                  subtopic_id: null,
                  topic_id: topicId,
                  title: "New Subtopic",
                  is_completed: false,
                  position: t.subtopics.length + 1,
                  isNew: true,
                },
              ],
              isExpanded: true,
            }
          : t
      ),
    }));
    markDirty();
  }

  function deleteSubtopic(topicId: string, subId: string) {
    setDraft((d) => ({
      ...d,
      topics: d.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subtopics: t.subtopics.map((s) =>
                s.id === subId ? { ...s, isDeleted: true } : s
              ),
            }
          : t
      ),
    }));
    markDirty();
  }

  function updateTopic(id: string, patch: Partial<DraftTopic>) {
    setDraft((d) => ({
      ...d,
      topics: d.topics.map((t) =>
        t.id === id ? { ...t, ...patch } : t
      ),
    }));
    markDirty();
  }

  function addTopic() {
    setDraft((d) => ({
      ...d,
      topics: [
        ...d.topics,
        {
          id: `temp_${uuid()}`,
          topic_id: null,
          title: "New Topic",
          status: "Not Started",
          position: d.topics.length + 1,
          subtopics: [],
          isNew: true,
        },
      ],
    }));
    markDirty();
  }

  function deleteTopic(id: string) {
    setDraft((d) => ({
      ...d,
      topics: d.topics.map((t) =>
        t.id === id ? { ...t, isDeleted: true } : t
      ),
    }));
    markDirty();
  }

  function onDragEnd(result: any) {
    if (!result.destination) return;

    const reordered = Array.from(topics);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setDraft((d) => ({
      ...d,
      topics: reordered.map((t, i) => ({
        ...t,
        position: i + 1,
      })),
    }));

    markDirty();
  }

  return (
    <CourseSection
      title="Topics"
      description="Course syllabus structure"
      action={
        <Button
          size="sm"
          onClick={addTopic}
          className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl px-4 py-2 shadow-md shadow-purple-200"
        >
          <Plus className="h-4 w-4" />
          Add topic
        </Button>
      }
    >
      {topics.length === 0 ? (
        <p className="text-sm text-gray-400">No topics added yet.</p>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="topics">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col gap-3"
              >
                {topics.map((topic, index) => {
                  const subs = topic.subtopics.filter((s) => !s.isDeleted);
                  const completed = subs.filter((s) => s.is_completed).length;
                  const isCompleted = topic.status === "completed";

                  return (
                    <Draggable
                      key={topic.id}
                      draggableId={topic.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`rounded-2xl border border-purple-100 bg-white p-3 shadow-sm transition-all ${
                            snapshot.isDragging
                              ? "shadow-lg scale-[1.01]"
                              : "hover:shadow-md"
                          }`}
                        >
                          {/* TOP ROW */}
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => {
                              if (editingId) return;

                              if (topic.topic_id) {
                                router.push(
                                  `/course/${draft.course_id}/${topic.topic_id}`
                                );
                                return;
                              }

                              setShowSaveWarning(true);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4 text-gray-300" />
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleTopicCompleted(topic.id, topic.status);
                                }}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                                ) : (
                                  <Circle className="h-4 w-4 text-gray-300 hover:text-purple-500" />
                                )}
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpanded(topic.id);
                                }}
                              >
                                {topic.isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            </div>

                            <div className="flex flex-col flex-1 ml-2">
                              {editingId === topic.id ? (
                                <Input
                                  autoFocus
                                  value={topic.title}
                                  onChange={(e) =>
                                    updateTopic(topic.id, {
                                      title: e.target.value,
                                    })
                                  }
                                  onBlur={() => setEditingId(null)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="border-none bg-transparent text-sm font-medium focus:ring-0"
                                />
                              ) : (
                                <span
                                  className={`font-medium ${
                                    isCompleted
                                      ? "line-through text-gray-400"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {topic.title}
                                </span>
                              )}

                              <p className="text-xs text-gray-400">
                                {subs.length > 0
                                  ? `${completed}/${subs.length} subtopics`
                                  : isCompleted
                                  ? "Completed"
                                  : "Not started"}
                              </p>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingId(topic.id);
                                }}
                              >
                                <Pencil className="h-4 w-4 text-gray-300 hover:text-purple-500" />
                              </Button>

                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTopic(topic.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-gray-300 hover:text-red-500" />
                              </Button>
                            </div>
                          </div>

                          {/* SUBTOPICS */}
                          {topic.isExpanded && (
                            <div className="ml-8 mt-3 flex flex-col gap-2">
                              {subs.map((sub) => (
                                <div
                                  key={sub.id}
                                  className="flex items-center gap-2 bg-purple-50/40 px-3 py-2 rounded-xl"
                                >
                                  <Checkbox
                                    checked={sub.is_completed}
                                    onCheckedChange={(checked) =>
                                      updateSubtopic(topic.id, sub.id, {
                                        is_completed: !!checked,
                                      })
                                    }
                                  />

                                  <Input
                                    value={sub.title}
                                    onChange={(e) =>
                                      updateSubtopic(topic.id, sub.id, {
                                        title: e.target.value,
                                      })
                                    }
                                    className={`border-none bg-transparent text-sm focus:ring-0 ${
                                      sub.is_completed
                                        ? "line-through text-gray-400"
                                        : ""
                                    }`}
                                  />

                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() =>
                                      deleteSubtopic(topic.id, sub.id)
                                    }
                                  >
                                    <Trash2 className="h-3 w-3 text-gray-300 hover:text-red-500" />
                                  </Button>
                                </div>
                              ))}

                              <button
                                onClick={() => addSubtopic(topic.id)}
                                className="flex items-center gap-1 text-xs text-purple-500 hover:text-purple-600"
                              >
                                <Plus className="h-3 w-3" />
                                Add subtopic
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {showSaveWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[400px] space-y-4 border border-purple-100">
            <h3 className="text-lg font-semibold text-gray-800">
              Save required
            </h3>
            <p className="text-sm text-gray-400">
              Please save your course first before opening this topic.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowSaveWarning(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowSaveWarning(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl"
              >
                Sure
              </Button>
            </div>
          </div>
        </div>
      )}
    </CourseSection>
  );
}