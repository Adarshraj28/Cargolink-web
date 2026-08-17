"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { getShipmentsByShipper, useAppState } from "@/lib/store";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { Boxes, FilePlus2, ArrowRight, Filter } from "lucide-react";

const FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Searching", value: "SEARCHING_FOR_TRUCK" },
  { label: "In transit", value: "IN_TRANSIT" },
  { label: "Delivered", value: "COMPLETED" },
];

export default function ShipmentsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  useAppState();

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64" />
        <SkeletonTable />
      </div>
    );
  }

  const shipments = getShipmentsByShipper(user.id);
  const filtered =
    filter === "all" ? shipments : shipments.filter((s) => s.status === filter);

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="h2">Shipments</h1>
          <p className="mt-1 text-muted">Create, manage and track your freight.</p>
        </div>
        <Link href="/dashboard/shipments/create" className="btn btn-primary">
          <FilePlus2 size={16} />
          Create shipment
        </Link>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Filter size={15} className="text-muted" />
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors ${
              filter === f.value
                ? "border-forest-600 bg-forest-700 text-white"
                : "border-line bg-white text-charcoal/75 hover:border-sage-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No shipments here yet"
          description="Create a shipment and it will appear here, then start searching for a truck."
          action={
            <Link href="/dashboard/shipments/create" className="btn btn-primary">
              Create shipment
            </Link>
          }
        />
      ) : (
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table min-w-[760px]">
              <thead>
                <tr>
                  <th>Shipment</th>
                  <th>Route</th>
                  <th>Cargo</th>
                  <th>Pickup</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td className="font-semibold">{s.ref}</td>
                    <td>{s.pickup} → {s.drop}</td>
                    <td className="text-muted">{s.cargoType} · {s.weight} T</td>
                    <td className="text-muted">{s.pickupDate} · {s.pickupTime}</td>
                    <td className="font-medium">₹{s.budget.toLocaleString("en-IN")}</td>
                    <td><StatusBadge status={s.status} /></td>
                    <td>
                      <Link
                        href={`/dashboard/tracking?ref=${s.ref}`}
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-forest-700 hover:text-forest-800"
                      >
                        Track <ArrowRight size={13} />
                      </Link>
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
