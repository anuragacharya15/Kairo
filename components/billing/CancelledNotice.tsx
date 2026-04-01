import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  expiryDateFormatted: string | null;
  loading: string | null;
  planId: number;
  onRenew: () => void;
}

export function CancelledNotice({ expiryDateFormatted, loading, planId, onRenew }: Props) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 flex flex-col gap-4">

      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        </div>
        <div className="flex flex-col gap-1.5 pt-0.5 min-w-0">
          <p className="text-sm font-semibold text-amber-700 tracking-tight">
            Subscription cancelled
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Auto-renewal is off. You still have full access until{" "}
            <span className="font-semibold text-gray-700">{expiryDateFormatted}</span>.
            Want to continue?
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={onRenew}
          disabled={loading !== null}
          className="h-8 px-4 rounded-xl border border-amber-200 bg-white text-xs font-semibold text-amber-600 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 shadow-sm transition-all duration-200 disabled:opacity-40"
        >
          {loading === `upgrade-${planId}` ? (
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Redirecting…
            </span>
          ) : "Renew plan"}
        </Button>
      </div>

    </div>
  );
}