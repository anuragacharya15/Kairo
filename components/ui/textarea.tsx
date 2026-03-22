import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-xl border border-purple-100 bg-white px-4 py-3",
        "text-sm text-gray-700 font-medium leading-relaxed",
        "placeholder:text-gray-300 placeholder:font-normal",
        "shadow-sm shadow-purple-50",
        "transition-all duration-200 resize-y",
        "hover:border-purple-200 hover:shadow-purple-100/60",
        "focus-visible:outline-none focus-visible:border-purple-300 focus-visible:ring-2 focus-visible:ring-purple-100 focus-visible:ring-offset-0",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-gray-50 disabled:resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }