"use client";

import { useState } from "react";
import { useAppState } from "@/lib/store";
import StatusBadge from "@/components/ui/StatusBadge";
import { Search } from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function AdminShipmentsPage() {
  useAppState();
  const state = useAppState();
  const [q, setQ] = useState("");

  const shipments = state.shipments
    .filter(
      (s) =>
        s.ref.toLowerCase().includes(q.toLowerCase()) ||
        `${s.pickup} ${s.drop}`.toLowerCase().includes(q.toLowerCase())
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h2">Shipments</h1>
          <p className="mt-1 text-muted">{state.shipments.length} shipments in the system.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by ID or route"
            className="form-input pl-10"
          />
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table min-w-[760px]">
            <thead>
              <tr>
                <th>Shipment</th>
                <th>Route</th>
                <th>Cargo</th>
                <th>Status</th>
                <th>Budget</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => (
                <tr key={s.id}>
                  <td className="font-semibold">{s.ref}</td>
                  <td>{s.pickup} → {s.drop}</td>
                  <td>{s.cargoType} · {s.weight} T</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td className="font-medium">{formatINR(s.budget)}</td>
                </tr>
              ))}
              {shipments.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted">No shipments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
