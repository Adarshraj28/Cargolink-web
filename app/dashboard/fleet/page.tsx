"use client";

import { useAuth } from "@/lib/auth";
import {
  getVehiclesByOwner,
  updateVehicle,
  getTripsForDriver,
  useAppState,
} from "@/lib/store";
import MetricCard from "@/components/ui/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { Truck, Wrench, Route, CheckCircle2 } from "lucide-react";

export default function FleetPage() {
  const { user } = useAuth();
  useAppState();

  if (!user) {
    return <SkeletonTable />;
  }

  const vehicles = getVehiclesByOwner(user.id);
  const trips = getTripsForDriver(user.id);
  const available = vehicles.filter((v) => v.availability === "available").length;
  const onTrip = vehicles.filter((v) => v.availability === "on-trip").length;
  const maintenance = vehicles.filter((v) => v.availability === "maintenance").length;
  const utilization = vehicles.length
    ? Math.round((onTrip / vehicles.length) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8">
        <h1 className="h2">Fleet</h1>
        <p className="mt-1 text-muted">Manage your vehicles and availability.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total vehicles" value={vehicles.length} icon={Truck} tone="brand" />
        <MetricCard label="Available" value={available} icon={CheckCircle2} tone="sage" />
        <MetricCard label="On trip" value={onTrip} icon={Route} tone="sand" />
        <MetricCard label="Maintenance" value={maintenance} icon={Wrench} tone="neutral" />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="card-elevated p-5">
          <p className="text-[12.5px] font-semibold uppercase tracking-wide text-muted">Fleet utilization</p>
          <p className="mt-2 text-[26px] font-bold text-charcoal font-display">{utilization}%</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-sage-100">
            <div className="h-full rounded-full bg-forest-600" style={{ width: `${utilization}%` }} />
          </div>
        </div>
        <div className="card-elevated p-5">
          <p className="text-[12.5px] font-semibold uppercase tracking-wide text-muted">Active trips</p>
          <p className="mt-2 text-[26px] font-bold text-charcoal font-display">
            {trips.filter((t) => !["COMPLETED", "CANCELLED"].includes(t.status)).length}
          </p>
          <p className="mt-1 text-[12.5px] text-muted">across all vehicles</p>
        </div>
      </div>

      <h2 className="h3 mt-10 mb-4">All vehicles</h2>
      {vehicles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-white p-12 text-center">
          <Truck size={28} className="mx-auto text-muted" />
          <p className="mt-3 text-[15px] font-semibold text-charcoal">No vehicles registered</p>
          <p className="mt-1 text-[13.5px] text-muted">Add your vehicle in Settings to start.</p>
        </div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table min-w-[820px]">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Driver</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Availability</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <p className="font-semibold">{v.number}</p>
                      <p className="text-[12px] text-muted">{v.truckType}</p>
                    </td>
                    <td>
                      <p className="font-medium">{v.driverName}</p>
                      <p className="text-[12px] text-muted">{v.driverPhone}</p>
                    </td>
                    <td>{v.currentLocation}</td>
                    <td>{v.capacity} T</td>
                    <td><StatusBadge status={v.availability} /></td>
                    <td>
                      <select
                        value={v.availability}
                        onChange={(e) =>
                          updateVehicle(v.id, {
                            availability: e.target.value as typeof v.availability,
                          })
                        }
                        className="form-select w-auto py-1.5 text-[13px]"
                        aria-label={`Set availability for ${v.number}`}
                      >
                        <option value="available">Available</option>
                        <option value="on-trip">On trip</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
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
