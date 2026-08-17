"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import {
  useAppState,
  getShipmentsByShipper,
  getVehiclesByOwner,
  getTripsForDriver,
  getActiveTripForDriver,
  getMatchesForVehicle,
  getEarningsTotal,
} from "@/lib/store";
import MetricCard from "@/components/ui/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";
import PermissionsBanner from "@/components/dashboard/shared/PermissionsBanner";
import { SkeletonCards, SkeletonTable } from "@/components/ui/Skeleton";
import {
  Boxes,
  PackageCheck,
  Truck,
  GitMerge,
  Wallet,
  ArrowRight,
  FilePlus2,
  Search,
  Route,
} from "lucide-react";

function ShipperOverview({ userId }: { userId: string }) {
  const shipments = getShipmentsByShipper(userId);
  const active = shipments.filter((s) => !["COMPLETED", "CANCELLED"].includes(s.status));
  const completed = shipments.filter((s) => s.status === "COMPLETED");

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Active shipments" value={active.length} icon={Boxes} tone="brand" />
        <MetricCard label="Pending" value={shipments.filter((s) => s.status === "SEARCHING_FOR_TRUCK").length} icon={PackageCheck} tone="sage" />
        <MetricCard label="Completed" value={completed.length} icon={PackageCheck} tone="sand" />
        <MetricCard label="Total freight" value={`${shipments.reduce((s, x) => s + x.weight, 0)} T`} icon={Truck} tone="neutral" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="h3">Recent activity</h2>
        <Link href="/dashboard/shipments/create" className="btn btn-primary btn-sm">
          <FilePlus2 size={15} />
          Create shipment
        </Link>
      </div>

      {shipments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-white p-10 text-center">
          <p className="text-[15px] font-semibold text-charcoal">No shipments yet</p>
          <p className="mt-1 text-[13.5px] text-muted">Create your first shipment to get started.</p>
          <Link href="/dashboard/shipments/create" className="btn btn-primary mt-5">
            Create shipment
          </Link>
        </div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Shipment</th>
                <th>Route</th>
                <th>Cargo</th>
                <th>Status</th>
                <th>Budget</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {shipments.slice(0, 6).map((s) => (
                <tr key={s.id}>
                  <td className="font-semibold">{s.ref}</td>
                  <td>{s.pickup} → {s.drop}</td>
                  <td className="text-muted">{s.cargoType} · {s.weight} T</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td className="font-medium">₹{s.budget.toLocaleString("en-IN")}</td>
                  <td>
                    <Link href={`/dashboard/tracking?ref=${s.ref}`} className="inline-flex items-center gap-1 text-[13px] font-semibold text-forest-700 hover:text-forest-800">
                      Track <ArrowRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DriverOverview({ userId }: { userId: string }) {
  const vehicles = getVehiclesByOwner(userId);
  const vehicle = vehicles[0];
  const trips = getTripsForDriver(userId);
  const activeTrip = getActiveTripForDriver(userId);
  const matches = vehicle ? getMatchesForVehicle(vehicle) : [];
  const earnings = getEarningsTotal(userId);

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Current trip" value={activeTrip ? "Active" : "None"} icon={Route} tone="brand" hint={activeTrip ? `${activeTrip.pickup} → ${activeTrip.drop}` : "No trip in progress"} />
        <MetricCard label="Return matches" value={matches.length} icon={GitMerge} tone="sage" hint="Based on your current location" />
        <MetricCard label="Trips completed" value={trips.filter((t) => t.status === "COMPLETED").length} icon={PackageCheck} tone="sand" />
        <MetricCard label="Total earnings" value={`₹${earnings.toLocaleString("en-IN")}`} icon={Wallet} tone="neutral" />
      </div>

      {activeTrip ? (
        <div className="card-elevated p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">Active trip</p>
              <p className="mt-1 text-[16px] font-bold text-charcoal">
                {activeTrip.ref} · {activeTrip.pickup} → {activeTrip.drop}
              </p>
            </div>
            <StatusBadge status={activeTrip.status} />
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-sage-100">
            <div className="h-full rounded-full bg-forest-600" style={{ width: `${activeTrip.progress}%` }} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/dashboard/trip" className="btn btn-primary btn-sm">
              Manage trip
            </Link>
            <Link href="/dashboard/matching" className="btn btn-ghost btn-sm">
              View return matches
            </Link>
          </div>
        </div>
      ) : (
        <div className="card-elevated flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="text-[15px] font-bold text-charcoal">Looking for your next load?</p>
            <p className="mt-1 text-[13.5px] text-muted">
              {matches.length > 0
                ? `${matches.length} return loads available near ${vehicle?.currentLocation ?? "your location"}.`
                : "Browse the load marketplace for available freight."}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/loads" className="btn btn-primary btn-sm">
              <Search size={15} />
              Find loads
            </Link>
            <Link href="/dashboard/matching" className="btn btn-ghost btn-sm">
              Matching
            </Link>
          </div>
        </div>
      )}

      {vehicle && (
        <div className="card-elevated p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">Your vehicle</p>
              <p className="mt-1 text-[15.5px] font-bold text-charcoal">
                {vehicle.number} · {vehicle.truckType}
              </p>
            </div>
            <StatusBadge status={vehicle.availability} />
          </div>
          <Link href="/dashboard/settings" className="mt-3 inline-flex items-center gap-1 text-[13.5px] font-semibold text-forest-700 hover:text-forest-800">
            Manage vehicle <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  useAppState();

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64" />
        <SkeletonCards />
        <SkeletonTable />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8">
        <h1 className="h2">Welcome back, {user.name.split(" ")[0]} 👋</h1>
        <p className="mt-1 text-muted">
          {user.role === "SHIPPER" ? "Here's what's moving with your shipments." : "Here's what's happening with your fleet."}
        </p>
      </div>

      <PermissionsBanner />

      {user.role === "SHIPPER" && <ShipperOverview userId={user.id} />}
      {(user.role === "DRIVER" || user.role === "FLEET_OPERATOR") && <DriverOverview userId={user.id} />}
    </div>
  );
}
