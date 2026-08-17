"use client";

import { useState } from "react";
import { useAppState } from "@/lib/store";
import StatusBadge from "@/components/ui/StatusBadge";
import { Search } from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function AdminTripsPage() {
  useAppState();
  const state = useAppState();
  const [q, setQ] = useState("");

  const trips = state.trips
    .filter(
      (t) =>
        t.ref.toLowerCase().includes(q.toLowerCase()) ||
        `${t.pickup} ${t.drop}`.toLowerCase().includes(q.toLowerCase())
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h2">Trips</h1>
          <p className="mt-1 text-muted">{state.trips.length} trips in the system.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by trip ID or route"
            className="form-input pl-10"
          />
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table min-w-[760px]">
            <thead>
              <tr>
                <th>Trip</th>
                <th>Route</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Earnings</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((t) => (
                <tr key={t.id}>
                  <td className="font-semibold">{t.ref}</td>
                  <td>{t.pickup} → {t.drop}</td>
                  <td>{t.vehicleId}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td>{t.progress}%</td>
                  <td className="font-medium">{formatINR(t.earnings)}</td>
                </tr>
              ))}
              {trips.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted">No trips found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
