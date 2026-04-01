"use client";

import { useState } from "react";
import type { Subscription } from "@/lib/billing";
import { createCheckout, cancelSubscription } from "@/lib/billing";
import { PlanBanner } from "./PlanBanner";
import { CancelConfirmBox } from "./CancelConfirmBox";
import { CancelledNotice } from "./CancelledNotice";
import { UpgradeSection } from "./UpgradeSection";

interface Props {
  subscription: Subscription;
  userId: string;
}

export default function CurrentPlanCard({ subscription, userId }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const isFree = subscription.plan_id === 0;
  const isPremium = subscription.plan_id === 2;
  const isCancelled = subscription.cancels_at_period_end;

  const expiryDateFormatted = subscription.plan_expires_at
    ? new Date(subscription.plan_expires_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  async function handleUpgrade(planId: number) {
    try {
      setLoading(`upgrade-${planId}`);
      const url = await createCheckout(userId, planId, cycle);
      window.location.href = url;
    } catch {
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  async function handleCancel() {
    if (!subscription.creem_subscription_id) return;
    try {
      setLoading("cancel");
      await cancelSubscription(userId, subscription.creem_subscription_id);
      window.location.reload();
    } catch {
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setLoading(null);
      setShowCancelConfirm(false);
    }
  }

  return (
    <section className="rounded-2xl border border-purple-100 bg-white shadow-sm shadow-purple-50 overflow-hidden">

      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-purple-50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 shadow-sm shadow-purple-200 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-sm font-semibold text-gray-800 tracking-tight leading-none">
              Subscription
            </h2>
            <p className="text-xs text-gray-400">
              Manage your plan and billing.
            </p>
          </div>
        </div>
      </div>

      {/* Plan info + notices */}
      <div className="px-6 py-5 flex flex-col gap-3">
        <PlanBanner
          subscription={subscription}
          expiryDateFormatted={expiryDateFormatted}
          loading={loading}
          onCancelClick={() => setShowCancelConfirm(true)}
        />

        {showCancelConfirm && (
          <CancelConfirmBox
            planName={subscription.plan_name}
            expiryDateFormatted={expiryDateFormatted}
            loading={loading === "cancel"}
            onConfirm={handleCancel}
            onDismiss={() => setShowCancelConfirm(false)}
          />
        )}

        {isCancelled && (
          <CancelledNotice
            expiryDateFormatted={expiryDateFormatted}
            loading={loading}
            planId={subscription.plan_id}
            onRenew={() => handleUpgrade(subscription.plan_id)}
          />
        )}
      </div>

      {/* Upgrade section */}
      {!isPremium && !isCancelled && (
        <UpgradeSection
          currentPlanId={subscription.plan_id}
          cycle={cycle}
          loading={loading}
          onCycleChange={setCycle}
          onUpgrade={handleUpgrade}
        />
      )}

      {/* Top tier celebration */}
      {isPremium && !isCancelled && (
        <div className="px-6 pb-6">
          <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-violet-50 p-5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 shadow-sm shadow-purple-200 flex items-center justify-center shrink-0 text-base">
              🎉
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold text-gray-800 tracking-tight">
                You're on our highest tier
              </p>
              <p className="text-xs text-gray-400">
                Enjoy all features with no limits.
              </p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}