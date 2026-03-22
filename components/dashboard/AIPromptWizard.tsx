"use client";

import { ChevronRight, Sparkles, Copy, Check, ExternalLink, ArrowLeft } from "lucide-react";
import { useAIPromptWizard, WizardStep } from "@/lib/backend/useAIPromptWizard";

interface AIPromptWizardProps {
  onClose: () => void;
  onDone: () => void;
}

const AI_TOOLS = [
  { name: "ChatGPT", url: "https://chat.openai.com" },
  { name: "Claude", url: "https://claude.ai" },
  { name: "Gemini", url: "https://gemini.google.com" },
];

export function AIPromptWizard({ onClose, onDone }: AIPromptWizardProps) {
  const {
    step, setStep,
    courseName, setCourseName,
    userIntent, setUserIntent,
    copied,
    handleCopy,
    reset,
  } = useAIPromptWizard();

  const handleBack = () => {
    if (step === 1) { 
      reset(); 
      onClose(); 
    } else {
      setStep((step - 1) as WizardStep);
    }
  };

  const handleDone = () => {
    reset();
    onDone();
  };

  const stepLabels: Record<WizardStep, string> = {
    1: "Course name",
    2: "Your goals",
    3: "Copy prompt",
  };

  return (
    <div className="flex flex-col gap-5 px-6 py-5">

      {/* Disclaimer */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <Sparkles size={14} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">
          <span className="font-semibold">We don't have AI built in.</span>{" "}
          This wizard builds a prompt you can paste into any AI tool (ChatGPT, Claude, Gemini)
          to generate your course outline — then paste the result back here.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                step === s
                  ? "bg-gradient-to-br from-purple-500 to-violet-500 text-white"
                  : step > s
                  ? "bg-purple-100 text-purple-500"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {step > s ? "✓" : s}
            </div>
            {s < 3 && (
              <div className={`h-px w-8 ${step > s ? "bg-purple-300" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
        <span className="ml-2 text-xs text-gray-400">
          {stepLabels[step]}
        </span>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-800">
            What course do you want to create?
          </h3>

          <input
            autoFocus
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="React, DSA, Python..."
            className="h-10 rounded-xl border border-purple-100 px-4 text-sm"
          />
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Why do you want this course?
          </h3>

          <textarea
            value={userIntent}
            onChange={(e) => setUserIntent(e.target.value)}
            className="min-h-[120px] rounded-xl border border-purple-100 px-4 py-3 text-sm"
          />
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="flex flex-col gap-4">

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="bg-purple-500 text-white rounded-xl py-2"
          >
            {copied ? "Copied!" : "Copy Prompt"}
          </button>

          {/* AI tools */}
          <div className="flex gap-2 flex-wrap">
            {AI_TOOLS.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 border rounded-lg text-xs flex items-center gap-1"
              >
                {tool.name}
                <ExternalLink size={10} />
              </a>
            ))}
          </div>

          <button
            onClick={handleDone}
            className="border rounded-xl py-2"
          >
            Done
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between pt-3">
        <button onClick={handleBack} className="text-xs text-gray-400">
          Back
        </button>

        {step < 3 && (
          <button
            onClick={() => setStep((step + 1) as WizardStep)}
            className="bg-purple-500 text-white px-4 py-2 rounded-xl text-xs"
          >
            Next
          </button>
        )}
      </div>

    </div>
  );
}