import { Button } from "@/components/ui/button";
import { Check, Zap, Crown } from "lucide-react";

const PLANS = [
  {
    id: 1,
    name: "Pro",
    icon: Zap,
    monthlyPrice: "$8.99",
    yearlyPrice: "$89.99",
    monthlyLabel: "/mo",
    yearlyLabel: "/yr",
    features: ["10 courses", "12 topics per course", "Priority support"],
    accent: "from-purple-50 to-violet-50",
    border: "border-purple-200",
    iconBg: "bg-purple-100 border-purple-200",
    iconColor: "text-purple-500",
    checkColor: "text-purple-400",
  },
  {
    id: 2,
    name: "Premium",
    icon: Crown,
    monthlyPrice: "$14.99",
    yearlyPrice: "$149.99",
    monthlyLabel: "/mo",
    yearlyLabel: "/yr",
    features: ["Unlimited courses", "Unlimited topics", "Priority support", "Early access to features"],
    accent: "from-amber-50 to-orange-50",
    border: "border-amber-200",
    iconBg: "bg-amber-100 border-amber-200",
    iconColor: "text-amber-500",
    checkColor: "text-amber-400",
    recommended: true,
  },
];

interface Props {
  currentPlanId: number;
  cycle: "monthly" | "yearly";
  loading: string | null;
  onCycleChange: (cycle: "monthly" | "yearly") => void;
  onUpgrade: (planId: number) => void;
}

export function UpgradeSection({ currentPlanId, cycle, loading, onCycleChange, onUpgrade }: Props) {
  const visiblePlans = PLANS.filter((p) => p.id > currentPlanId);

  return (
    <div className="px-6 pb-6 flex flex-col gap-5">

      {/* Section divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-purple-100" />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Upgrade
        </span>
        <div className="flex-1 h-px bg-purple-100" />
      </div>

      {/* Billing cycle toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-xl border border-purple-100 bg-purple-50/50 p-1">
          <button
            onClick={() => onCycleChange("monthly")}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              cycle === "monthly"
                ? "bg-white text-gray-700 shadow-sm border border-purple-100"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => onCycleChange("yearly")}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
              cycle === "yearly"
                ? "bg-white text-gray-700 shadow-sm border border-purple-100"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Yearly
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 font-semibold">
              −17%
            </span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div
        className={`grid gap-4 ${
          visiblePlans.length === 1
            ? "grid-cols-1 max-w-sm mx-auto w-full"
            : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {visiblePlans.map((plan) => {
          const Icon = plan.icon;
          const price = cycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
          const period = cycle === "monthly" ? plan.monthlyLabel : plan.yearlyLabel;
          const isLoading = loading === `upgrade-${plan.id}`;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-5 flex flex-col gap-4 bg-gradient-to-br transition-all duration-200 hover:shadow-md ${
                plan.accent
              } ${plan.border} ${plan.recommended ? "hover:shadow-amber-100/60" : "hover:shadow-purple-100/60"}`}
            >
              {/* Recommended badge */}
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white font-semibold shadow-sm whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan name + price */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div className={`h-7 w-7 rounded-xl border flex items-center justify-center shrink-0 ${plan.iconBg}`}>
                    <Icon className={`w-3.5 h-3.5 ${plan.iconColor}`} />
                  </div>
                  <span className="font-semibold text-sm text-gray-800 tracking-tight">{plan.name}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-800 tracking-tight">{price}</span>
                  <span className="text-xs font-medium text-gray-400">{period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                    <Check className={`w-3.5 h-3.5 shrink-0 ${plan.checkColor}`} strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <Button
                className={`w-full rounded-xl text-sm font-medium shadow-sm transition-all duration-200 active:scale-[0.98] border-0 ${
                  plan.recommended
                    ? "bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-200"
                    : "bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-purple-200"
                } disabled:opacity-40`}
                onClick={() => onUpgrade(plan.id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Redirecting…
                  </span>
                ) : `Get ${plan.name}`}
              </Button>
            </div>
          );
        })}
      </div>

    </div>
  );
}