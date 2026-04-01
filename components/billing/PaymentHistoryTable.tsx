import type { Payment } from "@/lib/billing";

interface Props {
  payments: Payment[];
}

export default function PaymentHistoryTable({ payments }: Props) {
  const PLAN_NAMES: Record<number, string> = {
    0: "Free",
    1: "Pro",
    2: "Premium",
  };

  return (
    <section className="rounded-2xl border border-purple-100 bg-white shadow-sm shadow-purple-50 overflow-hidden">

      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-purple-50 flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 shadow-sm shadow-purple-200 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-semibold text-gray-800 tracking-tight leading-none">
            Payment History
          </h2>
          <p className="text-xs text-gray-400">
            All your past transactions.
          </p>
        </div>
      </div>

      {/* Empty state */}
      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-14 px-6 text-center">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 border border-purple-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-gray-700 tracking-tight">No payments yet</p>
            <p className="text-xs text-gray-400">Your transaction history will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-50 bg-purple-50/40">
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Plan</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {payments.map((p) => (
                <tr key={p.payment_id} className="hover:bg-purple-50/30 transition-colors duration-150">
                  <td className="py-3.5 px-6 text-xs text-gray-400 tabular-nums">
                    {new Date(p.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-100 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-600">
                      {PLAN_NAMES[p.plan_id] ?? "Unknown"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-sm font-semibold text-gray-700 tabular-nums">
                      ${(p.amount / 100).toFixed(2)}
                    </span>
                    <span className="ml-1.5 text-xs font-medium text-gray-400 uppercase">
                      {p.currency}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 capitalize">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </section>
  );
}