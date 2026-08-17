"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getMatchesForVehicle,
  getState,
  createTripFromLoad,
  subscribe,
  getVehiclesByOwner,
} from "@/lib/store";
import type { MatchResult, Vehicle } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import { Truck, MapPin, IndianRupee, CheckCircle2, AlertTriangle, ArrowRight, Route } from "lucide-react";

const WEIGHT_LABELS: Record<string, string> = {
  route: "Route compatibility · 30%",
  distance: "Distance · 20%",
  truck: "Truck compatibility · 20%",
  capacity: "Capacity · 15%",
  timing: "Timing · 10%",
  cargo: "Cargo compatibility · 5%",
};

/**
 * Shared matching explorer used on the marketing /matching page (demo mode)
 * and the driver dashboard (live session). When a session driver exists and
 * owns a vehicle, it uses that vehicle; otherwise it falls back to the demo
 * driver's truck so the marketing page always shows real computed scores.
 */
export default function MatchingExplorer() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [selected, setSelected] = useState<MatchResult | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [gateMsg, setGateMsg] = useState<string | null>(null);

  useEffect(() => {
    const compute = () => {
      const s = getState();
      const session = s.users.find((u) => u.id === s.sessionUserId);
      let v: Vehicle | undefined;
      if (session && (session.role === "DRIVER" || session.role === "FLEET_OPERATOR")) {
        v = getVehiclesByOwner(session.id)[0];
      }
      if (!v) {
        v = s.vehicles.find((x) => x.id === "v-1");
      }
      setVehicle(v ?? null);
      if (v) {
        const m = getMatchesForVehicle(v);
        setMatches(m);
        setSelected((prev) => {
          if (prev) {
            const stillThere = m.find((x) => x.load.id === prev.load.id);
            return stillThere ?? m[0] ?? null;
          }
          return m[0] ?? null;
        });
      }
    };
    compute();
    return subscribe(compute);
  }, []);

  const handleAccept = () => {
    if (!selected || !vehicle) return;
    setGateMsg(null);
    const session = getState().users.find(
      (u) => u.id === getState().sessionUserId
    );
    // Accepting a load requires a signed-in driver / fleet account.
    if (!session) {
      router.push("/sign-in?next=/matching");
      return;
    }
    if (session.role !== "DRIVER" && session.role !== "FLEET_OPERATOR") {
      setGateMsg("Only driver or fleet accounts can accept loads. Sign up as a driver to start.");
      return;
    }
    setAccepting(true);
    setTimeout(() => {
      createTripFromLoad(selected.load, vehicle, session.id);
      setAccepting(false);
      router.push("/dashboard/trip");
    }, 500);
  };

  return (
    <div className="grid grid-12 items-start gap-8">
      {/* Loads list */}
      <div className="col-span-12 lg:col-span-7">
        {vehicle && (
          <div className="mb-5 flex flex-wrap items-center gap-4 rounded-xl border border-line bg-offwhite px-5 py-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-700 text-sage-100">
              <Truck size={18} />
            </span>
            <div>
              <p className="text-[14px] font-bold text-charcoal">
                {vehicle.truckType} · {vehicle.number}
              </p>
              <p className="text-[12.5px] text-muted">
                Current location: {vehicle.currentLocation} · Capacity {vehicle.capacity} T
              </p>
            </div>
            <div className="ml-auto">
              <StatusBadge status={vehicle.availability} />
            </div>
          </div>
        )}

        {matches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line-strong bg-offwhite/60 px-6 py-14 text-center">
            <Route size={28} className="mx-auto text-muted" />
            <h3 className="mt-4 text-[16px] font-bold text-charcoal">No return loads found</h3>
            <p className="mx-auto mt-2 max-w-sm text-[14px] text-muted">
              Try expanding your search radius or adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((m) => (
              <button
                key={m.load.id}
                onClick={() => setSelected(m)}
                className={`w-full rounded-2xl border p-5 text-left transition-all ${
                  selected?.load.id === m.load.id
                    ? "border-forest-600 bg-sage-50 shadow-md"
                    : "border-line bg-white hover:border-sage-200"
                }`}
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-700 text-sage-100">
                        <Route size={16} />
                      </span>
                      <div>
                        <p className="text-[15px] font-bold text-charcoal">
                          {m.load.pickup} → {m.load.drop}
                        </p>
                        <p className="text-[12.5px] text-muted">
                          {m.load.distance} km · {m.load.cargoType} · {m.load.weight} T · {m.load.ref}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[24px] font-bold text-forest-700 font-display">{m.score}%</p>
                    <p className="text-[11px] text-muted">Match</p>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center justify-end gap-1 text-[15px] font-bold text-charcoal">
                      <IndianRupee size={14} className="text-muted" />
                      {formatINR(m.load.price)}
                    </p>
                    <p className="text-[11px] text-muted">Est. earnings</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sage-100">
                  <div className="h-full rounded-full bg-forest-600" style={{ width: `${m.score}%` }} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail panel */}
      <div className="col-span-12 lg:col-span-5">
        {selected ? (
          <div className="sticky top-24 rounded-2xl border border-line bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="h3">{selected.load.pickup} → {selected.load.drop}</h3>
              <span className="badge badge-brand">{selected.score}% match</span>
            </div>

            <dl className="mt-5 space-y-3 border-b border-line pb-5">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-[13px] text-muted">
                  <MapPin size={14} /> Distance
                </dt>
                <dd className="text-[14px] font-semibold text-charcoal">{selected.load.distance} km</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[13px] text-muted">Cargo</dt>
                <dd className="text-[14px] font-semibold text-charcoal">{selected.load.cargoType} · {selected.load.weight} T</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[13px] text-muted">Pickup</dt>
                <dd className="text-[14px] font-semibold text-charcoal">
                  {selected.load.pickupDate} · {selected.load.pickupTime}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[13px] text-muted">Est. earnings</dt>
                <dd className="text-[14px] font-bold text-forest-700">{formatINR(selected.load.price)}</dd>
              </div>
            </dl>

            {/* Why this score */}
            <div className="mt-5">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">
                Why this match
              </p>
              <div className="mt-3 space-y-2.5">
                {(Object.keys(selected.breakdown) as (keyof typeof selected.breakdown)[]).map((key) => (
                  <div key={key}>
                    <div className="flex items-center justify-between text-[12.5px]">
                      <span className="text-muted">{WEIGHT_LABELS[key]}</span>
                      <span className="font-bold text-charcoal">{selected.breakdown[key]}%</span>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-sage-100">
                      <div
                        className="h-full rounded-full bg-forest-600"
                        style={{ width: `${selected.breakdown[key]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <ul className="mt-5 space-y-2">
                {selected.reasons.map((reason) => (
                  <li key={reason} className="flex items-start gap-2 text-[13.5px] text-charcoal/85">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success" />
                    {reason}
                  </li>
                ))}
                {selected.warnings.map((warning) => (
                  <li key={warning} className="flex items-start gap-2 text-[13.5px] text-warning">
                    <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                    {warning}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={handleAccept} disabled={accepting} className="btn btn-primary flex-1">
                {accepting ? "Accepting…" : "Accept Load"}
                <ArrowRight size={15} />
              </button>
              <Link href="/signup" className="btn btn-ghost">
                View all loads
              </Link>
            </div>
            {gateMsg && (
              <p className="mt-3 rounded-lg bg-warning-bg px-3 py-2 text-center text-[12.5px] font-medium text-warning">
                {gateMsg}
              </p>
            )}
            <p className="mt-3 text-center text-[11.5px] text-muted">
              Accepting a load creates a trip and notifies the shipper.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line-strong bg-offwhite/60 p-8 text-center text-muted">
            Select a load to see why it matched.
          </div>
        )}
      </div>
    </div>
  );
}
