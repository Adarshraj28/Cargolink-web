"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { INDIAN_CITIES, TRUCK_TYPES } from "@/lib/seed";
import { landmarkFor } from "@/lib/landmarks";
import {
  requestLocation,
  nearestCity,
  getSavedLocation,
  saveLocation,
  type GeoPoint,
} from "@/lib/geo";
import {
  Truck,
  GitMerge,
  Radar,
  ArrowRight,
  MapPin,
  Loader2,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "book" | "load" | "track" | "fleet";

function LandmarkHint({ city }: { city: string }) {
  const lm = landmarkFor(city);
  if (!lm) return null;
  return (
    <span className="mt-1.5 inline-flex items-center gap-1.5 text-[12px] font-medium text-forest-700">
      <span className="relative h-5 w-7 shrink-0 overflow-hidden rounded-sm">
        <Image src={lm.image} alt={lm.name} fill sizes="28px" className="object-cover" />
      </span>
      Known for {lm.name}
    </span>
  );
}

function LocateButton({
  target,
  locating,
  onLocate,
}: {
  target: "bookFrom" | "loadFrom";
  locating: "bookFrom" | "loadFrom" | null;
  onLocate: (target: "bookFrom" | "loadFrom") => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onLocate(target)}
      disabled={locating !== null}
      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[12.5px] font-semibold text-forest-700 transition-colors hover:border-sage-300 hover:bg-sage-50 disabled:opacity-60"
      title="Use my exact location"
    >
      {locating === target ? <Loader2 size={13} className="animate-spin" /> : <MapPin size={13} />}
      Use my location
    </button>
  );
}

