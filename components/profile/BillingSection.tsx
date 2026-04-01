import Link from "next/link";
import type { SubscriptionInfo } from "@/lib/types/user";

interface Props {
  subscription: SubscriptionInfo;
}

export default function BillingSection({ subscription }: Props) {
  const isActive = subscription.status === "active";
  const usagePercent =
    (subscription.courses_used / subscription.courses_limit) * 100;

  return (
    <section
      className="
        rounded-2xl 
        border 
        bg-card 
        shadow-sm 
        hover:shadow-md 
        transition-shadow
        p-6 
        space-y-5
      "
    >
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Billing & Subscription
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage your plan and usage
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Plan Row */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="font-medium">{subscription.plan_name}</p>

          <p
            className={`text-sm ${
              isActive ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            {isActive ? "Active subscription" : "No active subscription"}
          </p>
        </div>

        <Link
          href="/billing"
          className="
            px-4 py-2 
            rounded-lg 
            border 
            text-sm font-medium
            hover:bg-muted 
            transition-colors
          "
        >
          Manage
        </Link>
      </div>

      {/* Usage */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Courses used</span>
          <span>
            {subscription.courses_used} / {subscription.courses_limit}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`
              h-full rounded-full transition-all
              ${usagePercent > 90 ? "bg-red-500" : "bg-primary"}
            `}
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}