"use client";

import { useState } from "react";

import { Dialog } from "@headlessui/react";
import {
  X, ClipboardPaste, ChevronRight, Link,
  AlertCircle, CheckCircle2, Loader2, RotateCcw,
  FolderOpen, BookOpen, Sparkles,
} from "lucide-react";
import { Course } from "@/lib/api/course";
import { UpgradeModal } from "@/components/subscription/UpgradeModal";
import { usePasteCourse } from "@/lib/backend/usePasteCourse";
import { FORMAT_TEMPLATE, ParsedCourse } from "@/lib/backend/parseCourseFormat";
import { AIPromptWizard } from "./AIPromptWizard";

interface PasteCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onCreated: (course: Course) => void;
}

export function PasteCourseModal({ isOpen, onClose, userId, onCreated }: PasteCourseModalProps) {
  const {
    step, setStep,
    raw, setRaw,
    parsed,
    parseError, setParseError,
    createError,
    showUpgrade, setShowUpgrade,
    textareaRef,
    handleClose,
    handleParse,
    handleCreate,
    loadTemplate,
  } = usePasteCourse({ isOpen, userId, onCreated, onClose });

  const [showWizard, setShowWizard] = useState(false);

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">

      {/* Overlay */}
      <div className="fixed inset-0 bg-purple-950/25 backdrop-blur-sm" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="mx-auto w-full max-w-2xl rounded-2xl bg-white border border-purple-100 shadow-xl shadow-purple-100/50 overflow-hidden"
          style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        >

          {/* Header */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-purple-50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 shadow-sm shadow-purple-200 flex items-center justify-center shrink-0">
                <ClipboardPaste size={16} className="text-white" />
              </div>
              <div className="flex flex-col gap-0.5">
                <Dialog.Title className="text-sm font-semibold text-gray-800 tracking-tight leading-none">
                  Import Course from Text
                </Dialog.Title>
                <p className="text-xs text-gray-400">
                  Paste a structured outline to create a course with topics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Step pills */}
              <div className="hidden sm:flex items-center gap-1.5">
                {(["paste", "preview"] as const).map((s, i) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      step === s
                        ? "bg-purple-500 w-5"
                        : i < ["paste", "preview"].indexOf(step)
                        ? "bg-purple-300 w-2"
                        : "bg-gray-200 w-2"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleClose}
                className="h-7 w-7 flex items-center justify-center rounded-xl border border-purple-100 bg-purple-50 text-gray-400 hover:bg-purple-100 hover:text-purple-600 hover:border-purple-200 transition-all duration-150"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">

            {/* PASTE STEP */}
            {step === "paste" && (
              <div className="flex flex-col">

                {/* AI toggle */}
                <div className="px-7 pt-5 pb-3">
                  <button
                    onClick={() => setShowWizard((v) => !v)}
                    className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-200 ${
                      showWizard
                        ? "border-purple-200 bg-purple-50 text-purple-700"
                        : "border-purple-100 bg-white hover:bg-purple-50 hover:border-purple-200 text-gray-700"
                    }`}
                  >
                    <Sparkles size={14} className={showWizard ? "text-purple-500" : "text-gray-400"} />
                    <div className="text-left">
                      <p className="font-semibold text-sm leading-tight text-gray-800">Generate with AI</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Get a prompt to paste into ChatGPT, Claude, or Gemini
                      </p>
                    </div>
                    <span className="ml-auto text-xs font-medium text-gray-400">
                      {showWizard ? "Hide ↑" : "Try it →"}
                    </span>
                  </button>
                </div>

                {/* AI Wizard inline */}
                {showWizard && (
                  <div className="mx-7 mb-3 rounded-2xl border border-purple-100 bg-purple-50/30 overflow-hidden">
                    <AIPromptWizard
                      onClose={() => setShowWizard(false)}
                      onDone={() => setShowWizard(false)}
                    />
                  </div>
                )}

                {/* Divider */}
                {showWizard && (
                  <div className="flex items-center gap-3 px-7 mb-3">
                    <div className="flex-1 h-px bg-purple-100" />
                    <span className="text-xs font-medium text-gray-400">or paste manually</span>
                    <div className="flex-1 h-px bg-purple-100" />
                  </div>
                )}

                {/* Format hint */}
                {!showWizard && (
                  <div className="px-7 pb-3">
                    <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                        Expected Format
                      </p>
                      <pre className="text-xs text-gray-500 font-mono leading-relaxed whitespace-pre-wrap">
{`title: Your Course Title
type: Frontend / Backend / DSA
purpose: Why you're taking this (optional)
priority: low | medium | high

topics:
  - Topic One
    - Subtopic A
    - Subtopic B

resources:
  - title: Resource Name
    url: https://example.com

projects:
  - title: Project Name
    description: What to build

assignments:
  - title: Assignment Name
    description: What to do`}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Textarea */}
                <div className="px-7 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Paste your course outline
                    </label>
                    {!showWizard && (
                      <button
                        onClick={loadTemplate}
                        className="flex items-center gap-1 text-xs font-medium text-purple-500 hover:text-purple-700 transition-colors duration-150"
                      >
                        <RotateCcw size={10} />
                        Load example
                      </button>
                    )}
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={raw}
                    onChange={(e) => { setRaw(e.target.value); setParseError(null); }}
                    placeholder={FORMAT_TEMPLATE}
                    className="w-full rounded-xl border border-purple-100 bg-white px-4 py-3 text-sm font-mono text-gray-700 resize-none focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 placeholder:text-gray-200 leading-relaxed shadow-sm shadow-purple-50 transition-all duration-200"
                    style={{ minHeight: "180px" }}
                    spellCheck={false}
                  />
                  {parseError && (
                    <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5">
                      <AlertCircle size={13} className="text-red-400 shrink-0" />
                      <span className="text-xs font-medium text-red-500">{parseError}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PREVIEW STEP */}
            {step === "preview" && parsed && (
              <div className="px-7 py-6 flex flex-col gap-5">
                <CourseMetaPreview parsed={parsed} />
                {parsed.topics.length > 0 && <TopicsPreview parsed={parsed} />}
                {parsed.resources.length > 0 && <ResourcesPreview parsed={parsed} />}
                {parsed.projects.length > 0 && <ProjectsPreview parsed={parsed} />}
                {parsed.assignments.length > 0 && <AssignmentsPreview parsed={parsed} />}
                {createError && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                    <AlertCircle size={13} className="text-red-400 shrink-0" />
                    <span className="text-xs font-medium text-red-500">{createError}</span>
                  </div>
                )}
              </div>
            )}

            {/* CREATING STEP */}
            {step === "creating" && (
              <div className="flex flex-col items-center justify-center py-20 gap-5">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 border border-purple-200 flex items-center justify-center">
                  <Loader2 size={22} className="text-purple-500 animate-spin" />
                </div>
                <div className="text-center flex flex-col gap-1">
                  <p className="text-sm font-semibold text-gray-800 tracking-tight">Creating your course…</p>
                  <p className="text-xs text-gray-400">Setting up topics, resources and more</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {step !== "creating" && (
            <div className="px-7 py-5 border-t border-purple-50 flex items-center justify-between gap-3 shrink-0 bg-white">
              <button
                onClick={step === "preview" ? () => setStep("paste") : handleClose}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-purple-600 transition-colors duration-150 px-3 py-2 rounded-xl hover:bg-purple-50"
              >
                {step === "preview" ? "← Back" : "Cancel"}
              </button>

              {step === "paste" && (
                <button
                  onClick={handleParse}
                  disabled={!raw.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white text-sm font-medium shadow-md shadow-purple-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
                >
                  Preview Course
                  <ChevronRight size={14} />
                </button>
              )}

              {step === "preview" && (
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white text-sm font-medium shadow-md shadow-purple-200 transition-all duration-200 active:scale-[0.98]"
                >
                  <CheckCircle2 size={14} />
                  Create Course
                </button>
              )}
            </div>
          )}

        </Dialog.Panel>
      </div>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        message="You've reached the course limit for your current plan. Upgrade to create more courses."
      />
    </Dialog>
  );
}

// Preview sub-components

function SectionLabel({ children, badge }: { children: React.ReactNode; badge?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {children}
      </p>
      {badge && (
        <span className="text-xs font-semibold text-purple-500 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}

function CourseMetaPreview({ parsed }: { parsed: ParsedCourse }) {
  return (
    <div>
      <SectionLabel>Course Details</SectionLabel>
      <div className="rounded-xl border border-purple-100 bg-purple-50/30 p-4 grid grid-cols-2 gap-x-6 gap-y-3">
        <MetaRow label="Title" value={parsed.title} span />
        {parsed.purpose && <MetaRow label="Purpose" value={parsed.purpose} span />}
        <MetaRow label="Type" value={parsed.type} />
        <MetaRow label="Priority" value={capitalize(parsed.priority)} />
        <MetaRow label="Projects" value={parsed.projectsEnabled ? "Enabled" : "Disabled"} />
        <MetaRow label="Assignments" value={parsed.assignmentsEnabled ? "Enabled" : "Disabled"} />
      </div>
    </div>
  );
}

function TopicsPreview({ parsed }: { parsed: ParsedCourse }) {
  const subtopicCount = parsed.topics.reduce((acc, t) => acc + t.subtopics.length, 0);
  return (
    <div>
      <SectionLabel badge={`${parsed.topics.length} topics · ${subtopicCount} subtopics`}>
        Topics & Subtopics
      </SectionLabel>
      <div className="rounded-xl border border-purple-100 overflow-hidden divide-y divide-purple-50">
        {parsed.topics.map((topic, ti) => (
          <div key={ti} className="bg-white">
            <div className="flex items-center gap-2.5 px-4 py-3">
              <ChevronRight size={13} className="text-purple-400 shrink-0" />
              <span className="text-sm font-medium text-gray-700">{topic.title}</span>
              {topic.subtopics.length > 0 && (
                <span className="ml-auto text-xs font-semibold text-purple-400 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
                  {topic.subtopics.length}
                </span>
              )}
            </div>
            {topic.subtopics.length > 0 && (
              <div className="pb-2.5 pl-10 pr-4 flex flex-col gap-1.5">
                {topic.subtopics.map((sub, si) => (
                  <div key={si} className="text-xs text-gray-400 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-purple-300 shrink-0" />
                    {sub.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ResourcesPreview({ parsed }: { parsed: ParsedCourse }) {
  return (
    <div>
      <SectionLabel badge={`${parsed.resources.length}`}>Resources</SectionLabel>
      <div className="rounded-xl border border-purple-100 overflow-hidden divide-y divide-purple-50">
        {parsed.resources.map((r, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white">
            <Link size={13} className="text-purple-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{r.title}</p>
              <p className="text-xs text-gray-400 truncate">{r.url}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsPreview({ parsed }: { parsed: ParsedCourse }) {
  return (
    <div>
      <SectionLabel badge={`${parsed.projects.length}`}>Projects</SectionLabel>
      <div className="rounded-xl border border-purple-100 overflow-hidden divide-y divide-purple-50">
        {parsed.projects.map((p, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3 bg-white">
            <FolderOpen size={13} className="text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">{p.title}</p>
              {p.description && (
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{p.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssignmentsPreview({ parsed }: { parsed: ParsedCourse }) {
  return (
    <div>
      <SectionLabel badge={`${parsed.assignments.length}`}>Assignments</SectionLabel>
      <div className="rounded-xl border border-purple-100 overflow-hidden divide-y divide-purple-50">
        {parsed.assignments.map((a, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3 bg-white">
            <BookOpen size={13} className="text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">{a.title}</p>
              {a.description && (
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{a.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helpers

function MetaRow({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-700">{value}</p>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}