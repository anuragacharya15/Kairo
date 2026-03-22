import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-purple-100 bg-white px-4 py-2",
          "text-sm text-gray-700 font-medium",
          "placeholder:text-gray-300 placeholder:font-normal",
          "shadow-sm shadow-purple-50",
          "transition-all duration-200",
          "hover:border-purple-200 hover:shadow-purple-100/60",
          "focus-visible:outline-none focus-visible:border-purple-300 focus-visible:ring-2 focus-visible:ring-purple-100 focus-visible:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-gray-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-purple-600",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };