import { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function CourseSection({
  title,
  description,
  action,
  children,
}: Props) {
  return (
    <section className="
      rounded-2xl 
      border 
      bg-card 
      shadow-sm 
      hover:shadow-md 
      transition-shadow
      p-6 
      flex flex-col gap-5
    ">
      {/* ───── Header ───── */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">
            {title}
          </h2>

          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* ───── Content ───── */}
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </section>
  );
}