export default function ServicePanel() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState<Tab>("book");
  const [book, setBook] = useState({
    from: "Delhi",
    to: "Mumbai",
    truckType: "32 Ton Trailer",
    weight: "12",
    pickupDate: "",
    pickupTime: "09:00",
  });
  const [load, setLoad] = useState({
    from: "Mumbai",
    towards: "Pune",
    truckType: "32 Ton Trailer",
    capacity: "18",
  });
  const [fleet, setFleet] = useState({
    name: "",
    phone: "",
    city: "Delhi",
    vehicles: "1–5",
  });
  const [trackId, setTrackId] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [locating, setLocating] = useState<"bookFrom" | "loadFrom" | null>(null);
  const [exactLoc, setExactLoc] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  // Auto-detect the pickup location on load (user can override in the select).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let point: GeoPoint | null = getSavedLocation();
      if (!point) point = await requestLocation();
      if (cancelled || !point) return;
      saveLocation(point);
      const city = nearestCity(point.lat, point.lng);
      setBook((b) => ({ ...b, from: city }));
      setLoad((l) => ({ ...l, from: city }));
      const lm = landmarkFor(city);
      setExactLoc(
        `Pickup set to ${city}${lm ? ` · known for ${lm.name}` : ""} · ${point.lat.toFixed(3)}, ${point.lng.toFixed(3)}`
      );
    })();
    return () => {
      cancelled = true;
    };
  }, []);


  const requireAuth = (next: string) => {
    if (!isAuthenticated) {
      setNotice("Login or create a CARGOLINK account to continue.");
      setTimeout(() => router.push(`/sign-in?next=${encodeURIComponent(next)}`), 900);
      return false;
    }
    return true;
  };

  const locate = async (target: "bookFrom" | "loadFrom") => {
    setLocating(target);
    let point: GeoPoint | null = getSavedLocation();
    if (!point) point = await requestLocation();
    saveLocation(point);
    if (point) {
      const city = nearestCity(point.lat, point.lng);
      if (target === "bookFrom") setBook((b) => ({ ...b, from: city }));
      else setLoad((l) => ({ ...l, from: city }));
      const lm = landmarkFor(city);
      setExactLoc(
        `Detected near ${city}${lm ? ` · known for ${lm.name}` : ""} · ${point.lat.toFixed(3)}, ${point.lng.toFixed(3)}`
      );
      setNotice(null);
    } else {
      setExactLoc(null);
      setNotice("Location access is needed to detect your exact pickup point. You can pick a city manually.");
    }
    setLocating(null);
  };

  const bookParams = () =>
    new URLSearchParams({
      pickup: book.from,
      drop: book.to,
      truckType: book.truckType,
      weight: book.weight,
      pickupDate: book.pickupDate || today,
      pickupTime: book.pickupTime,
    }).toString();

  const handleBook = (e: FormEvent) => {
    e.preventDefault();
    setNotice(null);
    const params = bookParams();
    if (!requireAuth(`/dashboard/shipments/create?${params}`)) return;
    router.push(`/dashboard/shipments/create?${params}`);
  };

  const handleLoad = (e: FormEvent) => {
    e.preventDefault();
    setNotice(null);
    if (!requireAuth("/dashboard/loads")) return;
    router.push("/dashboard/loads");
  };

  const handleFleet = (e: FormEvent) => {
    e.preventDefault();
    setNotice(null);
    if (!fleet.name.trim() || !fleet.phone.trim()) {
      setNotice("Enter your name and phone so the fleet team can reach you.");
      return;
    }
    if (!requireAuth("/signup")) return;
    router.push("/signup");
  };

  const handleTrack = (e: FormEvent) => {
    e.preventDefault();
    setNotice(null);
    const id = trackId.trim();
    if (!id) return;
    router.push(`/tracking?ref=${encodeURIComponent(id.toUpperCase())}`);
  };

  const tabs: { key: Tab; label: string; icon: typeof Truck }[] = [
    { key: "book", label: "Book a Truck", icon: Truck },
    { key: "load", label: "Find a Return Load", icon: GitMerge },
    { key: "track", label: "Track Shipment", icon: Radar },
    { key: "fleet", label: "Join the Fleet", icon: PhoneCall },
  ];

  return (
    <section className="relative z-10 bg-offwhite">
      <div className="container-site">
        <div className="-mt-10 rounded-2xl border border-line bg-white p-6 shadow-xl sm:p-10">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Heading + trust */}
            <div className="lg:col-span-3">
              <h2 className="h2">What do you need today?</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Start using CARGOLINK immediately — book a truck, find a
                return load, track a shipment or join the fleet.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  { icon: ShieldCheck, text: "Verified pickup & delivery" },
                  { icon: MapPin, text: "Exact-location detection" },
                  { icon: GitMerge, text: "Return-load matching" },
                ].map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.text} className="flex items-center gap-2.5 text-[13px] font-medium text-charcoal/80">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage-50">
                        <Icon size={15} className="text-forest-700" />
                      </span>
                      {f.text}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tabs + forms */}
            <div className="lg:col-span-9">
              <div className="flex flex-wrap gap-2">
                {tabs.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.key}
                      onClick={() => {
                        setTab(t.key);
                        setNotice(null);
                      }}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13.5px] font-semibold transition-colors",
                        tab === t.key
                          ? "bg-forest-700 text-white"
                          : "bg-offwhite text-charcoal/75 hover:bg-sage-100"
                      )}
                      aria-pressed={tab === t.key}
                    >
                      <Icon size={15} />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Book a Truck */}
              {tab === "book" && (
                <form onSubmit={handleBook} className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="form-label">Pickup location</label>
                    <div className="flex gap-2">
                      <select className="form-select flex-1" value={book.from} onChange={(e) => setBook({ ...book, from: e.target.value })}>
                        {INDIAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <LandmarkHint city={book.from} />
                  </div>
                  <div>
                    <label className="form-label">Drop location</label>
                    <select className="form-select" value={book.to} onChange={(e) => setBook({ ...book, to: e.target.value })}>
                      {INDIAN_CITIES.filter((c) => c !== book.from).map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <LandmarkHint city={book.to} />
                  </div>
                  <div>
                    <label className="form-label">Truck type</label>
                    <select className="form-select" value={book.truckType} onChange={(e) => setBook({ ...book, truckType: e.target.value })}>
                      {TRUCK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Weight (T)</label>
                    <input type="number" min="0.5" max="60" step="0.5" className="form-input" value={book.weight} onChange={(e) => setBook({ ...book, weight: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Pickup date</label>
                    <input type="date" min={today} className="form-input" value={book.pickupDate} onChange={(e) => setBook({ ...book, pickupDate: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Pickup time</label>
                    <input type="time" className="form-input" value={book.pickupTime} onChange={(e) => setBook({ ...book, pickupTime: e.target.value })} />
                  </div>
                  <div className="flex items-end">
                    <LocateButton
                      target="bookFrom"
                      locating={locating}
                      onLocate={locate}
                    />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="btn btn-primary w-full">
                      Find Trucks
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </form>
              )}

              {/* Find a Return Load */}
              {tab === "load" && (
                <form onSubmit={handleLoad} className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <div className="lg:col-span-2">
                    <label className="form-label">Current location</label>
                    <div className="flex gap-2">
                      <select className="form-select flex-1" value={load.from} onChange={(e) => setLoad({ ...load, from: e.target.value })}>
                        {INDIAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <LandmarkHint city={load.from} />
                    <div className="mt-2">
                      <LocateButton
                        target="loadFrom"
                        locating={locating}
                        onLocate={locate}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Going towards</label>
                    <select className="form-select" value={load.towards} onChange={(e) => setLoad({ ...load, towards: e.target.value })}>
                      {INDIAN_CITIES.filter((c) => c !== load.from).map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Truck type</label>
                    <select className="form-select" value={load.truckType} onChange={(e) => setLoad({ ...load, truckType: e.target.value })}>
                      {TRUCK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Available capacity (T)</label>
                    <input type="number" min="1" max="60" className="form-input" value={load.capacity} onChange={(e) => setLoad({ ...load, capacity: e.target.value })} />
                  </div>
                  <div className="flex items-end lg:col-span-5">
                    <button type="submit" className="btn btn-primary w-full sm:w-auto">
                      Find Loads
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </form>
              )}

              {/* Track Shipment */}
              {tab === "track" && (
                <form onSubmit={handleTrack} className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <label className="form-label">Shipment ID</label>
                    <input
                      className="form-input font-mono"
                      placeholder="e.g. CL-28491"
                      value={trackId}
                      onChange={(e) => setTrackId(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="btn btn-primary w-full sm:w-auto">
                      Track
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </form>
              )}

              {/* Join the Fleet */}
              {tab === "fleet" && (
                <form onSubmit={handleFleet} className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="form-label">Your name</label>
                    <input className="form-input" placeholder="e.g. Rakesh Kumar" value={fleet.name} onChange={(e) => setFleet({ ...fleet, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <input className="form-input" placeholder="+91 98xxx xxxxx" value={fleet.phone} onChange={(e) => setFleet({ ...fleet, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Base city</label>
                    <select className="form-select" value={fleet.city} onChange={(e) => setFleet({ ...fleet, city: e.target.value })}>
                      {INDIAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Fleet size</label>
                    <select className="form-select" value={fleet.vehicles} onChange={(e) => setFleet({ ...fleet, vehicles: e.target.value })}>
                      {["1–5", "6–20", "21–50", "50+"].map((v) => <option key={v} value={v}>{v} trucks</option>)}
                    </select>
                  </div>
                  <div className="flex items-end sm:col-span-2 lg:col-span-4">
                    <button type="submit" className="btn btn-primary w-full sm:w-auto">
                      Join the fleet network
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </form>
              )}

              {exactLoc && (
                <p className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-success-bg px-3 py-2 text-[12.5px] font-semibold text-success animate-fade-in">
                  <MapPin size={13} />
                  {exactLoc}
                </p>
              )}
              {notice && (
                <p className="mt-4 rounded-lg bg-warning-bg px-4 py-2.5 text-[13.5px] font-medium text-warning animate-fade-in">
                  {notice}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
