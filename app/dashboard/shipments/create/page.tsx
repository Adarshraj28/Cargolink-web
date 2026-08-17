"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { createShipment, getState } from "@/lib/store";
import { INDIAN_CITIES, TRUCK_TYPES, CARGO_TYPES } from "@/lib/seed";
import { landmarkFor } from "@/lib/landmarks";
import { CheckCircle2, ArrowRight, ArrowLeft, MapPin, UserRound, Check } from "lucide-react";

interface FormState {
  pickup: string;
  drop: string;
  cargoType: string;
  weight: string;
  truckType: string;
  pickupDate: string;
  pickupTime: string;
  budget: string;
  instructions: string;
  dimensions: string;
  contactName: string;
  contactPhone: string;
}

const initial: FormState = {
  pickup: "Delhi",
  drop: "Mumbai",
  cargoType: "General Goods",
  weight: "",
  truckType: "32 Ton Trailer",
  pickupDate: "",
  pickupTime: "09:00",
  budget: "",
  instructions: "",
  dimensions: "",
  contactName: "",
  contactPhone: "",
};

function LandmarkNote({ city }: { city: string }) {
  const lm = landmarkFor(city);
  if (!lm) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[12px] font-medium text-forest-700">
      <span className="relative h-5 w-7 shrink-0 overflow-hidden rounded-sm">
        <Image src={lm.image} alt={lm.name} fill sizes="28px" className="object-cover" />
      </span>
      Known for {lm.name}
    </p>
  );
}

