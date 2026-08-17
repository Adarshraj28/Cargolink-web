"use client";

import { useAuth } from "@/lib/auth";
import {
  getShipmentsByShipper,
  getTripsForDriver,
  useAppState,
} from "@/lib/store";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { History, PackageCheck } from "lucide-react";
import type { Trip } from "@/lib/types";

function TripHistory({ trips }: { trips: Trip[] }) {
  return (
    <div className="card-elevated overflow-hidden">
      <div className="overflow-x-auto">
        <table className="data-table min-w-[760px]">
          <thead>
            <tr>
              <th>Trip</th>
              <th>Route</th>
              <th>Status</th>
              <th>Earnings</th>
              <th>Started</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((t) => (
              <tr key={t.id}>
                <td className="font-semibold">{t.ref}</td>
                <td>{t.pickup} → {t.drop}</td>
                <td><StatusBadge status={t.status} /></td>
                <td className="font-medium">₹{t.earnings.toLocaleString("en-IN")}</td>
                <td className="text-muted">{new Date(t.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const { user } = useAuth();
  useAppState();

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64" />
        <SkeletonTable />
      </div>
    );
  }

  const isShipper = user.role === "SHIPPER";
  const shipments = isShipper ? getShipmentsByShipper(user.id) : [];
  const trips = !isShipper ? getTripsForDriver(user.id) : [];

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8">
        <h1 className="h2">History</h1>
        <p className="mt-1 text-muted">
          {isShipper ? "Your completed and past shipments." : "Your completed trips and past journeys."}
        </p>
      </div>

      {isShipper ? (
        shipments.length === 0 ? (
          <EmptyState
            icon={History}
            title="No shipment history yet"
            description="Completed shipments will appear here."
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
                    <th>Status</th>
                    <th>Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((s) => (
                    <tr key={s.id}>
                      <td className="font-semibold">{s.ref}</td>
                      <td>{s.pickup} → {s.drop}</td>
                      <td className="text-muted">{s.cargoType} · {s.weight} T</td>
                      <td><StatusBadge status={s.status} /></td>
                      <td className="font-medium">₹{s.budget.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : trips.length === 0 ? (
        <EmptyState
          icon={PackageCheck}
          title="No trips yet"
          description="Completed trips will appear here with their earnings."
        />
      ) : (
        <TripHistory trips={trips} />
      )}
    </div>
  );
}
