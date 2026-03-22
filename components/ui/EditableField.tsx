"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

export function EditableField({
  value,
  onChange,
  children,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  children: (props: {
    value: string;
    onChange: (v: string) => void;
    onBlur: () => void;
  }) => React.ReactNode;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div
        className={cn(
          "w-full rounded-xl border border-purple-200 bg-white px-3 py-2",
          "shadow-sm shadow-purple-100/50 ring-2 ring-purple-100",
          "transition-all duration-200",
          className
        )}
      >
        {children({
          value,
          onChange,
          onBlur: () => setEditing(false),
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-2 cursor-pointer",
        "rounded-xl px-3 py-2",
        "border border-transparent",
        "hover:border-purple-100 hover:bg-purple-50/60",
        "transition-all duration-200",
        className
      )}
      onClick={() => setEditing(true)}
    >
      <span className="text-sm text-gray-700 font-medium leading-snug flex-1">
        {value || (
          <span className="text-gray-300 italic font-normal">Click to edit…</span>
        )}
      </span>
      <Pencil
        className={cn(
          "w-3.5 h-3.5 flex-shrink-0",
          "text-purple-300 opacity-0 group-hover:opacity-100",
          "transition-opacity duration-150"
        )}
      />
    </div>
  );
}