export default function CreateShipmentPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  // Prefill from the homepage service panel (?pickup=&drop=&truckType=&weight=&pickupDate=).
  const [form, setForm] = useState<FormState>(() => ({
    ...initial,
    pickup: searchParams.get("pickup") || initial.pickup,
    drop: searchParams.get("drop") || initial.drop,
    truckType: searchParams.get("truckType") || initial.truckType,
    weight: searchParams.get("weight") || initial.weight,
    pickupDate: searchParams.get("pickupDate") || initial.pickupDate,
  }));
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [created, setCreated] = useState<{ ref: string; id: string; vehicleNumber?: string } | null>(null);
  const [preferredVehicleId, setPreferredVehicleId] = useState<string | null>(null);

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const today = new Date().toISOString().slice(0, 10);

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.pickup.trim()) e.pickup = "Pickup location is required.";
    if (!form.drop.trim()) e.drop = "Drop location is required.";
    if (form.pickup === form.drop) e.drop = "Pickup and drop must be different.";
    const weight = parseFloat(form.weight);
    if (!weight || weight <= 0) e.weight = "Enter a valid weight in tonnes.";
    else if (weight > 60) e.weight = "Weight looks too high — max 60 tonnes.";
    if (!form.pickupDate) e.pickupDate = "Pickup date is required.";
    else if (form.pickupDate < today) e.pickupDate = "Pickup date cannot be in the past.";
    const budget = parseFloat(form.budget);
    if (!budget || budget <= 0) e.budget = "Enter a valid budget.";
    if (form.contactPhone && !/^[+\d][\d\s-]{9,14}$/.test(form.contactPhone)) {
      e.contactPhone = "Enter a valid phone number.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!user) return;
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const shipment = createShipment(user.id, {
      pickup: form.pickup.trim(),
      drop: form.drop.trim(),
      cargoType: form.cargoType,
      weight: parseFloat(form.weight),
      truckType: form.truckType,
      pickupDate: form.pickupDate,
      pickupTime: form.pickupTime,
      budget: parseFloat(form.budget),
      instructions: form.instructions.trim() || undefined,
      dimensions: form.dimensions.trim() || undefined,
      contactName: form.contactName.trim() || undefined,
      contactPhone: form.contactPhone.trim() || undefined,
      preferredVehicleId: preferredVehicleId ?? undefined,
    });
    const vehicle = preferredVehicleId
      ? getState().vehicles.find((v) => v.id === preferredVehicleId)
      : undefined;
    setCreated({ ref: shipment.ref, id: shipment.id, vehicleNumber: vehicle?.number });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (created) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-success/25 bg-success-bg p-10 text-center animate-scale-in">
          <CheckCircle2 size={48} className="mx-auto text-success" />
          <h1 className="mt-4 text-[22px] font-bold text-charcoal">Shipment created successfully</h1>
          <p className="mt-2 text-[15px] text-charcoal/75">
            Your shipment ID is{" "}
            <span className="rounded-lg bg-white px-2.5 py-1 font-mono text-[15px] font-bold text-forest-700">
              {created.ref}
            </span>
          </p>
          <p className="mx-auto mt-3 max-w-md text-[14px] text-charcoal/70">
            {created.vehicleNumber ? (
              <>
                Status: <span className="font-semibold">Truck notified</span> —{" "}
                <span className="font-mono font-semibold">{created.vehicleNumber}</span>{" "}
                has been notified and will confirm pickup from the load
                marketplace.
              </>
            ) : (
              <>
                Status: <span className="font-semibold">Searching for truck</span> — your
                shipment is now live in the load marketplace where drivers can
                find and accept it.
              </>
            )}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href={`/dashboard/tracking?ref=${created.ref}`} className="btn btn-primary">
              Track shipment
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => {
                setCreated(null);
                setForm(initial);
              }}
              className="btn btn-ghost"
            >
              Create another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard/shipments" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-muted hover:text-charcoal">
        <ArrowLeft size={14} />
        Back to shipments
      </Link>
      <div className="mt-3 mb-8">
        <h1 className="h2">Create shipment</h1>
        <p className="mt-1 text-muted">Add the details below — your shipment will start searching for a truck immediately.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-white p-8 shadow-md">
        <h2 className="text-[15px] font-bold text-charcoal">Route</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="pickup" className="form-label">Pickup location <span className="req">*</span></label>
            <select id="pickup" className="form-select" value={form.pickup} onChange={(e) => set("pickup", e.target.value)}>
              {INDIAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <LandmarkNote city={form.pickup} />
            {errors.pickup && <p className="form-error">{errors.pickup}</p>}
          </div>
          <div>
            <label htmlFor="drop" className="form-label">Drop location <span className="req">*</span></label>
            <select id="drop" className="form-select" value={form.drop} onChange={(e) => set("drop", e.target.value)}>
              {INDIAN_CITIES.filter((c) => c !== form.pickup).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <LandmarkNote city={form.drop} />
            {errors.drop && <p className="form-error">{errors.drop}</p>}
          </div>
        </div>

        <h2 className="mt-8 text-[15px] font-bold text-charcoal">Cargo</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="cargoType" className="form-label">Cargo type <span className="req">*</span></label>
            <select id="cargoType" className="form-select" value={form.cargoType} onChange={(e) => set("cargoType", e.target.value)}>
              {CARGO_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="weight" className="form-label">Weight (tonnes) <span className="req">*</span></label>
            <input id="weight" type="number" min="0.5" max="60" step="0.5" className={`form-input ${errors.weight ? "error" : ""}`}
              placeholder="e.g. 12" value={form.weight} onChange={(e) => set("weight", e.target.value)} />
            {errors.weight && <p className="form-error">{errors.weight}</p>}
          </div>
          <div>
            <label htmlFor="dimensions" className="form-label">Dimensions (optional)</label>
            <input id="dimensions" className="form-input" placeholder="e.g. 12ft × 8ft × 8ft"
              value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} />
          </div>
        </div>

        <h2 className="mt-8 text-[15px] font-bold text-charcoal">Truck & timing</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="truckType" className="form-label">Truck type <span className="req">*</span></label>
            <select id="truckType" className="form-select" value={form.truckType} onChange={(e) => set("truckType", e.target.value)}>
              {TRUCK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="pickupDate" className="form-label">Pickup date <span className="req">*</span></label>
            <input id="pickupDate" type="date" min={today} className={`form-input ${errors.pickupDate ? "error" : ""}`}
              value={form.pickupDate} onChange={(e) => set("pickupDate", e.target.value)} />
            {errors.pickupDate && <p className="form-error">{errors.pickupDate}</p>}
          </div>
          <div>
            <label htmlFor="pickupTime" className="form-label">Pickup time <span className="req">*</span></label>
            <input id="pickupTime" type="time" className="form-input" value={form.pickupTime}
              onChange={(e) => set("pickupTime", e.target.value)} />
          </div>
        </div>

        <h2 className="mt-8 text-[15px] font-bold text-charcoal">Choose a truck</h2>
        <p className="mt-1 text-[13.5px] text-muted">
          Available trucks on the network that fit your route. Selecting one
          notifies the driver — they confirm from the load marketplace.
        </p>
        {(() => {
          const weightNum = parseFloat(form.weight);
          const available = getState().vehicles.filter(
            (v) =>
              v.status === "active" &&
              v.availability === "available" &&
              (!Number.isFinite(weightNum) || v.capacity >= weightNum)
          );
          const exact = available.filter((v) => v.truckType === form.truckType);
          const others = available.filter((v) => v.truckType !== form.truckType);
          const ranked = [...exact, ...others];
          if (ranked.length === 0) {
            return (
              <div className="mt-4 rounded-xl border border-dashed border-line-strong bg-offwhite p-6 text-center">
                <p className="text-[14px] font-semibold text-charcoal">No available trucks match yet</p>
                <p className="mt-1 text-[13px] text-muted">
                  Your shipment will still go live on the marketplace — drivers
                  can accept it even without a preselected truck.
                </p>
              </div>
            );
          }
          return (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {ranked.map((v) => {
                const selected = preferredVehicleId === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setPreferredVehicleId(selected ? null : v.id)}
                    aria-pressed={selected}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      selected
                        ? "border-forest-600 bg-sage-50 shadow-md ring-2 ring-forest-600/15"
                        : "border-line bg-white hover:border-sage-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[14px] font-bold text-charcoal">{v.number}</span>
                      {selected ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-forest-700 px-2.5 py-0.5 text-[11px] font-bold text-white">
                          <Check size={11} /> Selected
                        </span>
                      ) : (
                        <span className="rounded-full bg-sage-100 px-2.5 py-0.5 text-[11px] font-semibold text-forest-800">
                          {v.truckType === form.truckType ? "Recommended" : "Available"}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-[13px] font-medium text-charcoal">
                      {v.truckType} · {v.capacity} T · {v.bodyType}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted">
                      <MapPin size={12} /> {v.currentLocation}
                      <span className="mx-1">·</span>
                      <UserRound size={12} /> {v.driverName}
                    </p>
                  </button>
                );
              })}
            </div>
          );
        })()}

        <h2 className="mt-8 text-[15px] font-bold text-charcoal">Budget & instructions</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="budget" className="form-label">Budget / price (₹) <span className="req">*</span></label>
            <input id="budget" type="number" min="1000" step="500" className={`form-input ${errors.budget ? "error" : ""}`}
              placeholder="e.g. 82000" value={form.budget} onChange={(e) => set("budget", e.target.value)} />
            {errors.budget && <p className="form-error">{errors.budget}</p>}
          </div>
          <div>
            <label htmlFor="instructions" className="form-label">Special instructions</label>
            <input id="instructions" className="form-input" placeholder="e.g. Handle with care"
              value={form.instructions} onChange={(e) => set("instructions", e.target.value)} />
          </div>
        </div>

        <h2 className="mt-8 text-[15px] font-bold text-charcoal">Contact (optional)</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contactName" className="form-label">Contact name</label>
            <input id="contactName" className="form-input" placeholder="Loading contact" value={form.contactName}
              onChange={(e) => set("contactName", e.target.value)} />
          </div>
          <div>
            <label htmlFor="contactPhone" className="form-label">Contact phone</label>
            <input id="contactPhone" type="tel" className={`form-input ${errors.contactPhone ? "error" : ""}`}
              placeholder="+91 98xxx xxxxx" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} />
            {errors.contactPhone && <p className="form-error">{errors.contactPhone}</p>}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
          <p className="text-[12.5px] text-muted">
            By creating this shipment it will appear in the load marketplace.
          </p>
          <button type="submit" className="btn btn-primary">
            Create shipment
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
