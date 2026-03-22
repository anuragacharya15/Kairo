import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-md shadow-purple-200 hover:from-purple-600 hover:to-violet-600 hover:shadow-lg hover:shadow-purple-200 active:scale-[0.98]",
        destructive:
          "rounded-xl bg-red-50 text-red-500 border border-red-100 shadow-sm hover:bg-red-100 hover:border-red-200 active:scale-[0.98] focus-visible:ring-red-200",
        outline:
          "rounded-xl border border-purple-100 bg-white text-gray-600 shadow-sm hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 active:scale-[0.98]",
        secondary:
          "rounded-xl bg-purple-50 text-purple-600 border border-purple-100 hover:bg-purple-100 hover:border-purple-200 active:scale-[0.98]",
        ghost:
          "rounded-xl text-gray-500 hover:bg-purple-50 hover:text-purple-600 active:scale-[0.98]",
        link:
          "rounded-md text-purple-500 underline-offset-4 hover:underline hover:text-purple-700",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-lg px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-xl gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-xl px-6 text-base has-[>svg]:px-4",
        icon: "size-9 rounded-xl",
        "icon-xs": "size-6 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-xl",
        "icon-lg": "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }