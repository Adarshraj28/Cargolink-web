"use client";

import { useSyncExternalStore, useState } from "react";
import {
  requestLocation,
  requestNotificationPermission,
  saveLocation,
  nearestCity,
  type PermStatus,
} from "@/lib/geo";
import { Bell, MapPin, X, Check } from "lucide-react";

const DISMISS_KEY = "cargolink-perm-dismissed";

// Tiny external store for the dismissed flag so no setState-in-effect is needed.
const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((fn) => fn());
}
function readDismissed(): boolean {
  try {
    return typeof window !== "undefined" && window.localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return true;
  }
}
function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function markDismissed() {
  try {
    window.localStorage.setItem(DISMISS_KEY, "1");
  } catch {
    // ignore
  }
  notify();
}

export default function PermissionsBanner() {
  // Server snapshot hides the banner; the client decides after hydration.
  const dismissed = useSyncExternalStore(subscribe, readDismissed, () => true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<PermStatus | null>(null);

  const visible = !dismissed || !!status;

  const enable = async () => {
    setBusy(true);
    const notif = await requestNotificationPermission();
    const loc = await requestLocation();
    saveLocation(loc);
    setStatus({
      notif: notif === "granted" ? "granted" : notif === "unsupported" ? "unsupported" : "denied",
      loc: loc ? "granted" : "denied",
      city: loc ? nearestCity(loc.lat, loc.lng) : undefined,
    });
    markDismissed();
    setBusy(false);
  };

  const dismiss = () => {
    setStatus(null);
    markDismissed();
  };

  if (!visible) return null;

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-forest-600/20 bg-gradient-to-r from-sage-50 to-white shadow-sm">
      <div className="flex flex-wrap items-center gap-5 p-6">
        <div className="flex-1">
          <p className="text-[15px] font-bold text-charcoal">
            Make CARGOLINK more useful for you
          </p>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1.5 text-[13px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Bell size={14} className="text-forest-600" />
              Notifications — load matches, trip updates, delivery alerts
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} className="text-forest-600" />
              Location — exact pickup and current-location detection
            </span>
          </div>

          {status && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-charcoal shadow-sm">
                <Bell size={12} className={status.notif === "granted" ? "text-success" : "text-muted"} />
                Notifications: {status.notif === "granted" ? "Enabled" : status.notif === "unsupported" ? "Not supported" : "Off"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-charcoal shadow-sm">
                <MapPin size={12} className={status.loc === "granted" ? "text-success" : "text-muted"} />
                Location: {status.loc === "granted" ? `Enabled — near ${status.city}` : "Off"}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!status && (
            <>
              <button onClick={enable} disabled={busy} className="btn btn-primary btn-sm">
                {busy ? "Requesting…" : "Enable"}
              </button>
              <button onClick={dismiss} className="btn btn-ghost btn-sm">
                Not now
              </button>
            </>
          )}
          {status && (
            <>
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-success">
                <Check size={15} /> Done
              </span>
              <button onClick={dismiss} className="btn btn-ghost btn-sm" aria-label="Dismiss">
                <X size={15} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
