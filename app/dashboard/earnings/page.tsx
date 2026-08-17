"use client";

import { useAuth } from "@/lib/auth";
import {
  getTransactionsForUser,
  getEarningsTotal,
  useAppState,
} from "@/lib/store";
import StatusBadge from "@/components/ui/StatusBadge";
import MetricCard from "@/components/ui/MetricCard";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { Wallet, ArrowDownToLine, ArrowUpFromLine, History } from "lucide-react";

export default function EarningsPage() {
  const { user } = useAuth();
  useAppState();

  if (!user) {
    return <SkeletonTable />;
  }

  const isShipper = user.role === "SHIPPER";
  const transactions = getTransactionsForUser(user.id);
  const earnings = getEarningsTotal(user.id);
  const pending = transactions
    .filter((t) => t.status === "pending")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="h2">{isShipper ? "Payments" : "Earnings"}</h1>
          <p className="mt-1 text-muted">
            {isShipper ? "Your payment history." : "Your trip earnings and payouts."}
          </p>
        </div>
        <span className="badge badge-brand">Demo data</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <MetricCard
          label={isShipper ? "Total paid" : "Total earnings"}
          value={`₹${earnings.toLocaleString("en-IN")}`}
          icon={Wallet}
          tone="brand"
        />
        <MetricCard
          label={isShipper ? "Pending payments" : "Pending payouts"}
          value={`₹${pending.toLocaleString("en-IN")}`}
          icon={ArrowDownToLine}
          tone="sand"
        />
        <MetricCard
          label="Transactions"
          value={transactions.length}
          icon={ArrowUpFromLine}
          tone="sage"
        />
      </div>

      <p className="mt-4 text-[12.5px] text-muted">
        Balances shown are demo data for development purposes — not real money.
      </p>

      <h2 className="h3 mt-10 mb-4">Transactions</h2>
      {transactions.length === 0 ? (
        <EmptyState
          icon={History}
          title="No transactions yet"
          description="Payments and earnings will appear here."
        />
      ) : (
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table min-w-[720px]">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="font-medium">{tx.label}</td>
                    <td>
                      <span className={`badge ${tx.type === "earnings" ? "badge-success" : "badge-info"}`}>
                        {tx.type === "earnings" ? "Earnings" : "Payment"}
                      </span>
                    </td>
                    <td><StatusBadge status={tx.status} /></td>
                    <td className="text-right font-bold">
                      {tx.type === "earnings" ? "+" : "−"}₹{tx.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
