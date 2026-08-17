"use client";

import { useAppState } from "@/lib/store";
import MetricCard from "@/components/ui/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { Users, Boxes, Truck, Route, PackageSearch, Wallet } from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  useAppState();
  const state = useAppState();

  const activeTrips = state.trips.filter((t) => t.status !== "COMPLETED" && t.status !== "CANCELLED");
  const openLoads = state.loads.filter((l) => l.status === "open");
  const completedTrips = state.trips.filter((t) => t.status === "COMPLETED");
  const totalEarnings = state.transactions
    .filter((tx) => tx.type === "earnings" && tx.status === "completed")
    .reduce((s, tx) => s + tx.amount, 0);
  const vehiclesByAvail = state.vehicles.reduce<Record<string, number>>((acc, v) => {
    acc[v.availability] = (acc[v.availability] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8">
        <h1 className="h2">Platform analytics</h1>
        <p className="mt-1 text-muted">Aggregate metrics across the CARGOLINK network.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Total users" value={state.users.length} icon={Users} tone="brand" />
        <MetricCard label="Shipments" value={state.shipments.length} icon={Boxes} tone="sage" />
        <MetricCard label="Vehicles" value={state.vehicles.length} icon={Truck} tone="sand" />
        <MetricCard label="Trips" value={state.trips.length} icon={Route} tone="neutral" />
        <MetricCard label="Open loads" value={openLoads.length} icon={PackageSearch} tone="brand" />
        <MetricCard label="Completed earnings" value={formatINR(totalEarnings)} icon={Wallet} tone="sage" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card-elevated p-6">
          <h2 className="h3">Fleet availability</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(vehiclesByAvail).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <StatusBadge status={k} />
                <span className="text-[14px] font-semibold text-charcoal">{v}</span>
              </div>
            ))}
            {state.vehicles.length === 0 && <p className="text-[13.5px] text-muted">No vehicles registered.</p>}
          </div>
        </div>

        <div className="card-elevated p-6">
          <h2 className="h3">Journey status</h2>
          <div className="mt-4 space-y-3">
            {completedTrips.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] text-muted">Completed trips</span>
                  <span className="text-[14px] font-semibold text-charcoal">{completedTrips.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] text-muted">Active trips</span>
                  <span className="text-[14px] font-semibold text-charcoal">{activeTrips.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] text-muted">Return trips matched</span>
                  <span className="text-[14px] font-semibold text-charcoal">{state.trips.filter((t) => t.isReturnTrip).length}</span>
                </div>
              </>
            ) : (
              <p className="text-[13.5px] text-muted">No journey data yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
