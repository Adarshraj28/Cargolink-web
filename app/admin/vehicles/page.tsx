"use client";

import { useState } from "react";
import { useAppState } from "@/lib/store";
import StatusBadge from "@/components/ui/StatusBadge";
import { Search } from "lucide-react";

export default function AdminVehiclesPage() {
  useAppState();
  const state = useAppState();
  const [q, setQ] = useState("");

  const vehicles = state.vehicles.filter(
    (v) =>
      v.number.toLowerCase().includes(q.toLowerCase()) ||
      v.driverName.toLowerCase().includes(q.toLowerCase()) ||
      v.currentLocation.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h2">Vehicles</h1>
          <p className="mt-1 text-muted">{state.vehicles.length} vehicles on the network.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by number, driver or location"
            className="form-input pl-10"
          />
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table min-w-[760px]">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Location</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td className="font-semibold">{v.number}</td>
                  <td>{v.driverName}</td>
                  <td>{v.currentLocation}</td>
                  <td>{v.truckType}</td>
                  <td>{v.capacity} T</td>
                  <td><StatusBadge status={v.availability} /></td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted">No vehicles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
