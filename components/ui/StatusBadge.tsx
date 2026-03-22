interface Props {
  status: "planned" | "active" | "paused" | "completed";
}

const statusStyles: Record<Props["status"], string> = {
  planned:
    "bg-gray-100 text-gray-500 border border-gray-200",
  active:
    "bg-purple-50 text-purple-600 border border-purple-200",
  paused:
    "bg-amber-50 text-amber-600 border border-amber-200",
  completed:
    "bg-emerald-50 text-emerald-600 border border-emerald-200",
};

const statusDot: Record<Props["status"], string> = {
  planned: "bg-gray-400",
  active: "bg-purple-500",
  paused: "bg-amber-400",
  completed: "bg-emerald-500",
};

export function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full capitalize tracking-wide transition-colors duration-150 ${statusStyles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot[status]}`} />
      {status}
    </span>
  );
}