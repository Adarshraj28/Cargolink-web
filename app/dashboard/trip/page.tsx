"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import {
  getActiveTripForDriver,
  getTripsForDriver,
  updateTripStatus,
  verifyPickupCode,
  verifyDeliveryCode,
  subscribe,
} from "@/lib/store";
import StatusBadge from "@/components/ui/StatusBadge";
import TripTimeline from "@/components/dashboard/shared/TripTimeline";
import RouteVisual from "@/components/dashboard/shared/RouteVisual";
import {
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  MapPin,
  IndianRupee,
  ArrowRight,
  PackageSearch,
} from "lucide-react";
import type { Trip, TripStatus } from "@/lib/types";

const STATUS_ACTIONS: { status: TripStatus; label: string }[] = [
  { status: "ARRIVING_AT_PICKUP", label: "Start heading to pickup" },
  { status: "AT_PICKUP", label: "Arrived at pickup" },
  { status: "LOADING", label: "Begin loading" },
  { status: "IN_TRANSIT", label: "Start trip" },
  { status: "NEAR_DESTINATION", label: "Near destination" },
  { status: "DELIVERED", label: "Mark delivered" },
];

export default function TripPage() {
  const { user } = useAuth();
  const [trip, setTrip] = useState<Trip | null | undefined>(undefined);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!user) return;
    const refresh = () => setTrip(getActiveTripForDriver(user.id) ?? null);
    refresh();
    return subscribe(refresh);
  }, [user]);

  const handleVerify = (ev: FormEvent, type: "pickup" | "delivery") => {
    ev.preventDefault();
    setCodeError("");
    if (!trip) return;
    const ok =
      type === "pickup"
        ? verifyPickupCode(trip.id, code)
        : verifyDeliveryCode(trip.id, code);
    if (!ok) {
      setCodeError("Incorrect verification code. Please check and try again.");
      return;
    }
    setCode("");
    setVerified(true);
    setTimeout(() => setVerified(false), 3000);
  };

  if (trip === undefined) {
    return (
      <div className="mx-auto max-w-[1200px] space-y-6">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  if (!trip) {
    const trips = getTripsForDriver(user?.id ?? "");
    return (
      <div className="mx-auto max-w-[1200px]">
        <h1 className="h2">Active trip</h1>
        <div className="mt-8 rounded-2xl border border-dashed border-line-strong bg-white p-12 text-center">
          <PackageSearch size={32} className="mx-auto text-muted" />
          <h2 className="mt-4 text-[17px] font-bold text-charcoal">No active trip</h2>
          <p className="mx-auto mt-2 max-w-sm text-[14px] text-muted">
            {trips.length > 0
              ? "You have no trips in progress. Find a load or check return-load matches to start your next journey."
              : "Accept a load from the marketplace to start your first trip."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard/loads" className="btn btn-primary">
              Find loads
            </Link>
            <Link href="/dashboard/matching" className="btn btn-ghost">
              Return matches
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const nextAction = STATUS_ACTIONS.find((a) => a.status === trip.status);
  const isDelivered = trip.status === "DELIVERED";

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="h2">Active trip</h1>
          <p className="mt-1 text-muted">
            {trip.ref} · {trip.pickup} → {trip.drop}
          </p>
        </div>
        <StatusBadge status={trip.status} />
      </div>

      {verified && (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-success-bg px-4 py-3 text-[14px] font-medium text-success animate-scale-in">
          <CheckCircle2 size={17} />
          Verification successful — trip updated.
        </div>
      )}

      <div className="grid grid-12 gap-8">
        {/* Main column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="card-elevated overflow-hidden">
            <div className="border-b border-line p-5">
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-muted">Trip timeline</p>
              <TripTimeline status={trip.status} />
            </div>
            <div className="p-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-offwhite p-4">
                  <p className="text-[11.5px] text-muted">Current location</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[14.5px] font-bold text-charcoal">
                    <MapPin size={14} className="text-forest-600" />
                    {trip.currentLocation}
                  </p>
                </div>
                <div className="rounded-xl bg-offwhite p-4">
                  <p className="text-[11.5px] text-muted">ETA</p>
                  <p className="mt-1 text-[14.5px] font-bold text-charcoal">{trip.eta}</p>
                </div>
                <div className="rounded-xl bg-offwhite p-4">
                  <p className="text-[11.5px] text-muted">Trip earnings</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[14.5px] font-bold text-forest-700">
                    <IndianRupee size={14} />
                    {trip.earnings.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="text-muted">Trip progress</span>
                  <span className="font-bold text-charcoal">{trip.progress}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sage-100">
                  <div className="h-full rounded-full bg-forest-600" style={{ width: `${trip.progress}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Status controls */}
          <div className="card-elevated p-6">
            <h2 className="text-[15px] font-bold text-charcoal">Update trip status</h2>
            <p className="mt-1 text-[13px] text-muted">
              Move the trip forward as you complete each stage.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {nextAction ? (
                <button
                  onClick={() => updateTripStatus(trip.id, nextAction.status)}
                  className="btn btn-primary"
                >
                  {nextAction.label}
                  <ArrowRight size={15} />
                </button>
              ) : isDelivered ? (
                <span className="rounded-lg bg-success-bg px-4 py-2.5 text-[14px] font-semibold text-success">
                  Delivered — complete delivery below with the delivery code.
                </span>
              ) : (
                <span className="rounded-lg bg-neutral-bg px-4 py-2.5 text-[14px] font-semibold text-neutral">
                  Trip completed. Find a return load to continue earning.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Verification column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="card-elevated p-6">
            <div className="flex items-center gap-2">
              <KeyRound size={18} className="text-forest-700" />
              <h2 className="text-[15px] font-bold text-charcoal">Pickup verification</h2>
            </div>
            <p className="mt-2 text-[13px] text-muted">
              Enter the pickup code shared by the shipper to verify pickup and
              start the trip.
            </p>
            <form onSubmit={(e) => handleVerify(e, "pickup")} className="mt-4 space-y-3">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="4-digit pickup code"
                inputMode="numeric"
                maxLength={4}
                className="form-input text-center font-mono text-[18px] tracking-[0.4em]"
                aria-label="Pickup verification code"
              />
              {codeError && <p className="form-error">{codeError}</p>}
              <button type="submit" disabled={trip.status !== "AT_PICKUP" && trip.status !== "LOADING"} className="btn btn-primary w-full" title="Available after arriving at pickup">
                Verify pickup & start trip
              </button>
            </form>
            <p className="mt-3 text-[11.5px] text-muted">
              Codes are private — shared only with the shipper and driver.
            </p>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-forest-700" />
              <h2 className="text-[15px] font-bold text-charcoal">Delivery verification</h2>
            </div>
            <p className="mt-2 text-[13px] text-muted">
              Enter the delivery code to confirm drop-off and complete the trip.
            </p>
            <form onSubmit={(e) => handleVerify(e, "delivery")} className="mt-4 space-y-3">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="4-digit delivery code"
                inputMode="numeric"
                maxLength={4}
                className="form-input text-center font-mono text-[18px] tracking-[0.4em]"
                aria-label="Delivery verification code"
              />
              <button
                type="submit"
                disabled={trip.status !== "DELIVERED"}
                className="btn btn-primary w-full"
                title="Available after marking delivered"
              >
                Verify delivery & complete
              </button>
            </form>
          </div>

          <div className="card-elevated overflow-hidden">
            <div className="h-44">
              <RouteVisual from={trip.pickup} to={trip.drop} progress={trip.progress} />
            </div>
            <div className="flex items-center justify-between p-4">
              <p className="text-[12px] text-muted">Live demo tracking</p>
              <Link href={`/dashboard/tracking?ref=${trip.ref}`} className="inline-flex items-center gap-1 text-[13px] font-semibold text-forest-700 hover:text-forest-800">
                View <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
