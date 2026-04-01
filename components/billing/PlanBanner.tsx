import { Button } from "@/components/ui/button";
import type { Subscription } from "@/lib/billing";
import { Crown, Zap, Sparkles, Calendar } from "lucide-react";

interface Props {
  subscription: Subscription;
  expiryDateFormatted: string | null;
  loading: string | null;
  onCancelClick: () => void;
}

export function PlanBanner({ subscription, expiryDateFormatted, loading, onCancelClick }: Props) {
  const isFree = subscription.plan_id === 0;
  const isPro = subscription.plan_id === 1;
  const isPremium = subscription.plan_id === 2;
  const isCancelled = subscription.cancels_at_period_end;

  return (
    <div
      className={`rounded-2xl p-5 flex items-center justify-between gap-4 border transition-all duration-200
        ${isPremium
          ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
          : isPro
          ? "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200"
          : "bg-gray-50 border-gray-200"
        }`}
    >
      <div className="flex flex-col gap-2.5 min-w-0">

        {/* Plan name + status badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 ${
            isPremium
              ? "bg-amber-100 border border-amber-200"
              : isPro
              ? "bg-purple-100 border border-purple-200"
              : "bg-gray-100 border border-gray-200"
          }`}>
            {isPremium && <Crown className="w-3.5 h-3.5 text-amber-500" />}
            {isPro && <Zap className="w-3.5 h-3.5 text-purple-500" />}
            {isFree && <Sparkles className="w-3.5 h-3.5 text-gray-400" />}
          </div>

          <span className="font-semibold text-sm text-gray-800 tracking-tight">
            {subscription.plan_name} Plan
          </span>

          {isFree && (
            <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-gray-500">
              Free
            </span>
          )}
          {!isFree && !isCancelled && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              Active
            </span>
          )}
          {isCancelled && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              Cancels {expiryDateFormatted}
            </span>
          )}
        </div>

        {/* Expiry / renewal info */}
        {!isFree && subscription.plan_expires_at && (
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-gray-300" />
            {isCancelled ? (
              <>
                Access until{" "}
                <span className="font-semibold text-gray-600">{expiryDateFormatted}</span>
                {subscription.days_remaining !== null && (
                  <span className="text-amber-500 font-medium">
                    · {subscription.days_remaining} days left
                  </span>
                )}
              </>
            ) : (
              <>
                {subscription.days_remaining !== null && (
                  <span className="font-semibold text-gray-600">
                    {subscription.days_remaining} days left
                  </span>
                )}
                {subscription.days_remaining !== null && (
                  <span className="text-gray-300">·</span>
                )}
                Renews {expiryDateFormatted}
              </>
            )}
          </p>
        )}

        {/* Free plan limits */}
        {isFree && (
          <p className="text-xs text-gray-400">
            3 courses · 7 topics per course
          </p>
        )}
      </div>

      {/* Cancel button */}
      {!isFree && !isCancelled && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancelClick}
          disabled={loading === "cancel"}
          className="shrink-0 h-8 px-3 rounded-xl border border-transparent text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all duration-200 shadow-none disabled:opacity-40"
        >
          Cancel plan
        </Button>
      )}
    </div>
  );
}