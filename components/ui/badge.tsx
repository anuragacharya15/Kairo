import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 tracking-wide",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-sm shadow-purple-200 hover:from-purple-600 hover:to-violet-600",
        secondary:
          "border border-purple-100 bg-purple-50 text-purple-600 hover:bg-purple-100 hover:border-purple-200",
        destructive:
          "border-transparent bg-red-50 text-red-500 border border-red-100 shadow-sm hover:bg-red-100",
        outline:
          "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };