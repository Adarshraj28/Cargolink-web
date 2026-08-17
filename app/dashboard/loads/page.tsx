"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  getOpenLoads,
  getVehiclesByOwner,
  createTripFromLoad,
  rejectLoad,
  useAppState,
} from "@/lib/store";
import { TRUCK_TYPES, CARGO_TYPES } from "@/lib/seed";
import { computeMatch } from "@/lib/matching";
import EmptyState from "@/components/ui/EmptyState";
import { PackageSearch, MapPin, IndianRupee, Search, Check, X, Route } from "lucide-react";
import type { Load } from "@/lib/types";

export default function LoadsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [truckFilter, setTruckFilter] = useState("all");
  const [cargoFilter, setCargoFilter] = useState("all");
  const [accepting, setAccepting] = useState<string | null>(null);
  useAppState();

  const vehicle = user ? getVehiclesByOwner(user.id)[0] : undefined;

  const loads = useMemo(() => {
    let list = getOpenLoads();
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (l) =>
          l.pickup.toLowerCase().includes(q) ||
          l.drop.toLowerCase().includes(q) ||
          l.ref.toLowerCase().includes(q)
      );
    }
    if (truckFilter !== "all") list = list.filter((l) => l.truckType === truckFilter);
    if (cargoFilter !== "all") list = list.filter((l) => l.cargoType === cargoFilter);
    return list;
  }, [query, truckFilter, cargoFilter]);

  const handleAccept = (load: Load) => {
    if (!user || !vehicle) return;
    setAccepting(load.id);
    setTimeout(() => {
      createTripFromLoad(load, vehicle, user.id);
      setAccepting(null);
      router.push("/dashboard/trip");
    }, 500);
  };

  if (!user || !vehicle) {
    return (
      <div className="mx-auto max-w-[1200px]">
        <h1 className="h2">Loads</h1>
        <div className="mt-6">
          <EmptyState
            icon={PackageSearch}
            title="Register a vehicle first"
            description="Add your truck details in Settings to start browsing available loads."
            action={
              <button onClick={() => router.push("/dashboard/settings")} className="btn btn-primary">
                Manage vehicle
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8">
        <h1 className="h2">Load marketplace</h1>
        <p className="mt-1 text-muted">
          Available freight for {vehicle.truckType} · currently in {vehicle.currentLocation}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by location or load ID"
            className="form-input pl-10"
            aria-label="Search loads"
          />
        </div>
        <select className="form-select w-auto" value={truckFilter} onChange={(e) => setTruckFilter(e.target.value)}>
          <option value="all">All truck types</option>
          {TRUCK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="form-select w-auto" value={cargoFilter} onChange={(e) => setCargoFilter(e.target.value)}>
          <option value="all">All cargo</option>
          {CARGO_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loads.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No loads found"
          description="Try expanding your search radius or adjusting your filters."
        />
      ) : (
        <div className="space-y-4">
          {loads.map((load) => {
            const match = vehicle ? computeMatch(load, vehicle) : null;
            return (
              <div key={load.id} className="card card-hover p-5">
                <div className="flex flex-wrap items-start gap-5">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-700 text-sage-100">
                        <Route size={18} />
                      </span>
                      <div>
                        <p className="text-[15.5px] font-bold text-charcoal">
                          {load.pickup} → {load.drop}
                        </p>
                        <p className="text-[12.5px] text-muted">
                          {load.ref} · {load.distance} km · {load.pickupDate} · {load.pickupTime}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-muted">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} /> {load.distance} km
                      </span>
                      <span>{load.cargoType} · {load.weight} T</span>
                      <span>Truck: {load.truckType}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="flex items-center justify-end gap-1 text-[17px] font-bold text-charcoal">
                      <IndianRupee size={15} className="text-muted" />
                      {load.price.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[11.5px] text-muted">Est. earnings</p>
                    {match && (
                      <div className="mt-2">
                        <span className={`badge ${match.score >= 75 ? "badge-success" : match.score >= 50 ? "badge-warning" : "badge-neutral"}`}>
                          {match.score}% match
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex w-full gap-3 sm:w-auto">
                    <button
                      onClick={() => handleAccept(load)}
                      disabled={accepting === load.id || !match}
                      className="btn btn-primary btn-sm flex-1 sm:flex-none"
                    >
                      <Check size={15} />
                      {accepting === load.id ? "Accepting…" : "Accept Load"}
                    </button>
                    <button
                      onClick={() => rejectLoad(load.id)}
                      className="btn btn-ghost btn-sm"
                      aria-label={`Reject load ${load.ref}`}
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
