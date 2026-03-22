"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 text-sm font-medium",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    "data-[state=on]:bg-gradient-to-r data-[state=on]:from-purple-500 data-[state=on]:to-violet-500",
    "data-[state=on]:text-white data-[state=on]:shadow-md data-[state=on]:shadow-purple-200",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "rounded-xl bg-transparent text-gray-500",
          "hover:bg-purple-50 hover:text-purple-600",
        ].join(" "),
        outline: [
          "rounded-xl border border-purple-100 bg-white text-gray-500",
          "shadow-sm shadow-purple-50",
          "hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200",
          "data-[state=on]:border-transparent",
        ].join(" "),
      },
      size: {
        default: "h-9 px-3 min-w-9",
        sm: "h-8 px-2.5 min-w-8 text-xs",
        lg: "h-10 px-4 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }