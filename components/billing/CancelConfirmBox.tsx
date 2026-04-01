import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  planName: string;
  expiryDateFormatted: string | null;
  loading: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function CancelConfirmBox({ planName, expiryDateFormatted, loading, onConfirm, onDismiss }: Props) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50/60 p-5 flex flex-col gap-4">

      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4 text-red-500" />
        </div>
        <div className="flex flex-col gap-1.5 min-w-0 pt-0.5">
          <p className="text-sm font-semibold text-gray-800 tracking-tight">
            Cancel your subscription?
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            You'll keep access to{" "}
            <span className="font-semibold text-gray-700">{planName}</span>{" "}
            until{" "}
            <span className="font-semibold text-gray-700">{expiryDateFormatted}</span>.
            After that, your account moves to the Free plan.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          disabled={loading}
          className="h-8 px-4 rounded-xl border border-purple-100 bg-white text-sm font-medium text-gray-500 hover:bg-purple-50 hover:text-gray-700 hover:border-purple-200 transition-all duration-200 shadow-none"
        >
          Keep plan
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onConfirm}
          disabled={loading}
          className="h-8 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium border-0 shadow-sm shadow-red-200 disabled:opacity-40 transition-all duration-200"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Cancelling…
            </span>
          ) : "Yes, cancel"}
        </Button>
      </div>

    </div>
  );
}