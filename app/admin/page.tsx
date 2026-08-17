"use client";

import Link from "next/link";
import { useAppState } from "@/lib/store";
import MetricCard from "@/components/ui/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { Users, Boxes, Truck, Route, PackageSearch } from "lucide-react";
import { timeAgo } from "@/lib/utils";

export default function AdminOverviewPage() {
  useAppState();

  const state = useAppState();
  const activeShipments = state.shipments.filter(
    (s) => s.status !== "COMPLETED" && s.status !== "CANCELLED"
  ).length;
  const activeTrips = state.trips.filter(
    (t) => t.status !== "COMPLETED" && t.status !== "CANCELLED"
  ).length;
  const openLoads = state.loads.filter((l) => l.status === "open").length;

  const activity = [
    ...state.loads.map((l) => ({ type: "load" as const, ref: l.ref, status: l.status, at: l.createdAt })),
    ...state.shipments.map((s) => ({ type: "shipment" as const, ref: s.ref, status: s.status, at: s.createdAt })),
    ...state.trips.map((t) => ({ type: "trip" as const, ref: t.ref, status: t.status, at: t.createdAt })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 10);

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8">
        <h1 className="h2">Platform overview</h1>
        <p className="mt-1 text-muted">Monitor users, shipments, fleet and matching activity.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Total users" value={state.users.length} icon={Users} tone="brand" />
        <MetricCard label="Shipments" value={`${activeShipments} active`} icon={Boxes} tone="sage" />
        <MetricCard label="Vehicles" value={state.vehicles.length} icon={Truck} tone="sand" />
        <MetricCard label="Active trips" value={activeTrips} icon={Route} tone="neutral" />
        <MetricCard label="Open loads" value={openLoads} icon={PackageSearch} tone="brand" />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="h3">Recent platform activity</h2>
        <div className="flex gap-3">
          <Link href="/admin/users" className="text-[13px] font-medium text-forest-700 hover:text-forest-800">Manage users</Link>
          <Link href="/admin/shipments" className="text-[13px] font-medium text-forest-700 hover:text-forest-800">View shipments</Link>
          <Link href="/admin/vehicles" className="text-[13px] font-medium text-forest-700 hover:text-forest-800">View vehicles</Link>
        </div>
      </div>

      <div className="card-elevated mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table min-w-[640px]">
            <thead>
              <tr>
                <th>Type</th>
                <th>Reference</th>
                <th>Status</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {activity.map((a) => (
                <tr key={a.ref + a.at}>
                  <td className="uppercase text-[12px] font-semibold text-muted">{a.type}</td>
                  <td className="font-semibold">{a.ref}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td className="text-muted">{timeAgo(a.at)}</td>
                </tr>
              ))}
              {activity.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted">No activity yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
