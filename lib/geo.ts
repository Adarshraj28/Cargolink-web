/**
 * Location & permission helpers.
 *
 * CARGOLINK asks for notification and location permission once (dashboard
 * banner). Location is used for exact "current location" detection when
 * booking a truck or finding a return load. In the demo, coordinates are
 * mapped to the nearest seeded city; a real backend + Google Maps will use
 * the raw coordinates directly.
 */

export interface GeoPoint {
  lat: number;
  lng: number;
}

// Approximate coordinates of the seeded cities (lat, lng) for demo mapping.
export const CITY_COORDS: Record<string, GeoPoint> = {
  Delhi: { lat: 28.61, lng: 77.21 },
  Mumbai: { lat: 19.08, lng: 72.88 },
  Pune: { lat: 18.52, lng: 73.86 },
  Bangalore: { lat: 12.97, lng: 77.59 },
  Chennai: { lat: 13.08, lng: 80.27 },
  Kolkata: { lat: 22.57, lng: 88.36 },
  Hyderabad: { lat: 17.39, lng: 78.49 },
  Ahmedabad: { lat: 23.02, lng: 72.57 },
  Jaipur: { lat: 26.91, lng: 75.79 },
  Lucknow: { lat: 26.85, lng: 80.95 },
  Surat: { lat: 21.17, lng: 72.83 },
  Nagpur: { lat: 21.15, lng: 79.09 },
  Indore: { lat: 22.72, lng: 75.86 },
  Chandigarh: { lat: 30.73, lng: 76.78 },
  Kochi: { lat: 9.93, lng: 76.27 },
};

/** Request the user's exact position. Resolves null on denial/error. */
export function requestLocation(): Promise<GeoPoint | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  });
}

/** Map a coordinate to the nearest seeded city (demo). */
export function nearestCity(lat: number, lng: number): string {
  let best = "Delhi";
  let bestD = Infinity;
  for (const [city, c] of Object.entries(CITY_COORDS)) {
    const d = (c.lat - lat) ** 2 + (c.lng - lng) ** 2;
    if (d < bestD) {
      bestD = d;
      best = city;
    }
  }
  return best;
}

export function cityCoords(city: string): GeoPoint | undefined {
  return CITY_COORDS[city];
}

/** Persist the user's granted location so booking/load forms can use it. */
export function saveLocation(point: GeoPoint | null) {
  try {
    if (point) {
      window.localStorage.setItem(
        "cargolink-location",
        JSON.stringify({ ...point, city: nearestCity(point.lat, point.lng) })
      );
    } else {
      window.localStorage.removeItem("cargolink-location");
    }
  } catch {
    // ignore
  }
}

export function getSavedLocation(): (GeoPoint & { city: string }) | null {
  try {
    const raw = window.localStorage.getItem("cargolink-location");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.lat === "number" && typeof parsed?.lng === "number") {
      return { lat: parsed.lat, lng: parsed.lng, city: parsed.city ?? nearestCity(parsed.lat, parsed.lng) };
    }
  } catch {
    // ignore
  }
  return null;
}

/** Ask for notification permission. Returns the resulting state. */
export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (typeof Notification === "undefined") return "unsupported";
  if (Notification.permission !== "default") return Notification.permission;
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

export type PermStatus = {
  notif: "granted" | "denied" | "unsupported";
  loc: "granted" | "denied";
  city?: string;
};
