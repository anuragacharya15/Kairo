import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getSubscription, getPayments } from "@/lib/billing";
import CurrentPlanCard from "./CurrentPlanCard";
import PaymentHistoryTable from "./PaymentHistoryTable";

export default async function BillingContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const [subscription, payments] = await Promise.all([
    getSubscription(user.id),
    getPayments(user.id),
  ]);

  return (
    <div className="flex-1 px-6 py-10 sm:px-10">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">

        {/* Page header */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-1.5 rounded-full bg-gradient-to-b from-purple-400 to-violet-500 shrink-0" />
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight leading-none">
              Billing
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Manage your subscription and payment history.
            </p>
          </div>
        </div>

        <CurrentPlanCard subscription={subscription} userId={user.id} />
        <PaymentHistoryTable payments={payments} />

      </div>
    </div>
  );
}