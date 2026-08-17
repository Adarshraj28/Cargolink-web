"use client";

import { useState, type FormEvent } from "react";
import {
  findShipment,
  findTrip,
  getState,
  getUser,
  getVehiclesByOwner,
} from "@/lib/store";
import type { Trip } from "@/lib/types";
import StatusBadge from "@/components/ui/StatusBadge";
import TripTimeline from "./TripTimeline";
import RouteVisual from "./RouteVisual";
import { Search, Truck, MapPin, Clock3, UserRound, PackageCheck } from "lucide-react";

export default function TrackingSearch({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState("");
  const [searchedRef, setSearchedRef] = useState<string | null>(null);

  const findByRef = (ref: string): Trip | undefined => {
    const foundTrip = findTrip(ref);
    if (foundTrip) return foundTrip;
    const shipment = findShipment(ref);
    if (shipment?.assignedTripId) return findTrip(shipment.assignedTripId);
    return undefined;
  };

  // Auto-search when an initial query is provided (e.g. ?ref=CL-…)
  if (initialQuery && initialQuery !== searchedRef) {
    setSearchedRef(initialQuery);
    const found = findByRef(initialQuery);
    if (found) {
      setError("");
      setTrip(found);
    }
  }

  const search = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const found = findByRef(q);
    if (!found) {
      setTrip(null);
      setError(
        `No shipment or trip found for "${q}". Try CL-28491, CL-28512 or TRP-20877.`
      );
      return;
    }
    setError("");
    setTrip(found);
  };

  return (
    <div>
      {/* Search */}
      <form
        onSubmit={search}
        className="mx-auto flex max-w-2xl items-center gap-3 rounded-2xl border border-line bg-white p-2.5 shadow-sm"
        role="search"
      >
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shipment or trip ID — e.g. CL-28491"
            className="w-full rounded-xl py-3 pl-11 pr-4 text-[15px] outline-none placeholder:text-muted"
            aria-label="Search shipment or trip ID"
          />
        </div>
        <button type="submit" className="btn btn-primary shrink-0">
          Track
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[12.5px] text-muted">
        Try:{" "}
        {["CL-28491", "CL-28512", "TRP-20877"].map((ref) => (
          <button
            key={ref}
            onClick={() => {
              setQuery(ref);
              const found = findTrip(ref) ?? (() => {
                const s = findShipment(ref);
                return s?.assignedTripId ? findTrip(s.assignedTripId) : undefined;
              })();
              if (found) {
                setError("");
                setTrip(found);
              }
            }}
            className="rounded-full border border-line bg-offwhite px-3 py-1 font-medium text-charcoal/80 transition-colors hover:border-sage-300"
          >
            {ref}
          </button>
        ))}
      </div>

      {error && (
        <div className="mx-auto mt-6 max-w-2xl rounded-xl bg-danger-bg px-5 py-4 text-[14px] font-medium text-danger">
          {error}
        </div>
      )}

      {trip && <TrackingCard trip={trip} />}
    </div>
  );
}

function TrackingCard({ trip }: { trip: Trip }) {
  const driver = getUser(trip.driverId);
  const vehicle = getVehiclesByOwner(trip.driverId)[0] ??
    getState().vehicles.find((v) => v.id === trip.vehicleId);

  return (
    <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-2xl border border-line bg-white shadow-lg animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-offwhite px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-700 text-sage-100">
            <Truck size={18} />
          </span>
          <div>
            <p className="text-[14.5px] font-bold text-charcoal">
              {trip.ref} · {trip.pickup} → {trip.drop}
            </p>
            <p className="text-[12px] text-muted">
              Shipment {trip.shipmentId ? findShipment(trip.shipmentId)?.ref ?? "—" : "—"}
            </p>
          </div>
        </div>
        <StatusBadge status={trip.status} />
      </div>

      <div className="grid gap-0 sm:grid-cols-2">
        <div className="border-b border-line p-4 sm:border-b-0 sm:border-r">
          <RouteVisual from={trip.pickup} to={trip.drop} progress={trip.progress} />
          <p className="mt-3 text-center text-[11.5px] text-muted">
            Live demo tracking — simulated location, not real GPS.
          </p>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between rounded-lg bg-offwhite px-4 py-3">
            <span className="text-[13px] font-medium text-muted">ETA</span>
            <span className="text-[15px] font-bold text-charcoal">{trip.eta}</span>
          </div>
          <dl className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <MapPin size={15} className="shrink-0 text-muted" />
              <dt className="w-20 text-[12.5px] text-muted">Route</dt>
              <dd className="text-[13.5px] font-semibold text-charcoal">
                {trip.pickup} → {trip.drop}
              </dd>
            </div>
            <div className="flex items-center gap-3">
              <UserRound size={15} className="shrink-0 text-muted" />
              <dt className="w-20 text-[12.5px] text-muted">Driver</dt>
              <dd className="text-[13.5px] font-semibold text-charcoal">
                {driver?.name ?? "—"} {vehicle ? `· ${vehicle.number}` : ""}
              </dd>
            </div>
            <div className="flex items-center gap-3">
              <Clock3 size={15} className="shrink-0 text-muted" />
              <dt className="w-20 text-[12.5px] text-muted">Location</dt>
              <dd className="text-[13.5px] font-semibold text-charcoal">{trip.currentLocation}</dd>
            </div>
            <div className="flex items-center gap-3">
              <PackageCheck size={15} className="shrink-0 text-muted" />
              <dt className="w-20 text-[12.5px] text-muted">Progress</dt>
              <dd className="text-[13.5px] font-semibold text-charcoal">{trip.progress}%</dd>
            </div>
          </dl>
          <div className="mt-4">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-muted">Delivery progress</span>
              <span className="font-bold text-charcoal">{trip.progress}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sage-100">
              <div className="h-full rounded-full bg-forest-600" style={{ width: `${trip.progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-line p-5">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-muted">Trip timeline</p>
        <TripTimeline status={trip.status} />
      </div>
    </div>
  );
}
