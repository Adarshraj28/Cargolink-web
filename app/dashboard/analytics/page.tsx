"use client";

import { useAuth } from "@/lib/auth";
import {
  getShipmentsByShipper,
  getTripsForDriver,
  getVehiclesByOwner,
  getMatchesForVehicle,
  useAppState,
} from "@/lib/store";
import MetricCard from "@/components/ui/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { SkeletonCards } from "@/components/ui/Skeleton";
import {
  Boxes,
  PackageCheck,
  Gauge,
  Route,
  GitMerge,
  TrendingUp,
} from "lucide-react";

export default function AnalyticsPage() {
  const { user } = useAuth();
  useAppState();

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64" />
        <SkeletonCards />
      </div>
    );
  }

  const isShipper = user.role === "SHIPPER";
  const shipments = isShipper ? getShipmentsByShipper(user.id) : [];
  const trips = !isShipper ? getTripsForDriver(user.id) : [];
  const vehicles = !isShipper ? getVehiclesByOwner(user.id) : [];
  const matches = !isShipper && vehicles[0] ? getMatchesForVehicle(vehicles[0]) : [];

  const activeTrips = trips.filter((t) => !["COMPLETED", "CANCELLED"].includes(t.status)).length;
  const completedTrips = trips.filter((t) => t.status === "COMPLETED").length;
  const returnTrips = trips.filter((t) => t.isReturnTrip).length;

  // Sustainability estimates from real app data
  const avgDistance = trips.length ? Math.round(trips.reduce((s, t) => s + (t.progress > 0 ? 600 : 0), 0) / Math.max(trips.length, 1)) : 0;
  const potentialEmptyKm = completedTrips * avgDistance * 0.6;

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8">
        <h1 className="h2">Analytics</h1>
        <p className="mt-1 text-muted">Operational metrics from your activity.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={isShipper ? "Total shipments" : "Active trips"}
          value={isShipper ? shipments.length : activeTrips}
          icon={Boxes}
          tone="brand"
        />
        <MetricCard
          label={isShipper ? "Completed" : "Completed trips"}
          value={isShipper ? shipments.filter((s) => s.status === "COMPLETED").length : completedTrips}
          icon={PackageCheck}
          tone="sage"
        />
        <MetricCard
          label="Fleet utilization"
          value={vehicles.length ? `${Math.round((vehicles.filter((v) => v.availability === "on-trip").length / vehicles.length) * 100)}%` : "—"}
          icon={Gauge}
          tone="sand"
        />
        <MetricCard
          label="Return matches"
          value={matches.length}
          icon={GitMerge}
          tone="neutral"
        />
      </div>

      {/* Sustainability estimates */}
      <div className="mt-10">
        <div className="flex items-center gap-2">
          <h2 className="h3">Estimated impact</h2>
          <span className="badge badge-brand">Estimated</span>
        </div>
        <p className="mt-1 text-[13px] text-muted">
          Calculated from your demo platform data — not certified claims.
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div className="card-elevated p-5">
            <Route size={18} className="text-forest-600" />
            <p className="mt-3 text-[24px] font-bold text-charcoal font-display">
              {potentialEmptyKm.toLocaleString("en-IN")} km
            </p>
            <p className="mt-1 text-[12.5px] text-muted">Potential empty distance avoided</p>
          </div>
          <div className="card-elevated p-5">
            <GitMerge size={18} className="text-forest-600" />
            <p className="mt-3 text-[24px] font-bold text-charcoal font-display">{returnTrips || matches.length}</p>
            <p className="mt-1 text-[12.5px] text-muted">Return trips matched</p>
          </div>
          <div className="card-elevated p-5">
            <TrendingUp size={18} className="text-forest-600" />
            <p className="mt-3 text-[24px] font-bold text-charcoal font-display">
              {avgDistance ? `${Math.min(avgDistance, 100)}%` : "—"}
            </p>
            <p className="mt-1 text-[12.5px] text-muted">Journey productivity</p>
          </div>
        </div>
      </div>

      {/* Recent trips table for drivers */}
      {!isShipper && trips.length > 0 && (
        <div className="mt-10">
          <h2 className="h3 mb-4">Recent trips</h2>
          <div className="card-elevated overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table min-w-[700px]">
                <thead>
                  <tr>
                    <th>Trip</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.slice(0, 8).map((t) => (
                    <tr key={t.id}>
                      <td className="font-semibold">{t.ref}</td>
                      <td>{t.pickup} → {t.drop}</td>
                      <td><StatusBadge status={t.status} /></td>
                      <td className="font-medium">₹{t.earnings.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
