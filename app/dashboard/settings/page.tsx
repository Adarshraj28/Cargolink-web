"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  updateUser,
  addVehicle,
  updateVehicle,
  getVehiclesByOwner,
  logout,
  resetDemoData,
  useAppState,
} from "@/lib/store";
import { TRUCK_TYPES, INDIAN_CITIES } from "@/lib/seed";
import StatusBadge from "@/components/ui/StatusBadge";
import { CheckCircle2, Save, Truck, RotateCcw, LogOut } from "lucide-react";
import type { Vehicle } from "@/lib/types";

export default function SettingsPage() {
  const { user, logout: signOut } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("Delhi");
  const [notifications, setNotifications] = useState(true);

  // vehicle form
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [vNumber, setVNumber] = useState("");
  const [vType, setVType] = useState(TRUCK_TYPES[0]);
  const [vCapacity, setVCapacity] = useState("");
  const [vLocation, setVLocation] = useState("Delhi");
  const [vDriver, setVDriver] = useState("");
  const [vPhone, setVPhone] = useState("");
  const [vError, setVError] = useState("");
  useAppState();

  // Keep the form fields in sync when the signed-in user changes.
  const [seenUserId, setSeenUserId] = useState<string | null>(null);
  if (user && user.id !== seenUserId) {
    setSeenUserId(user.id);
    setName(user.name);
    setPhone(user.phone ?? "");
    setCompany(user.company ?? "");
    setCity(user.city ?? "Delhi");
  }

  const vehicles = user ? getVehiclesByOwner(user.id) : [];

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  const isFleet = user.role === "DRIVER" || user.role === "FLEET_OPERATOR";

  const handleProfile = (e: FormEvent) => {
    e.preventDefault();
    updateUser(user.id, { name, phone, company, city });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddVehicle = (e: FormEvent) => {
    e.preventDefault();
    setVError("");
    if (!/^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/.test(vNumber.trim().toUpperCase())) {
      setVError("Vehicle number must look like MH-12-AB-3456.");
      return;
    }
    const capacity = parseFloat(vCapacity);
    if (!capacity || capacity <= 0) {
      setVError("Enter a valid capacity in tonnes.");
      return;
    }
    if (!vDriver.trim() || !vPhone.trim()) {
      setVError("Driver name and phone are required.");
      return;
    }
    addVehicle({
      ownerId: user.id,
      number: vNumber.trim().toUpperCase(),
      truckType: vType,
      capacity,
      bodyType: vType.includes("Container") ? "Container" : "Open Body",
      currentLocation: vLocation,
      driverName: vDriver.trim(),
      driverPhone: vPhone.trim(),
      availability: "available",
    });
    setShowVehicleForm(false);
    setVNumber("");
    setVCapacity("");
    setVDriver("");
    setVPhone("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    resetDemoData();
    signOut();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h2">Settings</h1>
          <p className="mt-1 text-muted">Manage your profile and account.</p>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-3 py-1.5 text-[13px] font-semibold text-success animate-scale-in">
            <CheckCircle2 size={14} />
            Saved
          </span>
        )}
      </div>

      {/* Profile */}
      <form onSubmit={handleProfile} className="rounded-2xl border border-line bg-white p-7 shadow-sm">
        <h2 className="text-[15px] font-bold text-charcoal">Profile</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="form-label">Name</label>
            <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Phone</label>
            <input className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Company</label>
            <input className="form-input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" />
          </div>
          <div>
            <label className="form-label">Base city</label>
            <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
              {INDIAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <button type="submit" className="btn btn-primary">
            <Save size={15} />
            Save profile
          </button>
          <span className="text-[12.5px] text-muted">Email: {user.email}</span>
        </div>
      </form>

      {/* Vehicle */}
      {isFleet && (
        <div className="rounded-2xl border border-line bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-charcoal">Vehicle</h2>
            <button onClick={() => setShowVehicleForm(!showVehicleForm)} className="btn btn-secondary btn-sm">
              <Truck size={15} />
              {showVehicleForm ? "Cancel" : "Add vehicle"}
            </button>
          </div>

          {vehicles.length > 0 && (
            <div className="mt-4 space-y-3">
              {vehicles.map((v) => (
                <div key={v.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line p-4">
                  <div>
                    <p className="text-[14.5px] font-bold text-charcoal">{v.number} · {v.truckType}</p>
                    <p className="text-[12.5px] text-muted">
                      {v.capacity} T · {v.currentLocation} · {v.driverName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={v.availability} />
                    <select
                      value={v.availability}
                      onChange={(e) =>
                        updateVehicle(v.id, {
                          availability: e.target.value as Vehicle["availability"],
                        })
                      }
                      className="form-select w-auto py-1.5 text-[13px]"
                      aria-label={`Availability for ${v.number}`}
                    >
                      <option value="available">Available</option>
                      <option value="on-trip">On trip</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showVehicleForm && (
            <form onSubmit={handleAddVehicle} className="mt-5 rounded-xl bg-offwhite p-5 animate-fade-up">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="form-label">Vehicle number <span className="req">*</span></label>
                  <input className="form-input" placeholder="MH-12-AB-3456" value={vNumber}
                    onChange={(e) => setVNumber(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Truck type <span className="req">*</span></label>
                  <select className="form-select" value={vType} onChange={(e) => setVType(e.target.value)}>
                    {TRUCK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Capacity (tonnes) <span className="req">*</span></label>
                  <input className="form-input" type="number" placeholder="e.g. 32" value={vCapacity}
                    onChange={(e) => setVCapacity(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Current location <span className="req">*</span></label>
                  <select className="form-select" value={vLocation} onChange={(e) => setVLocation(e.target.value)}>
                    {INDIAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Driver name <span className="req">*</span></label>
                  <input className="form-input" placeholder="Driver name" value={vDriver}
                    onChange={(e) => setVDriver(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Driver phone <span className="req">*</span></label>
                  <input className="form-input" placeholder="+91 98xxx xxxxx" value={vPhone}
                    onChange={(e) => setVPhone(e.target.value)} />
                </div>
              </div>
              {vError && <p className="form-error mt-3">{vError}</p>}
              <button type="submit" className="btn btn-primary mt-5">
                <Truck size={15} />
                Save vehicle
              </button>
            </form>
          )}
        </div>
      )}

      {/* Preferences */}
      <div className="rounded-2xl border border-line bg-white p-7 shadow-sm">
        <h2 className="text-[15px] font-bold text-charcoal">Notification preferences</h2>
        <label className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-line p-4">
          <span>
            <span className="block text-[14.5px] font-medium text-charcoal">Platform notifications</span>
            <span className="block text-[12.5px] text-muted">Shipment updates, load matches, payments</span>
          </span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="h-5 w-5 rounded accent-forest-700"
          />
        </label>
        <button
          onClick={() => {
            updateUser(user.id, {});
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          className="btn btn-secondary mt-4"
        >
          Save preferences
        </button>
      </div>

      {/* Account */}
      <div className="rounded-2xl border border-line bg-white p-7 shadow-sm">
        <h2 className="text-[15px] font-bold text-charcoal">Account</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => {
              logout();
              signOut();
              router.push("/sign-in");
            }}
            className="btn btn-ghost"
          >
            <LogOut size={15} />
            Log out
          </button>
          <button onClick={handleReset} className="btn btn-ghost">
            <RotateCcw size={15} />
            Reset demo data
          </button>
        </div>
      </div>
    </div>
  );
}
