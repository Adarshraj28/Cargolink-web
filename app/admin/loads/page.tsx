"use client";

import { useState } from "react";
import { useAppState } from "@/lib/store";
import StatusBadge from "@/components/ui/StatusBadge";
import { Search } from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function AdminLoadsPage() {
  useAppState();
  const state = useAppState();
  const [q, setQ] = useState("");

  const loads = state.loads
    .filter(
      (l) =>
        l.ref.toLowerCase().includes(q.toLowerCase()) ||
        `${l.pickup} ${l.drop}`.toLowerCase().includes(q.toLowerCase())
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h2">Loads</h1>
          <p className="mt-1 text-muted">{state.loads.length} loads in the marketplace.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by load ID or route"
            className="form-input pl-10"
          />
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table min-w-[760px]">
            <thead>
              <tr>
                <th>Load</th>
                <th>Route</th>
                <th>Cargo</th>
                <th>Status</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {loads.map((l) => (
                <tr key={l.id}>
                  <td className="font-semibold">{l.ref}</td>
                  <td>{l.pickup} → {l.drop} · {l.distance} km</td>
                  <td>{l.cargoType} · {l.weight} T</td>
                  <td><StatusBadge status={l.status} /></td>
                  <td className="font-medium">{formatINR(l.price)}</td>
                </tr>
              ))}
              {loads.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted">No loads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
